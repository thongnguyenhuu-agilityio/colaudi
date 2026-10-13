// Offline sound measurement through the real engine (docs/09 §6, "Red-team review 2").
// Usage: node scripts/sound-measure.mjs <baseUrl> [--wav <dir>]
//   <baseUrl>: a running dev server (PORT=3100 node scripts/dev.mjs). Needs @playwright/test and PW_CHROMIUM
//   (or the default Playwright browser). Renders each scenario with window.__sound.render (?presenter&soundtest),
//   prints one row of numbers per scenario and, with --wav, writes the crown sequences as 16-bit stereo WAV files.
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SR = 44100;
const steps = (name, n, gap) => [[0, '@scene'], ...Array.from({ length: n }, (_, i) => [i * gap, name, i])];
export const SCENARIOS = {
  'crown natural': { script: steps('crown', 8, 2.6), secs: 36, gap: 2.6 },
  'crown rapid': { script: steps('crown', 8, 0.15), secs: 24, gap: 0.15 },
  'finale natural': { script: steps('finale', 7, 2.4), secs: 34, gap: 2.4 },
  'correct': { script: [[0, '@scene'], [0, 'correct']], secs: 16, gap: 0 }
};

// Radix-2 FFT, in place.
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const a = -2 * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const u = i + k, v = i + k + len / 2, tr = re[v] * cr - im[v] * ci, ti = re[v] * ci + im[v] * cr;
        re[v] = re[u] - tr; im[v] = im[u] - ti; re[u] += tr; im[u] += ti;
        const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
      }
    }
  }
}
const BANDS = [[0, 150], [150, 600], [600, 4000], [4000, 22050]];
function bandEnergy(x, from, len) { // energy per band over x[from, from+len)
  const N = 16384, re = new Float64Array(N), im = new Float64Array(N);
  for (let i = 0; i < len && from + i < x.length; i++) re[i] = x[from + i] * (0.5 - 0.5 * Math.cos(2 * Math.PI * i / (len - 1)));
  fft(re, im);
  const e = [0, 0, 0, 0];
  for (let k = 1; k < N / 2; k++) {
    const f = k * SR / N, b = BANDS.findIndex(([lo, hi]) => f >= lo && f < hi);
    e[b] += re[k] * re[k] + im[k] * im[k];
  }
  return e;
}
const mono = d => { const m = new Float32Array(d[0].length); for (let i = 0; i < m.length; i++) m[i] = (d[0][i] + d[1][i]) / 2; return m; };
const rms = (x, a, b) => { let s = 0; a = Math.max(0, a); b = Math.min(x.length, b); for (let i = a; i < b; i++) s += x[i] * x[i]; return Math.sqrt(s / Math.max(1, b - a)); };
const db = v => 20 * Math.log10(Math.max(v, 1e-9));
const peakOf = d => { let p = 0; for (const c of d) for (let i = 0; i < c.length; i++) p = Math.max(p, Math.abs(c[i])); return p; };

export function analyse(post, pre, voices) {
  const x = mono(post.data), W = Math.round(SR * 0.25), nW = Math.floor(x.length / W);
  let maxVoices = 0, maxAt = 0, hot = 0, active = 0, ring = 0;
  const band = [0, 0, 0, 0];
  for (let w = 0; w < nW; w++) {
    const a = w * W / SR, b = a + 0.25;
    const v = voices.filter(s => s.start < b && s.end > a).length;
    if (v > maxVoices) { maxVoices = v; maxAt = a; }
    if (rms(x, w * W, (w + 1) * W) > 0.003) { ring = b; active++; }
    let pk = 0; for (let i = w * W; i < (w + 1) * W; i++) pk = Math.max(pk, Math.abs(pre.data[0][i]), Math.abs(pre.data[1][i]));
    if (pk > 0.7) hot++;
    bandEnergy(x, w * W, W).forEach((e, i) => { band[i] += e; });
  }
  const tot = band.reduce((s, v) => s + v, 0) || 1;
  return { maxVoices, maxAt, peak: peakOf(post.data), preclip: peakOf(pre.data), hot, active, bands: band.map(v => 100 * v / tot), ring };
}
// Tail masking: level of the 300 ms before each step start against the 300 ms after it (dB; near 0 or above
// means the old tail is as loud as the new attack).
export function masking(post, n, gap) {
  const x = mono(post.data), w = Math.round(SR * 0.3), out = [];
  for (let i = 1; i < n; i++) { const t = Math.round(i * gap * SR); out.push(+(db(rms(x, t - w, t)) - db(rms(x, t, t + w))).toFixed(1)); }
  return out;
}
export function wav(data) {
  const n = data[0].length, buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) for (let c = 0; c < 2; c++) buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, data[c][i])) * 32767), 44 + i * 4 + c * 2);
  return buf;
}

export async function renderAll(baseUrl, scenarios = SCENARIOS) {
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
  const page = await browser.newPage();
  await page.addInitScript(() => { // log every source with its scheduled start and (earliest) stop time
    window.__voices = [];
    for (const C of [AudioBufferSourceNode, OscillatorNode]) {
      const start = C.prototype.start, stop = C.prototype.stop;
      C.prototype.start = function (when = 0, ...r) { this.__v = { start: when, end: Infinity }; window.__voices.push(this.__v); return start.call(this, when, ...r); };
      C.prototype.stop = function (when = 0) { if (this.__v) this.__v.end = Math.min(this.__v.end, when); return stop.call(this, when); };
    }
  });
  await page.goto(baseUrl.replace(/\/$/, '') + '/?presenter&soundtest');
  const state = await page.evaluate(() => window.__sound.ready());
  if (state !== 'ok') throw new Error('samples not loaded: ' + state);
  const out = {};
  for (const [name, sc] of Object.entries(scenarios)) {
    const run = clip => page.evaluate(async ([script, secs, clip]) => {
      window.__voices.length = 0;
      const r = await window.__sound.render(script, secs, { clip });
      return { data: r.data.map(a => Array.from(a)), voices: window.__voices.map(v => ({ start: v.start, end: Number.isFinite(v.end) ? v.end : 99 })) };
    }, [sc.script, sc.secs, clip]);
    const post = await run(true), pre = await run(false);
    out[name] = { post, pre, ...sc };
  }
  await browser.close();
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [base, flag, dir] = process.argv.slice(2);
  const res = await renderAll(base);
  console.log('scenario | voices max@s | peak | preclip | hot/active 250ms windows | % energy <150/150-600/600-4k/>4k Hz | ring-out s after last cue | tail-vs-attack dB per step');
  for (const [name, r] of Object.entries(res)) {
    const a = analyse(r.post, r.pre, r.post.voices);
    const m = r.gap ? masking(r.post, r.script.length - 1, r.gap) : [];
    const last = r.script[r.script.length - 1][0];
    console.log(`${name} | ${a.maxVoices}@${a.maxAt.toFixed(2)} | ${a.peak.toFixed(3)} | ${a.preclip.toFixed(3)} | ${a.hot}/${a.active} | ${a.bands.map(v => v.toFixed(1)).join('/')} | ${(a.ring - last).toFixed(1)} | ${m.join(' ')}`);
  }
  if (flag === '--wav') {
    mkdirSync(dir, { recursive: true });
    for (const k of ['crown natural', 'crown rapid']) writeFileSync(join(dir, k.replace(' ', '-') + '.wav'), wav(res[k].post.data));
  }
}
