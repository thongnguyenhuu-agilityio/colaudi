import { test, expect } from '@playwright/test';
import { startCampaign, fight } from './campaign.js';

// Owner decision A (14 Oct): no quick mode. The coronation is reachable only after all 12 warlords are done.
// On the previous build (dd996b1) the title offered a quick start, and the S key or a 2-battle run led to the crown.

const reached = page => page.evaluate(() => ({
  crown: !!document.querySelector('.scene.crown'),
  fin: !!document.querySelector('.scene.fin'),
  tally: !!document.querySelector('.scene.tally'),
  surrender: !!document.querySelector('.scene.surrender'),
  map: !!document.querySelector('.scene .map')
}));
const notBeyond = async (page, expectMap = false) => {
  const r = await reached(page);
  expect(r.crown || r.fin || r.tally || r.surrender).toBe(false);
  if (expectMap) expect(r.map).toBe(true);
};

test('the title offers exactly one way to start: the 12-battle campaign', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /Tập trận nhanh/ })).toHaveCount(0);
  await expect(page.locator('.title [data-act^="start"]')).toHaveCount(1);
  await expect(page.locator('.title [data-act="start"]')).toContainText('12');
  await expect(page.locator('.title .btn')).toHaveCount(1);
});

test('the S shortcut is gone: it does not skip any battle', async ({ page }) => {
  await page.goto('/?presenter');
  await page.keyboard.press('s');
  await expect(page.locator('.title')).toBeVisible();
  await expect(page.locator('.title .keys').last()).not.toContainText('đoạn kết');
  await startCampaign(page);
  await page.keyboard.press('s');
  await expect(page.locator('.map')).toBeVisible();
  await notBeyond(page, true);
});

test('with fewer than 12 warlords done nothing reaches the crown', async ({ page }) => {
  await page.goto('/?presenter');
  await startCampaign(page);
  for (const done of [0, 1, 2, 11]) {
    const have = await page.locator('button.tile[disabled]').count();
    if (done > have) await fight(page, done - have);
    await expect(page.locator('.count b')).toHaveText(String(done));
    await expect(page.getByRole('button', { name: 'Ghi danh bảng vàng' })).toHaveCount(0);
    await expect(page.locator('.capital [data-primary]')).toHaveCount(0);
    // Every key that might act as "continue" or as a shortcut.
    for (const k of ['Enter', ' ', 'ArrowRight', 's', 'S', 'Escape']) await page.keyboard.press(k);
    await notBeyond(page, true);
    // Forge a click on every gated action, as a stale button or a script would.
    for (const act of ['tally', 'crown', 'finale', 'surrender']) {
      await page.evaluate(a => { const b = document.createElement('button'); b.dataset.act = a; document.body.appendChild(b); b.click(); b.remove(); }, act);
      await notBeyond(page, true);
    }
  }
  // Also from inside a battle that is not the last one.
  await page.locator('button.tile:not([disabled])').first().click();
  for (const k of ['s', 'Enter']) await page.keyboard.press(k);
  await notBeyond(page);
  await expect(page.locator('.battle')).toBeVisible();
});

test('a saved scene from an unfinished run is sent back to the map', async ({ page }) => {
  await page.addInitScript(() => {
    window.claude = { hot: { data: { scene: 'crown', done: { 'xuong-xi': 'won', 'canh-thac': 'won' }, wrongs: { 'xuong-xi': 0, 'canh-thac': 0 } }, snapshot() {} } };
  });
  await page.goto('/');
  await expect(page.locator('.map')).toBeVisible();
  await notBeyond(page, true);
});

test('the 12th victory opens the tally and then the coronation', async ({ page }) => {
  await page.goto('/?presenter');
  await startCampaign(page);
  await fight(page, 12, { stay: true });
  await page.getByRole('button', { name: 'Ghi danh bảng vàng' }).click();
  await expect(page.locator('.scene.tally')).toBeVisible();
  await page.keyboard.press('Enter'); // the presenter can go on without signing
  await expect(page.locator('.scene.crown')).toBeAttached();
});
