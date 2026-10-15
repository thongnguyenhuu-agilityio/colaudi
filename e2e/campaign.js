// Shared helpers: the only way through the game is the 12-battle campaign.

// Win one battle by trying A, B, C until the result card appears. Returns the number of wrong tries.
export async function winBattle(page) {
  let wrong = 0;
  for (const key of ['a', 'b', 'c']) {
    await page.keyboard.press(key);
    if (await page.locator('.result').isVisible()) return wrong;
    wrong++;
  }
  throw new Error('battle not won');
}

// Title -> intro -> map, via the single start button.
export async function startCampaign(page) {
  await page.getByRole('button', { name: /Khởi binh/ }).click();
  await page.getByRole('button', { name: 'Xuất quân' }).click();
}

// Fight `count` warlords from the map, returning to the map after each (the last one stays on its result card when
// `stay` is set). Returns the points earned.
export async function fight(page, count, { stay = false } = {}) {
  let points = 0;
  for (let i = 0; i < count; i++) {
    await page.locator('button.tile:not([disabled])').first().click();
    const wrong = await winBattle(page);
    points += [3, 1, 0][Math.min(wrong, 2)];
    if (!(stay && i === count - 1)) await page.keyboard.press('Escape');
  }
  return points;
}

// All 12 battles; ends on the 12th result card ("Ghi danh bảng vàng" button).
export const winAll = page => fight(page, 12, { stay: true });
