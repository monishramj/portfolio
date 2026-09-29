import { test, expect } from '@playwright/test';
import { buildCalendar } from '../src/components/contributions.js';

test.use({ channel: 'chrome', reducedMotion: 'reduce' });

test('calendar bounds, totals, alignment and invalid responses', () => {
  const calendar = buildCalendar({ contributions: [
    { date: '2026-01-01', count: 2, level: 1 },
    { date: '2026-01-02', count: 4, level: 2 },
    { date: '2026-01-03', count: 9, level: 3 },
    { date: '2024-01-01', count: 100, level: 4 },
    { date: '2026-01-02', count: -1, level: 9 },
    null,
  ] }, new Date('2026-01-02T12:00:00Z'));
  expect(calendar.total).toBe(6);
  expect(calendar.cells.slice(0, 4)).toEqual([null, null, null, null]);
  expect(calendar.cells.filter(Boolean)).toHaveLength(2);
  expect(() => buildCalendar({ contributions: [] })).toThrow();
  expect(() => buildCalendar({})).toThrow();
});

test('one-page browsing, responsive layout, resume and calendar fallback', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const today = new Date().toISOString().slice(0, 10);
  await page.route('**/github-contributions-api.jogruber.de/**', route => route.fulfill({ json: { contributions: [{ date: today, count: 5, level: 2 }] } }));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('http://127.0.0.1:5173/portfolio/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByText('5 contributions', { exact: true })).toBeVisible();
  await expect(page.locator('.project-card:visible')).toHaveCount(3);
  await page.getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page).toHaveURL(/#\/#projects$/);
  await page.locator('summary').click();
  await expect(page.locator('.project-card:visible')).toHaveCount(7);
  await page.locator('summary').click();
  await expect(page.locator('.project-card:visible')).toHaveCount(3);
  await page.getByRole('button', { name: 'Résumé' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Résumé' })).toBeFocused();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator('summary').click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator('summary').click();
  }
  await page.goto('http://127.0.0.1:5173/portfolio/#/projects');
  await expect(page).toHaveURL(/#\/#projects$/);
  await expect(page.getByRole('heading', { name: 'A few things I’ve built.' })).toBeVisible();
  await page.route('**/github-contributions-api.jogruber.de/**', route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.reload();
  await expect(page.getByRole('link', { name: 'View activity on GitHub' })).toBeVisible();
  expect(errors).toEqual([]);
});
