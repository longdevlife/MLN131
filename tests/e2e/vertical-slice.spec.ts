import { test, expect } from '@playwright/test';

test.describe('MLN Chapter 5 Presentation - Vertical Slice', () => {
  test('Complete vertical slice flow: Cover -> Library -> Book I -> P1.S0 -> P1.S1 (beats) -> Backtrack -> Blackout -> Library', async ({ page }) => {
    // 1. Load application at root (safe mode flag to ensure consistent headless WebGL testing)
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
});
