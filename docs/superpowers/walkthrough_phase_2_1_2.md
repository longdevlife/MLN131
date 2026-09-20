# Walkthrough & Verification Report: Phase 2.1.2 — Final Technical Cleanup Only

> **Baseline Commit:** `916e1aec0272de4a42671a6111b7c3c0a38c12a8`  
> **Verification Status:** ALL CRITERIA PASSED (0 Lint Errors/Warnings, Vitest 9/9 Passed, TypeScript & Vite Build Clean, Playwright E2E 8/8 Passed)  
> **Boundary Enforcement:** Part II Content NOT Implemented (`part2Scenes = []`). Empty Chapter Guard active.

---

## 1. Tóm tắt các vấn đề kỹ thuật đã xử lý triệt để

| STT | Hạng mục | Vấn đề ban đầu | Giải pháp kỹ thuật đã triển khai & Kiểm chứng | Trạng thái |
| :---: | :--- | :--- | :--- | :---: |
| **1** | **Offline Troika Font** | `Part1BridgeScene` dùng `<Text>` không prop `font`, kích hoạt Troika ngầm tải Google Fonts CDN và fallback Unicode qua jsDelivr khi gặp ký tự lạ. | - Tải và đóng gói font bản quyền Apache 2.0 `public/fonts/roboto-regular.woff` (hỗ trợ toàn bộ dải ký tự Tiếng Việt, Latin Extended).<br>- Chỉ định tường minh `font="/fonts/roboto-regular.woff"` cho 100% thẻ `<Text>` trong `Part1BridgeScene.tsx`.<br>- Loại bỏ các ký tự ngoài font như `✦` và `➔` để triệt tiêu 100% request ngầm đến `lojjic/unicode-font-resolver` trên `cdn.jsdelivr.net`.<br>- Bổ sung Network Interception trong Playwright E2E: fail ngay lập tức nếu phát hiện request ra CDN/font ngoại trú. | 🟢 **HOÀN THÀNH TRIỆT ĐỂ** |
| **2** | **Orbital Primitive Disposal** | `OrbitalCentralityScene` tạo `BufferGeometry[]`, `LineBasicMaterial[]`, `Line[]` đưa vào `<primitive>` nhưng thiếu cleanup unmount. | Bổ sung `useEffect` unmount cleanup duyệt qua từng line, gọi `.geometry.dispose()` và `.material.dispose()`, khép kín lifecycle WebGL. | 🟢 **HOÀN THÀNH TRIỆT ĐỂ** |
| **3** | **Paper Texture Disposal** | `PaperScene` tạo `CanvasTexture` bằng `useMemo` nhưng không giải phóng texture khi unmount. | Bổ sung `useEffect` unmount cleanup gọi `paperTexture.dispose()`, ngăn chặn leak GPU bộ đệm texture khi chuyển cảnh. | 🟢 **HOÀN THÀNH TRIỆT ĐỂ** |
| **4** | **Terminology Cleanup** | Một số chuỗi văn bản cũ dùng cụm "các quy luật biến đổi", "3 Quy luật". | Chuẩn hóa 100% trong `chapters.ts`, `part1.ts`, `PaperScene.tsx`, `SafePaperScene.tsx`, `SafePart1BridgeScene.tsx`, `bookshelfRenderer.js` thành: *"Khái niệm, vị trí và sự biến đổi có tính quy luật trong TKQĐ."*, *"3 xu hướng biến đổi có tính quy luật trong thời kỳ quá độ."*, *"Sự biến đổi có tính quy luật — Xu hướng 1/2/3"*. | 🟢 **HOÀN THÀNH TRIỆT ĐỂ** |
| **5** | **Remove Stale P1.S7 Paper Copy** | `PaperScene.tsx` còn giữ nhánh dead-code `isBridge` chứa câu hỏi bản lề cũ của P1.S7. | Xóa bỏ hoàn toàn nhánh dead copy `isBridge` và `PaperSceneProps.sceneId`, chỉ giữ nguyên bản nội dung chuẩn mực của P1.S0. | 🟢 **HOÀN THÀNH TRIỆT ĐỂ** |
| **6** | **Empty Chapter Guard** | Khi `part2Scenes = []`, chọn Book II có thể chuyển sang màn hình đen/trắng trống rỗng. | Cập nhật `openChapter`, `jumpToChapter`, `next()`: Khi chapter đích có `scenes.length === 0`, hệ thống giữ nguyên ở Thư viện (`viewMode: 'library'`), giữ quyển đó được chọn/highlight, tuyệt đối không vào `viewMode: 'chapter'`. Đã được kiểm thử trong Unit test và E2E Test 1 & 4. | 🟢 **HOÀN THÀNH TRIỆT ĐỂ** |
| **7** | **README Accuracy** | Câu chữ "0 new allocations per frame" quá tuyệt đối hóa cả Three/Troika internals. | Cập nhật chính xác thành: *"No explicit object/array allocation or React state update remains inside authored useFrame callbacks after audit."* | 🟢 **HOÀN THÀNH TRIỆT ĐỂ** |
| **8** | **Acceptance Verification** | Bộ kiểm tra chất lượng và minh chứng visual. | `oxlint` 0 warn 0 error; `vitest` 9/9 pass; `vite build` clean; `playwright test` 8/8 pass (bao gồm network assertion); 10 ảnh minh chứng đã xuất vào `review-phase-2.1` và `Downloads`. | 🟢 **HOÀN THÀNH TRIỆT ĐỂ** |

---

## 2. Kết quả Thực thi Kiểm thử Tự động (Automated Verification)

### 2.1. Kiểm tra Lỗi Tĩnh (`npm run lint`)
```
> oxlint
Found 0 warnings and 0 errors.
Finished in 24ms on 53 files with 115 rules using 20 threads.
```

### 2.2. Kiểm thử Đơn vị (`npm test`)
```
> vitest run
 RUN  v5.0.1 D:/Ky9-FPT/MLN131

 ✓ tests/unit/presentationStore.test.ts (9 tests) 6ms
 Test Files  1 passed (1)
      Tests  9 passed (9)
```

### 2.3. Đóng gói Bản dựng Sản phẩm (`npm run build`)
```
> tsc -b && vite build
vite v8.3.0 building client environment for production...
✓ 2482 modules transformed.
dist/index.html                                     1.20 kB │ gzip:   0.63 kB
dist/assets/Part1BridgeScene-DR9kq36q.js          118.52 kB │ gzip:  43.56 kB
dist/assets/index-v2Kr_CTb.js                   1,967.11 kB │ gzip: 568.78 kB
✓ built in 572ms
PWA precache: 28 entries (2277.66 KiB)
```

### 2.4. Kiểm thử Đầu cuối E2E (`npm run test:e2e`)
```
> playwright test
Running 8 tests using 1 worker

  ok 1 [chromium] › 1. Vertical Slice Core Flow (Empty Chapter Guard UI test included) (659ms)
  ok 2 [chromium] › 2. Presenter Console sync & Beat-Aware Speaker Notes (571ms)
  ok 3 [chromium] › 3. Preflight Screen diagnostic verification (1.6s)
  ok 4 [chromium] › 4. Real ThreeUI Bookshelf Interaction (created=1, disposed=0 & Digit2 guard) (44.3s)
  ok 5 [chromium] › 5. Safe Mode Full Part I Walkthrough & Full Reverse Navigation (3.6s)
  ok 6 [chromium] › 6. Real WebGL Full Part I Walkthrough (Network Assertion 0 external font/CDN) (24.1s)
  ok 7 [chromium] › 7. Real WebGL Soak Test (5 continuous cycles of S1 -> S7 -> S1) (57.3s)
  ok 8 [chromium] › 8. Visual Proof Screenshot Generator (1920x1080 & 1366x768) (56.9s)

  8 passed (3.2m)
```

---

## 3. Danh mục Tệp Minh chứng Đồ họa (Visual Proofs)

Toàn bộ 10 ảnh chụp màn hình kiểm chứng đã được lưu đồng bộ tại thư mục `artifacts/screenshots/phase-2.1/`, `review-phase-2.1/` và `C:\Users\admin\Downloads\`:

1. **`p1-s2-beat4.png`** (1920x1080): Cảnh P1.S2 - Bốn trục quan hệ sản xuất định nghĩa giai cấp của V.I.Lênin.
2. **`p1-s3-beat4.png`** (1920x1080): Cảnh P1.S3 - Vị trí trung tâm hàng đầu của Cơ cấu XH-GC và 4 vệ tinh quỹ đạo kết nối.
3. **`p1-s4-beat4.png`** (1920x1080): Cảnh P1.S4 - Sự biến đổi có tính quy luật (Xu hướng 1): Gắn liền và bị quy định bởi cơ cấu kinh tế.
4. **`p1-s5-beat4.png`** (1920x1080): Cảnh P1.S5 - Sự biến đổi có tính quy luật (Xu hướng 2): Biến đổi phức tạp, đa dạng và xuất hiện tầng lớp mới.
5. **`p1-s6-beat5.png`** (1920x1080): Cảnh P1.S6 - Sự biến đổi có tính quy luật (Xu hướng 3): Vừa đấu tranh vừa liên minh, từng bước xích lại gần nhau.
6. **`p1-s7-beat5.png`** (1920x1080): Cảnh P1.S7 - Cầu nối chuyển giao sang Quyển II (3D Text nạp font offline nội trú `roboto-regular.woff`, không gọi font CDN ngoài).
7. **`p1-s3-1366x768.png`** (1366x768): Cảnh P1.S3 kiểm chứng độ phân giải máy chiếu phổ thông (không tràn viền, label sắc nét).
8. **`p1-s4-1366x768.png`** (1366x768): Cảnh P1.S4 kiểm chứng độ phân giải máy chiếu 1366x768.
9. **`p1-s6-1366x768.png`** (1366x768): Cảnh P1.S6 kiểm chứng độ phân giải máy chiếu 1366x768.
10. **`p1-s7-1366x768.png`** (1366x768): Cảnh P1.S7 kiểm chứng độ phân giải máy chiếu 1366x768.
