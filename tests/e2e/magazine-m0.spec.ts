import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOT_DIR = path.resolve('artifacts/screenshots/magazine-m0');

test.describe('MLN131 Magazine Core M0 - Verification & Lifecycle Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Fail immediately on any forbidden external font or CDN requests
    page.on('request', (request) => {
      const url = request.url();
      const forbiddenHosts = [
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'cdn.jsdelivr.net',
        'unpkg.com',
      ];
      for (const host of forbiddenHosts) {
        if (url.includes(host)) {
          throw new Error(`[M0 Security Violation] Forbidden external request detected: ${url}`);
        }
      }
    });
  });

  test('1. Core flow: Cover -> Library -> Magazine Book I -> Page turn -> View mode toggle -> Escape back to Library', async ({ page }) => {
    test.setTimeout(120000);
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/?tier=high');

    // 1. Cover Screen
    const openBtn = page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i });
    await expect(openBtn).toBeVisible();
    await openBtn.click();

    // 2. Library Screen
    await expect(page.locator('.bookshelf-wrapper')).toBeVisible();
    expect(await page.locator('canvas').count()).toBe(1);

    // 3. Open Book I via Digit1
    await page.keyboard.press('Digit1');
    const magazineRoot = page.locator('.magazine-experience');
    await expect(magazineRoot).toBeVisible({ timeout: 10000 });
    expect(await page.locator('canvas').count()).toBe(1);

    // Verify Magazine Header & initial page
    await expect(page.locator('.magazine-volume-title')).toContainText('Quyển I');
    await expect(page.locator('.magazine-page-indicator')).toContainText('Bìa trước');

    // 4. Page forward via keyboard Space
    await page.keyboard.press('Space');
    await expect(page.locator('.magazine-page-indicator')).toContainText('Trang 1–2');

    // 5. Page backward via keyboard ArrowLeft
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('.magazine-page-indicator')).toContainText('Bìa trước');

    // 6. Page forward via Chrome UI button
    const nextBtn = page.getByRole('button', { name: 'Trang tiếp' });
    await nextBtn.click();
    await expect(page.locator('.magazine-page-indicator')).toContainText('Trang 1–2');

    // 7. Toggle Reading mode
    const readingModeBtn = page.getByRole('button', { name: 'Chuyển sang chế độ đọc' });
    await readingModeBtn.click();
    const showcaseModeBtn = page.getByRole('button', { name: 'Chuyển sang chế độ 3D' });
    await expect(showcaseModeBtn).toBeVisible();

    // 8. Toggle back to Showcase mode
    await showcaseModeBtn.click();
    await expect(page.getByRole('button', { name: 'Chuyển sang chế độ đọc' })).toBeVisible();

    // 9. Escape back to Library
    await page.keyboard.press('Escape');
    await expect(page.locator('.bookshelf-wrapper')).toBeVisible();
    await expect(magazineRoot).toHaveCount(0);
    expect(await page.locator('canvas').count()).toBe(1);

    expect(pageErrors).toHaveLength(0);
  });

  test('2. Negative assertions: No legacy party magazine branding in Magazine Book I', async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/?tier=high');

    await page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i }).click();
    await expect(page.locator('.bookshelf-wrapper')).toBeVisible();

    await page.keyboard.press('Digit1');
    await expect(page.locator('.magazine-experience')).toBeVisible();

    // Negative branding checks
    await expect(page.getByText(/VNR-T17/i)).toHaveCount(0);
    await expect(page.getByText(/Sản Xuất Bung Ra/i)).toHaveCount(0);
    await expect(page.getByText(/Tạp Chí Lịch Sử Đảng/i)).toHaveCount(0);
  });

  test('3. Unavailable books guard: Books II, III, IV remain in Library without opening Magazine', async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/?tier=high');

    await page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i }).click();
    await expect(page.locator('.bookshelf-wrapper')).toBeVisible();

    // Press Digit2 for Book II
    await page.keyboard.press('Digit2');
    await page.waitForTimeout(300);
    await expect(page.locator('.bookshelf-wrapper')).toBeVisible();
    await expect(page.locator('.magazine-experience')).toHaveCount(0);
    expect(await page.locator('canvas').count()).toBe(1);

    // Press Digit3 for Book III
    await page.keyboard.press('Digit3');
    await page.waitForTimeout(300);
    await expect(page.locator('.bookshelf-wrapper')).toBeVisible();
    await expect(page.locator('.magazine-experience')).toHaveCount(0);
    expect(await page.locator('canvas').count()).toBe(1);

    // Press Digit4 for Book IV
    await page.keyboard.press('Digit4');
    await page.waitForTimeout(300);
    await expect(page.locator('.bookshelf-wrapper')).toBeVisible();
    await expect(page.locator('.magazine-experience')).toHaveCount(0);
    expect(await page.locator('canvas').count()).toBe(1);
  });

  test('4. 10-cycle WebGL lifecycle test: Library <-> Magazine with zero context loss and invariant single canvas', async ({ page }) => {
    test.setTimeout(240000);

    const pageErrors: Error[] = [];
    const consoleErrors: string[] = [];

    page.on('pageerror', (err) => pageErrors.push(err));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (/webgl|context lost|gl error|shader/i.test(text)) {
          consoleErrors.push(text);
        }
      }
    });

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/?tier=high');

    await page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i }).click();
    await expect(page.locator('.bookshelf-wrapper')).toBeVisible();
    expect(await page.locator('canvas').count()).toBe(1);

    for (let cycle = 1; cycle <= 10; cycle++) {
      // 1. Open Magazine via Digit1
      await page.keyboard.press('Digit1');
      await expect(page.locator('.magazine-experience')).toBeVisible();

      // Exactly 1 canvas during Magazine
      expect(await page.locator('canvas').count()).toBe(1);

      // Turn one page
      await page.keyboard.press('Space');
      await expect(page.locator('.magazine-page-indicator')).toContainText('Trang 1–2');

      // 2. Escape back to Library
      await page.keyboard.press('Escape');
      await expect(page.locator('.bookshelf-wrapper')).toBeVisible();
      await expect(page.locator('.magazine-experience')).toHaveCount(0);

      // Exactly 1 canvas during Library
      expect(await page.locator('canvas').count()).toBe(1);
    }

    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
  });

  test('5. Visual Gate: Capture exact 6 M0 verification screenshots', async ({ page }) => {
    test.setTimeout(180000);

    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }

    const assertLayoutClean = async () => {
      const isOverflowing = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(isOverflowing).toBe(false);
      expect(await page.locator('canvas').count()).toBe(1);
    };

    // --- Viewport 1920x1080 ---
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/?tier=high');

    await page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i }).click();
    await expect(page.locator('.bookshelf-wrapper')).toBeVisible();
    await page.waitForTimeout(1000);

    // 1. M0-library-1920.png
    await assertLayoutClean();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M0-library-1920.png'),
      fullPage: false,
    });

    // Open Magazine Book I (Cover)
    await page.keyboard.press('Digit1');
    await expect(page.locator('.magazine-experience')).toBeVisible();
    await expect(page.locator('.magazine-volume-title')).toContainText('Quyển I');
    await page.waitForSelector('.magazine-experience[data-magazine-settled="true"]');
    await page.waitForTimeout(800);

    // 2. M0-magazine-cover-1920.png
    await assertLayoutClean();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M0-magazine-cover-1920.png'),
      fullPage: false,
    });

    // Turn to Open Spread (Page 1-2)
    await page.keyboard.press('Space');
    await expect(page.locator('.magazine-page-indicator')).toContainText('Trang 1–2');
    await page.waitForSelector('.magazine-experience[data-magazine-settled="true"]');
    await page.waitForTimeout(800);

    // 3. M0-magazine-open-1920.png
    await assertLayoutClean();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M0-magazine-open-1920.png'),
      fullPage: false,
    });

    // Switch to Reading mode
    await page.getByRole('button', { name: 'Chuyển sang chế độ đọc' }).click();
    await page.waitForSelector('.magazine-experience[data-magazine-settled="true"]');
    await page.waitForTimeout(800);

    // 4. M0-magazine-reading-1920.png
    await assertLayoutClean();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M0-magazine-reading-1920.png'),
      fullPage: false,
    });

    // Return to Library
    await page.keyboard.press('Escape');
    await expect(page.locator('.bookshelf-wrapper')).toBeVisible();

    // --- Viewport 1366x768 ---
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.waitForTimeout(1000);

    // 5. M0-library-1366.png
    await assertLayoutClean();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M0-library-1366.png'),
      fullPage: false,
    });

    // Open Magazine Book I and turn to Open Spread
    await page.keyboard.press('Digit1');
    await expect(page.locator('.magazine-experience')).toBeVisible();
    await page.keyboard.press('Space');
    await expect(page.locator('.magazine-page-indicator')).toContainText('Trang 1–2');
    await page.waitForSelector('.magazine-experience[data-magazine-settled="true"]');
    await page.waitForTimeout(800);

    // 6. M0-magazine-open-1366.png
    await assertLayoutClean();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M0-magazine-open-1366.png'),
      fullPage: false,
    });

    // Confirm all 6 files exist and have non-zero size
    const expectedScreenshots = [
      'M0-library-1920.png',
      'M0-magazine-cover-1920.png',
      'M0-magazine-open-1920.png',
      'M0-magazine-reading-1920.png',
      'M0-library-1366.png',
      'M0-magazine-open-1366.png',
    ];

    for (const filename of expectedScreenshots) {
      const filePath = path.join(SCREENSHOT_DIR, filename);
      expect(fs.existsSync(filePath)).toBe(true);
      const stats = fs.statSync(filePath);
      expect(stats.size).toBeGreaterThan(10000);
    }
  });
});
