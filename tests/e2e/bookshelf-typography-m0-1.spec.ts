import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'artifacts/screenshots/magazine-m0');

test.describe('M0.1 — Bookshelf Vietnamese Typography Integrity Visual Gate', () => {
  const externalForbiddenRequests: string[] = [];
  const pageErrors: Error[] = [];
  const consoleErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    externalForbiddenRequests.length = 0;
    pageErrors.length = 0;
    consoleErrors.length = 0;

    page.on('pageerror', (err) => {
      pageErrors.push(err);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('sRGBEncoding') && !text.includes('LinearEncoding')) {
          consoleErrors.push(text);
        }
      }
    });

    page.on('request', (req) => {
      const url = req.url();
      if (
        url.includes('fonts.googleapis.com') ||
        url.includes('fonts.gstatic.com') ||
        url.includes('cdn.jsdelivr.net') ||
        url.includes('cdnjs.cloudflare.com') ||
        url.includes('unpkg.com')
      ) {
        externalForbiddenRequests.push(url);
      }
    });
  });

  test('Generate exact 4 M0.1 typography verification screenshots', async ({ page }) => {
    test.setTimeout(180000);

    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }

    const assertSettled = async () => {
      expect(await page.locator('canvas').count()).toBe(1);
      const isOverflowing = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      expect(isOverflowing).toBe(false);
    };

    // ==========================================
    // 1. Viewport 1920x1080 - Library font & full dock
    // ==========================================
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/?tier=high');

    // Click to open Library
    await page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i }).click();
    await expect(page.locator('.bookshelf-wrapper')).toBeVisible();

    // Wait for bookshelf canvas to be ready
    await page.waitForSelector('.bookshelf-wrapper[data-state="ready"]');
    await page.waitForTimeout(1500);

    await assertSettled();

    // 1. M0.1-library-font-1920.png
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M0.1-library-font-1920.png'),
      fullPage: false,
    });

    // ==========================================
    // 2. Viewport 1366x768 - Library font responsive
    // ==========================================
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.waitForTimeout(800);
    await assertSettled();

    // 2. M0.1-library-font-1366.png
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M0.1-library-font-1366.png'),
      fullPage: false,
    });

    // ==========================================
    // 3. All four books view (Library overview at 1920)
    // ==========================================
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    await assertSettled();

    // 3. M0.1-books-all-four.png
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M0.1-books-all-four.png'),
      fullPage: false,
    });

    // ==========================================
    // 4. Book I Closeup for Vietnamese accents inspection
    // ==========================================
    // Trigger inspect on selected Book (Book I)
    await page.evaluate(() => {
      const inspectBtn = document.getElementById('inspect') as HTMLButtonElement | null;
      inspectBtn?.click();
    });

    // Wait for detail transition animation to fully settle
    await page.waitForTimeout(2500);
    await assertSettled();

    // 4. M0.1-book-I-closeup.png
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M0.1-book-I-closeup.png'),
      fullPage: false,
    });

    // Verification assertions
    expect(externalForbiddenRequests).toHaveLength(0);
    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
  });
});
