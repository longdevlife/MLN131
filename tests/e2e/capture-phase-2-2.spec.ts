import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.resolve('review-phase-2.2');
const DOWNLOADS_DIR = 'C:\\Users\\admin\\Downloads';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

test.describe('Phase 2.2 Gate Screenshot Capture', () => {
  test('Capture P1.S3 & P1.S4 at 1920x1080 and 1366x768', async ({ page }) => {
    test.setTimeout(120000);

    const captures = [
      {
        sceneIndex: 3, // P1.S3: Vị trí của cơ cấu xã hội – giai cấp
        expectedHeading: /Vị trí của cơ cấu xã hội – giai cấp/i,
        sceneName: 'P1.S3',
        width: 1920,
        height: 1080,
        filename: 'p1-s3-threeui-1920.png',
      },
      {
        sceneIndex: 3, // P1.S3: Vị trí của cơ cấu xã hội – giai cấp
        expectedHeading: /Vị trí của cơ cấu xã hội – giai cấp/i,
        sceneName: 'P1.S3',
        width: 1366,
        height: 768,
        filename: 'p1-s3-threeui-1366.png',
      },
      {
        sceneIndex: 4, // P1.S4: Gắn liền và bị quy định bởi cơ cấu kinh tế
        expectedHeading: /Gắn liền và bị quy định bởi cơ cấu kinh tế/i,
        sceneName: 'P1.S4',
        width: 1920,
        height: 1080,
        filename: 'p1-s4-threeui-1920.png',
      },
      {
        sceneIndex: 4, // P1.S4: Gắn liền và bị quy định bởi cơ cấu kinh tế
        expectedHeading: /Gắn liền và bị quy định bởi cơ cấu kinh tế/i,
        sceneName: 'P1.S4',
        width: 1366,
        height: 768,
        filename: 'p1-s4-threeui-1366.png',
      },
    ];

    for (const cap of captures) {
      await page.setViewportSize({ width: cap.width, height: cap.height });
      await page.goto('/?tier=high');
      await page.waitForLoadState('networkidle');

      // Wait for store to be ready
      await page.waitForFunction(() => typeof (window as any).__PRESENTATION_STORE__ !== 'undefined');

      // Direct, deterministic navigation to target scene and final beat 4
      await page.evaluate(({ sceneIdx }) => {
        const store = (window as any).__PRESENTATION_STORE__;
        store.getState().openChapter(0, sceneIdx);
        store.setState({ beatIndex: 4 });
      }, { sceneIdx: cap.sceneIndex });

      // Verify the scene heading is explicitly visible
      await expect(page.getByRole('heading', { name: cap.expectedHeading })).toBeVisible({ timeout: 10000 });

      // Allow 3000ms for ThreeUI particles, ambient glowing halos and dynamic flow streams to render
      await page.waitForTimeout(3000);

      // Verify exactly 1 canvas is rendered
      const canvasCount = await page.locator('canvas').count();
      expect(canvasCount).toBe(1);

      // Capture screenshot
      const localPath = path.join(OUTPUT_DIR, cap.filename);
      await page.screenshot({ path: localPath, fullPage: true });

      const downloadsPath = path.join(DOWNLOADS_DIR, cap.filename);
      fs.copyFileSync(localPath, downloadsPath);
      console.log(`[PASS] Captured ${cap.filename} (${cap.width}x${cap.height}) at beat 4 -> saved to ${localPath} and ${downloadsPath}`);
    }
  });
});
