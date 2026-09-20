# Báo Cáo Nghiệm Thu M0.1 — Bookshelf Vietnamese Typography Integrity Patch

> **Thời điểm:** 2026-09-21  
> **Trạng thái:** HOÀN TẤT 100% (PASSED ALL GATES) — STOP (KHÔNG BẮT ĐẦU M1)  
> **Mục tiêu:** Vá triệt để lỗi typography tiếng Việt trên bìa, gáy sách 3D và thanh dock ChapterRail theo đặc tả tại `C:\Users\admin\Downloads\chat.md`.

---

## 1. Commit & Branch Information
- **Branch:** `spec/magazine-museum-rebase`
- **M0 Baseline Commit:** `e2e032c docs(magazine): add M0 acceptance report`
- **M0.1 Commits:**
  - `ba89071 feat(bookshelf): add typographyUtils with fitTextToWidth`
  - `32c7c6b feat(bookshelf): preload local fonts before texture generation`
  - `26ee274 feat(bookshelf): apply fitTextToWidth to cover and spine textures`
  - `3161ece feat(presentation): polish ChapterRail typography`
  - `e44ca0e test(bookshelf): add M0.1 typography visual proof`
  - `23cc75b test(magazine): refresh M0 baseline screenshots with improved typography`

---

## 2. Changed Files
Danh sách chính xác các tệp đã tạo mới và sửa đổi:
- **Tạo mới:**
  - `src/vendor/threeui-custom/bookshelf/typographyUtils.ts` (Bộ helper pure dàn chữ và đo đạc chuẩn NFC)
  - `src/vendor/threeui-custom/bookshelf/fontLoader.ts` (Bộ nạp font cục bộ tiền định thời FontFace)
  - `tests/unit/typographyUtils.test.ts` (11 unit tests kiểm thử 4 tiêu đề và ký tự dấu kết hợp NFC)
  - `tests/unit/fontLoader.test.ts` (3 unit tests kiểm thử cơ chế nạp và cache font cục bộ)
  - `tests/e2e/bookshelf-typography-m0-1.spec.ts` (E2E visual gate chụp 4 ảnh nghiệm thu)
  - `docs/superpowers/plans/2026-09-20-bookshelf-typography-m0-1-plan.md` (Kế hoạch kỹ thuật M0.1)
  - `artifacts/screenshots/magazine-m0/M0.1-library-font-1920.png`
  - `artifacts/screenshots/magazine-m0/M0.1-library-font-1366.png`
  - `artifacts/screenshots/magazine-m0/M0.1-book-I-closeup.png`
  - `artifacts/screenshots/magazine-m0/M0.1-books-all-four.png`
- **Chỉnh sửa:**
  - `src/vendor/threeui-custom/bookshelf/BookshelfScene.tsx` (Chờ `ensureBookshelfFonts()` hoàn tất trước khi tạo renderer; an toàn hủy unmount)
  - `src/vendor/threeui-custom/bookshelf/bookshelfRenderer.js` (Xóa bỏ toàn bộ `Iowan Old Style` và logic fixed font size; áp dụng `fitTextToWidth` và `MLNBookSans` cho `Tn`, `Cn`, `Kn`, `Mn`)
  - `src/presentation/ChapterRail.tsx` (Bỏ inline `maxWidth: 140px`, áp dụng responsive CSS class)
  - `src/styles/global.css` (Đăng ký `@font-face` cho `MLNBookSans`, responsive typography cho dock top)

---

## 3. Font-Loading Implementation (Tiền Định Thời)
Áp dụng cơ chế nạp font cục bộ 100% không phụ thuộc CDN / Google Fonts qua module `src/vendor/threeui-custom/bookshelf/fontLoader.ts`:
```ts
const regular = new FontFace('MLNBookSans', 'url(/fonts/roboto-regular.woff)', {
  weight: '400',
  style: 'normal',
});
const bold = new FontFace('MLNBookSans', 'url(/fonts/roboto-bold.woff)', {
  weight: '700',
  style: 'normal',
});

const [loadedRegular, loadedBold] = await Promise.all([regular.load(), bold.load()]);
document.fonts.add(loadedRegular);
document.fonts.add(loadedBold);

await Promise.all([
  document.fonts.load('400 64px MLNBookSans'),
  document.fonts.load('700 64px MLNBookSans'),
]);
```
Trong `BookshelfScene.tsx`, `initRenderer` đợi `await ensureBookshelfFonts()` hoàn tất mới gọi `createBookshelfRenderer()`. Nếu component unmount trong quá trình tải font, cờ `disposed = true` sẽ ngăn chặn việc sinh texture hay khởi tạo renderer.

---

## 4. Fit Algorithm (Thuật Toán Dàn Chữ Tự Động)
Thực hiện trong `src/vendor/threeui-custom/bookshelf/typographyUtils.ts`:
1. **Chuẩn hóa chuỗi (Normalize NFC):** Loại bỏ dấu tổ hợp rời rạc bằng `.normalize('NFC')` và rút gọn khoảng trắng thừa.
2. **Gói từ (Word wrap):** Thử nghiệm gói từ theo ngữ pháp tiếng Việt.
3. **Đo đạc chính xác bằng `ctx.measureText()`:** Giảm dần `fontSize` từ `startSize` xuống `minSize` (với bước nhảy 1px) cho tới khi:
   - Số dòng `lines.length <= maxLines` (tối đa 2 dòng đối với bìa sách).
   - Chiều rộng mọi dòng `maxWidth <= 610px` (nằm gọn trong khung bìa an toàn 768x1152).
4. **Không viết tắt / không cắt ngắn nội dung:** Cả 4 tiêu đề chính thức được hiển thị nguyên bản:
   - I: *Cơ cấu xã hội – giai cấp*
   - II: *Tính tất yếu của liên minh*
   - III: *Việt Nam hiện nay*
   - IV: *Phương hướng & giải pháp*

---

## 5. Test Outputs (Kiểm Thử Toàn Diện)

### 1. `npm run lint` (Oxlint)
```
Found 0 warnings and 0 errors.
Finished in 24ms on 71 files with 115 rules using 20 threads.
```

### 2. `npm test` (Vitest)
```
 ✓ tests/unit/fontLoader.test.ts (3 tests)
 ✓ tests/unit/magazineModel.test.ts (4 tests)
 ✓ tests/unit/typographyUtils.test.ts (11 tests)
 ✓ tests/unit/presentationStore.test.ts (16 tests)
 ✓ tests/unit/threeui-imports.test.ts (1 test)

 Test Files  5 passed (5)
      Tests  35 passed (35)
```

### 3. `npm run build` (TypeScript + Vite)
```
✓ 2658 modules transformed.
dist/index.html                                     1.20 kB
dist/assets/index-DzJeOC-o.css                     75.36 kB
dist/assets/index-B2finDif.js                   2,542.88 kB
✓ built in 597ms
```

### 4. `npx playwright test tests/e2e/bookshelf-typography-m0-1.spec.ts --project=chromium`
```
Running 1 test using 1 worker
  ok 1 [chromium] › tests/e2e/bookshelf-typography-m0-1.spec.ts:44:3 › M0.1 — Bookshelf Vietnamese Typography Integrity Visual Gate › Generate exact 4 M0.1 typography verification screenshots (1.1m)
  1 passed (1.2m)
```

### 5. `npx playwright test tests/e2e/magazine-m0.spec.ts --project=chromium` (Regression Suite)
```
Running 5 tests using 1 worker
  ok 1 [chromium] › 1. Core flow: Cover -> Library -> Magazine Book I -> Page turn -> View mode toggle -> Escape back to Library (22.6s)
  ok 2 [chromium] › 2. Negative assertions: No legacy party magazine branding in Magazine Book I (1.8s)
  ok 3 [chromium] › 3. Unavailable books guard: Books II, III, IV remain in Library without opening Magazine (27.5s)
  ok 4 [chromium] › 4. 10-cycle WebGL lifecycle test: Library <-> Magazine with zero context loss and invariant single canvas (2.4m)
  ok 5 [chromium] › 5. Visual Gate: Capture exact 6 M0 verification screenshots (53.8s)
  5 passed (4.2m)
```

---

## 6. Verification Screenshots (4 Visual Proofs)
Các ảnh chụp nghiệm thu mới theo đúng yêu cầu đã được lưu tại thư mục `artifacts/screenshots/magazine-m0/`:
1. [M0.1-library-font-1920.png](file:///D:/Ky9-FPT/MLN131/artifacts/screenshots/magazine-m0/M0.1-library-font-1920.png) — Toàn cảnh Thư viện 3D độ phân giải 1920x1080; dock top hiển thị đầy đủ shortTitle không bị cắt xén.
2. [M0.1-library-font-1366.png](file:///D:/Ky9-FPT/MLN131/artifacts/screenshots/magazine-m0/M0.1-library-font-1366.png) — Giao diện Thư viện 3D tại độ phân giải 1366x768; bố cục co giãn mượt mà.
3. [M0.1-book-I-closeup.png](file:///D:/Ky9-FPT/MLN131/artifacts/screenshots/magazine-m0/M0.1-book-I-closeup.png) — Chế độ cận cảnh Quyển I (*Cơ cấu xã hội – giai cấp*); hiển thị trọn vẹn, sắc nét, không vỡ dấu, không lỗi font, không chạm viền.
4. [M0.1-books-all-four.png](file:///D:/Ky9-FPT/MLN131/artifacts/screenshots/magazine-m0/M0.1-books-all-four.png) — Toàn bộ 4 quyển sách với tiêu đề và nhãn chuyên ngành hoàn chỉnh.

---

## 7. Quy Tắc Tuân Thủ & Dừng (STOP)
- Không bắt đầu M1.
- Không chỉnh sửa Museum.
- Không viết tắt hay thay đổi nội dung tiêu đề sách.
- Toàn bộ các cổng kỹ thuật (Lint, Unit Tests, Build, Regression E2E, Visual Gates) đều đạt 100% không lỗi.
- **DỪNG (STOP) theo đúng quy trình Superpowers.**
