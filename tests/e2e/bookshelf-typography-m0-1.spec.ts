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

      try {
        const parsed = new URL(url);
        if (
          parsed.protocol.startsWith('http') &&
          parsed.hostname !== 'localhost' &&
          parsed.hostname !== '127.0.0.1'
        ) {
          externalForbiddenRequests.push(url);
        }
      } catch {
        // ignore data: or blob:
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

    // Verification assertions: zero forbidden host and zero external origin requests
    expect(externalForbiddenRequests).toHaveLength(0);
    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
  });

  test('ChapterRail Library interaction: clicking Book IV selects Book IV and Space does NOT open Book I', async ({ page }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/?tier=high');

    // Open Library
    await page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i }).click();
    await expect(page.locator('.bookshelf-wrapper')).toBeVisible();

    // Wait for bookshelf to be ready
    await page.waitForSelector('.bookshelf-wrapper[data-state="ready"]');
    await page.waitForTimeout(1000);

    // Click Book IV in ChapterRail dock
    const book4Btn = page.getByRole('button', { name: /Quyển IV/i });
    await expect(book4Btn).toBeVisible();
    await book4Btn.click();

    // Verify state in store
    await expect.poll(async () => {
      return await page.evaluate(() => {
        const store = (window as any).__PRESENTATION_STORE__?.getState?.();
        return {
          selectedBook: store?.selectedBook,
          chapterIndex: store?.chapterIndex,
          experienceMode: store?.experienceMode,
        };
      });
    }).toEqual({
      selectedBook: 3,
      chapterIndex: 3,
      experienceMode: 'library',
    });

    // Press Space in Library while Book IV is selected
    await page.keyboard.press('Space');
    await page.waitForTimeout(500);

    // Assert Space did NOT open Book I (remains in library)
    const stateAfterSpace = await page.evaluate(() => {
      const store = (window as any).__PRESENTATION_STORE__?.getState?.();
      return {
        selectedBook: store?.selectedBook,
        chapterIndex: store?.chapterIndex,
        experienceMode: store?.experienceMode,
      };
    });
    expect(stateAfterSpace.selectedBook).toBe(3);
    expect(stateAfterSpace.chapterIndex).toBe(3);
    expect(stateAfterSpace.experienceMode).toBe('library');
    await expect(page.locator('.magazine-experience')).toHaveCount(0);

    // Now click Book I in ChapterRail dock -> must open Book I
    const book1Btn = page.getByRole('button', { name: /Quyển I\b/i });
    await book1Btn.click();
    await expect(page.locator('.magazine-experience')).toBeVisible();
    await expect(page.locator('.magazine-volume-title')).toContainText('Quyển I');
  });

  test('M0.3 — Generate exact 2 internal page verification screenshots (Book I and Book II)', async ({ page }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/?tier=high');

    // Open Library
    await page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i }).click();
    const wrapper = page.locator('.bookshelf-wrapper');
    await expect(wrapper).toBeVisible();

    // Wait for bookshelf canvas to be ready
    await page.waitForSelector('.bookshelf-wrapper[data-state="ready"]');
    await expect(wrapper).toHaveAttribute('data-bookshelf-mode', 'hero', { timeout: 10000 });
    await expect(wrapper).toHaveAttribute('data-bookshelf-settled', 'true', { timeout: 10000 });

    // Assert before detail
    let storeState = await page.evaluate(() => (window as any).__PRESENTATION_STORE__?.getState?.());
    expect(storeState.experienceMode).toBe('library');
    expect(storeState.selectedBook).toBe(0);

    // ==========================================
    // 1. Book I: opening Book I routes to Magazine
    // ==========================================
    const book1Btn = page.getByRole('button', { name: /Quyển I\b/i });
    await book1Btn.click();

    // Assert Magazine explicitly
    const magazineRoot = page.locator('.magazine-experience');
    await expect(magazineRoot).toBeVisible({ timeout: 10000 });
    storeState = await page.evaluate(() => (window as any).__PRESENTATION_STORE__?.getState?.());
    expect(storeState.experienceMode).toBe('magazine');
    await expect(page.locator('.magazine-volume-title')).toContainText('Quyển I');

    // Capture M0.3-book-I-inner-page.png (Magazine reading view)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M0.3-book-I-inner-page.png'),
      fullPage: false,
    });

    // Escape back to Library
    await page.keyboard.press('Escape');
    await expect(wrapper).toBeVisible({ timeout: 10000 });
    await expect(wrapper).toHaveAttribute('data-bookshelf-mode', 'hero', { timeout: 10000 });
    await expect(wrapper).toHaveAttribute('data-bookshelf-settled', 'true', { timeout: 10000 });

    // ==========================================
    // 2. Return to shelf -> select Book II -> open internal pages
    // ==========================================
    // Select Book II via ChapterRail
    const book2Btn = page.getByRole('button', { name: /Quyển II/i });
    await book2Btn.click();
    await expect(wrapper).toHaveAttribute('data-bookshelf-selected-index', '1', { timeout: 5000 });
    await expect(wrapper).toHaveAttribute('data-bookshelf-settled', 'true', { timeout: 10000 });

    // Inspect Book II
    await page.evaluate(() => {
      const inspectBtn = document.getElementById('inspect') as HTMLButtonElement | null;
      inspectBtn?.click();
    });
    await expect(wrapper).toHaveAttribute('data-bookshelf-mode', 'detail', { timeout: 10000 });

    // Toggle open Book II
    await page.evaluate(() => {
      const toggleBtn = document.getElementById('toggle-book') as HTMLButtonElement | null;
      toggleBtn?.click();
    });
    await page.waitForTimeout(2000);

    // Capture M0.3-book-II-inner-page.png
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'M0.3-book-II-inner-page.png'),
      fullPage: false,
    });

    // Close detail via Escape
    await page.keyboard.press('Escape');
    await expect(wrapper).toHaveAttribute('data-bookshelf-mode', 'hero', { timeout: 10000 });
    await expect(wrapper).toHaveAttribute('data-bookshelf-selected-index', '1', { timeout: 5000 });
    await expect(wrapper).toHaveAttribute('data-bookshelf-settled', 'true', { timeout: 10000 });

    storeState = await page.evaluate(() => (window as any).__PRESENTATION_STORE__?.getState?.());
    expect(storeState.experienceMode).toBe('library');
    expect(storeState.selectedBook).toBe(1);

    // ==========================================
    // 3. Repeat for Book III
    // ==========================================
    const book3Btn = page.getByRole('button', { name: /Quyển III/i });
    await book3Btn.click();
    await expect(wrapper).toHaveAttribute('data-bookshelf-selected-index', '2', { timeout: 5000 });
    await expect(wrapper).toHaveAttribute('data-bookshelf-settled', 'true', { timeout: 10000 });

    await page.evaluate(() => {
      const inspectBtn = document.getElementById('inspect') as HTMLButtonElement | null;
      inspectBtn?.click();
    });
    await expect(wrapper).toHaveAttribute('data-bookshelf-mode', 'detail', { timeout: 10000 });

    await page.keyboard.press('Escape');
    await expect(wrapper).toHaveAttribute('data-bookshelf-mode', 'hero', { timeout: 10000 });
    await expect(wrapper).toHaveAttribute('data-bookshelf-selected-index', '2', { timeout: 5000 });
    await expect(wrapper).toHaveAttribute('data-bookshelf-settled', 'true', { timeout: 10000 });

    storeState = await page.evaluate(() => (window as any).__PRESENTATION_STORE__?.getState?.());
    expect(storeState.experienceMode).toBe('library');
    expect(storeState.selectedBook).toBe(2);

    // Verification assertions
    expect(externalForbiddenRequests).toHaveLength(0);
    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
  });
});
