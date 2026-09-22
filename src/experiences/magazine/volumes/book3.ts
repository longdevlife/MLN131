import type { MagazineVolume } from '../magazineTypes';

export const book3Volume: MagazineVolume = {
  id: 'part3',
  roman: 'III',
  title: 'Cơ cấu xã hội – giai cấp và liên minh ở Việt Nam',
  subtitle: 'Chương 5 · Chủ nghĩa xã hội khoa học',
  coverFront: { id: 'book3-cover-front', kind: 'cover', texture: '/magazine/book3/cover-front.svg', alt: 'Bìa Quyển III: Cơ cấu xã hội – giai cấp và liên minh ở Việt Nam' },
  sheets: [
    {
      id: 'book3-sheet-01',
      front: { id: 'book3-p01-vietnam', kind: 'editorial', texture: '/magazine/book3/page-01.svg', alt: 'Trang 01: Việt Nam trong thời kỳ quá độ' },
      back: { id: 'book3-p02-forces', kind: 'diagram', texture: '/magazine/book3/page-02.svg', alt: 'Trang 02: Các lực lượng chủ yếu' },
    },
    {
      id: 'book3-sheet-02',
      front: { id: 'book3-p03-directions', kind: 'editorial', texture: '/magazine/book3/page-03.svg', alt: 'Trang 03: Phương hướng và giải pháp' },
      back: { id: 'book3-p04-editorial-status', kind: 'transition', texture: '/magazine/book3/page-04.svg', alt: 'Trang 04: Trạng thái biên tập Quyển III' },
    },
  ],
  coverBack: { id: 'book3-cover-back', kind: 'back-cover', texture: '/magazine/book3/cover-back.svg', alt: 'Bìa sau Quyển III' },
  theme: { shellBackground: '#08120F', paperTone: '#E8F0EC', accent: '#D4AF37', secondaryAccent: '#4D8A76' },
};
