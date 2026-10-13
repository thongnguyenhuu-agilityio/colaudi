import { test, expect } from '@playwright/test';

// Win one battle by trying A, B, C until the result card appears. Returns the number of wrong tries.
async function winBattle(page) {
  let wrong = 0;
  for (const key of ['a', 'b', 'c']) {
    await page.keyboard.press(key);
    if (await page.locator('.result').isVisible()) return wrong;
    wrong++;
  }
  throw new Error('battle not won');
}

test('a full run of 12 battles gets scored and lands on the leaderboard', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Đánh đủ 12 trận/ }).click();
  await page.getByRole('button', { name: 'Xuất quân' }).click();
  // A script finishes 12 battles faster than any human; wait past the minimum run time (MIN_RUN_SEC=5 in tests).
  await page.waitForTimeout(5_500);

  let expected = 0;
  for (let i = 0; i < 12; i++) {
    await page.locator('button.tile:not([disabled])').first().click();
    const wrong = await winBattle(page);
    expected += [3, 1, 0][Math.min(wrong, 2)];
    await expect(page.locator('#scorebox')).toContainText(`Điểm ${expected}`);
    await page.keyboard.press('Escape');
  }

  await page.getByRole('button', { name: 'Ghi danh bảng vàng' }).click();
  await expect(page.locator('.big')).toContainText(String(expected));

  await page.locator('#pname').fill('Bộ Lĩnh QA');
  await page.getByRole('button', { name: 'Ghi danh', exact: true }).click();
  await expect(page.locator('.msg.ok')).toContainText('hạng 1');
  await expect(page.locator('#board .r.me')).toContainText('Bộ Lĩnh QA');
  await expect(page.locator('#board .r.me')).toContainText(`${expected} điểm`);
});

test('the leaderboard trims an over-long name to 20 characters', async ({ request }) => {
  const runId = 'e2e-' + Date.now();
  await request.post('/api/leaderboard', { data: { action: 'start', runId } });
  await new Promise(r => setTimeout(r, 5_500));
  const res = await request.post('/api/leaderboard', {
    data: { name: 'Một cái tên rất rất rất dài', points: 12, runId }
  });
  expect(res.status()).toBe(201);
  expect([...(await res.json()).name].length).toBe(20);
});

test('quick mode reaches the coronation and the Claude reveal', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Enter'); // Tập trận nhanh
  await page.keyboard.press('Enter'); // Xuất quân
  for (let i = 0; i < 2; i++) {
    await page.locator('button.tile:not([disabled])').first().click();
    await winBattle(page);
    if (i < 1) await page.keyboard.press('Escape');
  }
  await page.getByRole('button', { name: 'Tiếp tục' }).click();
  await page.getByRole('button', { name: 'Lên ngôi' }).click();
  await expect(page.getByRole('heading', { name: 'Đại Thắng Minh Hoàng Đế' })).toBeAttached();
  for (let i = 0; i < 8; i++) await page.keyboard.press('Enter');
  await expect(page.locator('.morph .claude')).toBeVisible({ timeout: 15_000 });
});

test('a failed leaderboard poll never fakes a saved score', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Đánh đủ 12 trận/ }).click();
  await page.getByRole('button', { name: 'Xuất quân' }).click();
  await page.waitForTimeout(5_500);
  for (let i = 0; i < 12; i++) {
    await page.locator('button.tile:not([disabled])').first().click();
    await winBattle(page);
    await page.keyboard.press('Escape');
  }
  // From now on every leaderboard request fails, as during a Redis outage.
  await page.route('**/api/leaderboard', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"down"}' }));
  await page.getByRole('button', { name: 'Ghi danh bảng vàng' }).click();
  await expect(page.locator('#liveTotal')).toContainText('Mất kết nối');
  await page.locator('#pname').fill('Không được lưu');
  await page.getByRole('button', { name: 'Ghi danh', exact: true }).click();
  await expect(page.locator('#signMsg')).toHaveClass(/err/);
  await expect(page.locator('#signBtn')).toBeEnabled();
  // Recovery: the same run can still be submitted once the server is back.
  await page.unroute('**/api/leaderboard');
  await page.getByRole('button', { name: 'Ghi danh', exact: true }).click();
  await expect(page.locator('.msg.ok')).toContainText('Không được lưu');
});

test('Enter keeps driving the game after a header button was clicked', async ({ page }) => {
  await page.goto('/');
  await page.locator('#snd').click();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Cậu bé chăn trâu và lá cờ lau' })).toBeVisible();
});
