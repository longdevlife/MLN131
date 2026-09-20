# MLN Chapter 5 — Living Textbook (Giáo trình Số Không gian 3D)

> **Môn học:** Chủ nghĩa xã hội khoa học (CNXHKH) — Mã học phần: `MLN131`  
> **Chủ đề:** Chương 5: Cơ cấu xã hội – giai cấp và liên minh giai cấp, tầng lớp trong thời kỳ quá độ lên chủ nghĩa xã hội  
> **Nền tảng:** Web 3D tương tác thế hệ mới, tối ưu hóa cho thuyết trình hội trường & giảng dạy đại học.

---

## 🌟 1. Tổng quan Dự án (Project Overview)

**MLN Chapter 5 — Living Textbook** là dự án chuyển đổi bài giảng kinh điển của môn **Chủ nghĩa xã hội khoa học** thành một trải nghiệm số không gian 3D trực quan, chân thực và có tính tương tác cao.

Thay vì sử dụng các slide tĩnh truyền thống (PowerPoint, Canva, Keynote), hệ thống mang lại:
1. **Thư viện Sách 3D (3D Bookshelf Lobby):** Mô phỏng 4 quyển da gáy kim mạ vàng thủ công tương ứng với 4 phần nội dung lớn của Chương 5. 100% nội dung tiếng Việt học thuật chuẩn mực, loại bỏ hoàn toàn các nhãn demo stock.
2. **Cảnh 3D theo Nhịp (Beat-driven Spatial Scenes):** Trực quan hóa các khái niệm trừu tượng (như mạng lưới 5 phân hệ cộng đồng, chuyển dịch cơ cấu kinh tế - giai tầng, liên minh công - nông - trí thức) theo từng nhịp diễn giải bằng WebGL/Three.js.
3. **Bảng điều khiển Diễn giả thời gian thực (Presenter Console):** Hỗ trợ thiết lập 2 màn hình (Dual-screen setup) đồng bộ tức thời qua `BroadcastChannel` API không cần internet hay WebSocket server trung gian.
4. **Khả năng hoạt động Offline & Chế độ An toàn (Safe Mode Fallback):** Cài đặt dưới dạng PWA (Progressive Web App) với Service Worker lưu đệm hoàn toàn và cơ chế 2D Safe Mode đảm bảo bài thuyết trình không bao giờ bị gián đoạn.

---

## 🏛️ 2. Kiến trúc Kỹ thuật (Technical Architecture)

Hệ thống được phát triển theo kiến trúc module hóa phân tầng:

```
src/
├── app/               # Root shell & Dynamic routing (Presentation, Presenter Console, Preflight)
├── content/           # Nội dung học thuật chuẩn mực trích từ Giáo trình CNXHKH 2021 (Chương 5)
│   ├── chapters.ts    # Khai báo cấu trúc 4 Quyển (Part I -> Part IV)
│   ├── part1.ts       # Part I: Khái luận về cơ cấu xã hội – giai cấp (P1.S0 -> P1.S7)
│   ├── sources.ts     # Danh mục trích dẫn học thuật (Giáo trình 2021, V.I.Lênin Toàn tập, ĐH XIII)
│   └── types.ts       # Schema dữ liệu cảnh, nhịp (Beats), nhãn và nguồn
├── hooks/             # Custom React Hooks
│   ├── useKeyboardNavigation.ts # Xử lý phím tắt diễn thuyết toàn cục
│   └── usePerformanceTier.ts    # Giám sát FPS & thích ứng đồ họa tự động (Particle Scale)
├── preflight/         # Màn hình kiểm tra tiền trạm đồ họa thiết bị hội trường (?preflight=1)
├── presentation/      # Lớp hiển thị sân khấu & UI người nghe (Audience View)
│   ├── CoverScreen.tsx       # Màn hình bìa giáo trình
│   ├── ChapterRail.tsx       # Thanh điều hướng chương/quyển phía trên
│   ├── ContentOverlay.tsx    # Lớp văn bản ngữ nghĩa & nút tra cứu trích dẫn
│   ├── SourceDrawer.tsx      # Drawer tra cứu danh mục tài liệu trích dẫn
│   ├── VisualStage.tsx       # Bộ điều phối trung tâm giữa BookshelfScene và R3FStage
│   └── BlackoutLayer.tsx     # Lớp phủ màn hình đen tập trung (Phím B)
├── presenter/         # Bảng điều khiển dành riêng cho người thuyết trình (?mode=control)
│   ├── PresenterConsole.tsx  # Ghi chú diễn giả, xem trước cảnh tiếp theo, bộ đếm giờ, nút xóa cache
│   └── broadcast.ts          # Giao thức đồng bộ không dây nội bộ qua BroadcastChannel
├── scenes/            # Các cảnh trực quan hóa không gian 3D
│   ├── r3f/           # Cảnh 3D sử dụng React Three Fiber & Drei (P1.S1: Social Network)
│   └── safe/          # Cảnh 2D Vector phẳng dự phòng khi thiết bị yếu / GPU lỗi (?safe=1)
├── state/             # Zustand Store quản lý trạng thái trình chiếu (Navigation State Machine)
└── vendor/threeui-custom/bookshelf/ # Thư viện 3D Bookshelf tùy biến (isolated Three.js 0.165-compatible runtime)
```

### ⚙️ Môi trường thực thi đồ họa (Runtime Architecture)
- **Application / R3F Scenes:** Three.js `0.170.0`, `@react-three/fiber` `9.7.0`, `@react-three/drei` `10.7.8`.
- **Vendored ThreeUI Bookshelf:** isolated Three.js `0.165`-compatible runtime (forked & cô lập tại `src/vendor/threeui-custom/bookshelf/`).

---

## ⌨️ 3. Bảng Phím tắt Thuyết trình (Presenter Hotkeys)

Mọi thao tác trong suốt buổi thuyết trình có thể được thực hiện hoàn toàn qua bàn phím hoặc bút thuyết trình (Presenter Clicker):

| Phím tắt | Tác vụ | Mô tả chi tiết |
| :--- | :--- | :--- |
| **`Space`** / **`→`** / **`PageDown`** | **Tiến bước (Next)** | Chuyển sang nhịp tiếp theo trong cảnh; nếu hết nhịp thì sang cảnh kế tiếp; nếu ở Thư viện thì mở sách |
| **`←`** / **`PageUp`** | **Lùi bước (Prev)** | Quay lại nhịp trước đó; nếu ở đầu cảnh thì quay về cảnh trước; nếu ở đầu chương thì về Thư viện |
| **`1`**, **`2`**, **`3`**, **`4`** | **Chuyển Quyển** | Nhảy trực tiếp đến Quyển I, II, III hoặc IV |
| **`O`** | **Thư viện Sách 3D** | Mở ngay giao diện chọn sách 3D (Bookshelf Lobby) từ bất kỳ đâu |
| **`B`** | **Màn hình Đen (Blackout)** | Tắt tạm thời màn hình chiếu để người nghe tập trung hoàn toàn vào diễn giả |
| **`R`** | **Đặt lại Cảnh (Reset)** | Khởi động lại nhịp đầu tiên (Beat 0) của cảnh hiện tại |
| **`F`** | **Toàn màn hình (Fullscreen)** | Bật hoặc thoát chế độ toàn màn hình không viền của trình duyệt |
| **`Home`** | **Về Trang Bìa (Cover)** | Quay trở lại màn hình giới thiệu ban đầu |
| **`Escape`** | **Đóng / Thoát** | Đóng Slide-over Drawer tài liệu trích dẫn; nếu không mở drawer thì quay về Thư viện 3D |

---

## 📋 4. Hướng dẫn Vận hành & Checklist Ngày Thuyết trình (Pre-presentation Checklist)

Nhằm đảm bảo buổi báo cáo diễn ra trơn tru tuyệt đối, người thuyết trình cần thực hiện các bước sau trước giờ lên bục:

### Bước 1: Kiểm tra phần cứng & GPU hội trường (Preflight Test)
1. Mở trình duyệt và truy cập đường dẫn:
   ```
   http://localhost:5173/?preflight=1
   ```
   (hoặc đường dẫn triển khai: `https://<domain>/?preflight=1`)
2. Màn hình Tiền trạm sẽ tự động chạy bài kiểm tra đo tốc độ khung hình (FPS Benchmark) trong 3 giây:
   - **Tốt (Tier: High, 60 FPS):** Nhấn **"KHỞI ĐỘNG 3D CHUẨN"** để sử dụng toàn bộ hiệu ứng WebGL chất lượng cao.
   - **Yếu / Máy cũ (FPS < 28):** Nhấn **"KHỞI ĐỘNG 2D SAFE MODE"** hoặc thêm tham số `?safe=1` trên thanh địa chỉ.

### Bước 2: Thiết lập 2 Màn hình Diễn giả (Dual-Screen Setup)
- **Màn hình 1 (Máy chiếu / Màn hình phụ của khán giả):**
  Mở trình duyệt ở chế độ Toàn màn hình (phím `F`):
  ```
  http://localhost:5173/
  ```
- **Màn hình 2 (Màn hình Laptop người nói):**
  Mở tab mới trên cùng trình duyệt với tham số điều khiển:
  ```
  http://localhost:5173/?mode=control
  ```
- *Cơ chế:* Hai màn hình tự động kết nối qua `BroadcastChannel`. Mọi thao tác nhấn Next/Prev, chọn chương, xem ghi chú bài giảng (Speaker Notes) trên màn hình Laptop sẽ đồng bộ tức thời sang màn hình máy chiếu với độ trễ 0ms mà không cần mạng internet.

### Bước 3: Đảm bảo khả năng Offline & Xóa Cache làm mới
- Ứng dụng đã đăng ký PWA Service Worker. Sau lần tải đầu tiên, có thể ngắt toàn bộ Wi-Fi/LAN mà ứng dụng vẫn hoạt động 100%.
- Nếu nội dung vừa được cập nhật mã nguồn mới, tại chân trang của Bảng điều khiển Diễn giả (`?mode=control`), nhấn nút đỏ:
  **"XÓA BỘ NHỚ ĐỆM OFFLINE & TẢI LẠI"** để xóa sạch Service Worker & Cache Storage cũ.

---

## 🛠️ 5. Lệnh Phát triển & Kiểm thử (Development & QA)

Dự án sử dụng công cụ kiểm tra chất lượng tự động nghiêm ngặt:

```bash
# Cài đặt thư viện phụ thuộc
npm install

# Khởi chạy máy chủ phát triển
npm run dev

# Kiểm tra lỗi tĩnh siêu tốc bằng Oxlint
npm run lint

# Biên dịch TypeScript và đóng gói PWA Production
npm run build

# Chạy kiểm thử đơn vị & Store State Machine
npm test

# Chạy kiểm thử đầu cuối E2E (End-to-End) với Playwright
npm run test:e2e
```

### 🎯 Tiêu chuẩn Nghiệm thu Kỹ thuật (QA Pass Criteria)
- ✅ `tsc -b`: 0 lỗi biên dịch kiểu TypeScript.
- ✅ `oxlint`: 0 cảnh báo linting (0 errors, 0 warnings trên toàn bộ 53 files mã nguồn).
- ✅ `vitest`: 8/8 unit tests đạt 100% (kiểm thử chặt chẽ Store State Machine, navigation determinism và ranh giới Part II handoff).
- ✅ `playwright test`: 8/8 kịch bản E2E kiểm thử tự động đạt 100% (bao gồm core flow, đồng bộ Presenter Console, kiểm tra Preflight, kiểm thử ThreeUI Bookshelf lifecycle created=1/disposed=0, Safe Mode walkthrough & reverse, Real WebGL walkthrough với console capture, Real WebGL Soak Test >=5 chu kỳ S1->S7->S1, và kiểm thử hiển thị song song ở cả 2 độ phân giải 1920x1080 và 1366x768).
- ✅ Lifecycle ThreeUI: Không ghi nhận renderer recreation hoặc WebGL context loss trong test lifecycle hiện tại (duyệt qua các tập sách I -> II -> III -> IV -> I trong thư viện giữ nguyên `created = 1`, `disposed = 0`).

---

## ⚠️ 6. Giới hạn đã biết (Known Limitations)

1. **Phân tách Bundle JS (Lazy Splitting Architecture):**  
   Hệ thống đã triển khai Dynamic Import (`React.lazy`) và True Scene Registry cho toàn bộ các cảnh 3D chuyên biệt (P1.S1 đến P1.S7) thành các chunk độc lập tải theo nhu cầu. Chunk chính (~1.96 MB chưa gzip / ~568 kB gzipped) đóng gói Three.js r170 runtime và thư viện ThreeUI Bookshelf dùng chung. Với ứng dụng trình chiếu hội trường chạy local hoặc PWA offline có Service Worker lưu đệm, tốc độ khởi động tức thì và hoàn toàn mượt mà.
2. **Kiểm chứng bộ nhớ WebGL:**  
   Chỉ số `created = 1`, `disposed = 0` chứng minh renderer không bị tái tạo ngoài ý muốn khi chuyển đổi sách. Toàn bộ các cảnh R3F đã được kiểm toán triệt để, loại bỏ hoàn toàn việc cấp phát đối tượng mới (0 new allocations per frame) trong `useFrame`.

---

## 📜 7. Giấy phép & Ghi công (License & Attributions)

- **Nội dung lý luận & Trích dẫn:** Giáo trình *Chủ nghĩa xã hội khoa học* (Dành cho bậc đại học hệ không chuyên lý luận chính trị), Bộ Giáo dục và Đào tạo, NXB Chính trị quốc gia Sự thật, Hà Nội, 2021.
- **ThreeUI Bookshelf Module:** Dựa trên thiết kế và mã nguồn nền tảng của ThreeUI, được tinh chỉnh, tối ưu hóa lifecycle và bản địa hóa 100% tiếng Việt học thuật bởi nhóm phát triển.
- **Giấy phép mã nguồn:** MIT License.
