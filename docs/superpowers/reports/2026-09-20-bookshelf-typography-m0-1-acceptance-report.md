# Báo Cáo Nghiệm Thu M0.1 — Bookshelf Vietnamese Typography Integrity Patch & Navigation Regression Guard

> **Thời điểm:** 2026-09-21  
> **Trạng thái:** HOÀN TẤT 100% (PASSED ALL GATES) — STOP (KHÔNG BẮT ĐẦU M1)  
> **Mục tiêu:** Vá triệt để lỗi typography tiếng Việt trên bìa, gáy sách 3D và thanh dock ChapterRail, bảo đảm an toàn dữ liệu chữ không bao giờ bị cắt bỏ, tách bạch điều hướng Library vs Presentation theo đặc tả tại `C:\Users\admin\Downloads\chat.md`.

---

## 1. Commit & Branch Information
- **Branch:** `spec/magazine-museum-rebase`
- **M0 Baseline Commit:** `e2e032c docs(magazine): add M0 acceptance report`
- **M0.1 Patch & Regression Scope:**
  - Hoàn thiện thuật toán dàn chữ tiếng Việt `fitTextToWidth` (không bao giờ drop từ, đo đạc NFC chuẩn hóa).
  - Tách bạch điều hướng ChapterRail trong Library (`openBook(0)` cho Quyển I, `selectBook(idx)` guarded cho Quyển II–IV, không gọi `jumpToChapter`).
  - Giữ `jumpToChapter()` riêng biệt cho chế độ presentation legacy/dev.
  - Bảo đảm kiểm thử hồi quy trạng thái chọn sách và phím Space trong Library.
  - Thắt chặt kiểm thử mạng: khẳng định không truy cập forbidden hosts và kiểm chứng zero external-origin requests.

---

## 2. Changed Files
Danh sách chính xác các tệp đã tạo mới và chỉnh sửa trong đợt M0.1:
- **Tạo mới:**
  - `src/vendor/threeui-custom/bookshelf/typographyUtils.ts` (Bộ helper pure dàn chữ và đo đạc chuẩn NFC; an toàn 100% không drop từ)
  - `src/vendor/threeui-custom/bookshelf/fontLoader.ts` (Bộ nạp font cục bộ tiền định thời FontFace)
  - `tests/unit/typographyUtils.test.ts` (12 unit tests kiểm thử 4 tiêu đề production, ký tự dấu kết hợp NFC, và case `fits === false` không drop từ)
  - `tests/unit/fontLoader.test.ts` (3 unit tests kiểm thử cơ chế nạp và cache font cục bộ)
  - `tests/e2e/bookshelf-typography-m0-1.spec.ts` (E2E visual gate chụp 4 ảnh nghiệm thu + kiểm thử hồi quy ChapterRail Book IV & phím Space)
  - `docs/superpowers/plans/2026-09-20-bookshelf-typography-m0-1-plan.md` (Kế hoạch kỹ thuật M0.1)
  - `artifacts/screenshots/magazine-m0/M0.1-library-font-1920.png`
  - `artifacts/screenshots/magazine-m0/M0.1-library-font-1366.png`
  - `artifacts/screenshots/magazine-m0/M0.1-book-I-closeup.png`
  - `artifacts/screenshots/magazine-m0/M0.1-books-all-four.png`
- **Chỉnh sửa:**
  - `src/vendor/threeui-custom/bookshelf/typographyUtils.ts` (Xóa bỏ hoàn toàn `slice(0, maxLines)`, trả về `fits: false` khi không vừa, giữ trọn vẹn toàn bộ các từ)
  - `src/vendor/threeui-custom/bookshelf/bookshelfRenderer.js` (Áp dụng `MLNBookSans`, kiểm tra `if (!fittedTitle.fits)` tường minh, render toàn bộ các dòng theo `startY` mà không bỏ từ)
  - `src/vendor/threeui-custom/bookshelf/BookshelfScene.tsx` (Chờ nạp font cục bộ, đồng bộ `selectVolume(initialIndex, true)` mượt mà không gây xung đột lerp)
  - `src/state/presentationStore.ts` (Thêm `selectBook(index)` cho Library, cập nhật phím Space / `next()` chỉ mở sách hiện tại đang chọn)
  - `src/presentation/ChapterRail.tsx` (Xử lý riêng trong Library: click Book I gọi `openBook(0)`, click Book II–IV gọi `selectBook(idx)`; chỉ gọi `jumpToChapter()` khi ngoài Library; thêm `aria-label`)
  - `src/styles/global.css` (Đăng ký `@font-face` cho `MLNBookSans`, co giãn dock ChapterRail)
  - `tests/unit/presentationStore.test.ts` (Bổ sung kiểm thử hồi quy cho `selectBook(3)`, Space guard)

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

## 4. Fit Algorithm — TUYỆT ĐỐI KHÔNG BỎ TỪ
Cập nhật trong `src/vendor/threeui-custom/bookshelf/typographyUtils.ts`:
1. **Chuẩn hóa chuỗi (Normalize NFC):** Chuẩn hóa ký tự Unicode bằng `.normalize('NFC')` và rút gọn khoảng trắng thừa.
2. **Gói từ (Word wrap):** Thử nghiệm gói từ theo ranh giới từ vựng tiếng Việt.
3. **Đo đạc chính xác bằng `ctx.measureText()`:** Giảm dần `fontSize` từ `startSize` xuống `minSize` (với bước nhảy 1px) cho tới khi:
   - Số dòng `lines.length <= maxLines` (tối đa 2 dòng đối với bìa sách).
   - Chiều rộng mọi dòng `maxWidth <= 610px`.
4. **Nguyên tắc bất di bất dịch — NEVER discard words:**
   - Đã xóa bỏ hoàn toàn lệnh `slice(0, maxLines)`.
   - Nếu ở cỡ chữ tối thiểu (`minSize`) mà văn bản vẫn không thỏa mãn ràng buộc, hàm trả về `fits: false` và giữ nguyên toàn bộ các từ trong `lines`.
   - Caller (`bookshelfRenderer.js`) chủ động kiểm tra `if (!fittedTitle.fits)` để cảnh báo (`console.warn`) và tính toán `startY` tự động để vẽ toàn bộ số dòng thực tế, tuyệt đối không làm mất mát câu chữ.
   - Toàn bộ 4 tiêu đề chính thức của giáo trình được unit test kiểm chứng nghiêm ngặt đạt `fits === true`:
     - I: *Cơ cấu xã hội – giai cấp* (`fits === true`)
     - II: *Tính tất yếu của liên minh* (`fits === true`)
     - III: *Việt Nam hiện nay* (`fits === true`)
     - IV: *Phương hướng & giải pháp* (`fits === true`)

---

## 5. Tách Bạch Điều Hướng ChapterRail & Kiểm Thử Hồi Quy
Theo yêu cầu tại `chat.md`:
1. **Trong Thư viện (`isLibrary === true`):**
   - Click Quyển I: Gọi `openBook(0)` mở chế độ tạp chí 3D Quyển I.
   - Click Quyển II–IV: Gọi `selectBook(idx)` cập nhật sách được chọn trên kệ, KHÔNG gọi `jumpToChapter()`.
2. **Ngoài Thư viện (Presentation mode):**
   - Giữ nguyên `jumpToChapter(idx)` cho luồng trình chiếu cổ điển / legacy dev.
3. **Kiểm thử hồi quy trạng thái (State Regression Guard):**
   - Khi ở Thư viện và chọn Quyển IV (`selectBook(3)`):
     - `selectedBook === 3`
     - `chapterIndex === 3`
     - `experienceMode === 'library'`
     - Phím **Space** tuyệt đối KHÔNG được mở Quyển I (vẫn duy trì an toàn ở Thư viện).

---

## 6. Test Outputs (Kiểm Thử Toàn Diện)

### 1. `npm run lint` (Oxlint)
```
Found 0 warnings and 0 errors.
Finished in 20ms on 71 files with 115 rules using 20 threads.
```

### 2. `npm test` (Vitest)
```
 ✓ tests/unit/fontLoader.test.ts (3 tests)
 ✓ tests/unit/magazineModel.test.ts (4 tests)
 ✓ tests/unit/typographyUtils.test.ts (12 tests)
 ✓ tests/unit/presentationStore.test.ts (18 tests)
 ✓ tests/unit/threeui-imports.test.ts (1 test)

 Test Files  5 passed (5)
      Tests  38 passed (38)
   Duration  1.90s
```

### 3. `npm run build` (TypeScript + Vite)
```
✓ 2658 modules transformed.
dist/index.html                                     1.20 kB │ gzip:   0.63 kB
dist/assets/index-DzJeOC-o.css                     75.36 kB │ gzip:  27.46 kB
dist/assets/index-CNJHRuBx.js                   2,543.32 kB │ gzip: 716.37 kB
✓ built in 804ms
```

### 4. `npx playwright test tests/e2e/bookshelf-typography-m0-1.spec.ts --project=chromium`
```
Running 2 tests using 1 worker
  ok 1 [chromium] › tests\e2e\bookshelf-typography-m0-1.spec.ts:57:3 › M0.1 — Bookshelf Vietnamese Typography Integrity Visual Gate › Generate exact 4 M0.1 typography verification screenshots (1.8m)
  ok 2 [chromium] › tests\e2e\bookshelf-typography-m0-1.spec.ts:145:3 › M0.1 — Bookshelf Vietnamese Typography Integrity Visual Gate › ChapterRail Library interaction: clicking Book IV selects Book IV and Space does NOT open Book I (1.4m)
  2 passed (3.2m)
```

### 5. `npx playwright test tests/e2e/magazine-m0.spec.ts --project=chromium` (Full Suite)
```
Running 5 tests using 1 worker
  ok 1 [chromium] › 1. Core flow: Cover -> Library -> Magazine Book I -> Page turn -> View mode toggle -> Escape back to Library (28.2s)
  ok 2 [chromium] › 2. Negative assertions: No legacy party magazine branding in Magazine Book I (2.8s)
  ok 3 [chromium] › 3. Unavailable books guard: Books II, III, IV remain in Library without opening Magazine (26.2s)
  ok 4 [chromium] › 4. 10-cycle WebGL lifecycle test: Library <-> Magazine with zero context loss and invariant single canvas (3.6m)
  ok 5 [chromium] › 5. Visual Gate: Capture exact 6 M0 verification screenshots (1.2m)
  5 passed (5.9m)
```

---

## 7. Network Integrity Assertions (Bảo Mật Mạng Offline 100%)
- **Forbidden-Host Requests:** 0 requests (được kiểm tra nghiêm ngặt, chặn mọi request tới `fonts.googleapis.com`, `fonts.gstatic.com`, `cdn.jsdelivr.net`, `unpkg.com`).
- **Zero External-Origin Requests:** Khẳng định và xác minh tự động trong E2E suite: toàn bộ tài nguyên (font woff, âm thanh mp3, texture webp/png) chỉ được nạp từ local origin (`localhost` / `127.0.0.1`), không có bất kỳ request ra internet bên ngoài.

---

## 8. Verification Screenshots (4 Visual Proofs)
Các ảnh chụp nghiệm thu mới theo đúng yêu cầu đã được lưu tại thư mục `artifacts/screenshots/magazine-m0/`:
1. [M0.1-library-font-1920.png](file:///D:/Ky9-FPT/MLN131/artifacts/screenshots/magazine-m0/M0.1-library-font-1920.png) — Toàn cảnh Thư viện 3D độ phân giải 1920x1080; dock top hiển thị đầy đủ shortTitle không bị cắt xén.
2. [M0.1-library-font-1366.png](file:///D:/Ky9-FPT/MLN131/artifacts/screenshots/magazine-m0/M0.1-library-font-1366.png) — Giao diện Thư viện 3D tại độ phân giải 1366x768; bố cục co giãn mượt mà.
3. [M0.1-book-I-closeup.png](file:///D:/Ky9-FPT/MLN131/artifacts/screenshots/magazine-m0/M0.1-book-I-closeup.png) — Chế độ cận cảnh Quyển I (*Cơ cấu xã hội – giai cấp*); hiển thị trọn vẹn, sắc nét, không vỡ dấu, không lỗi font, không chạm viền.
4. [M0.1-books-all-four.png](file:///D:/Ky9-FPT/MLN131/artifacts/screenshots/magazine-m0/M0.1-books-all-four.png) — Toàn bộ 4 quyển sách với tiêu đề và nhãn chuyên ngành hoàn chỉnh.

---

## 9. Quy Tắc Tuân Thủ & Dừng (STOP)
- Không bắt đầu M1.
- Không chỉnh sửa Museum (`Do not touch Museum`).
- Không chỉnh sửa Minigame (`Do not touch Minigame`).
- Không viết tắt hay thay đổi nội dung tiêu đề sách.
- Toàn bộ các cổng kỹ thuật (Lint, 38/38 Unit Tests, Build, 7/7 Regression E2E, Visual Gates) đều đạt 100% không lỗi.
- **DỪNG (STOP) theo đúng quy định.**
