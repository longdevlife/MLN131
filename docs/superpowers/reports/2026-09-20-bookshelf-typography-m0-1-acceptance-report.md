# Báo Cáo Nghiệm Thu M0.3 — Bookshelf Typography Final Closure & Internal Page Textures

> **Thời điểm:** 2026-09-21  
> **Trạng thái:** HOÀN TẤT 100% (PASSED ALL GATES) — STOP (KHÔNG BẮT ĐẦU M1)  
> **Mục tiêu:** Loại bỏ triệt để các đường dẫn font hệ thống còn sót lại trong `bookshelfRenderer.js` (`Tn(e, true)`, `Pn(e)`), xóa bỏ phụ thuộc font Inter không tồn tại cục bộ, bổ sung static regression test, và nghiệm thu trực quan 2 ảnh trang sách bên trong (M0.3) theo đúng yêu cầu tại `C:\Users\admin\Downloads\chat.md`.

---

## 1. Commit & Branch Information
- **Branch:** `spec/magazine-museum-rebase`
- **M0.2 Baseline Commit:** `42a083f30fc8c9d03368d8e592315d5fcfdc6957`
- **M0.3 Micro-Patch Scope:**
  - Chuẩn hóa `Tn(e, true)`: Thay thế toàn bộ chuỗi font hệ thống Inter/Helvetica/Arial bằng `MLNBookSans`, chuẩn hóa NFC (`normalizeVietnameseText`), dàn chữ tự động bằng `fitSingleLineText` dựa trên `ctx.measureText`, không drop từ.
  - Kiểm toán và chuẩn hóa toàn bộ các trang nội dung `Pn(e)`: Chuyển toàn bộ khai báo font canvas sang `MLNBookSans`, chuẩn hóa NFC cho mọi trường dữ liệu động tiếng Việt (`e.title`, `e.discipline`, `e.note`, `e.deck`, `e.theme`, `e.chapters[*]`), và dàn chữ tự động cho `e.discipline`.
  - Xóa bỏ hoàn toàn lệnh `await document.fonts.load("600 82px Inter");` để đảm bảo thư viện 3D chỉ phụ thuộc vào font cục bộ `MLNBookSans`.
  - Bổ sung bộ kiểm thử tĩnh tự động (`tests/unit/bookshelfRendererTypography.test.ts`) ngăn chặn vĩnh viễn việc tái phát sinh font hệ thống hoặc render trực tiếp văn bản tiếng Việt chưa qua fitting.
  - Chụp bộ 2 ảnh nghiệm thu trang bên trong: `M0.3-book-I-inner-page.png` và `M0.3-book-II-inner-page.png`.

---

## 2. Changed Files
Danh sách chính xác các tệp đã tạo mới và chỉnh sửa trong đợt M0.3:
- **Tạo mới:**
  - `tests/unit/bookshelfRendererTypography.test.ts` (Bộ kiểm thử tĩnh 4 bài test chặn hồi quy font hệ thống, Inter load, và unfitted text rendering)
  - `artifacts/screenshots/magazine-m0/M0.3-book-I-inner-page.png` (Ảnh chụp trang nội dung bên trong Quyển I)
  - `artifacts/screenshots/magazine-m0/M0.3-book-II-inner-page.png` (Ảnh chụp trang nội dung bên trong Quyển II)
- **Chỉnh sửa:**
  - `src/vendor/threeui-custom/bookshelf/bookshelfRenderer.js` (Loại bỏ toàn bộ font Inter/Helvetica/Arial trong `Tn` và `Pn`, chuẩn hóa NFC, xóa `document.fonts.load("600 82px Inter")`)
  - `tests/e2e/bookshelf-typography-m0-1.spec.ts` (Bổ sung test tự động mở detail/open-book và chụp 2 ảnh M0.3)
  - `docs/superpowers/reports/2026-09-20-bookshelf-typography-m0-1-acceptance-report.md` (Cập nhật báo cáo nghiệm thu M0.3)

---

## 3. Grep Evidence — Xác Minh Không Còn Font Hệ Thống
Kết quả quét regex toàn bộ file `src/vendor/threeui-custom/bookshelf/bookshelfRenderer.js` tìm kiếm `Inter`, `Helvetica`, `Arial`:
```bash
$ git grep -n -E "Inter|Helvetica|Arial" src/vendor/threeui-custom/bookshelf/bookshelfRenderer.js
src/vendor/threeui-custom/bookshelf/bookshelfRenderer.js:53:      motif: "Interlaced paths",
```
*Ghi chú:* Dòng 53 là thuộc tính dữ liệu metadata `motif: "Interlaced paths"` (từ vựng tiếng Anh "Interlaced"), không phải chuỗi font. Toàn bộ các khai báo font canvas trong file hiện 100% là `MLNBookSans, sans-serif`.

---

## 4. Chi Tiết Thực Hiện Các Hạng Mục

### 1. Sửa `Tn(e, true)`
Đoạn mã in trang thử nghiệm `Tn(e, true)` đã được tái cấu trúc:
```js
const normTnTitle = normalizeVietnameseText(e.title).toUpperCase();
const fittedTnTitle = fitSingleLineText(r, normTnTitle, {
  maxWidth: 580,
  startSize: 15,
  minSize: 11,
  fontFamily: 'MLNBookSans',
  fontWeight: 500,
});
r.font = `500 ${fittedTnTitle.fontSize}px MLNBookSans, sans-serif`;
r.letterSpacing = "2px";
r.fillText(fittedTnTitle.text, 84, 98);
r.fillRect(84, 121, Math.max(190, Math.min(580, fittedTnTitle.width)), 2);
```

### 2. Chuẩn Hóa Các Trang Nội Dung `Pn(e)`
- Tất cả các nhãn tiêu đề, số chương, và thông số kỹ thuật chuyển sang `MLNBookSans, sans-serif`.
- Nhãn chuyên ngành `e.discipline.toUpperCase()` được đo và dàn bằng `fitSingleLineText(s, normDiscipline, { maxWidth: 400, startSize: 12, minSize: 9, fontFamily: 'MLNBookSans' })`.
- Các trường tiếng Việt `e.note`, `e.deck`, `e.theme`, `e.chapters[*]` đều được bọc qua `normalizeVietnameseText(...)`.

### 3. Loại Bỏ Phụ Thuộc Font Inter
Khối mã:
```js
try {
  await document.fonts.load("600 82px Inter");
} catch {}
```
đã bị xóa bỏ hoàn toàn. Trạng thái sẵn sàng của 3D Bookshelf chỉ phụ thuộc duy nhất vào font cục bộ `MLNBookSans` thông qua `ensureBookshelfFonts()`.

---

## 5. Test Outputs (Kiểm Thử Toàn Diện)

### 1. `npm run lint` (Oxlint)
```
Found 0 warnings and 0 errors.
Finished in 27ms on 72 files with 115 rules using 20 threads.
```

### 2. `npm test` (Vitest — 42/42 Passed)
```
 ✓ tests/unit/presentationStore.test.ts (18 tests)
 ✓ tests/unit/magazineModel.test.ts (4 tests)
 ✓ tests/unit/bookshelfRendererTypography.test.ts (4 tests)
 ✓ tests/unit/typographyUtils.test.ts (12 tests)
 ✓ tests/unit/fontLoader.test.ts (3 tests)
 ✓ tests/unit/threeui-imports.test.ts (1 test)

 Test Files  6 passed (6)
      Tests  42 passed (42)
   Duration  2.76s
```

### 3. `npm run build` (TypeScript + Vite)
```
✓ 2658 modules transformed.
dist/index.html                                     1.20 kB │ gzip:   0.63 kB
dist/assets/index-DzJeOC-o.css                     75.36 kB │ gzip:  27.46 kB
dist/assets/index-CLLToV2N.js                   2,543.36 kB │ gzip: 716.37 kB
✓ built in 616ms
```

### 4. `npx playwright test tests/e2e/bookshelf-typography-m0-1.spec.ts --project=chromium`
```
Running 3 tests using 1 worker
  ok 1 [chromium] › Generate exact 4 M0.1 typography verification screenshots (1.5m)
  ok 2 [chromium] › ChapterRail Library interaction: clicking Book IV selects Book IV and Space does NOT open Book I (1.2m)
  ok 3 [chromium] › M0.3 — Generate exact 2 internal page verification screenshots (Book I and Book II) (58.3s)
  3 passed (3.7m)
```

### 5. `npx playwright test tests/e2e/magazine-m0.spec.ts --project=chromium`
```
Running 5 tests using 1 worker
  ok 1 [chromium] › 1. Core flow: Cover -> Library -> Magazine Book I -> Page turn -> View mode toggle -> Escape back to Library (24.0s)
  ok 2 [chromium] › 2. Negative assertions: No legacy party magazine branding in Magazine Book I (1.9s)
  ok 3 [chromium] › 3. Unavailable books guard: Books II, III, IV remain in Library without opening Magazine (13.1s)
  ok 4 [chromium] › 4. 10-cycle WebGL lifecycle test: Library <-> Magazine with zero context loss and invariant single canvas (2.4m)
  ok 5 [chromium] › 5. Visual Gate: Capture exact 6 M0 verification screenshots (56.3s)
  5 passed (4.1m)
```

---

## 6. Network Integrity Assertion
- Khẳng định chuẩn xác theo yêu cầu: **zero external-origin HTTP(S) requests observed in the tested Library/Magazine route**.
- Tuyệt đối không phát hiện bất kỳ request nào ra ngoài domain local (`localhost` / `127.0.0.1`) trong suốt quá trình chạy toàn bộ 8 bài test E2E.

---

## 7. M0.3 Verification Screenshots (2 Visual Proofs)
1. [M0.3-book-I-inner-page.png](file:///D:/Ky9-FPT/MLN131/artifacts/screenshots/magazine-m0/M0.3-book-I-inner-page.png) — Trang nội dung bên trong Quyển I (*Cơ cấu xã hội – giai cấp*) ở chế độ mở sách 3D; hiển thị tiêu đề, phụ đề và nội dung mẫu sử dụng font `MLNBookSans`.
2. [M0.3-book-II-inner-page.png](file:///D:/Ky9-FPT/MLN131/artifacts/screenshots/magazine-m0/M0.3-book-II-inner-page.png) — Trang nội dung bên trong Quyển II (*Tính tất yếu của liên minh*) ở chế độ mở sách 3D; nhãn chuyên ngành (*TÍNH TẤT YẾU KINH TẾ - XÃ HỘI*) và tiêu đề chuẩn hóa NFC không vỡ dấu.

---

## 8. Quy Tắc Tuân Thủ & Dừng (STOP)
- Không bắt đầu M1.
- Không chỉnh sửa Magazine mechanics.
- Không chỉnh sửa Museum (`Do not touch Museum`).
- Không chỉnh sửa Minigame (`Do not touch Minigame`).
- Toàn bộ các cổng kỹ thuật (Oxlint 0/0, Vitest 42/42, Build, Playwright E2E 8/8) đều đạt 100%.
- **DỪNG (STOP) theo đúng quy định.**
