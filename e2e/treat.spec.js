import { test, expect } from '@playwright/test';
import { startCampaign, winAll } from './campaign.js';

// "Khao quân" (buy me a coffee): a modal with the bank QR, opened from the header or the finale.

async function openFromHeader(page) {
  await page.getByRole('button', { name: 'Khao quân', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Mời người làm game một ly cà phê' });
  await expect(dialog).toBeVisible();
  return dialog;
}

test('the header button opens the dialog with a loaded QR, and every way out closes it', async ({ page }) => {
  await page.goto('/');
  let dialog = await openFromHeader(page);
  const qr = dialog.getByRole('img', { name: 'Mã QR chuyển khoản ngân hàng' });
  expect(await qr.evaluate(img => img.complete && img.naturalWidth)).toBeGreaterThan(0);

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  dialog = await openFromHeader(page);
  await dialog.getByRole('button', { name: 'Đóng' }).click();
  await expect(dialog).toBeHidden();

  dialog = await openFromHeader(page);
  await page.mouse.click(10, 400); // the backdrop, left of the centred dialog
  await expect(dialog).toBeHidden();
});

test('an open dialog swallows game keys, and the battle resumes untouched after closing', async ({ page }) => {
  await page.goto('/');
  await startCampaign(page);
  await page.locator('button.tile:not([disabled])').first().click();
  const dialog = await openFromHeader(page);
  for (const key of ['a', 'b', 'c', 'l', 's']) await page.keyboard.press(key);
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.locator('.opt.bad')).toHaveCount(0);
  await expect(page.locator('.result')).toHaveCount(0);
  await expect(page.locator('.fight .q')).toBeVisible(); // still in the same battle, not on the map
});

test('Enter drives the game after the dialog closes instead of reopening it', async ({ page }) => {
  await page.goto('/');
  const dialog = await openFromHeader(page);
  await page.keyboard.press('Escape');
  await page.keyboard.press('Enter');
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Cậu bé chăn trâu và lá cờ lau' })).toBeVisible();
});

test('copy puts the account number on the clipboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  const dialog = await openFromHeader(page);
  const copy = dialog.locator('.copy[data-copy="0123456789"]'); // by data: the label changes on click
  await copy.click();
  await expect(copy).toHaveText('Đã chép');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('0123456789');
});

test('a refused clipboard selects the text and never claims it was copied', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { navigator.clipboard.writeText = () => Promise.reject(new Error('denied')); });
  const dialog = await openFromHeader(page);
  const copy = dialog.locator('.copy[data-copy="0123456789"]'); // by data: the label changes on click
  await copy.click();
  await expect(copy).toHaveText('Đã bôi đen, hãy tự chép');
  expect(await page.evaluate(() => getSelection().toString())).toBe('0123 456 789');
});

// Title -> the 12 battles -> tally -> crown -> finale, without signing the board.
async function toFinale(page) {
  await startCampaign(page);
  await winAll(page);
  await page.getByRole('button', { name: 'Ghi danh bảng vàng' }).click();
  await page.getByRole('button', { name: 'Đăng cơ' }).click();
  for (let i = 0; i < 16; i++) await page.keyboard.press('Enter');
}

test('the finale invites players to khao quân', async ({ page }) => {
  await page.goto('/');
  await toFinale(page);
  const link = page.getByRole('button', { name: 'Khao quân một ly cà phê' });
  await expect(link).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('.fin > .row')).toHaveClass(/on/, { timeout: 15_000 });
  await link.click();
  await expect(page.getByRole('dialog', { name: 'Mời người làm game một ly cà phê' })).toBeVisible();
});

test('presenter mode shows no request for money', async ({ page }) => {
  await page.goto('/?presenter');
  await expect(page.locator('#treatBtn')).toBeHidden();
  await expect(page.locator('#boardBtn')).toBeVisible();
  await toFinale(page);
  await expect(page.locator('.fin > .row')).toHaveClass(/on/, { timeout: 15_000 });
  await expect(page.locator('.made')).toHaveText('Trò chơi này dựng nên cùng Claude.');
});

test('on a phone the dialog fits the screen with no sideways scroll', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
  await page.goto('/');
  const dialog = await openFromHeader(page);
  const box = await dialog.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(375);
  expect(box.y + box.height).toBeLessThanOrEqual(667 + 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  await expect(dialog.getByRole('img', { name: 'Mã QR chuyển khoản ngân hàng' })).toBeInViewport();
  await page.close();
});
