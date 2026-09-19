import type { PresentationScene } from './types';

export const part2Scenes: PresentationScene[] = [
  {
    id: 'p2-s0',
    chapterId: 'part-2',
    order: 0,
    kicker: 'Phần thứ hai',
    title: 'Tính tất yếu của liên minh giai cấp, tầng lớp',
    subtitle: 'Giai cấp công nhân với giai cấp nông dân và tầng lớp trí thức',
    body: [
      'Liên minh giữa giai cấp công nhân với giai cấp nông dân và tầng lớp trí thức là một tất yếu khách quan về kinh tế, chính trị và văn hóa - xã hội.',
    ],
    visual: { id: 'paper' },
    beats: [
      { id: 'p2-s0-b0', label: 'Mở đầu phần II' },
    ],
    speakerNotes: ['Giới thiệu tính tất yếu khách quan của liên minh.'],
    sourceNote: 'Giáo trình CNXHKH 2021, Mục II',
  },
];
