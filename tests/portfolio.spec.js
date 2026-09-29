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

test('two-panel browsing, project channels, keyboard and mobile layout', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const today = new Date().toISOString().slice(0, 10);
  await page.route('**/github-contributions-api.jogruber.de/**', route => route.fulfill({ json: { contributions: [{ date: today, count: 5, level: 2 }] } }));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('http://127.0.0.1:5173/portfolio/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByRole('link', { name: 'about me', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByText('love movies, sketching, and I have an origami collection.')).toBeVisible();

  const channels = ['MedVR Haptic Glove', 'Monkish', 'Passenger Princess', 'DiabFit', 'Drone Survey Mission', 'ESP32 DOOM', 'Doffy'];
  for (const title of channels) {
    await page.getByRole('link', { name: 'Next channel', exact: true }).click();
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: `TV showing ${title}`, exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Source' })).toHaveAttribute('href', /github.com/);
    if (title === 'DiabFit') await expect(page.getByRole('link', { name: 'App ↗', exact: true })).toHaveAttribute('href', /play.google.com/);
    if (title === 'Passenger Princess') await expect(page.getByRole('link', { name: 'Devpost' })).toHaveAttribute('href', /devpost.com/);
  }
  await expect(page).toHaveURL(/channel=doffy/);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Doffy', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Next channel', exact: true }).click();
  await expect(page.getByRole('link', { name: 'about me', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Doffy', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'about me', exact: true }).click();
  await page.getByRole('link', { name: 'Previous channel', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Doffy', exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'projects', exact: true }).click();
  await expect(page).toHaveURL(/channel=medvr-haptic-glove$/);
  await page.getByRole('button', { name: 'Enlarge' }).click();
  await expect(page.getByRole('dialog', { name: 'MedVR Haptic Glove image preview' })).toBeVisible();
  await expect(page.locator('.image-preview img')).toHaveAttribute('src', /vrglove.jpg$/);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Enlarge' })).toBeFocused();
  await expect(page.getByRole('link', { name: 'résumé' })).toHaveAttribute('href', /resume.pdf$/);

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('link', { name: 'github activity', exact: true }).click();
    await expect(page.getByText('5 contributions', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('link', { name: 'projects', exact: true }).click();
  }
  await page.getByRole('link', { name: 'contact', exact: true }).click();
  await expect(page.getByRole('link', { name: 'mrameshj@purdue.edu' })).toHaveAttribute('href', 'mailto:mrameshj@purdue.edu');
  await page.goto('http://127.0.0.1:5173/portfolio/#/projects');
  await expect(page).toHaveURL(/channel=medvr-haptic-glove$/);
  await page.goto('http://127.0.0.1:5173/portfolio/#/?channel=unknown');
  await expect(page.getByRole('link', { name: 'about me', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.route('**/github-contributions-api.jogruber.de/**', route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.getByRole('link', { name: 'github activity', exact: true }).click();
  await expect(page.getByRole('link', { name: 'View activity on GitHub' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('channel browsing remains usable when the TV model cannot load', async ({ page }) => {
  await page.route('**/grandmas_tv.glb', route => route.abort());
  await page.goto('http://127.0.0.1:5173/portfolio/');
  await expect(page.locator('.screen-fallback')).toBeVisible();
  await page.getByRole('link', { name: 'Next channel', exact: true }).click();
  await expect(page.locator('.screen-fallback')).toHaveAttribute('src', /vrglove.jpg$/);
  await expect(page.getByRole('heading', { name: 'MedVR Haptic Glove', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Enlarge' }).click();
  await expect(page.getByRole('dialog', { name: 'MedVR Haptic Glove image preview' })).toBeVisible();
});
