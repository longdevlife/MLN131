import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

test.describe('MLN Chapter 5 Presentation - Phase 2.1 Compliance & Verification Suite', () => {
  test('1. Vertical Slice Core Flow: Cover -> Library -> Book I -> P1.S0 -> P1.S1 -> Backtrack -> Blackout -> Library', async ({ page }) => {
    await page.goto('/?safe=1');

    // Cover Screen
    const openBtn = page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i });
    await expect(openBtn).toBeVisible();
    await expect(page.getByText(/Cơ cấu xã hội – giai cấp và liên minh giai cấp/i)).toBeVisible();

    // Enter Library
    await openBtn.click();
    await expect(page.getByText(/Thư viện Giáo trình/i)).toBeVisible();
    await expect(page.getByText('QUYỂN I', { exact: true })).toBeVisible();
    await expect(page.getByText('QUYỂN II', { exact: true })).toBeVisible();
    await expect(page.getByText('QUYỂN III', { exact: true })).toBeVisible();
    await expect(page.getByText('QUYỂN IV', { exact: true })).toBeVisible();

    // Open Book I
    await page.getByText('QUYỂN I', { exact: true }).click();
    await expect(page.getByRole('heading', { name: /Khái luận về cơ cấu xã hội – giai cấp/i })).toBeVisible();

    // Advance to P1.S1
    await page.keyboard.press('Space'); // P1.S0 beat 1
    await page.keyboard.press('Space'); // Enters P1.S1
    await expect(page.getByRole('heading', { name: /Cơ cấu xã hội là gì\?/i })).toBeVisible();

    // Verify nodes
    await expect(page.getByText('Dân cư', { exact: true })).toBeVisible();
    await expect(page.getByText('Giai cấp', { exact: true })).toBeVisible();
    await expect(page.getByText('Nghề nghiệp', { exact: true })).toBeVisible();
    await expect(page.getByText('Dân tộc', { exact: true })).toBeVisible();
    await expect(page.getByText('Tôn giáo', { exact: true })).toBeVisible();

    // Advance beat in P1.S1
    await page.keyboard.press('Space'); // beat 1
    await page.keyboard.press('Space'); // beat 2
    await expect(page.getByText(/những cộng đồng người cùng toàn bộ những mối quan hệ xã hội/i)).toBeVisible();

    // Source Drawer
    const sourceChip = page.getByRole('button', { name: /Nguồn:/i });
    await expect(sourceChip).toBeVisible();
    await sourceChip.click();
    await expect(page.getByText(/Tài liệu tham khảo & Trích dẫn/i)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByText(/Tài liệu tham khảo & Trích dẫn/i)).not.toBeVisible();

    // Backtrack via Left Arrow
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByRole('heading', { name: /Khái luận về cơ cấu xã hội – giai cấp/i })).toBeVisible();

    // Blackout test with key 'B'
    await page.keyboard.press('KeyB');
    const blackoutLayer = page.locator('.blackout-layer');
    await expect(blackoutLayer).toBeVisible();
    await page.keyboard.press('KeyB');
    await expect(blackoutLayer).not.toBeVisible();

    // Return to Library
    await page.keyboard.press('KeyO');
    await expect(page.getByText(/Thư viện Giáo trình/i)).toBeVisible();
  });

  test('2. Presenter Console sync & Beat-Aware Speaker Notes', async ({ context }) => {
    const audiencePage = await context.newPage();
    await audiencePage.goto('/?safe=1');

    const presenterPage = await context.newPage();
    await presenterPage.goto('/?mode=control');

    await expect(presenterPage.getByText(/BẢNG ĐIỀU KHIỂN DIỄN GIẢ/i)).toBeVisible();
    await expect(presenterPage.getByText(/GHI CHÚ DIỄN GIẢ/i)).toBeVisible();
    await expect(presenterPage.getByText(/BƯỚC TIẾP THEO/i)).toBeVisible();

    const nextBtn = presenterPage.getByRole('button', { name: /Tiếp tục/i });
    await nextBtn.click();
    await expect(audiencePage.getByText(/Thư viện Giáo trình/i)).toBeVisible();

    await audiencePage.close();
    await presenterPage.close();
  });

  test('3. Preflight Screen diagnostic verification', async ({ page }) => {
    await page.goto('/?preflight=1');
    await expect(page.getByText(/Kiểm tra tiền trạm phòng học/i)).toBeVisible();
    await expect(page.getByText(/Khởi động 3D chuẩn/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Khởi động 2D Safe Mode/i)).toBeVisible();
    await expect(page.getByText(/Chi tiết bộ điều khiển đồ họa/i)).toBeVisible();
  });

  test('4. Real ThreeUI Bookshelf Interaction: I -> II -> III -> IV -> I (created=1, disposed=0)', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/?tier=high');
    await page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i }).click();

    const canvas = page.locator('canvas.bookshelf__canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // Initial lifecycle
    let created = await page.evaluate(() => (window as any).bookshelfRendererCreated || 0);
    let disposed = await page.evaluate(() => (window as any).bookshelfRendererDisposed || 0);
    expect(created).toBe(1);
    expect(disposed).toBe(0);

    // Navigate volumes using real keyboard Arrow keys
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(100);
      created = await page.evaluate(() => (window as any).bookshelfRendererCreated || 0);
      disposed = await page.evaluate(() => (window as any).bookshelfRendererDisposed || 0);
      expect(created).toBe(1);
      expect(disposed).toBe(0);
    }

    // Navigate back to Book I
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(100);
      created = await page.evaluate(() => (window as any).bookshelfRendererCreated || 0);
      disposed = await page.evaluate(() => (window as any).bookshelfRendererDisposed || 0);
      expect(created).toBe(1);
      expect(disposed).toBe(0);
    }
  });

  test('5. Safe Mode Full Part I Walkthrough & Full Reverse Navigation (S0 -> S7 -> S0)', async ({ page }) => {
    await page.goto('/?safe=1');
    await page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i }).click();
    await page.getByText('QUYỂN I', { exact: true }).click();

    // S0
    await expect(page.getByRole('heading', { name: /Khái luận về cơ cấu xã hội – giai cấp/i })).toBeVisible();
    await page.keyboard.press('Space'); // S0.B1

    // S1
    await page.keyboard.press('Space'); // enters S1
    await expect(page.getByRole('heading', { name: /Cơ cấu xã hội là gì\?/i })).toBeVisible();
    await page.keyboard.press('Space'); // S1.B1
    await page.keyboard.press('Space'); // S1.B2

    // S2
    await page.keyboard.press('Space'); // enters S2
    await expect(page.getByRole('heading', { name: /Cơ cấu xã hội – giai cấp là gì\?/i })).toBeVisible();
    await page.keyboard.press('Space'); // S2.B1
    await page.keyboard.press('Space'); // S2.B2
    await page.keyboard.press('Space'); // S2.B3
    await page.keyboard.press('Space'); // S2.B4

    // S3
    await page.keyboard.press('Space'); // enters S3
    await expect(page.getByRole('heading', { name: /Vị trí của cơ cấu xã hội – giai cấp/i })).toBeVisible();
    await page.keyboard.press('Space'); // S3.B1
    await page.keyboard.press('Space'); // S3.B2
    await page.keyboard.press('Space'); // S3.B3
    await page.keyboard.press('Space'); // S3.B4

    // S4
    await page.keyboard.press('Space'); // enters S4
    await expect(page.getByRole('heading', { name: /Gắn liền và bị quy định bởi cơ cấu kinh tế/i })).toBeVisible();
    await page.keyboard.press('Space'); // S4.B1
    await page.keyboard.press('Space'); // S4.B2
    await page.keyboard.press('Space'); // S4.B3
    await page.keyboard.press('Space'); // S4.B4

    // S5
    await page.keyboard.press('Space'); // enters S5
    await expect(page.getByRole('heading', { name: /Biến đổi phức tạp, đa dạng và xuất hiện tầng lớp mới/i })).toBeVisible();
    await page.keyboard.press('Space'); // S5.B1
    await page.keyboard.press('Space'); // S5.B2
    await page.keyboard.press('Space'); // S5.B3
    await page.keyboard.press('Space'); // S5.B4

    // S6
    await page.keyboard.press('Space'); // enters S6
    await expect(page.getByRole('heading', { name: /Vừa đấu tranh vừa liên minh, từng bước xích lại gần nhau/i })).toBeVisible();
    await page.keyboard.press('Space'); // S6.B1
    await page.keyboard.press('Space'); // S6.B2
    await page.keyboard.press('Space'); // S6.B3
    await page.keyboard.press('Space'); // S6.B4
    await page.keyboard.press('Space'); // S6.B5

    // S7
    await page.keyboard.press('Space'); // enters S7
    await expect(page.getByRole('heading', { name: /Cầu nối sang Liên minh giai cấp, tầng lớp/i })).toBeVisible();
    await page.keyboard.press('Space'); // S7.B1
    await page.keyboard.press('Space'); // S7.B2
    await page.keyboard.press('Space'); // S7.B3
    await page.keyboard.press('Space'); // S7.B4
    await page.keyboard.press('Space'); // S7.B5

    // Reverse navigation test from S7 back to S0
    const s0Heading = page.getByRole('heading', { name: /Khái luận về cơ cấu xã hội – giai cấp/i });
    for (let i = 0; i < 50; i++) {
      if (await s0Heading.isVisible()) {
        break;
      }
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(35);
    }
    await expect(s0Heading).toBeVisible({ timeout: 5000 });
  });

  test('6. Real WebGL Full Part I Walkthrough (P1.S0 -> P1.S7 with ?tier=high)', async ({ page }) => {
    test.setTimeout(180000);
    const pageErrors: Error[] = [];
    const criticalConsoleMessages: string[] = [];

    // Explicit allowlist for known benign browser / environment messages
    const BENIGN_ALLOWLIST = [
      'download the react devtools',
      'favicon.ico',
      'source map',
      'an iframe which has both allow-scripts and allow-same-origin',
    ];

    page.on('pageerror', (err) => pageErrors.push(err));
    page.on('console', (msg) => {
      const type = msg.type();
      if (type === 'error' || type === 'warn') {
        const rawText = msg.text();
        const lower = rawText.toLowerCase();

        // Check if benign
        const isBenign = BENIGN_ALLOWLIST.some((allowed) => lower.includes(allowed));
        if (!isBenign) {
          if (
            lower.includes('webgl') ||
            lower.includes('context lost') ||
            lower.includes('shader') ||
            lower.includes('out of memory') ||
            lower.includes('three.webglrenderer')
          ) {
            criticalConsoleMessages.push(`[${type}] ${rawText}`);
          }
        }
      }
    });

    await page.goto('/?tier=high');
    await page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i }).click();

    // 1 canvas in Library
    const bookshelfCanvas = page.locator('canvas.bookshelf__canvas');
    await expect(bookshelfCanvas).toBeVisible({ timeout: 10000 });
    expect(await page.locator('canvas').count()).toBe(1);

    // Open Book I
    await page.keyboard.press('Digit1');

    // Exactly 1 canvas (R3F stage canvas)
    const r3fCanvas = page.locator('.r3f-stage-root canvas');
    await expect(r3fCanvas).toBeVisible();
    expect(await page.locator('canvas').count()).toBe(1);

    // Walkthrough P1.S0 to P1.S7
    const sceneHeadings = [
      /Khái luận về cơ cấu xã hội – giai cấp/i,
      /Cơ cấu xã hội là gì\?/i,
      /Cơ cấu xã hội – giai cấp là gì\?/i,
      /Vị trí của cơ cấu xã hội – giai cấp/i,
      /Gắn liền và bị quy định bởi cơ cấu kinh tế/i,
      /Biến đổi phức tạp, đa dạng và xuất hiện tầng lớp mới/i,
      /Vừa đấu tranh vừa liên minh, từng bước xích lại gần nhau/i,
      /Cầu nối sang Liên minh giai cấp, tầng lớp/i,
    ];

    const beatsPerScene = [2, 3, 5, 5, 5, 5, 6, 6];

    for (let s = 0; s < sceneHeadings.length; s++) {
      await expect(page.getByRole('heading', { name: sceneHeadings[s] })).toBeVisible({ timeout: 10000 });
      expect(await page.locator('canvas').count()).toBe(1);

      const beats = beatsPerScene[s];
      for (let b = 0; b < beats; b++) {
        await page.keyboard.press('Space');
        await page.waitForTimeout(60);
      }
    }

    // Verify zero WebGL critical errors/warnings and zero unhandled page errors
    expect(pageErrors.length).toBe(0);
    expect(criticalConsoleMessages.length).toBe(0);

    // Return to Library
    await page.keyboard.press('KeyO');
    await expect(bookshelfCanvas).toBeVisible({ timeout: 10000 });
    expect(await page.locator('canvas').count()).toBe(1);
  });

  test('7. Real WebGL Soak Test (5 continuous cycles of S1 -> S7 -> S1)', async ({ page }) => {
    test.setTimeout(240000);
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    await page.goto('/?tier=high');
    await page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i }).click();
    await page.locator('canvas.bookshelf__canvas').waitFor({ state: 'visible', timeout: 10000 });

    // Open Book I
    await page.keyboard.press('Digit1');
    await expect(page.getByRole('heading', { name: /Khái luận về cơ cấu xã hội – giai cấp/i })).toBeVisible({ timeout: 10000 });

    // Advance to S1
    await page.keyboard.press('Space'); // S0.B1
    await page.keyboard.press('Space'); // Enters S1
    await expect(page.getByRole('heading', { name: /Cơ cấu xã hội là gì\?/i })).toBeVisible({ timeout: 10000 });

    const sceneHeadings = [
      /Khái luận về cơ cấu xã hội – giai cấp/i, // 0
      /Cơ cấu xã hội là gì\?/i, // 1
      /Cơ cấu xã hội – giai cấp là gì\?/i, // 2
      /Vị trí của cơ cấu xã hội – giai cấp/i, // 3
      /Gắn liền và bị quy định bởi cơ cấu kinh tế/i, // 4
      /Biến đổi phức tạp, đa dạng và xuất hiện tầng lớp mới/i, // 5
      /Vừa đấu tranh vừa liên minh, từng bước xích lại gần nhau/i, // 6
      /Cầu nối sang Liên minh giai cấp, tầng lớp/i, // 7
    ];

    // Forward helper: from S1 to S7
    const navigateS1ToS7 = async () => {
      // From S1 (beat 0) to S2: 3 spaces
      for (let i = 0; i < 3; i++) {
        await page.keyboard.press('Space');
        await page.waitForTimeout(40);
      }
      await expect(page.getByRole('heading', { name: sceneHeadings[2] })).toBeVisible({ timeout: 10000 });

      // S2 -> S3: 5 spaces
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Space');
        await page.waitForTimeout(40);
      }
      await expect(page.getByRole('heading', { name: sceneHeadings[3] })).toBeVisible({ timeout: 10000 });

      // S3 -> S4: 5 spaces
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Space');
        await page.waitForTimeout(40);
      }
      await expect(page.getByRole('heading', { name: sceneHeadings[4] })).toBeVisible({ timeout: 10000 });

      // S4 -> S5: 5 spaces
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Space');
        await page.waitForTimeout(40);
      }
      await expect(page.getByRole('heading', { name: sceneHeadings[5] })).toBeVisible({ timeout: 10000 });

      // S5 -> S6: 5 spaces
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Space');
        await page.waitForTimeout(40);
      }
      await expect(page.getByRole('heading', { name: sceneHeadings[6] })).toBeVisible({ timeout: 10000 });

      // S6 -> S7: 6 spaces (enters S7)
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press('Space');
        await page.waitForTimeout(40);
      }
      await expect(page.getByRole('heading', { name: sceneHeadings[7] })).toBeVisible({ timeout: 10000 });

      // Advance through remaining beats of S7
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Space');
        await page.waitForTimeout(40);
      }
    };

    // Reverse helper: from S7 (beat 5) back to S1 (beat 0)
    const reverseS7ToS1 = async () => {
      // S7 (beat 5) -> S6: 6 ArrowLeft
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(40);
      }
      await expect(page.getByRole('heading', { name: sceneHeadings[6] })).toBeVisible({ timeout: 10000 });

      // S6 -> S5: 6 ArrowLeft
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(40);
      }
      await expect(page.getByRole('heading', { name: sceneHeadings[5] })).toBeVisible({ timeout: 10000 });

      // S5 -> S4: 5 ArrowLeft
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(40);
      }
      await expect(page.getByRole('heading', { name: sceneHeadings[4] })).toBeVisible({ timeout: 10000 });

      // S4 -> S3: 5 ArrowLeft
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(40);
      }
      await expect(page.getByRole('heading', { name: sceneHeadings[3] })).toBeVisible({ timeout: 10000 });

      // S3 -> S2: 5 ArrowLeft
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(40);
      }
      await expect(page.getByRole('heading', { name: sceneHeadings[2] })).toBeVisible({ timeout: 10000 });

      // S2 -> S1: 5 ArrowLeft (reaches S1 last beat)
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(40);
      }
      await expect(page.getByRole('heading', { name: sceneHeadings[1] })).toBeVisible({ timeout: 10000 });

      // Rewind to S1 beat 0 (2 ArrowLeft)
      for (let i = 0; i < 2; i++) {
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(40);
      }
      await expect(page.getByRole('heading', { name: sceneHeadings[1] })).toBeVisible({ timeout: 10000 });
    };

    // Repeat >= 5 cycles in real WebGL
    for (let cycle = 1; cycle <= 5; cycle++) {
      // Navigate forward S1 -> S7
      await navigateS1ToS7();

      // Assert scene heading at S7 every cycle
      await expect(page.getByRole('heading', { name: /Cầu nối sang Liên minh giai cấp, tầng lớp/i })).toBeVisible();
      expect(await page.locator('canvas').count()).toBe(1);

      // Reverse back to S1
      await reverseS7ToS1();

      // Assert scene heading at S1 every cycle
      await expect(page.getByRole('heading', { name: /Cơ cấu xã hội là gì\?/i })).toBeVisible();
      expect(await page.locator('canvas').count()).toBe(1);
    }

    expect(pageErrors.length).toBe(0);
  });

  test('8. Visual Proof Screenshot Generator (1920x1080 & 1366x768)', async ({ page }) => {
    test.setTimeout(240000);
    const screenshotDir = path.resolve('artifacts/screenshots/phase-2.1');
    const reviewDir = path.resolve('review-phase-2.1');
    const downloadsDir = 'C:/Users/admin/Downloads';

    fs.mkdirSync(screenshotDir, { recursive: true });
    fs.mkdirSync(reviewDir, { recursive: true });

    const saveScreenshot = async (filename: string) => {
      const mainPath = path.join(screenshotDir, filename);
      await page.screenshot({ path: mainPath });
      fs.copyFileSync(mainPath, path.join(reviewDir, filename));
      if (fs.existsSync(downloadsDir)) {
        fs.copyFileSync(mainPath, path.join(downloadsDir, filename));
      }
    };

    // Common assertions at both resolutions:
    // - no clipping
    // - no horizontal overflow
    // - source chip visible
    // - main heading visible
    // - active beat label visible
    const assertResolutionIntegrity = async () => {
      // Check horizontal overflow
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(isOverflowing).toBe(false);

      // Source chip visible
      const sourceChip = page.getByRole('button', { name: /Nguồn:/i });
      await expect(sourceChip).toBeVisible();

      // Main heading visible
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();

      // Active beat label / nhịp indicator visible
      const beatIndicator = page.locator('text=Nhịp');
      await expect(beatIndicator).toBeVisible();
    };

    // ==========================================
    // VIEWPORT 1: 1920x1080
    // ==========================================
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/?tier=high');
    await page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i }).click();
    await page.locator('canvas.bookshelf__canvas').waitFor({ state: 'visible', timeout: 10000 });
    await page.keyboard.press('Digit1');
    await page.waitForTimeout(500);

    // 1. S2.B4 (9 spaces from start of Book I)
    for (let i = 0; i < 9; i++) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(50);
    }
    await expect(page.getByRole('heading', { name: /Cơ cấu xã hội – giai cấp là gì\?/i })).toBeVisible();
    await assertResolutionIntegrity();
    await page.waitForTimeout(500);
    await saveScreenshot('p1-s2-beat4.png');

    // 2. S3.B4 (5 spaces)
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(50);
    }
    await expect(page.getByRole('heading', { name: /Vị trí của cơ cấu xã hội – giai cấp/i })).toBeVisible();
    await assertResolutionIntegrity();
    await page.waitForTimeout(500);
    await saveScreenshot('p1-s3-beat4.png');

    // 3. S4.B4 (5 spaces)
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(50);
    }
    await expect(page.getByRole('heading', { name: /Gắn liền và bị quy định bởi cơ cấu kinh tế/i })).toBeVisible();
    await assertResolutionIntegrity();
    await page.waitForTimeout(500);
    await saveScreenshot('p1-s4-beat4.png');

    // 4. S5.B4 (5 spaces)
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(50);
    }
    await expect(page.getByRole('heading', { name: /Biến đổi phức tạp, đa dạng và xuất hiện tầng lớp mới/i })).toBeVisible();
    await assertResolutionIntegrity();
    await page.waitForTimeout(500);
    await saveScreenshot('p1-s5-beat4.png');

    // 5. S6.B5 (6 spaces)
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(50);
    }
    await expect(page.getByRole('heading', { name: /Vừa đấu tranh vừa liên minh, từng bước xích lại gần nhau/i })).toBeVisible();
    await assertResolutionIntegrity();
    await page.waitForTimeout(500);
    await saveScreenshot('p1-s6-beat5.png');

    // 6. S7.B5 (6 spaces)
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(50);
    }
    await expect(page.getByRole('heading', { name: /Cầu nối sang Liên minh giai cấp, tầng lớp/i })).toBeVisible();
    await assertResolutionIntegrity();
    await page.waitForTimeout(500);
    await saveScreenshot('p1-s7-beat5.png');

    // ==========================================
    // VIEWPORT 2: 1366x768
    // ==========================================
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('/?tier=high');
    await page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i }).click();
    await page.locator('canvas.bookshelf__canvas').waitFor({ state: 'visible', timeout: 10000 });
    await page.keyboard.press('Digit1');
    await page.waitForTimeout(500);

    // Advance to S3.B4 (9 + 5 = 14 spaces)
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(50);
    }
    await expect(page.getByRole('heading', { name: /Vị trí của cơ cấu xã hội – giai cấp/i })).toBeVisible();
    await assertResolutionIntegrity();
    await page.waitForTimeout(500);
    await saveScreenshot('p1-s3-1366x768.png');

    // S4.B4 (5 spaces)
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(50);
    }
    await expect(page.getByRole('heading', { name: /Gắn liền và bị quy định bởi cơ cấu kinh tế/i })).toBeVisible();
    await assertResolutionIntegrity();
    await page.waitForTimeout(500);
    await saveScreenshot('p1-s4-1366x768.png');

    // Advance past S5 to S6.B5 (5 + 6 = 11 spaces)
    for (let i = 0; i < 11; i++) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(50);
    }
    await expect(page.getByRole('heading', { name: /Vừa đấu tranh vừa liên minh, từng bước xích lại gần nhau/i })).toBeVisible();
    await assertResolutionIntegrity();
    await page.waitForTimeout(500);
    await saveScreenshot('p1-s6-1366x768.png');

    // S7.B5 (6 spaces)
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(50);
    }
    await expect(page.getByRole('heading', { name: /Cầu nối sang Liên minh giai cấp, tầng lớp/i })).toBeVisible();
    await assertResolutionIntegrity();
    await page.waitForTimeout(500);
    await saveScreenshot('p1-s7-1366x768.png');

    // Copy patch and diff to reviewDir and downloadsDir if present
    if (fs.existsSync('phase-2.1.patch')) {
      fs.copyFileSync('phase-2.1.patch', path.join(reviewDir, 'phase-2.1.patch'));
      if (fs.existsSync(downloadsDir)) {
        fs.copyFileSync('phase-2.1.patch', path.join(downloadsDir, 'phase-2.1.patch'));
      }
    }
    if (fs.existsSync('phase-2.1.diff')) {
      fs.copyFileSync('phase-2.1.diff', path.join(reviewDir, 'phase-2.1.diff'));
      if (fs.existsSync(downloadsDir)) {
        fs.copyFileSync('phase-2.1.diff', path.join(downloadsDir, 'phase-2.1.diff'));
      }
    }
  });
});
