import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOT_DIR = path.resolve('artifacts/screenshots/magazine-m1a');

test.describe('MLN131 Magazine M1A Early Visual Gate — Spreads 01-02 & 05-06', () => {
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
          throw new Error(`[M1A Security Violation] Forbidden external request detected: ${url}`);
        }
      }
    });
  });

  test('Early Visual Gate: Capture required 6 screenshots and assert layout integrity', async ({ page }) => {
    test.setTimeout(180000);

    const pageErrors: Error[] = [];
    const consoleErrors: string[] = [];

    page.on('pageerror', (err) => pageErrors.push(err));
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

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

    // Helper: wait for 3D magazine settlement
    const waitForMagazineSettled = async () => {
      await page.waitForSelector('.magazine-experience[data-magazine-settled="true"]', { timeout: 15000 });
      await page.waitForTimeout(600);
    };

    // --- 1. Viewport 1920x1080 ---
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/?tier=high');

    // Mở Thư viện
    const openBtn = page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i });
    await expect(openBtn).toBeVisible();
    await openBtn.click();
    await expect(page.locator('.bookshelf-wrapper')).toBeVisible();

    // Mở Book I (Trang 0: Bìa trước)
    await page.keyboard.press('Digit1');
    const magazineRoot = page.locator('.magazine-experience');
    await expect(magazineRoot).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.magazine-volume-title')).toContainText('Quyển I');
    await expect(page.locator('.magazine-page-indicator')).toContainText('Bìa trước');
    await waitForMagazineSettled();

    // Screenshot 1: M1A-gate-cover-1920.png
    await assertLayoutClean();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M1A-gate-cover-1920.png'),
      fullPage: false,
    });

    // Lật sang Trang 1 (Spread 01–02: Cơ cấu xã hội & Năm lát cắt)
    await page.keyboard.press('Space');
    await expect(page.locator('.magazine-page-indicator')).toContainText('Trang 1–2');
    await waitForMagazineSettled();

    // Screenshot 2: M1A-gate-spread-01-02-showcase-1920.png
    await assertLayoutClean();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M1A-gate-spread-01-02-showcase-1920.png'),
      fullPage: false,
    });

    // Chuyển sang Reading mode
    const readingModeBtn = page.getByRole('button', { name: 'Chuyển sang chế độ đọc' });
    await readingModeBtn.click();
    await expect(page.getByRole('button', { name: 'Chuyển sang chế độ 3D' })).toBeVisible();
    await waitForMagazineSettled();

    // Screenshot 3: M1A-gate-spread-01-02-reading-1920.png
    await assertLayoutClean();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M1A-gate-spread-01-02-reading-1920.png'),
      fullPage: false,
    });

    // Chuyển lại sang Showcase mode để lật tiếp
    const showcaseModeBtn = page.getByRole('button', { name: 'Chuyển sang chế độ 3D' });
    await showcaseModeBtn.click();
    await waitForMagazineSettled();

    // Lật sang Trang 2 (Spread 03–04)
    await page.keyboard.press('Space');
    await expect(page.locator('.magazine-page-indicator')).toContainText('Trang 3–4');
    await waitForMagazineSettled();

    // Lật sang Trang 3 (Spread 05–06: Vị trí quan trọng hàng đầu & Tác động qua lại)
    await page.keyboard.press('Space');
    await expect(page.locator('.magazine-page-indicator')).toContainText('Trang 5–6');
    await waitForMagazineSettled();

    // Screenshot 4: M1A-gate-spread-05-06-showcase-1920.png
    await assertLayoutClean();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M1A-gate-spread-05-06-showcase-1920.png'),
      fullPage: false,
    });

    // Chuyển sang Reading mode ở Spread 05–06
    await page.getByRole('button', { name: 'Chuyển sang chế độ đọc' }).click();
    await expect(page.getByRole('button', { name: 'Chuyển sang chế độ 3D' })).toBeVisible();
    await waitForMagazineSettled();

    // Screenshot 5: M1A-gate-spread-05-06-reading-1920.png
    await assertLayoutClean();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M1A-gate-spread-05-06-reading-1920.png'),
      fullPage: false,
    });

    // Quay lại Showcase mode và trở về Thư viện
    await page.getByRole('button', { name: 'Chuyển sang chế độ 3D' }).click();
    await waitForMagazineSettled();
    await page.keyboard.press('Escape');
    await expect(page.locator('.bookshelf-wrapper')).toBeVisible();

    // --- 2. Viewport 1366x768 ---
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.waitForTimeout(600);

    // Mở lại Book I
    await page.keyboard.press('Digit1');
    await expect(magazineRoot).toBeVisible({ timeout: 10000 });
    await waitForMagazineSettled();

    // Lật sang Trang 1–2
    await page.keyboard.press('Space');
    await expect(page.locator('.magazine-page-indicator')).toContainText('Trang 1–2');
    await waitForMagazineSettled();

    // Screenshot 6: M1A-gate-spread-01-02-1366.png
    await assertLayoutClean();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M1A-gate-spread-01-02-1366.png'),
      fullPage: false,
    });

    // Xác nhận không có page errors hoặc console errors
    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);

    // Xác nhận đủ 6 file screenshots với kích thước > 10KB
    const requiredScreenshots = [
      'M1A-gate-cover-1920.png',
      'M1A-gate-spread-01-02-showcase-1920.png',
      'M1A-gate-spread-01-02-reading-1920.png',
      'M1A-gate-spread-05-06-showcase-1920.png',
      'M1A-gate-spread-05-06-reading-1920.png',
      'M1A-gate-spread-01-02-1366.png',
    ];

    for (const filename of requiredScreenshots) {
      const filePath = path.join(SCREENSHOT_DIR, filename);
      expect(fs.existsSync(filePath)).toBe(true);
      const stats = fs.statSync(filePath);
      expect(stats.size).toBeGreaterThan(10000);
    }
  });
});
