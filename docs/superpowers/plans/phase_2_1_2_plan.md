# Implementation Plan: Phase 2.1.2 — Final Technical Cleanup

## 1. Phân rã Công việc (Task Breakdown)

- [ ] **Task 1: Offline Font Configuration & Verification**
  - Đảm bảo font file `public/fonts/roboto-regular.woff` tồn tại và đầy đủ glyphs tiếng Việt.
  - Cập nhật mọi thẻ `<Text>` trong [`src/scenes/r3f/Part1BridgeScene.tsx`](file:///D:/Ky9-FPT/MLN131/src/scenes/r3f/Part1BridgeScene.tsx) với `font="/fonts/roboto-regular.woff"`.
  - Thêm network monitor trong Playwright E2E test ([`tests/e2e/vertical-slice.spec.ts`](file:///D:/Ky9-FPT/MLN131/tests/e2e/vertical-slice.spec.ts)) chặn mọi request ra ngoài host nội bộ liên quan đến font/CDN (`fonts.gstatic.com`, `fonts.googleapis.com`, `cdn.jsdelivr.net`).

- [ ] **Task 2: Resource Disposal for Primitives and Textures**
  - Trong [`src/scenes/r3f/OrbitalCentralityScene.tsx`](file:///D:/Ky9-FPT/MLN131/src/scenes/r3f/OrbitalCentralityScene.tsx): Thêm `useEffect` để giải phóng `.dispose()` cho từng `geometry` và `material` của mảng `rayLines`.
  - Trong [`src/scenes/r3f/PaperScene.tsx`](file:///D:/Ky9-FPT/MLN131/src/scenes/r3f/PaperScene.tsx): Thêm `useEffect` để gọi `paperTexture.dispose()`.

- [ ] **Task 3: Terminology Normalization & Stale Branch Removal**
  - Trong [`src/content/chapters.ts`](file:///D:/Ky9-FPT/MLN131/src/content/chapters.ts): Thay `"Khái niệm, vị trí và các quy luật biến đổi trong TKQĐ."` bằng `"Khái niệm, vị trí và sự biến đổi có tính quy luật trong TKQĐ."`.
  - Trong [`src/scenes/r3f/PaperScene.tsx`](file:///D:/Ky9-FPT/MLN131/src/scenes/r3f/PaperScene.tsx):
    - Thay `"3 Quy luật vận động trong thời kỳ quá độ."` bằng `"3 xu hướng biến đổi có tính quy luật trong thời kỳ quá độ."`.
    - Xóa bỏ hoàn toàn nhánh dead branch P1.S7 cũ (chứa câu hỏi về liên minh công - nông - trí thức).
  - Rà soát toàn bộ dự án (`src/`) tìm các từ khóa "quy luật 1/2/3" và chuẩn hóa đồng bộ.

- [ ] **Task 4: Empty Chapter Guard in State Machine**
  - Trong [`src/state/presentationStore.ts`](file:///D:/Ky9-FPT/MLN131/src/state/presentationStore.ts):
    - Cập nhật `openChapter`, `jumpToChapter`, và luồng `next()` khi ở `viewMode === 'library'`.
    - Nếu chapter đích có `scenes.length === 0`: giữ nguyên `viewMode: 'library'`, cập nhật `chapterIndex` được chọn, không bao giờ chuyển sang `viewMode: 'chapter'`.
  - Thêm unit test trong [`tests/unit/presentationStore.test.ts`](file:///D:/Ky9-FPT/MLN131/tests/unit/presentationStore.test.ts) để kiểm thử guard này.

- [ ] **Task 5: README Precision Update**
  - Cập nhật câu chữ trong [`README.md`](file:///D:/Ky9-FPT/MLN131/README.md) thành:
    `"No explicit object/array allocation or React state update remains inside authored useFrame callbacks after audit."`

- [ ] **Task 6: Verification & Final Acceptance Delivery**
  - Chạy `npm run lint` -> 0 errors, 0 warnings.
  - Chạy `npm test` -> 9/9 tests pass (có test empty chapter guard).
  - Chạy `npm run build` -> Clean production build.
  - Chạy `npm run test:e2e` -> 8/8 tests pass (bao gồm network assertion).
  - Tạo patch `phase-2.1.2.patch`, `phase-2.1.2.diff`, cập nhật cumulative patch `phase-2.1.patch`, `phase-2.1.diff`.
  - Sao chép tệp vá và 10 ảnh minh chứng vào `C:\Users\admin\Downloads\` và `review-phase-2.1\`.
  - Tạo tài liệu `docs/superpowers/walkthrough_phase_2_1_2.md`.
  - Git commit và git push origin main.

---

## 2. Kế hoạch Kiểm thử (Verification Plan)
1. **Automated Unit Tests:**
   - Test empty chapter guard: `openChapter(1)` khi `part2Scenes = []` phải giữ `viewMode === 'library'` và `chapterIndex === 1`.
   - Test P1.S7 finish handoff: kết thúc P1.S7 phải về `library` với `chapterIndex === 1`.
2. **Automated E2E Tests:**
   - Network interception: Assert không có request nào ra CDN fonts ngoài.
   - Real WebGL Walkthrough & Soak test: Xác nhận không có WebGL error/warn, không context loss.
