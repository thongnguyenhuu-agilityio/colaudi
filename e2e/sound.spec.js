import { test, expect } from '@playwright/test';

// Sound must never threaten the game (FR-18 is "Nên có"): these tests guard the stage demo.
// Console warnings are ignored on purpose: Chrome warns when an AudioContext is created before a user gesture.

const FALLBACK = 'Âm thanh: bản tổng hợp (mẫu lỗi) · bấm để tải lại';

function watchErrors(page) {
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  return errors;
}

// Counts audio sources that are due to be playing now: started, scheduled start time reached, no 'ended' event yet.
// Both the old synth (oscillators) and the samples (buffer sources) go through these two constructors. An 'ended'
// event is the only honest proof that a source is gone: every source gets a scheduled stop at creation, so counting
// stop() calls would pass trivially. A source whose start lies in the future (a gong a second into the phrase) is not
// counted: when a scene is left it is stopped before it ever starts, and it is inaudible meanwhile.
async function instrumentAudio(page) {
  await page.addInitScript(() => {
    const all = new Set();
    for (const C of [AudioBufferSourceNode, OscillatorNode]) {
      const start = C.prototype.start;
      C.prototype.start = function (when = 0, ...rest) {
        this.__when = when;
        all.add(this);
        this.addEventListener('ended', () => all.delete(this));
        return start.call(this, when, ...rest);
      };
    }
    window.__liveSources = () => [...all].filter(n => n.__when <= n.context.currentTime).length;
  });
}
const live = page => page.evaluate(() => window.__liveSources());

async function winBattle(page) {
  for (const key of ['a', 'b', 'c']) {
    await page.keyboard.press(key);
    if (await page.locator('.result').isVisible()) return;
  }
  throw new Error('battle not won');
}

// Title -> quick run -> surrender (S) -> crown -> finale, using only the keyboard after the first clicks.
async function playToFinale(page) {
  await page.getByRole('button', { name: /Tập trận nhanh/ }).click();
  await page.getByRole('button', { name: 'Xuất quân' }).click();
  await page.keyboard.press('s');
  await expect(page.locator('.tile.pending')).toHaveCount(0, { timeout: 15_000 });
  await page.getByRole('button', { name: 'Lên ngôi' }).click();
  const legacy = page.getByRole('button', { name: /Ngàn năm sau/ });
  for (let i = 0; i < 12 && !(await legacy.isVisible()); i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(120); }
  await expect(legacy).toBeVisible();
  await legacy.click();
  for (let i = 0; i < 12 && !(await page.locator('.made').isVisible()); i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(120); }
  await expect(page.locator('.made')).toBeVisible();
}

test('a quick run reaches the finale with sound on: no console or page errors', async ({ page }) => {
  const errors = watchErrors(page);
  const sounds = [];
  page.on('response', r => { if (/\/sound\/[^/]+\.mp3$/.test(r.url())) sounds.push(r.status()); });
  await page.goto('/?presenter');
  await playToFinale(page);
  await expect(page.locator('#snd')).toHaveText('Âm thanh: bật');
  expect(sounds.length).toBe(7);
  expect(sounds.every(s => s === 200)).toBe(true);
  expect(errors).toEqual([]);
});

test('a quick run reaches the finale with sound off: no console or page errors', async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto('/?presenter');
  await page.keyboard.press('m');
  await expect(page.locator('#snd')).toHaveText('Âm thanh: tắt');
  await playToFinale(page);
  await expect(page.locator('#snd')).toHaveText('Âm thanh: tắt');
  expect(errors).toEqual([]);
});

test('the mute choice survives a reload', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#snd')).toHaveText('Âm thanh: bật');
  await page.keyboard.press('m');
  await expect(page.locator('#snd')).toHaveText('Âm thanh: tắt');
  await page.reload();
  await expect(page.locator('#snd')).toHaveText('Âm thanh: tắt');
  await page.locator('#snd').click();
  await expect(page.locator('#snd')).toHaveText('Âm thanh: bật');
  await page.reload();
  await expect(page.locator('#snd')).toHaveText('Âm thanh: bật');
});

test('when the samples fail to load the button says so, the game still plays, and a click retries', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(e.message));
  await page.route('**/sound/*', route => route.abort());
  await page.goto('/?presenter');
  await expect(page.locator('#snd')).toHaveText(FALLBACK);
  // The game still plays (synth fallback) and nothing throws.
  await page.getByRole('button', { name: /Tập trận nhanh/ }).click();
  await page.getByRole('button', { name: 'Xuất quân' }).click();
  await page.locator('button.tile:not([disabled])').first().click();
  await winBattle(page);
  await expect(page.locator('.result')).toBeVisible();
  await expect(page.locator('#snd')).toHaveText(FALLBACK);
  // Retry: let the files through, click the button, the label returns to normal.
  await page.unroute('**/sound/*');
  await page.locator('#snd').click();
  await expect(page.locator('#snd')).toHaveText('Âm thanh: bật');
  expect(pageErrors).toEqual([]);
});

test('leaving a scene stops the previous scene\'s sources', async ({ page }) => {
  await instrumentAudio(page);
  await page.goto('/?presenter');
  await page.getByRole('button', { name: /Tập trận nhanh/ }).click();
  await page.getByRole('button', { name: 'Xuất quân' }).click();
  await page.locator('button.tile:not([disabled])').first().click();
  await winBattle(page); // the "correct" cue is a long phrase
  await expect.poll(() => live(page)).toBeGreaterThan(0); // the instrument sees the cue
  await page.keyboard.press('Escape'); // go('map')
  await page.waitForTimeout(450);
  expect(await live(page)).toBe(0);
});

test('muting stops the live sources', async ({ page }) => {
  await instrumentAudio(page);
  await page.goto('/?presenter');
  await page.getByRole('button', { name: /Tập trận nhanh/ }).click();
  await page.getByRole('button', { name: 'Xuất quân' }).click();
  await page.locator('button.tile:not([disabled])').first().click();
  await winBattle(page);
  await expect.poll(() => live(page)).toBeGreaterThan(0);
  await page.keyboard.press('m');
  await page.waitForTimeout(450);
  expect(await live(page)).toBe(0);
});

test('a hidden tab fades out and suspends the audio, a visible tab resumes it', async ({ page }) => {
  await page.addInitScript(() => {
    const Orig = window.AudioContext;
    window.AudioContext = class extends Orig { constructor(...a) { super(...a); window.__ctx = this; } };
  });
  const setHidden = hidden => page.evaluate(h => {
    Object.defineProperty(document, 'hidden', { value: h, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  }, hidden);
  await page.goto('/?presenter');
  await page.getByRole('button', { name: /Tập trận nhanh/ }).click(); // a gesture: the context runs
  await expect.poll(() => page.evaluate(() => window.__ctx.state)).toBe('running');
  await setHidden(true);
  await expect.poll(() => page.evaluate(() => window.__ctx.state)).toBe('suspended');
  await setHidden(false);
  await expect.poll(() => page.evaluate(() => window.__ctx.state)).toBe('running');
});

// Offline render of the real coronation (docs/09 "Red-team review 2"): one climax at step 2, and the text breathes.
// On the 42a5683 build the step-2/3 gongs rang under steps 4 to 6 and this failed. Steps are rendered at the real GAP.crown.
test('the coronation has one climax at step 2 and is quiet under steps 5 and 6', async ({ page }) => {
  await page.goto('/?presenter&soundtest');
  expect(await page.evaluate(() => window.__sound.ready())).toBe('ok');
  const r = await page.evaluate(async () => {
    const g = window.__sound.gap.crown / 1000;
    const script = [[0, '@scene'], ...Array.from({ length: 8 }, (_, i) => [i * g, 'crown', i])];
    const { data, sr } = await window.__sound.render(script, 24);
    const level = (a, b) => { let p = 0, s = 0, n = 0; for (let i = Math.round(a * sr); i < Math.round(b * sr); i++) { p = Math.max(p, Math.abs(data[0][i])); s += data[0][i] ** 2; n++; } return [p, Math.sqrt(s / n)]; };
    return Array.from({ length: 8 }, (_, i) => level(i * g + 0.1, i * g + g));
  });
  const peaks = r.map(x => x[0]), rms = r.map(x => x[1]);
  expect(peaks[2]).toBe(Math.max(...peaks)); // the tutti is the loudest step
  expect(rms[5]).toBeLessThan(0.01); // about -40 dBFS: nothing rings under the text
  expect(rms[6]).toBeLessThan(0.01);
});

// iPhone: Web Audio is muted by the ring/silent switch unless the page asks for a "playback" audio session.
test('the page asks iOS for a playback audio session', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(navigator, 'audioSession', { value: { type: 'auto' }, configurable: true }); });
  await page.goto('/');
  expect(await page.evaluate(() => navigator.audioSession.type)).toBe('playback');
});

// iPhone: pointerdown is not a user activation there, so the context must also be resumed on touchend/click.
test('a touchend resumes a suspended audio context', async ({ page }) => {
  await page.addInitScript(() => {
    window.__resumes = 0;
    const resume = AudioContext.prototype.resume;
    AudioContext.prototype.resume = function () { window.__resumes++; return resume.call(this); };
    Object.defineProperty(AudioContext.prototype, 'state', { get() { return 'suspended'; }, configurable: true });
    const Orig = window.AudioContext;
    window.AudioContext = class extends Orig { constructor(...a) { super(...a); window.__ctx = this; } };
  });
  await page.goto('/?presenter'); // the presenter page creates its context at load to decode the samples
  await page.waitForFunction(() => window.__ctx);
  const before = await page.evaluate(() => window.__resumes);
  await page.evaluate(() => document.body.dispatchEvent(new Event('touchend', { bubbles: true })));
  expect(await page.evaluate(() => window.__resumes)).toBeGreaterThan(before);
});
