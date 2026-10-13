// Regenerates the listening files for prototypes/crown-ab.html: the full 8-step coronation at the real 2.6 s spacing,
// rendered offline through the real engine, once from an old commit and once from the working tree.
// Usage: node scripts/render-crown-ab.mjs [oldRef]     (default oldRef: 42a5683, the build the owner listened to)
// Needs ffmpeg and @playwright/test (PW_CHROMIUM overrides the browser). Writes prototypes/crown-ab/crown-{old,new}.mp3.
import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderAll, SCENARIOS, wav } from './sound-measure.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const ref = process.argv[2] || '42a5683';
const out = join(root, 'prototypes/crown-ab');
const work = mkdtempSync(join(tmpdir(), 'crown-ab-'));

function serve(dir, port) {
  return new Promise((ok, bad) => {
    const p = spawn('node', ['scripts/dev.mjs'], { cwd: dir, env: { ...process.env, PORT: String(port) } });
    p.stdout.on('data', d => { if (String(d).includes('http://')) ok(p); });
    p.on('error', bad); setTimeout(() => bad(new Error('server did not start')), 10000);
  });
}

// An old checkout needs the offline-render fix the engine has now (otherwise its render races): the engine must not
// call resume() on the offline context while cues are being scheduled. It changes no sound.
function patchOld(dir) {
  const f = join(dir, 'public/game.js'); let s = readFileSync(f, 'utf8');
  s = s.replace("if (c.state === 'suspended') c.resume()", "if (c.state === 'suspended' && !c.startRendering) c.resume()");
  writeFileSync(f, s);
}

const oldDir = join(work, 'old');
mkdirSync(oldDir);
const tar = join(work, 'old.tar');
execFileSync('git', ['archive', '-o', tar, ref], { cwd: root });
execFileSync('tar', ['-x', '-C', oldDir, '-f', tar]);
patchOld(oldDir);

mkdirSync(out, { recursive: true });
const servers = [];
try {
  for (const [label, dir, port] of [['old', oldDir, 3291], ['new', root, 3292]]) {
    servers.push(await serve(dir, port));
    const res = await renderAll(`http://localhost:${port}`, { crown: SCENARIOS['crown natural'] });
    const wavFile = join(work, `${label}.wav`);
    writeFileSync(wavFile, wav(res.crown.post.data));
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wavFile, '-codec:a', 'libmp3lame', '-b:a', '160k', join(out, `crown-${label}.mp3`)]);
    console.log('wrote', `prototypes/crown-ab/crown-${label}.mp3`, label === 'old' ? `(from ${ref})` : '(from the working tree)');
  }
} finally {
  servers.forEach(p => p.kill());
  rmSync(work, { recursive: true, force: true });
}
