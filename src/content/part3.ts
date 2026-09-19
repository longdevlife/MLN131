import type { PresentationScene } from './types';

export const part3Scenes: PresentationScene[] = [
  {
    id: 'p3-s0',
    chapterId: 'part-3',
    order: 0,
    kicker: 'Phần thứ ba',
    title: 'Cơ cấu xã hội – giai cấp và liên minh tại Việt Nam',
    subtitle: 'Đặc điểm trong thời kỳ đổi mới và phát triển kinh tế thị trường',
    body: [
      'Phân tích sự biến đổi của các giai cấp, tầng lớp xã hội tại Việt Nam trong thời kỳ quá độ lên chủ nghĩa xã hội.',
    ],
    visual: { id: 'paper' },
    beats: [
      { id: 'p3-s0-b0', label: 'Mở đầu phần III' },
    ],
    speakerNotes: ['Đặc điểm thực tiễn Việt Nam hiện nay.'],
    sourceNote: 'Giáo trình CNXHKH 2021, Mục III',
  },
];
