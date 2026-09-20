import type { MagazineVolume } from '../magazineTypes';

export const book1Volume: MagazineVolume = {
  id: 'part1',
  roman: 'I',
  title: 'Cơ cấu xã hội – giai cấp',
  subtitle: 'Chương 5 · Chủ nghĩa xã hội khoa học',
  coverFront: {
    id: 'book1-cover-front',
    kind: 'cover',
    texture: '/magazine/book1/cover-front.png',
    alt: 'Bìa Quyển I: Cơ cấu xã hội – giai cấp',
  },
  sheets: [
    {
      id: 'book1-sheet-01',
      front: {
        id: 'book1-prototype-01',
        kind: 'editorial',
        texture: '/magazine/book1/spread-01-front.png',
        alt: 'Trang thử nghiệm editorial thứ nhất',
      },
      back: {
        id: 'book1-prototype-02',
        kind: 'editorial',
        texture: '/magazine/book1/spread-01-back.png',
        alt: 'Trang thử nghiệm editorial thứ hai',
      },
    },
    {
      id: 'book1-sheet-02',
      front: {
        id: 'book1-prototype-03',
        kind: 'editorial',
        texture: '/magazine/book1/spread-02-front.png',
        alt: 'Trang thử nghiệm editorial thứ ba',
      },
      back: {
        id: 'book1-prototype-04',
        kind: 'editorial',
        texture: '/magazine/book1/spread-02-back.png',
        alt: 'Trang thử nghiệm editorial thứ tư',
      },
    },
  ],
  coverBack: {
    id: 'book1-cover-back',
    kind: 'back-cover',
    texture: '/magazine/book1/cover-back.png',
    alt: 'Bìa sau Quyển I',
  },
  theme: {
    shellBackground: '#0B0D10',
    paperTone: '#F1E7D2',
    accent: '#C8A86A',
    secondaryAccent: '#A96D45',
  },
};
