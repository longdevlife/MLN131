import { test, expect } from '@playwright/test';

test.describe('MLN Chapter 5 Presentation - Vertical Slice Hardened Suite', () => {
  test('Complete vertical slice flow: Cover -> Library -> Book I -> P1.S0 -> P1.S1 (beats) -> Backtrack -> Blackout -> Library', async ({ page }) => {
    // 1. Load application at root with safe mode
    await page.goto('/?safe=1');

    // 2. Verify Cover screen with "MỞ GIÁO TRÌNH" button
    const openButton = page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i });
    await expect(openButton).toBeVisible();
    await expect(page.getByText(/Cơ cấu xã hội – giai cấp và liên minh giai cấp/i)).toBeVisible();

    // 3. Click "MỞ GIÁO TRÌNH" -> enters Library Lobby
    await openButton.click();

    // 4. Verify Library Lobby with 4 authored books
    await expect(page.getByText(/Thư viện Giáo trình/i)).toBeVisible();
    await expect(page.getByText('QUYỂN I', { exact: true })).toBeVisible();
    await expect(page.getByText('QUYỂN II', { exact: true })).toBeVisible();
    await expect(page.getByText('QUYỂN III', { exact: true })).toBeVisible();
    await expect(page.getByText('QUYỂN IV', { exact: true })).toBeVisible();

    // Verify zero stock labels
    const bodyText = await page.textContent('body');
    expect(bodyText).not.toContain('Codex');
    expect(bodyText).not.toContain('Claude Code');
    expect(bodyText).not.toContain('Cursor');
    expect(bodyText).not.toContain('Figma');
    expect(bodyText).not.toContain('Framer');
    expect(bodyText).not.toContain('Xcode');
    expect(bodyText).not.toContain('Lumina');

    // 5. Open Book I
    await page.getByText('QUYỂN I', { exact: true }).click();

    // 6. Verify P1.S0 Chapter Title
    await expect(page.getByRole('heading', { name: /Khái luận về cơ cấu xã hội – giai cấp/i })).toBeVisible();
    await expect(page.getByText(/Khái niệm · Vị trí · Sự biến đổi có tính quy luật/i)).toBeVisible();

    // Advance beat in P1.S0 with Space key
    await page.keyboard.press('Space');

    // 7. Advance to P1.S1: Social Structure Network
    await page.keyboard.press('Space');
    await expect(page.getByRole('heading', { name: /Cơ cấu xã hội là gì\?/i })).toBeVisible();

    // Beat 0: Nodes visible
    await expect(page.getByText('Dân cư', { exact: true })).toBeVisible();
    await expect(page.getByText('Giai cấp', { exact: true })).toBeVisible();
    await expect(page.getByText('Nghề nghiệp', { exact: true })).toBeVisible();
    await expect(page.getByText('Dân tộc', { exact: true })).toBeVisible();
    await expect(page.getByText('Tôn giáo', { exact: true })).toBeVisible();

    // Beat 1: Links revealed via Space
    await page.keyboard.press('Space');

    // Beat 2: Concise definition revealed via Space
    await page.keyboard.press('Space');
    await expect(
      page.getByText(/Cộng đồng người \+ các mối quan hệ xã hội giữa các cộng đồng ấy/i)
    ).toBeVisible();

    // Test Source Drawer interaction
    const sourceChip = page.getByRole('button', { name: /Nguồn:/i });
    await expect(sourceChip).toBeVisible();
    await sourceChip.click();
    await expect(page.getByText(/Tài liệu tham khảo & Trích dẫn/i)).toBeVisible();
    await expect(page.getByText(/V.I.Lênin: Toàn tập/i)).toBeVisible();

    // Close Source Drawer with Esc
    await page.keyboard.press('Escape');
    await expect(page.getByText(/Tài liệu tham khảo & Trích dẫn/i)).not.toBeVisible();

    // 8. Backtrack via Left Arrow
    await page.keyboard.press('ArrowLeft'); // beat 2 -> 1
    await page.keyboard.press('ArrowLeft'); // beat 1 -> 0
    await page.keyboard.press('ArrowLeft'); // beat 0 -> back to P1.S0
    await expect(page.getByRole('heading', { name: /Khái luận về cơ cấu xã hội – giai cấp/i })).toBeVisible();

    // 9. Blackout test with key 'B'
    await page.keyboard.press('KeyB');
    const blackoutLayer = page.locator('.blackout-layer');
    await expect(blackoutLayer).toBeVisible();
    await page.keyboard.press('KeyB');
    await expect(blackoutLayer).not.toBeVisible();

    // 10. Return to Library with key 'O'
    await page.keyboard.press('KeyO');
    await expect(page.getByText(/Thư viện Giáo trình/i)).toBeVisible();
  });

  test('Presenter Console sync via BroadcastChannel', async ({ context }) => {
    // Open audience page
    const audiencePage = await context.newPage();
    await audiencePage.goto('/?safe=1');

    // Open presenter console page
    const presenterPage = await context.newPage();
    await presenterPage.goto('/?mode=control');

    // Verify presenter console displays controls and speaker notes
    await expect(presenterPage.getByText(/BẢNG ĐIỀU KHIỂN DIỄN GIẢ/i)).toBeVisible();
    await expect(presenterPage.getByText(/GHI CHÚ DIỄN GIẢ/i)).toBeVisible();

    // Click Next on presenter console
    const nextBtn = presenterPage.getByRole('button', { name: /Tiếp tục/i });
    await nextBtn.click();

    // Audience page should advance to library
    await expect(audiencePage.getByText(/Thư viện Giáo trình/i)).toBeVisible();

    await audiencePage.close();
    await presenterPage.close();
  });

  test('Preflight Screen diagnostic verification', async ({ page }) => {
    await page.goto('/?preflight=1');

    await expect(page.getByText(/Kiểm tra tiền trạm phòng học/i)).toBeVisible();
    // Wait for benchmark to finish
    await expect(page.getByText(/Khởi động 3D chuẩn/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Khởi động 2D Safe Mode/i)).toBeVisible();
    await expect(page.getByText(/Chi tiết bộ điều khiển đồ họa/i)).toBeVisible();
  });

  test('Soak Stress Test - Repeated Rapid Navigation (20 cycles)', async ({ page }) => {
    await page.goto('/?safe=1');
    await page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i }).click();
    await expect(page.getByText(/Thư viện Giáo trình/i)).toBeVisible();

    // Rapidly cycle through Chapter 1 and Library 20 times
    for (let i = 0; i < 20; i++) {
      // Enter Book I
      await page.keyboard.press('Digit1');
      await expect(page.getByRole('heading', { name: /Khái luận về cơ cấu xã hội – giai cấp/i })).toBeVisible();

      // Advance to P1.S1
      await page.keyboard.press('Space');
      await page.keyboard.press('Space');
      await expect(page.getByRole('heading', { name: /Cơ cấu xã hội là gì\?/i })).toBeVisible();

      // Return to Library
      await page.keyboard.press('KeyO');
      await expect(page.getByText(/Thư viện Giáo trình/i)).toBeVisible();
    }

    // Final assertion: state remains completely responsive and clean
    await page.keyboard.press('Digit1');
    await expect(page.getByRole('heading', { name: /Khái luận về cơ cấu xã hội – giai cấp/i })).toBeVisible();
  });

  test('Real WebGL 3D Lifecycle & Context Longevity (repeat 3 cycles)', async ({ page }) => {
    test.setTimeout(180000);
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => pageErrors.push(err));

    // 1. Load application at root with REAL 3D WebGL (no ?safe=1)
    await page.goto('/?tier=high');

    // 2. Open presentation from Cover Screen -> enters Library 3D
    const openButton = page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i });
    await expect(openButton).toBeVisible();
    await openButton.click();

    // 3. Verify Bookshelf 3D canvas is mounted and ready
    const bookshelfCanvas = page.locator('canvas.bookshelf__canvas');
    await expect(bookshelfCanvas).toBeVisible({ timeout: 10000 });

    // Verify exactly 1 canvas exists
    expect(await page.locator('canvas').count()).toBe(1);

    // Initial lifecycle counter verification
    let createdCount = await page.evaluate(() => (window as any).bookshelfRendererCreated || 0);
    let disposedCount = await page.evaluate(() => (window as any).bookshelfRendererDisposed || 0);
    expect(createdCount).toBe(1);
    expect(disposedCount).toBe(0);

    // 4. Volume browsing without WebGL re-creation: I -> II -> III -> IV -> I
    for (let targetVol = 1; targetVol <= 3; targetVol++) {
      await page.evaluate((idx) => {
        (window as any).__store?.setState({ chapterIndex: idx });
      }, targetVol);
      await page.waitForTimeout(100);

      // Verify lifecycle counters remain invariant during volume browsing
      createdCount = await page.evaluate(() => (window as any).bookshelfRendererCreated || 0);
      disposedCount = await page.evaluate(() => (window as any).bookshelfRendererDisposed || 0);
      expect(createdCount).toBe(1);
      expect(disposedCount).toBe(0);
    }

    // Return to Book I
    await page.evaluate(() => {
      (window as any).__store?.setState({ chapterIndex: 0 });
    });
    await page.waitForTimeout(100);
    createdCount = await page.evaluate(() => (window as any).bookshelfRendererCreated || 0);
    disposedCount = await page.evaluate(() => (window as any).bookshelfRendererDisposed || 0);
    expect(createdCount).toBe(1);
    expect(disposedCount).toBe(0);

    // 5. Repeat 3 cycles of: Open Book I -> P1.S0 3D -> P1.S1 3D -> Back to Library
    for (let cycle = 1; cycle <= 3; cycle++) {
      await page.waitForTimeout(200);
      // Open Book I via Digit1
      await page.keyboard.press('Digit1');
      await expect(page.getByRole('heading', { name: /Khái luận về cơ cấu xã hội – giai cấp/i })).toBeVisible();

      // Only 1 canvas must remain active (R3F Canvas)
      expect(await page.locator('canvas').count()).toBe(1);

      // Advance to P1.S1 (beats)
      await page.keyboard.press('Space'); // beat 1 of P1.S0
      await page.keyboard.press('Space'); // enters P1.S1
      await expect(page.getByRole('heading', { name: /Cơ cấu xã hội là gì\?/i })).toBeVisible();

      // Ensure single active canvas
      expect(await page.locator('canvas').count()).toBe(1);

      // Return to Library with KeyO
      await page.keyboard.press('KeyO');
      await expect(bookshelfCanvas).toBeVisible({ timeout: 10000 });

      // Exactly 1 canvas active
      expect(await page.locator('canvas').count()).toBe(1);

      // Verify lifecycle increment: created = cycle + 1, disposed = cycle
      createdCount = await page.evaluate(() => (window as any).bookshelfRendererCreated || 0);
      disposedCount = await page.evaluate(() => (window as any).bookshelfRendererDisposed || 0);
      expect(createdCount).toBe(cycle + 1);
      expect(disposedCount).toBe(cycle);
    }

    // Final checks: Zero page errors, zero context loss
    expect(pageErrors.length).toBe(0);
  });

  test('Phase 2 Complete Part 1 Authoring Walkthrough (P1.S0 -> P1.S7)', async ({ page }) => {
    // 1. Open Book I in Safe Mode
    await page.goto('/?safe=1');
    await page.getByRole('button', { name: /MỞ GIÁO TRÌNH/i }).click();
    await page.getByText('QUYỂN I', { exact: true }).click();

    // P1.S0
    await expect(page.getByRole('heading', { name: /Khái luận về cơ cấu xã hội – giai cấp/i })).toBeVisible();

    // Advance beats to P1.S1
    await page.keyboard.press('Space');
    await page.keyboard.press('Space');
    await expect(page.getByRole('heading', { name: /Cơ cấu xã hội là gì\?/i })).toBeVisible();

    // Advance beats to P1.S2 (Class Relations)
    await page.keyboard.press('Space'); // beat 1
    await page.keyboard.press('Space'); // beat 2
    await page.keyboard.press('Space'); // enters P1.S2
    await expect(page.getByRole('heading', { name: /Cơ cấu xã hội – giai cấp là gì\?/i })).toBeVisible();
    await expect(page.getByText(/1\. Sở hữu tư liệu sản xuất/i)).toBeVisible();

    // Advance beat in P1.S2 to P1.S3 (Orbital Centrality)
    await page.keyboard.press('Space'); // beat 1
    await page.keyboard.press('Space'); // enters P1.S3
    await expect(page.getByRole('heading', { name: /Vị trí của cơ cấu xã hội – giai cấp/i })).toBeVisible();
    await expect(page.getByText('Vị trí quan trọng hàng đầu', { exact: true })).toBeVisible();

    // Advance beats to P1.S4 (Structure Flow)
    await page.keyboard.press('Space'); // beat 1
    await page.keyboard.press('Space'); // beat 2
    await page.keyboard.press('Space'); // enters P1.S4
    await expect(page.getByRole('heading', { name: /Gắn liền và bị quy định bởi cơ cấu kinh tế/i })).toBeVisible();
    await expect(page.getByText(/Quy luật chuyển dịch 1 chiều cốt lõi/i)).toBeVisible();

    // Advance beats to P1.S5 (Diversification)
    await page.keyboard.press('Space'); // beat 1
    await page.keyboard.press('Space'); // enters P1.S5
    await expect(page.getByRole('heading', { name: /Biến đổi phức tạp, đa dạng và xuất hiện tầng lớp mới/i })).toBeVisible();
    await expect(page.getByText(/3 Khối giai tầng truyền thống/i)).toBeVisible();

    // Advance beats to P1.S6 (Convergence)
    await page.keyboard.press('Space'); // beat 1
    await page.keyboard.press('Space'); // beat 2
    await page.keyboard.press('Space'); // enters P1.S6
    await expect(page.getByRole('heading', { name: /Vừa đấu tranh vừa liên minh, từng bước xích lại gần nhau/i })).toBeVisible();
    await expect(page.getByText(/Xây dựng thành công Chủ nghĩa Xã hội/i)).toBeVisible();

    // Advance beats to P1.S7 (Bridge)
    await page.keyboard.press('Space'); // beat 1
    await page.keyboard.press('Space'); // beat 2
    await page.keyboard.press('Space'); // enters P1.S7
    await expect(page.getByRole('heading', { name: /Cầu nối sang Liên minh giai cấp, tầng lớp/i })).toBeVisible();
    await expect(page.getByText(/Vì sao liên minh giai cấp, tầng lớp là đòi hỏi khách quan\?/i)).toBeVisible();
  });
});


