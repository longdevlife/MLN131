# M0 Magazine Prototype Report

## Commit
`97df0b53606c1dfc23eba75b245fa20a1da45997`

## Baselines
- **MLN131 Baseline:** `309dbe150b3b70dfe5c2762a95fe3b7de4f85594`
- **HCM202 Reference:** `d19c0d8557ce64778574c74ede16c66ffec95a53`

---

## Changed files
- `artifacts/screenshots/magazine-m0/M0-library-1366.png`
- `artifacts/screenshots/magazine-m0/M0-library-1920.png`
- `artifacts/screenshots/magazine-m0/M0-magazine-cover-1920.png`
- `artifacts/screenshots/magazine-m0/M0-magazine-open-1366.png`
- `artifacts/screenshots/magazine-m0/M0-magazine-open-1920.png`
- `artifacts/screenshots/magazine-m0/M0-magazine-reading-1920.png`
- `docs/superpowers/plans/2026-09-20-magazine-core-m0-implementation-plan.md`
- `docs/superpowers/specs/2026-09-20-mln131-experience-architecture-design.md`
- `docs/superpowers/specs/2026-09-20-mln131-magazine-core-design.md`
- `docs/superpowers/specs/2026-09-20-mln131-museum-experience-design.md`
- `package.json`
- `package-lock.json`
- `public/audios/page-flip-01a.mp3`
- `public/magazine/book1/cover-front.png`
- `public/magazine/book1/spread-01-front.png`
- `public/magazine/book1/spread-01-back.png`
- `public/magazine/book1/spread-02-front.png`
- `public/magazine/book1/spread-02-back.png`
- `public/magazine/book1/cover-back.png`
- `scripts/generate_m0_textures.mjs`
- `src/experiences/magazine/MagazineBook.tsx`
- `src/experiences/magazine/MagazineChrome.tsx`
- `src/experiences/magazine/MagazineExperience.tsx`
- `src/experiences/magazine/MagazinePage.tsx`
- `src/experiences/magazine/MagazineParticles.tsx`
- `src/experiences/magazine/MagazineScene.tsx`
- `src/experiences/magazine/magazine.css`
- `src/experiences/magazine/magazineModel.ts`
- `src/experiences/magazine/magazineTypes.ts`
- `src/experiences/magazine/volumes/book1.ts`
- `src/hooks/useKeyboardNavigation.ts`
- `src/presentation/PresentationShell.tsx`
- `src/presentation/VisualStage.tsx`
- `src/presenter/PresenterConsole.tsx`
- `src/presenter/broadcast.ts`
- `src/state/presentationStore.ts`
- `tests/e2e/magazine-m0.spec.ts`
- `tests/unit/magazineModel.test.ts`
- `tests/unit/presentationStore.test.ts`

---

## Port fidelity
- **Book skeleton:** Port nguyên bản cấu trúc SkinnedMesh 30 xương (`Bone 0` đến `Bone 29`) với trọng số skinning tuyến tính chính xác từ `HCM202/src/book/Book.jsx`.
- **Page bend:** Sử dụng thuật toán uốn cong vật lý tương tự HCM202 qua hàm `turningCurve` và ma trận góc xoay luân phiên theo `maath/easing.dampAngle` (`PAGE_TURN_SPEED = 0.5`).
- **Sequential turn:** Lật trang tuần tự, trang sau chờ trang trước lật hoàn tất (`delay = (i - page) * 0.14`), loại bỏ hoàn toàn hiện tượng xuyên thấu mesh qua độ dày `PAGE_THICKNESS = 0.003` và bias `z = -i * PAGE_THICKNESS`.
- **Showcase camera:** Camera ở tọa độ `[0, 1.2, 5]` với fov 45, nghiêng góc 3D nhẹ, cho phép quan sát toàn bộ góc nghiêng gáy sách và bóng đổ sàn (`ContactShadows`).
- **Reading camera:** Chuyển camera về mặt phẳng chính diện song song trang sách `[0, 0, 3.2]` với fov 35, phục vụ đọc nội dung không bị biến dạng phối cảnh.
- **Page particles:** Hạt bụi vàng lấp lánh nhẹ (`Sparkles` 35 hạt) tỏa ra khi lật trang sách và tự tiêu biến sau 1.5s.
- **Local audio:** Phát âm thanh lật trang tự nhiên từ file cục bộ `public/audios/page-flip-01a.mp3`, xử lý non-fatal khi trình duyệt chặn autoplay.

---

## Verification

### 1. `npm run lint`
```text
> mln131@1.1.0 lint
> oxlint

Found 0 warnings and 0 errors.
Finished in 28ms on 68 files with 115 rules using 20 threads.
```

### 2. `npm test`
```text
> mln131@1.1.0 test
> vitest run

 RUN  v5.0.1 D:/Ky9-FPT/MLN131

 ✓ tests/unit/magazineModel.test.ts (4 tests) 4ms
 ✓ tests/unit/presentationStore.test.ts (16 tests) 9ms
 ✓ tests/unit/threeui-imports.test.ts (1 test) 3ms

 Test Files  3 passed (3)
      Tests  21 passed (21)
   Start at  15:37:19
   Duration  2.32s (environment 90%, import 6%, transform 3%, worker 1%)
```

### 3. `npm run build`
```text
> mln131@1.1.0 build
> tsc -b && vite build

vite v8.3.0 building client environment for production...
transforming...
✓ 2656 modules transformed.
rendering chunks...
computing gzip size...
dist/registerSW.js                                  0.13 kB
dist/manifest.webmanifest                           0.41 kB
dist/index.html                                     1.20 kB │ gzip:   0.62 kB
dist/assets/index-wCphSFyg.css                     74.75 kB │ gzip:  27.27 kB
dist/assets/DiversificationScene-B5a12kgL.js        2.78 kB │ gzip:   1.23 kB
dist/assets/SocialNetworkScene-DXNrBgFZ.js          3.09 kB │ gzip:   1.63 kB
dist/assets/StructureFlowScene-BXRQDcdV.js          3.85 kB │ gzip:   1.86 kB
dist/assets/ClassRelationsScene-DePCmjJH.js         4.00 kB │ gzip:   1.79 kB
dist/assets/ConvergenceScene-DfPDo23Q.js            4.39 kB │ gzip:   1.73 kB
dist/assets/OrbitalCentralityScene-Cryc2q9S.js      5.55 kB │ gzip:   2.39 kB
dist/assets/PaperScene-Uz-fRGJV.js                  5.56 kB │ gzip:   2.10 kB
dist/assets/Html-FYxLuIFW.js                        7.52 kB │ gzip:   3.04 kB
dist/assets/Line-_hz3YI2T.js                       19.67 kB │ gzip:   6.00 kB
dist/assets/Part1BridgeScene-DODQ1s7V.js          118.49 kB │ gzip:  43.53 kB
dist/assets/index-DWN0d6gf.js                   2,539.89 kB │ gzip: 715.13 kB
✓ built in 700ms
```

### 4. `npm run test:e2e` (`tests/e2e/magazine-m0.spec.ts`)
```text
Running 5 tests using 1 worker

  ok 1 [chromium] › tests\e2e\magazine-m0.spec.ts:26:3 › MLN131 Magazine Core M0 - Verification & Lifecycle Suite › 1. Core flow: Cover -> Library -> Magazine Book I -> Page turn -> View mode toggle -> Escape back to Library (42.6s)
  ok 2 [chromium] › tests\e2e\magazine-m0.spec.ts:85:3 › MLN131 Magazine Core M0 - Verification & Lifecycle Suite › 2. Negative assertions: No legacy party magazine branding in Magazine Book I (21.7s)
  ok 3 [chromium] › tests\e2e\magazine-m0.spec.ts:102:3 › MLN131 Magazine Core M0 - Verification & Lifecycle Suite › 3. Unavailable books guard: Books II, III, IV remain in Library without opening Magazine (56.9s)
  ok 4 [chromium] › tests\e2e\magazine-m0.spec.ts:132:3 › MLN131 Magazine Core M0 - Verification & Lifecycle Suite › 4. 10-cycle WebGL lifecycle test: Library <-> Magazine with zero context loss and invariant single canvas (3.7m)
  ok 5 [chromium] › tests\e2e\magazine-m0.spec.ts:180:3 › MLN131 Magazine Core M0 - Verification & Lifecycle Suite › 5. Visual Gate: Capture exact 6 M0 verification screenshots (1.1m)

  5 passed (6.9m)
```

---

## Lifecycle
- **10 Library -> Magazine -> Library cycles:** Vượt qua toàn bộ 10 chu kỳ chuyển đổi mà không xuất hiện bất kỳ `pageerror`, không có sự kiện `webglcontextlost`, và không có lỗi shader/GL driver context crash.
- **WebGL Canvas Exclusive Ownership:** Tại mọi thời điểm settled ở cả 10 chu kỳ, số lượng thẻ `<canvas>` trong toàn bộ DOM luôn luôn bằng **chính xác 1**.

---

## Network
- **External font/CDN requests:** **0 requests**.
- Bộ kiểm tra tự động trong `beforeEach` kích hoạt cấm và không phát hiện bất kỳ yêu cầu mạng nào tới các domain bị cấm (`fonts.googleapis.com`, `fonts.gstatic.com`, `cdn.jsdelivr.net`, `unpkg.com`). Tất cả font, âm thanh và texture đều chạy 100% offline.

---

## Screenshots
Đã sinh thành công bộ 6 ảnh chụp màn hình nghiệm thu visual gates tại thư mục `artifacts/screenshots/magazine-m0/`:

1. `M0-library-1920.png` (1920x1080 — Thư viện 3D với 4 quyển sách)
2. `M0-magazine-cover-1920.png` (1920x1080 — Bìa Quyển I: Cơ cấu xã hội – giai cấp)
3. `M0-magazine-open-1920.png` (1920x1080 — Trang mở đôi 1–2 ở chế độ Showcase 3D)
4. `M0-magazine-reading-1920.png` (1920x1080 — Trang mở đôi 1–2 ở chế độ Reading trực diện)
5. `M0-library-1366.png` (1366x768 — Thư viện 3D kiểm tra responsive)
6. `M0-magazine-open-1366.png` (1366x768 — Trang mở đôi Quyển I kiểm tra layout responsive)

---

## Known issues
1. **ThreeUI Warnings:** Trong quá trình build Vite và khởi tạo runtime, thư viện ThreeUI cũ phát ra một số cảnh báo về `sRGBEncoding` (do phiên bản Three.js nâng cấp). Cảnh báo này không làm ảnh hưởng tới việc render của Magazine 3D hay Library.
2. **Texture Prototype:** Nội dung 6 trang của Quyển I hiện là bản prototype kỹ thuật M0 (tập trung nghiệm thu vật liệu, độ cong xương, scale và typography an toàn); nội dung học thuật chi tiết và 3D interactive inserts sẽ được bổ sung tại các mốc tiếp theo.

---

## STOP
> [!IMPORTANT]
> **ĐÓNG BĂNG PHẠM VI (SCOPE FREEZE):** Mốc M0 đã hoàn thành 100% mục tiêu. Không có bất kỳ công việc nào của M1, Bảo tàng 3D (Museum), ThreeUI inserts, Part II, hay Minigame/Firebase được khởi động. Hoàn toàn dừng lại theo đúng quy tắc kỹ thuật.
