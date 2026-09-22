import type { MagazineVolume } from '../magazineTypes';

export const book2Volume: MagazineVolume = {
  id: 'part2',
  roman: 'II',
  title: 'Liên minh giai cấp, tầng lớp',
  subtitle: 'Chương 5 · Chủ nghĩa xã hội khoa học',
  coverFront: { id: 'book2-cover-front', kind: 'cover', texture: '/magazine/book2/cover-front.svg', alt: 'Bìa Quyển II: Liên minh giai cấp, tầng lớp' },
  sheets: [
    {
      id: 'book2-sheet-01',
      front: { id: 'book2-p01-scope', kind: 'editorial', texture: '/magazine/book2/page-01.svg', alt: 'Trang 01: Tính tất yếu của liên minh' },
      back: { id: 'book2-p02-dimensions', kind: 'diagram', texture: '/magazine/book2/page-02.svg', alt: 'Trang 02: Kinh tế, chính trị, văn hóa – xã hội' },
    },
    {
      id: 'book2-sheet-02',
      front: { id: 'book2-p03-alliance', kind: 'editorial', texture: '/magazine/book2/page-03.svg', alt: 'Trang 03: Liên minh giai cấp, tầng lớp' },
      back: { id: 'book2-p04-editorial-status', kind: 'transition', texture: '/magazine/book2/page-04.svg', alt: 'Trang 04: Trạng thái biên tập Quyển II' },
    },
  ],
  coverBack: { id: 'book2-cover-back', kind: 'back-cover', texture: '/magazine/book2/cover-back.svg', alt: 'Bìa sau Quyển II' },
  theme: { shellBackground: '#100D0B', paperTone: '#F3E7D6', accent: '#EFC16D', secondaryAccent: '#C24D24' },
};
