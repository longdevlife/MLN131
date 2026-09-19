import type { PresentationScene } from './types';

export const part1Scenes: PresentationScene[] = [
  {
    id: 'p1-s0',
    chapterId: 'part-1',
    order: 0,
    kicker: 'Phần thứ nhất',
    title: 'Khái luận về cơ cấu xã hội – giai cấp',
    subtitle: 'Khái niệm · Vị trí · Sự biến đổi có tính quy luật',
    body: [
      'Trong hệ thống xã hội, cơ cấu xã hội – giai cấp giữ vị trí quan trọng hàng đầu và có ảnh hưởng mạnh tới các loại hình cơ cấu xã hội khác trong thời kỳ quá độ lên chủ nghĩa xã hội.',
    ],
    visual: {
      id: 'paper',
      variant: 'leather-folio',
    },
    beats: [
      {
        id: 'p1-s0-b0',
        label: 'Mở đầu chương',
        durationMs: 800,
      },
      {
        id: 'p1-s0-b1',
        label: 'Đặt 3 vấn đề trọng tâm',
        emphasis: ['core-questions'],
        durationMs: 700,
      },
    ],
    speakerNotes: [
      'Giới thiệu tổng quan Phần I của Chương 5: Cơ cấu xã hội - giai cấp và liên minh giai cấp, tầng lớp trong thời kỳ quá độ lên CNXH.',
      'Nhấn mạnh 3 câu hỏi xuyên suốt: (1) Cơ cấu xã hội - giai cấp là gì? (2) Vị trí của nó thế nào trong hệ thống xã hội? (3) Quy luật biến đổi trong thời kỳ quá độ ra sao?',
    ],
    sourceNote: 'Giáo trình Chủ nghĩa xã hội khoa học, 2021, Chương 5, Mục I',
    transitionIn: 'book-open',
  },
  {
    id: 'p1-s1',
    chapterId: 'part-1',
    order: 1,
    kicker: '1. Khái niệm cơ bản',
    title: 'Cơ cấu xã hội là gì?',
    subtitle: 'Hệ thống các cộng đồng người cùng toàn bộ các mối quan hệ xã hội',
    body: [
      'Cơ cấu xã hội là những cộng đồng người cùng toàn bộ những mối quan hệ xã hội do sự tác động lẫn nhau của các cộng đồng ấy tạo nên.',
    ],
    labels: [
      { id: 'node-dancu', text: 'Dân cư', sub: 'Lãnh thổ / Địa bàn sinh sống' },
      { id: 'node-nghenghiep', text: 'Nghề nghiệp', sub: 'Phân công lao động xã hội' },
      { id: 'node-giaicap', text: 'Giai cấp', sub: 'Địa vị kinh tế - xã hội' },
      { id: 'node-dantoc', text: 'Dân tộc', sub: 'Quan hệ tộc người / Bản sắc' },
      { id: 'node-tongiao', text: 'Tôn giáo', sub: 'Niềm tin & Sinh hoạt tâm linh' },
    ],
    visual: {
      id: 'constellation',
      variant: 'social-network',
      props: {
        nodeCount: 5,
        interactive: true,
      },
    },
    beats: [
      {
        id: 'p1-s1-b0',
        label: 'Xuất hiện 5 cộng đồng xã hội',
        reveal: ['nodes'],
        durationMs: 600,
      },
      {
        id: 'p1-s1-b1',
        label: 'Hình thành mạng lưới liên kết',
        reveal: ['links'],
        durationMs: 800,
      },
      {
        id: 'p1-s1-b2',
        label: 'Định nghĩa cơ cấu xã hội cốt lõi',
        reveal: ['definition-card'],
        emphasis: ['definition'],
        durationMs: 700,
      },
    ],
    speakerNotes: [
      'Nhắc lại: Xã hội không phải là tập hợp rời rạc các cá nhân đơn lẻ.',
      'Beat 1: Chỉ ra 5 phân hệ cộng đồng cơ bản: dân cư, nghề nghiệp, giai cấp, dân tộc, tôn giáo.',
      'Beat 2: Nhấn mạnh sự tương tác qua lại giữa các phân hệ tạo thành mạng lưới quan hệ xã hội.',
      'Beat 3: Khắc sâu công thức: Cơ cấu xã hội = Các cộng đồng người + Các mối quan hệ xã hội giữa họ.',
    ],
    sourceNote: 'Giáo trình Chủ nghĩa xã hội khoa học, 2021, Chương 5, Mục I.1',
    transitionIn: 'fade',
  },
  {
    id: 'p1-s2',
    chapterId: 'part-1',
    order: 2,
    kicker: '2. Bản chất cấu trúc',
    title: 'Cơ cấu xã hội – giai cấp là gì?',
    subtitle: 'Hệ thống các giai cấp, tầng lớp và 4 chiều kích quan hệ sản xuất',
    body: [
      'Cơ cấu xã hội – giai cấp là hệ thống các giai cấp, tầng lớp xã hội tồn tại khách quan trong một chế độ xã hội nhất định, thông qua 4 mối quan hệ cốt lõi: sở hữu tư liệu sản xuất, tổ chức quản lý sản xuất, địa vị chính trị – xã hội, và phân phối sản phẩm lao động / thu nhập.',
    ],
    visual: {
      id: 'class-relations',
    },
    beats: [
      { id: 'p1-s2-b0', label: 'Cụm giai cấp, tầng lớp xã hội khách quan' },
      { id: 'p1-s2-b1', label: '4 chiều kích quan hệ kinh tế - xã hội' },
    ],
    speakerNotes: [
      'Phân tích theo định nghĩa giai cấp kinh điển của V.I.Lênin gắn liền với 4 chiều kích: (1) Quan hệ sở hữu TLSX; (2) Vai trò tổ chức quản lý lao động; (3) Địa vị chính trị - xã hội; (4) Phương thức và quy mô phân phối thu nhập.',
    ],
    sourceNote: 'Giáo trình Chủ nghĩa xã hội khoa học, 2021, Chương 5, Mục I.1',
  },
  {
    id: 'p1-s3',
    chapterId: 'part-1',
    order: 3,
    kicker: '3. Vị trí trung tâm & Tác động qua lại',
    title: 'Vị trí của cơ cấu xã hội – giai cấp',
    subtitle: 'Giữ vị trí quan trọng hàng đầu trong mối quan hệ biện chứng hai chiều',
    body: [
      'Cơ cấu xã hội – giai cấp giữ vị trí quan trọng hàng đầu, có ảnh hưởng mạnh tới các loại hình cơ cấu xã hội khác, đồng thời chịu sự tác động trở lại của cơ cấu dân tộc, tôn giáo, dân số và nghề nghiệp.',
      'Không được tuyệt đối hóa vai trò của cơ cấu xã hội – giai cấp và xem nhẹ các loại hình cơ cấu xã hội khác.',
    ],
    visual: {
      id: 'orbital-centrality',
    },
    beats: [
      { id: 'p1-s3-b0', label: 'Hạt nhân trung tâm hàng đầu' },
      { id: 'p1-s3-b1', label: 'Tác động biện chứng hai chiều' },
    ],
    speakerNotes: [
      'Nhấn mạnh nguyên lý biện chứng: Cơ cấu xã hội - giai cấp giữ vị trí trọng yếu hàng đầu nhưng tồn tại trong mối tác động qua lại với các cơ cấu khác.',
      'Cảnh báo sai lầm: Không được tuyệt đối hóa vai trò của cơ cấu xã hội – giai cấp và xem nhẹ các loại hình cơ cấu xã hội khác.',
    ],
    sourceNote: 'Giáo trình Chủ nghĩa xã hội khoa học, 2021, Chương 5, Mục I.1',
  },
  {
    id: 'p1-s4',
    chapterId: 'part-1',
    order: 4,
    kicker: '4. Sự biến đổi có tính quy luật — Xu hướng 1',
    title: 'Gắn liền và bị quy định bởi cơ cấu kinh tế',
    subtitle: 'Sự biến đổi của cơ cấu xã hội – giai cấp vận động cùng cơ cấu kinh tế',
    body: [
      'Cơ cấu xã hội – giai cấp biến đổi gắn liền và bị quy định bởi sự biến đổi của cơ cấu kinh tế trong thời kỳ quá độ lên chủ nghĩa xã hội.',
    ],
    visual: {
      id: 'structure-flow',
    },
    beats: [
      { id: 'p1-s4-b0', label: 'Cơ cấu kinh tế nhiều thành phần chuyển dịch' },
      { id: 'p1-s4-b1', label: 'Cơ cấu xã hội - giai cấp biến đổi tương ứng' },
    ],
    speakerNotes: [
      'Xu hướng 1: Khi cơ cấu kinh tế chuyển dịch (công nghiệp hóa, hiện đại hóa, kinh tế thị trường định hướng XHCN), cơ cấu giai tầng cũng biến đổi theo.',
    ],
    sourceNote: 'Giáo trình Chủ nghĩa xã hội khoa học, 2021, Chương 5, Mục I.2',
  },
  {
    id: 'p1-s5',
    chapterId: 'part-1',
    order: 5,
    kicker: '5. Sự biến đổi có tính quy luật — Xu hướng 2',
    title: 'Biến đổi phức tạp, đa dạng và xuất hiện tầng lớp mới',
    subtitle: 'Nền kinh tế nhiều thành phần tạo nên diện mạo xã hội đa tầng',
    body: [
      'Cơ cấu xã hội – giai cấp biến đổi phức tạp, đa dạng, làm xuất hiện các tầng lớp xã hội mới như đội ngũ doanh nhân, tầng lớp tiểu chủ, người làm nghề tự do.',
    ],
    visual: {
      id: 'diversification',
    },
    beats: [
      { id: 'p1-s5-b0', label: 'Phân hóa từ các giai cấp truyền thống' },
      { id: 'p1-s5-b1', label: 'Hình thành và phát triển các tầng lớp xã hội mới' },
    ],
    speakerNotes: [
      'Xu hướng 2: Sự tồn tại của nhiều thành phần kinh tế tất yếu dẫn đến sự phân hóa và xuất hiện các tầng lớp mới.',
    ],
    sourceNote: 'Giáo trình Chủ nghĩa xã hội khoa học, 2021, Chương 5, Mục I.2',
  },
  {
    id: 'p1-s6',
    chapterId: 'part-1',
    order: 6,
    kicker: '6. Sự biến đổi có tính quy luật — Xu hướng 3',
    title: 'Vừa đấu tranh vừa liên minh, từng bước xích lại gần nhau',
    subtitle: 'Hội tụ quanh lợi ích chung xây dựng chủ nghĩa xã hội',
    body: [
      'Cơ cấu xã hội – giai cấp biến đổi trong mối quan hệ vừa đấu tranh, vừa liên minh, từng bước dẫn đến sự xích lại gần nhau giữa các giai cấp, tầng lớp cơ bản trong xã hội.',
    ],
    visual: {
      id: 'convergence',
    },
    beats: [
      { id: 'p1-s6-b0', label: 'Giải quyết khác biệt lợi ích thông qua đấu tranh và đồng thuận' },
      { id: 'p1-s6-b1', label: 'Liên minh chặt chẽ và xích lại gần nhau vì mục tiêu CNXH' },
    ],
    speakerNotes: [
      'Xu hướng 3: Đấu tranh để khắc phục tiêu cực, phân hóa bất bình đẳng; liên minh để phát huy sức mạnh tổng hợp xây dựng CNXH.',
    ],
    sourceNote: 'Giáo trình Chủ nghĩa xã hội khoa học, 2021, Chương 5, Mục I.2',
  },
  {
    id: 'p1-s7',
    chapterId: 'part-1',
    order: 7,
    kicker: '7. Chuyển tiếp sang Phần thứ hai',
    title: 'Cầu nối sang Liên minh giai cấp, tầng lớp',
    subtitle: 'Vì sao liên minh giai cấp, tầng lớp là đòi hỏi khách quan?',
    body: [
      'Khi các giai cấp vừa có khác biệt vừa xích lại gần nhau, vì sao liên minh công – nông – trí thức trở thành đòi hỏi khách quan quyết định thắng lợi của công cuộc xây dựng chủ nghĩa xã hội?',
    ],
    visual: {
      id: 'paper',
    },
    beats: [
      { id: 'p1-s7-b0', label: 'Tổng kết 3 quy luật biến đổi' },
      { id: 'p1-s7-b1', label: 'Mở đường sang Quyển II: Cơ sở lý luận của liên minh' },
    ],
    speakerNotes: ['Đúc kết Phần I và mở đường dẫn dắt sang Quyển II: Liên minh giai cấp, tầng lớp trong thời kỳ quá độ lên CNXH.'],
    sourceNote: 'Giáo trình Chủ nghĩa xã hội khoa học, 2021, Chương 5, Mục I',
    transitionOut: 'book-close',
  },
];
