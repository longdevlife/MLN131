import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const VIDEO_DIR = path.resolve('artifacts/videos');
const SCREENSHOT_DIR = path.resolve('artifacts/screenshots/magazine-m0');

test.describe('M0.4 — Bookshelf Navigation & Lifecycle Stabilization Suite', () => {
  test('Reproduction & Verification: Full 5-cycle Library Navigation & Detail Lifecycle', async ({ browser }) => {
    test.setTimeout(600000);

    if (!fs.existsSync(VIDEO_DIR)) {
      fs.mkdirSync(VIDEO_DIR, { recursive: true });
    }
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      recordVideo: {
        dir: VIDEO_DIR,
        size: { width: 1920, height: 1080 },
      },
    });

    const page = await context.newPage();

    // 1. Diagnostics tracking
    const pageErrors: Error[] = [];
    const consoleErrors: string[] = [];
    let webglContextLost = false;

    page.on('pageerror', (err) => {
      pageErrors.push(err);
    });

    page.on('console', (msg) => {
      const text = msg.text();
      if (msg.type() === 'error') {
        if (!text.includes('sRGBEncoding') && !text.includes('LinearEncoding')) {
          consoleErrors.push(text);
        }
      }
    });

    await page.exposeFunction('onWebGLContextLost', () => {
      webglContextLost = true;
    });

    await page.addInitScript(() => {
      window.addEventListener('webglcontextlost', () => {
        (window as any).onWebGLContextLost?.();
      });
    });

    // Helper to get store & renderer state
    const getLifecycleState = async () => {
      return await page.evaluate(() => {
        const store = (window as any).__PRESENTATION_STORE__?.getState?.();
        const wrapper = document.querySelector('.bookshelf-wrapper') as HTMLElement | null;
        const renderer = (window as any).__BOOKSHELF_RENDERER__;

        return {
          experienceMode: store?.experienceMode,
          selectedBook: store?.selectedBook,
          chapterIndex: store?.chapterIndex,
          canvasCount: document.querySelectorAll('canvas').length,
          rendererCreated: (window as any).bookshelfRendererCreated || 0,
          rendererDisposed: (window as any).bookshelfRendererDisposed || 0,
          domMode: wrapper?.getAttribute('data-bookshelf-mode') || null,
          domSelectedIndex: wrapper?.getAttribute('data-bookshelf-selected-index') || null,
          domSettled: wrapper?.getAttribute('data-bookshelf-settled') || null,
          rendererSelectedIndex: renderer?.getSelectedVolume?.() ?? null,
          rendererMode: renderer?.getMode?.() ?? null,
          rendererSettled: renderer?.isSettled?.() ?? null,
        };
      });
    };

    // Helper: Wait for Bookshelf in Hero mode and Settled
    const waitForShelfSettled = async (expectedIndex?: number) => {
      const wrapper = page.locator('.bookshelf-wrapper');
      await expect(wrapper).toBeVisible({ timeout: 60000 });
      await expect(wrapper).toHaveAttribute('data-state', 'ready', { timeout: 60000 });
      await expect(wrapper).toHaveAttribute('data-bookshelf-mode', 'hero', { timeout: 60000 });
      await expect(wrapper).toHaveAttribute('data-bookshelf-settled', 'true', { timeout: 60000 });

      if (expectedIndex !== undefined) {
        await expect(wrapper).toHaveAttribute(
          'data-bookshelf-selected-index',
          String(expectedIndex),
          { timeout: 60000 }
        );
      }
    };

    // Helper: Wait for Bookshelf Detail mode
    const waitForDetailMode = async () => {
      const wrapper = page.locator('.bookshelf-wrapper');
      await expect(wrapper).toBeVisible({ timeout: 60000 });
      await expect(wrapper).toHaveAttribute('data-bookshelf-mode', 'detail', { timeout: 60000 });
    };

    // ==========================================
    // START: Cover -> Library
    // ==========================================
    await page.goto('/?tier=high');

    const openBtn = page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i });
    await expect(openBtn).toBeVisible({ timeout: 15000 });
    await openBtn.click();

    await waitForShelfSettled(0);

    // ==========================================
    // REPEAT THE 5 CYCLES
    // ==========================================
    const TOTAL_CYCLES = 5;

    for (let cycle = 1; cycle <= TOTAL_CYCLES; cycle++) {
      // Step A: Select Book II
      const book2Btn = page.getByRole('button', { name: /Quyển II\b/i });
      await book2Btn.click();
      await waitForShelfSettled(1);

      // Enter Bookshelf detail (click canvas center or inspect)
      await page.evaluate(() => {
        const inspect = document.getElementById('inspect') as HTMLButtonElement | null;
        inspect?.click();
      });
      await waitForDetailMode();

      // Back/Escape -> must return to Library browse (hero mode), NOT Cover!
      await page.keyboard.press('Escape');
      await waitForShelfSettled(1);

      // Verify still in library mode
      let state = await getLifecycleState();
      expect(state.experienceMode).toBe('library');
      expect(state.selectedBook).toBe(1);

      // Step B: Select Book IV
      const book4Btn = page.getByRole('button', { name: /Quyển IV\b/i });
      await book4Btn.click();
      await waitForShelfSettled(3);

      // Enter detail
      await page.evaluate(() => {
        const inspect = document.getElementById('inspect') as HTMLButtonElement | null;
        inspect?.click();
      });
      await waitForDetailMode();

      // Back/Escape -> must return to Library browse
      await page.keyboard.press('Escape');
      await waitForShelfSettled(3);

      state = await getLifecycleState();
      expect(state.experienceMode).toBe('library');
      expect(state.selectedBook).toBe(3);

      // Step C: Select Book III
      const book3Btn = page.getByRole('button', { name: /Quyển III\b/i });
      await book3Btn.click();
      await waitForShelfSettled(2);

      // Step D: Select Book I -> open Magazine
      const book1Btn = page.getByRole('button', { name: /Quyển I\b/i });
      await book1Btn.click();

      // Verify Magazine opened
      const magazineRoot = page.locator('.magazine-experience');
      await expect(magazineRoot).toBeVisible({ timeout: 10000 });
      state = await getLifecycleState();
      expect(state.experienceMode).toBe('magazine');

      // Escape back to Library
      await page.keyboard.press('Escape');
      await waitForShelfSettled(0);
      state = await getLifecycleState();
      expect(state.experienceMode).toBe('library');

      // Step E: IMMEDIATELY select Book IV -> Book II -> Book III in rapid succession
      await book4Btn.click();
      await book2Btn.click();
      await book3Btn.click();

      // Final state of rapid selection must equal Book III (index 2)
      await waitForShelfSettled(2);
      state = await getLifecycleState();
      expect(state.selectedBook).toBe(2);
      expect(state.chapterIndex).toBe(2);
      expect(state.rendererSelectedIndex).toBe(2);
    }

    // ==========================================
    // CAPTURE EVIDENCE ARTIFACTS
    // ==========================================
    // Capture screenshot after full cycle: bookshelf-after-cycle-1920.png
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'bookshelf-after-cycle-1920.png'),
      fullPage: false,
    });

    // Close page and context to finalize video recording
    const videoObj = page.video();
    await page.close();
    await context.close();

    if (videoObj) {
      const rawVideoPath = await videoObj.path();
      const targetVideoPath = path.join(VIDEO_DIR, 'bookshelf-navigation-lifecycle.webm');
      if (rawVideoPath && fs.existsSync(rawVideoPath)) {
        fs.copyFileSync(rawVideoPath, targetVideoPath);
      }
    }

    // Diagnostics assertions
    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
    expect(webglContextLost).toBe(false);
  });
});
