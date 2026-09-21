import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const VIDEO_DIR = path.resolve('artifacts/videos');
const SCREENSHOT_DIR = path.resolve('artifacts/screenshots/magazine-m0');

test.describe('M0.4.1 — Bookshelf Navigation Contract & Lifecycle Closure Suite', () => {
  test('Full Verification: Canvas Interaction, Closing-Race, Top-Rail Policy, Lifecycle Assertions & 5-Cycle', async ({
    browser,
  }) => {
    test.setTimeout(900000);

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

    // Helper: read-only diagnostics snapshot & store state
    const getLifecycleState = async () => {
      return await page.evaluate(() => {
        const store =
          (window as any).__PRESENTATION_STORE__?.getState?.() ||
          (window as any).__store?.getState?.();
        const wrapper = document.querySelector('.bookshelf-wrapper') as HTMLElement | null;
        const debug = (window as any).__BOOKSHELF_DEBUG__?.getSnapshot?.();

        const rawIndex = wrapper?.getAttribute('data-bookshelf-selected-index');

        return {
          experienceMode: store?.experienceMode,
          selectedBook: store?.selectedBook,
          chapterIndex: store?.chapterIndex,
          canvasCount: document.querySelectorAll('canvas').length,
          rendererCreated: (window as any).bookshelfRendererCreated || 0,
          rendererDisposed: (window as any).bookshelfRendererDisposed || 0,
          domMode: wrapper?.getAttribute('data-bookshelf-mode') || null,
          domSelectedIndex: rawIndex !== null && rawIndex !== undefined ? Number(rawIndex) : null,
          domSettled: wrapper?.getAttribute('data-bookshelf-settled') === 'true',
          debugMode: debug?.mode ?? null,
          debugSelectedIndex: debug?.selectedIndex ?? null,
          debugSettled: debug?.settled ?? null,
        };
      });
    };

    // Helper: click book on canvas via read-only 3D projected screen coordinates
    const clickBookOnCanvas = async (bookIndex: number) => {
      await page.waitForFunction(
        (idx) => {
          const p = (window as any).__BOOKSHELF_DEBUG__?.getBookScreenPosition(idx);
          return p && p.visible && p.x > 0 && p.y > 0;
        },
        bookIndex,
        { timeout: 30000 }
      );

      const pos = await page.evaluate((idx) => {
        return (window as any).__BOOKSHELF_DEBUG__?.getBookScreenPosition(idx);
      }, bookIndex);

      expect(pos).not.toBeNull();
      await page.mouse.click(pos.x, pos.y);
    };

    // Helper: wait for Bookshelf in Hero mode and Settled
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

    // Helper: wait for Bookshelf Detail mode
    const waitForDetailMode = async () => {
      const wrapper = page.locator('.bookshelf-wrapper');
      await expect(wrapper).toBeVisible({ timeout: 60000 });
      await expect(wrapper).toHaveAttribute('data-bookshelf-mode', 'detail', { timeout: 60000 });
    };

    // =========================================================================
    // SECTION A: INITIAL MOUNT & LIFECYCLE BASELINE
    // =========================================================================
    await page.goto('/?tier=high');

    const openBtn = page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i });
    await expect(openBtn).toBeVisible({ timeout: 15000 });
    await openBtn.click();

    await waitForShelfSettled(0);

    // Lifecycle Assertions: Exactly 1 canvas, renderer active count is bounded
    let state = await getLifecycleState();
    expect(state.canvasCount).toBe(1);
    expect(state.rendererCreated - state.rendererDisposed).toBe(1);

    // =========================================================================
    // SECTION B: REAL CANVAS INTERACTION TEST (Mục 5 trong chat.md)
    // =========================================================================
    // 1. Click side Book II on canvas -> must center only, mode remains hero
    await clickBookOnCanvas(1);
    await waitForShelfSettled(1);
    state = await getLifecycleState();
    expect(state.domMode).toBe('hero');
    expect(state.selectedBook).toBe(1);

    // 2. Click centered Book II on canvas -> must open detail
    await clickBookOnCanvas(1);
    await waitForDetailMode();

    // 3. Escape -> closing -> hero
    await page.keyboard.press('Escape');
    await waitForShelfSettled(1);
    state = await getLifecycleState();
    expect(state.domMode).toBe('hero');
    expect(state.selectedBook).toBe(1);

    // 4. Repeat with Book IV (index 3)
    await clickBookOnCanvas(3);
    await waitForShelfSettled(3);
    state = await getLifecycleState();
    expect(state.domMode).toBe('hero');
    expect(state.selectedBook).toBe(3);

    // Click centered Book IV on canvas -> detail
    await clickBookOnCanvas(3);
    await waitForDetailMode();

    // Escape -> closing -> hero
    await page.keyboard.press('Escape');
    await waitForShelfSettled(3);

    // =========================================================================
    // SECTION C: REAL CLOSING-RACE TEST (Mục 4 trong chat.md)
    // =========================================================================
    // Kịch bản 1: Book II -> detail -> Escape -> mode === closing -> immediately click Book IV
    const book2Btn = page.getByRole('button', { name: /Quyển II\b/i });
    const book3Btn = page.getByRole('button', { name: /Quyển III\b/i });
    const book4Btn = page.getByRole('button', { name: /Quyển IV\b/i });
    const book1Btn = page.getByRole('button', { name: /Quyển I\b/i });

    await book2Btn.click();
    await waitForShelfSettled(1);

    // Vào detail Book II
    await clickBookOnCanvas(1);
    await waitForDetailMode();

    // Nhấn Escape
    await page.keyboard.press('Escape');

    // Chờ cho tới khi renderer bắt đầu closing
    await page.waitForFunction(() => {
      const wrapper = document.querySelector('.bookshelf-wrapper');
      return wrapper?.getAttribute('data-bookshelf-mode') === 'closing';
    }, { timeout: 30000 });

    // NGAY LẬP TỨC click Book IV trên rail mà KHÔNG chờ về hero trước!
    await book4Btn.click();

    // Đích đến cuối cùng phải là Book IV settled tại hero!
    await waitForShelfSettled(3);
    state = await getLifecycleState();
    expect(state.domMode).toBe('hero');
    expect(state.selectedBook).toBe(3);
    expect(state.domSelectedIndex).toBe(3);
    expect(state.domSettled).toBe(true);
    expect(state.debugSelectedIndex).toBe(3);
    expect(state.debugSettled).toBe(true);

    // Kịch bản 2: Book III detail -> closing -> immediately click Book II
    await book3Btn.click();
    await waitForShelfSettled(2);

    // Vào detail Book III
    await clickBookOnCanvas(2);
    await waitForDetailMode();

    // Nhấn Escape
    await page.keyboard.press('Escape');

    // Chờ cho tới khi mode === closing
    await page.waitForFunction(() => {
      const wrapper = document.querySelector('.bookshelf-wrapper');
      return wrapper?.getAttribute('data-bookshelf-mode') === 'closing';
    }, { timeout: 30000 });

    // NGAY LẬP TỨC click Book II trên rail
    await book2Btn.click();

    // Đích đến cuối cùng phải là Book II settled tại hero!
    await waitForShelfSettled(1);
    state = await getLifecycleState();
    expect(state.domMode).toBe('hero');
    expect(state.selectedBook).toBe(1);
    expect(state.domSelectedIndex).toBe(1);
    expect(state.domSettled).toBe(true);
    expect(state.debugSelectedIndex).toBe(1);
    expect(state.debugSettled).toBe(true);

    // =========================================================================
    // SECTION D: UNIFIED TOP-RAIL POLICY CHO BOOK I TRONG NON-HERO (Mục 2 & 3)
    // =========================================================================
    // Từ Book II detail -> click Book I trên rail:
    // BookshelfScene KHÔNG được unmount đột ngột mid-detail; phải close an toàn về hero,
    // sau đó mới mở Magazine!
    await clickBookOnCanvas(1);
    await waitForDetailMode();

    await book1Btn.click();

    // Verify Magazine mở mượt mà
    const magazineRoot = page.locator('.magazine-experience');
    await expect(magazineRoot).toBeVisible({ timeout: 60000 });

    // Lifecycle Counter Assertions:
    // Khi ở Magazine: exactly 1 canvas, Bookshelf renderer đã được dispose sạch
    state = await getLifecycleState();
    expect(state.experienceMode).toBe('magazine');
    expect(state.canvasCount).toBe(1);
    expect(state.rendererCreated - state.rendererDisposed).toBe(0);

    // Escape từ Magazine quay lại Library
    await page.keyboard.press('Escape');
    await waitForShelfSettled(0);

    // Lifecycle Counter Assertions:
    // Sau khi remount: exactly 1 canvas, renderer created/disposed delta <= 1 (không rò rỉ!)
    state = await getLifecycleState();
    expect(state.experienceMode).toBe('library');
    expect(state.canvasCount).toBe(1);
    expect(state.rendererCreated - state.rendererDisposed).toBe(1);

    // =========================================================================
    // SECTION E: LIBRARY-BUTTON REGRESSION TEST (Mục 4 trong chat.md)
    // =========================================================================
    const libraryBtn = page.getByRole('button', { name: /Thư viện/i });

    // Step E1: Select Book II -> detail -> click "Thư viện" button -> safe close to hero
    await book2Btn.click();
    await waitForShelfSettled(1);

    await clickBookOnCanvas(1);
    await waitForDetailMode();

    await libraryBtn.click();

    // Assert mode becomes closing immediately without unmounting
    await page.waitForFunction(() => {
      const wrapper = document.querySelector('.bookshelf-wrapper');
      return wrapper?.getAttribute('data-bookshelf-mode') === 'closing';
    }, { timeout: 30000 });

    state = await getLifecycleState();
    expect(state.experienceMode).toBe('library');
    expect(state.selectedBook).toBe(1);

    // Wait until hero is settled and verify selected book index remains 1
    await waitForShelfSettled(1);
    state = await getLifecycleState();
    expect(state.domMode).toBe('hero');
    expect(state.selectedBook).toBe(1);
    expect(state.domSelectedIndex).toBe(1);
    expect(state.debugSelectedIndex).toBe(1);

    // Step E2: Select Book IV -> detail -> click "Thư viện" -> hero settled -> Escape -> only NOW go to Cover
    await book4Btn.click();
    await waitForShelfSettled(3);

    await clickBookOnCanvas(3);
    await waitForDetailMode();

    await libraryBtn.click();
    await waitForShelfSettled(3);

    state = await getLifecycleState();
    expect(state.experienceMode).toBe('library');
    expect(state.selectedBook).toBe(3);

    // One click must never perform two transitions. Now pressing Escape while settled in hero exits to Cover.
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => {
      const store =
        (window as any).__PRESENTATION_STORE__?.getState?.() ||
        (window as any).__store?.getState?.();
      return store?.experienceMode === 'cover' || store?.viewMode === 'cover';
    }, { timeout: 30000 });

    state = await getLifecycleState();
    expect(state.experienceMode).toBe('cover');

    // Reopen Library to proceed with cycle tests
    const reopenLibraryBtn = page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i });
    await expect(reopenLibraryBtn).toBeVisible({ timeout: 15000 });
    await reopenLibraryBtn.click();
    await waitForShelfSettled(3);

    // =========================================================================
    // SECTION F: REAL 5-CYCLE VERIFICATION VỚI LIFECYCLE ASSERTIONS
    // =========================================================================
    const TOTAL_CYCLES = 5;

    for (let cycle = 1; cycle <= TOTAL_CYCLES; cycle++) {
      // Step 1: Select Book II -> enter detail -> Escape
      await book2Btn.click();
      await waitForShelfSettled(1);

      await clickBookOnCanvas(1);
      await waitForDetailMode();

      await page.keyboard.press('Escape');
      await waitForShelfSettled(1);

      state = await getLifecycleState();
      expect(state.experienceMode).toBe('library');
      expect(state.selectedBook).toBe(1);
      expect(state.canvasCount).toBe(1);
      expect(state.rendererCreated - state.rendererDisposed).toBe(1);

      // Step 2: Select Book IV -> enter detail -> Escape
      await book4Btn.click();
      await waitForShelfSettled(3);

      await clickBookOnCanvas(3);
      await waitForDetailMode();

      await page.keyboard.press('Escape');
      await waitForShelfSettled(3);

      state = await getLifecycleState();
      expect(state.experienceMode).toBe('library');
      expect(state.selectedBook).toBe(3);
      expect(state.canvasCount).toBe(1);
      expect(state.rendererCreated - state.rendererDisposed).toBe(1);

      // Step 3: Select Book III
      await book3Btn.click();
      await waitForShelfSettled(2);

      // Step 4: Select Book I -> open Magazine -> Escape back to Library
      await book1Btn.click();
      await expect(magazineRoot).toBeVisible({ timeout: 60000 });

      // Inside Magazine: exactly 1 canvas, Bookshelf renderer disposed
      state = await getLifecycleState();
      expect(state.experienceMode).toBe('magazine');
      expect(state.canvasCount).toBe(1);
      expect(state.rendererCreated - state.rendererDisposed).toBe(0);

      await page.keyboard.press('Escape');
      await waitForShelfSettled(0);

      // Back in Library: exactly 1 canvas, exactly 1 active renderer
      state = await getLifecycleState();
      expect(state.experienceMode).toBe('library');
      expect(state.canvasCount).toBe(1);
      expect(state.rendererCreated - state.rendererDisposed).toBe(1);

      // Step 5: Rapid succession clicks Book IV -> Book II -> Book III
      await book4Btn.click();
      await book2Btn.click();
      await book3Btn.click();

      // Final state of rapid selection must equal Book III (index 2)
      await waitForShelfSettled(2);
      state = await getLifecycleState();
      expect(state.selectedBook).toBe(2);
      expect(state.chapterIndex).toBe(2);
      expect(state.domSelectedIndex).toBe(2);
      expect(state.debugSelectedIndex).toBe(2);
      expect(state.canvasCount).toBe(1);
      expect(state.rendererCreated - state.rendererDisposed).toBe(1);
    }

    // =========================================================================
    // SECTION G: CAPTURE FRESH M0.4.2 EVIDENCE ARTIFACTS
    // =========================================================================
    const screenshotM042 = path.join(SCREENSHOT_DIR, 'm0-4-2-bookshelf-settled.png');
    const screenshotLegacy = path.join(SCREENSHOT_DIR, 'bookshelf-after-cycle-1920.png');
    await page.screenshot({ path: screenshotM042, fullPage: false });
    await page.screenshot({ path: screenshotLegacy, fullPage: false });

    const videoObj = page.video();
    await page.close();
    await context.close();

    if (videoObj) {
      const rawVideoPath = await videoObj.path();
      const videoM042 = path.join(VIDEO_DIR, 'm0-4-2-bookshelf-lifecycle.webm');
      const videoLegacy = path.join(VIDEO_DIR, 'bookshelf-navigation-lifecycle.webm');
      if (rawVideoPath && fs.existsSync(rawVideoPath)) {
        fs.copyFileSync(rawVideoPath, videoM042);
        fs.copyFileSync(rawVideoPath, videoLegacy);
      }
    }

    // Final safety assertions
    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
    expect(webglContextLost).toBe(false);
  });
});
