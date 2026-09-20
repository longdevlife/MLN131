# Spec: Phase 2.1.2 — Final Technical Cleanup Only

## 1. Mục tiêu & Bối cảnh (Goal & Context)
Dự án đã hoàn thành Phase 2.1.1 với việc khép kín State Machine, True Registry, dọn dẹp nội dung học thuật, và bổ sung test suite độ phân giải kép (1920x1080 & 1366x768).
Tuy nhiên, qua đợt rà soát kỹ thuật độc lập trên commit `916e1ae`, Reviewer đã chỉ ra 4 vấn đề kỹ thuật còn tồn tại cần được xử lý triệt để trong micro-patch Phase 2.1.2:
1. **Offline Font cho Troika / Drei `<Text>`:** Troika mặc định gọi CDN ngoài khi không có font chỉ định hoặc khi gặp ký tự tiếng Việt. Cần nạp font local `.woff` có sẵn bản quyền Apache 2.0 trong `public/fonts/` và gắn `font=` rõ ràng cho mọi `<Text>` trong `Part1BridgeScene.tsx`.
2. **Resource Lifecycle Cleanup:**
   - `OrbitalCentralityScene`: Các đối tượng thủ công `THREE.BufferGeometry`, `THREE.LineBasicMaterial`, `THREE.Line` đưa vào `<primitive>` phải được gọi `.dispose()` tường minh khi unmount.
   - `PaperScene`: `CanvasTexture` tạo bởi `createPaperTexture()` phải được gọi `dispose()` khi unmount.
3. **Terminology & Stale Branch Cleanup:**
   - Chuẩn hóa các cụm từ "quy luật biến đổi" thành "sự biến đổi có tính quy luật", "3 xu hướng biến đổi có tính quy luật" trong `chapters.ts`, `PaperScene.tsx`, `part1.ts`.
   - Xóa bỏ hoàn toàn nhánh dead copy P1.S7 cũ trong `PaperScene.tsx`.
4. **Empty Chapter Guard:** Khi `part2Scenes = []` (hoặc bất kỳ quyển nào có `scenes.length === 0`), nếu người dùng chọn Quyển II/III/IV từ Thư viện hoặc gọi `openChapter`/`jumpToChapter`, hệ thống phải giữ nguyên ở Thư viện (`viewMode = 'library'`), giữ quyển đó được chọn/highlight, tuyệt đối không chuyển sang `viewMode = 'chapter'` để tránh màn hình trắng.
5. **README Accuracy & Network Assertions:**
   - Cập nhật câu chữ chính xác trong README: "No explicit object/array allocation or React state update remains inside authored useFrame callbacks after audit."
   - Thêm network request assertion trong Playwright test để fail nếu phát hiện bất kỳ request nào hướng ra external font/CDN hosts (`fonts.gstatic.com`, `cdn.jsdelivr.net`, v.v.).

---

## 2. Phạm vi Yêu cầu (Scope)

### Trong phạm vi (In Scope)
- [x] Bundle font local `public/fonts/roboto-regular.woff` (Apache 2.0, hỗ trợ Latin + Latin Extended + Vietnamese).
- [x] Chỉ định `font="/fonts/roboto-regular.woff"` cho tất cả các thẻ `<Text>` trong `src/scenes/r3f/Part1BridgeScene.tsx`.
- [x] Thêm `useEffect` cleanup giải phóng `BufferGeometry`, `LineBasicMaterial` của `rayLines` trong `src/scenes/r3f/OrbitalCentralityScene.tsx`.
- [x] Thêm `useEffect` cleanup giải phóng `CanvasTexture` trong `src/scenes/r3f/PaperScene.tsx`.
- [x] Xóa bỏ đoạn mã dead-branch P1.S7 trong `src/scenes/r3f/PaperScene.tsx`.
- [x] Chuẩn hóa thuật ngữ học thuật:
  - `chapters.ts`: `"Khái niệm, vị trí và sự biến đổi có tính quy luật trong TKQĐ."`
  - `PaperScene.tsx`: `"3 xu hướng biến đổi có tính quy luật trong thời kỳ quá độ."`
  - Rà soát `part1.ts` để đồng bộ.
- [x] Cập nhật guard trong `src/state/presentationStore.ts`: Không mở `viewMode = 'chapter'` nếu `chapter.scenes.length === 0`.
- [x] Cập nhật unit test trong `tests/unit/presentationStore.test.ts` kiểm thử empty chapter guard.
- [x] Thêm Network Monitor vào Playwright test (`tests/e2e/vertical-slice.spec.ts`) để chặn mọi request đến domain font/CDN ngoại trú.
- [x] Sửa câu chữ trong `README.md` theo chỉ đạo.

### Ngoài phạm vi (Out of Scope)
- **TUYỆT ĐỐI KHÔNG** triển khai nội dung thực chất của Phần II (Part II / Quyển II). `part2Scenes` phải giữ nguyên `[]`.
- Không thay đổi hành vi mỹ thuật hoặc cấu trúc scene đã được duyệt của P1.S0 -> P1.S7.

---

## 3. Kiến trúc Kỹ thuật & Thiết kế API (Technical Design)

### 3.1 Font Offline Architecture
- Đường dẫn: `/fonts/roboto-regular.woff`
- Truyền vào Drei `<Text font="/fonts/roboto-regular.woff" ...>`
- Troika Worker sẽ nạp font từ URL nội bộ này, không kích hoạt cơ chế fallback CDN.

### 3.2 Resource Lifecycle Pattern
```ts
// OrbitalCentralityScene.tsx
useEffect(() => {
  return () => {
    rayLines.forEach((line) => {
      line.geometry.dispose();
      const mat = line.material;
      if (Array.isArray(mat)) {
        mat.forEach((m) => m.dispose());
      } else {
        mat.dispose();
      }
    });
  };
}, [rayLines]);

// PaperScene.tsx
useEffect(() => {
  return () => {
    paperTexture.dispose();
  };
}, [paperTexture]);
```

### 3.3 State Machine Empty Chapter Guard
```ts
// presentationStore.ts
openChapter: (chapterIndex: number, sceneIndex = 0) => {
  const validChapterIndex = Math.max(0, Math.min(chapters.length - 1, chapterIndex));
  const targetChapter = chapters[validChapterIndex];
  if (!targetChapter || targetChapter.scenes.length === 0) {
    // Remain in library, keep book selected/highlighted
    set({
      viewMode: 'library',
      chapterIndex: validChapterIndex,
      sceneIndex: 0,
      beatIndex: 0,
    });
    return;
  }
  set({
    viewMode: 'chapter',
    chapterIndex: validChapterIndex,
    sceneIndex,
    beatIndex: 0,
    direction: 1,
  });
},
```

---

## 4. Tiêu chuẩn Nghiệm thu (Verification & Acceptance)
1. `npm run lint`: 0 errors, 0 warnings.
2. `npm test`: Pass 100% (bổ sung test empty chapter guard).
3. `npm run build`: Clean build không lỗi kiểu.
4. `npm run test:e2e`: 8/8 tests pass, có network monitoring chặn external fonts.
5. Commit git và xuất bản patch/diff hoàn chỉnh.
