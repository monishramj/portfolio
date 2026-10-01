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

test('image-only TV, project carousel, skill tapes, history and mobile layout', async ({ page }) => {
  test.setTimeout(60000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const today = new Date().toISOString().slice(0, 10);
  await page.route('**/github-contributions-api.jogruber.de/**', route => route.fulfill({ json: { contributions: [{ date: today, count: 5, level: 2 }] } }));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('http://127.0.0.1:5173/portfolio/');
  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(page.locator('canvas')).toBeVisible();
  await expect(nav.getByRole('link', { name: 'about me', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByText('love movies, sketching, and I have an origami collection.')).toBeVisible();
  await expect(page.locator('.screen-stage')).toHaveText('');
  await page.screenshot({ path: 'test-results/about-desktop.png' });
  await nav.getByRole('link', { name: 'projects', exact: true }).click();
  const titles = ['MedVR Haptic Glove', 'Monkish', 'Passenger Princess', 'DiabFit', 'Drone Survey Mission', 'ESP32 DOOM', 'Doffy'];
  for (const title of titles) {
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: `tv showing ${title}`, exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'source ↗', exact: true })).toHaveAttribute('href', /github.com/);
    if (title === 'DiabFit') await expect(page.getByRole('link', { name: 'app ↗', exact: true })).toHaveAttribute('href', /play.google.com/);
    if (title === 'Passenger Princess') await expect(page.getByRole('link', { name: 'devpost ↗', exact: true })).toHaveAttribute('href', /devpost.com/);
    await page.getByRole('link', { name: 'next project', exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: titles[0], exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'previous project', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Doffy', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Doffy', exact: true })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: titles[0], exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'enlarge image' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'MedVR Haptic Glove image preview' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'enlarge image' })).toBeFocused();
  await nav.getByRole('link', { name: 'skills', exact: true }).click();
  await expect(page.getByRole('group', { name: 'skills' }).getByRole('button')).toHaveCount(10);
  await page.getByRole('button', { name: 'PyTorch', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.skill-detail')).toContainText('10 million+');
  await expect(page.getByRole('region', { name: /5 contributions/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'PyTorch', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Flutter', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.skill-detail')).toContainText('800+');
  await page.screenshot({ path: 'test-results/skills-desktop.png' });
  await expect(page.getByRole('link', { name: /résumé/i })).toHaveAttribute('href', /resume.pdf$/);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const name of ['about me', 'projects', 'skills']) {
      await nav.getByRole('link', { name, exact: true }).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (name === 'skills') {
        await page.getByRole('button', { name: 'Docker', exact: true }).focus();
  await page.keyboard.press('Enter');
        await expect(page.locator('.skill-detail')).toContainText('Container tooling');
      }
      if (width === 390 && ['projects', 'skills'].includes(name)) await page.screenshot({ path: `test-results/${name}-mobile.png`, fullPage: true });
    }
  }
  await expect(page.getByRole('link', { name: 'email', exact: true })).toHaveAttribute('href', 'mailto:mrameshj@purdue.edu');
  await page.goto('http://127.0.0.1:5173/portfolio/#/?channel=doffy');
  await expect(page.getByRole('heading', { name: 'Doffy', exact: true })).toBeVisible();
  await page.goto('http://127.0.0.1:5173/portfolio/#/projects');
  await expect(page.getByRole('heading', { name: titles[0], exact: true })).toBeVisible();
  await page.goto('http://127.0.0.1:5173/portfolio/#/?view=unknown');
  await expect(nav.getByRole('link', { name: 'about me', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.route('**/github-contributions-api.jogruber.de/**', route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.reload();
  await expect(page.getByRole('link', { name: 'View activity on GitHub' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('project carousel remains usable when the TV model cannot load', async ({ page }) => {
  await page.route('**/grandmas_tv.glb', route => route.abort());
  await page.goto('http://127.0.0.1:5173/portfolio/');
  await expect(page.locator('.screen-fallback')).toBeVisible();
  await page.getByRole('link', { name: 'projects', exact: true }).click();
  await expect(page.locator('.screen-fallback')).toHaveAttribute('src', /vrglove.jpg$/);
  await page.getByRole('link', { name: 'next project', exact: true }).click();
  await expect(page.locator('.screen-fallback')).toHaveAttribute('src', /chess_eval.png$/);
  await page.getByRole('button', { name: 'enlarge image' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Monkish image preview' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('link', { name: 'skills', exact: true }).click();
  await page.getByRole('button', { name: 'Python', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.skill-detail')).toContainText('140,000+');
});
