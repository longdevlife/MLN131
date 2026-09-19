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
      'Cơ cấu xã hội – giai cấp giữ vị trí trung tâm, chi phối mọi quan hệ cộng đồng trong thời kỳ quá độ lên chủ nghĩa xã hội.',
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
      'Giới thiệu tổng quan Phần I của Chương 5.',
      'Nhấn mạnh 3 câu hỏi xuyên suốt: (1) Cơ cấu xã hội - giai cấp là gì? (2) Vị trí thế nào trong hệ thống xã hội? (3) Biến đổi theo quy luật nào?',
    ],
    sourceNote: 'Giáo trình CNXHKH 2021, Chương 5, Mục I.1',
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
    sourceNote: 'Giáo trình CNXHKH 2021, tr. 142',
    transitionIn: 'fade',
  },
  // Architecture placeholders for Part 1 expansion: P1.S2 - P1.S7
  {
    id: 'p1-s2',
    chapterId: 'part-1',
    order: 2,
    kicker: '2. Bản chất cấu trúc',
    title: 'Cơ cấu xã hội – giai cấp là gì?',
    subtitle: 'Hệ thống các giai cấp, tầng lớp và mối quan hệ giữa chúng',
    body: [
      'Là hệ thống các giai cấp, tầng lớp xã hội tồn tại khách quan trong một chế độ xã hội nhất định, thông qua những mối quan hệ về sở hữu TLSX, tổ chức quản lý, và phân phối sản phẩm.',
    ],
    visual: {
      id: 'class-relations',
    },
    beats: [
      { id: 'p1-s2-b0', label: 'Cụm giai tầng xã hội' },
      { id: 'p1-s2-b1', label: 'Bốn trục quan hệ sản xuất' },
    ],
    speakerNotes: ['Phân tích theo định nghĩa giai cấp kinh điển của V.I.Lênin.'],
    sourceNote: 'Giáo trình CNXHKH 2021, tr. 143',
  },
  {
    id: 'p1-s3',
    chapterId: 'part-1',
    order: 3,
    kicker: '3. Vị trí trung tâm',
    title: 'Vì sao cơ cấu giai cấp giữ vị trí trung tâm?',
    subtitle: 'Gắn liền với quan hệ sản xuất và chi phối các cơ cấu khác',
    body: [
      'Cơ cấu xã hội - giai cấp liên quan trực tiếp đến quyền lực chính trị và quyền sở hữu TLSX, quy định tính chất của các loại hình cơ cấu xã hội khác.',
    ],
    visual: {
      id: 'orbital-centrality',
    },
    beats: [
      { id: 'p1-s3-b0', label: 'Hạt nhân trung tâm' },
      { id: 'p1-s3-b1', label: 'Các phân hệ vệ tinh' },
    ],
    speakerNotes: ['Lưu ý: Trung tâm chi phối nhưng không tuyệt đối hóa hay phủ nhận các cơ cấu khác.'],
    sourceNote: 'Giáo trình CNXHKH 2021, tr. 144',
  },
  {
    id: 'p1-s4',
    chapterId: 'part-1',
    order: 4,
    kicker: '4. Quy luật 1',
    title: 'Kinh tế quyết định sự biến đổi',
    subtitle: 'Sự thay đổi của cơ cấu kinh tế dẫn đến chuyển dịch cơ cấu giai cấp',
    body: [
      'Cơ cấu kinh tế nhiều thành phần quy định tính đa dạng và biến đổi năng động của cơ cấu xã hội - giai cấp trong thời kỳ quá độ.',
    ],
    visual: {
      id: 'structure-flow',
    },
    beats: [
      { id: 'p1-s4-b0', label: 'Dòng chuyển hóa kinh tế' },
      { id: 'p1-s4-b1', label: 'Dòng chuyển dịch giai tầng' },
    ],
    speakerNotes: ['Phương thức sản xuất thay đổi kéo theo sự thay đổi về địa vị giai cấp.'],
    sourceNote: 'Giáo trình CNXHKH 2021, tr. 146',
  },
  {
    id: 'p1-s5',
    chapterId: 'part-1',
    order: 5,
    kicker: '5. Quy luật 2',
    title: 'Xu hướng đa dạng hóa & phức tạp',
    subtitle: 'Xuất hiện các nhóm xã hội và tầng lớp lao động mới',
    body: [
      'Phát triển kinh tế thị trường làm nảy sinh sự phân hóa nội bộ và hình thành các tầng lớp mới như doanh nhân, tiểu chủ, lao động tự do.',
    ],
    visual: {
      id: 'diversification',
    },
    beats: [
      { id: 'p1-s5-b0', label: 'Cơ cấu truyền thống' },
      { id: 'p1-s5-b1', label: 'Phân hóa và xuất hiện tầng lớp mới' },
    ],
    speakerNotes: ['Sự phân tầng xã hội là hiện tượng khách quan.'],
    sourceNote: 'Giáo trình CNXHKH 2021, tr. 148',
  },
  {
    id: 'p1-s6',
    chapterId: 'part-1',
    order: 6,
    kicker: '6. Quy luật 3',
    title: 'Vừa đấu tranh vừa liên minh, xích lại gần nhau',
    subtitle: 'Xóa bỏ áp bức, hội tụ quanh lợi ích cơ bản xây dựng CNXH',
    body: [
      'Các giai cấp, tầng lớp vừa giải quyết những khác biệt về lợi ích, vừa liên minh chặt chẽ vì mục tiêu chung độc lập dân tộc và CNXH.',
    ],
    visual: {
      id: 'convergence',
    },
    beats: [
      { id: 'p1-s6-b0', label: 'Khác biệt lợi ích ban đầu' },
      { id: 'p1-s6-b1', label: 'Hội tụ liên minh' },
    ],
    speakerNotes: ['Đấu tranh và liên minh diễn ra đan xen, hướng tới sự đồng thuận xã hội.'],
    sourceNote: 'Giáo trình CNXHKH 2021, tr. 150',
  },
  {
    id: 'p1-s7',
    chapterId: 'part-1',
    order: 7,
    kicker: '7. Chuyển tiếp',
    title: 'Cầu nối sang Quyển II',
    subtitle: 'Vì sao liên minh giai cấp, tầng lớp là đòi hỏi khách quan?',
    body: [
      'Khi các giai cấp vừa có lợi ích chung vừa có khác biệt, vì sao liên minh trở thành yêu cầu khách quan quyết định thắng lợi của cách mạng XHCN?',
    ],
    visual: {
      id: 'paper',
    },
    beats: [
      { id: 'p1-s7-b0', label: 'Câu hỏi chuyển tiếp' },
    ],
    speakerNotes: ['Đúc kết Phần 1 và mở đường dẫn dắt sang Quyển 2.'],
    sourceNote: 'Giáo trình CNXHKH 2021, tr. 152',
    transitionOut: 'book-close',
  },
];
