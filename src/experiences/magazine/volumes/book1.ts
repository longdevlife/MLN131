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
        id: 'book1-p01-social-structure',
        kind: 'editorial',
        texture: '/magazine/book1/page-01.png',
        alt: 'Trang 01: Cơ cấu xã hội là gì?',
        sourceIds: ['giaoTrinh2021'],
      },
      back: {
        id: 'book1-p02-five-structures',
        kind: 'diagram',
        texture: '/magazine/book1/page-02.png',
        alt: 'Trang 02: Năm lát cắt của cơ cấu xã hội',
        sourceIds: ['giaoTrinh2021'],
      },
    },
    {
      id: 'book1-sheet-02',
      front: {
        id: 'book1-p03-class-social-structure',
        kind: 'editorial',
        texture: '/magazine/book1/page-03.png',
        alt: 'Trang 03: Một hệ thống các giai cấp và tầng lớp',
        sourceIds: ['giaoTrinh2021'],
      },
      back: {
        id: 'book1-p04-four-dimensions',
        kind: 'diagram',
        texture: '/magazine/book1/page-04.png',
        alt: 'Trang 04: Nhìn cấu trúc qua bốn quan hệ',
        sourceIds: ['giaoTrinh2021'],
      },
    },
    {
      id: 'book1-sheet-03',
      front: {
        id: 'book1-p05-position',
        kind: 'editorial',
        texture: '/magazine/book1/page-05.png',
        alt: 'Trang 05: Giữ vị trí quan trọng hàng đầu',
        sourceIds: ['giaoTrinh2021'],
      },
      back: {
        id: 'book1-p06-two-way',
        kind: 'editorial',
        texture: '/magazine/book1/page-06.png',
        alt: 'Trang 06: Quan trọng, nhưng không đứng một mình',
        sourceIds: ['giaoTrinh2021'],
      },
    },
    {
      id: 'book1-sheet-04',
      front: {
        id: 'book1-p07-trend-one',
        kind: 'editorial',
        texture: '/magazine/book1/page-07.png',
        alt: 'Trang 07: Kinh tế thay đổi, cơ cấu giai cấp thay đổi',
        sourceIds: ['giaoTrinh2021'],
      },
      back: {
        id: 'book1-p08-economic-chain',
        kind: 'diagram',
        texture: '/magazine/book1/page-08.png',
        alt: 'Trang 08: Từ cơ cấu kinh tế đến diện mạo giai tầng',
        sourceIds: ['giaoTrinh2021'],
      },
    },
    {
      id: 'book1-sheet-05',
      front: {
        id: 'book1-p09-trend-two',
        kind: 'editorial',
        texture: '/magazine/book1/page-09.png',
        alt: 'Trang 09: Phức tạp hơn, đa dạng hơn',
        sourceIds: ['giaoTrinh2021'],
      },
      back: {
        id: 'book1-p10-internal-differentiation',
        kind: 'diagram',
        texture: '/magazine/book1/page-10.png',
        alt: 'Trang 10: Khác biệt diễn ra cả bên trong mỗi giai tầng',
        sourceIds: ['giaoTrinh2021'],
      },
    },
    {
      id: 'book1-sheet-06',
      front: {
        id: 'book1-p11-trend-three',
        kind: 'editorial',
        texture: '/magazine/book1/page-11.png',
        alt: 'Trang 11: Vừa đấu tranh, vừa liên minh',
        sourceIds: ['giaoTrinh2021'],
      },
      back: {
        id: 'book1-p12-draw-closer',
        kind: 'editorial',
        texture: '/magazine/book1/page-12.png',
        alt: 'Trang 12: Thu hẹp những khoảng cách bất hợp lý',
        sourceIds: ['giaoTrinh2021'],
      },
    },
    {
      id: 'book1-sheet-07',
      front: {
        id: 'book1-p13-synthesis',
        kind: 'diagram',
        texture: '/magazine/book1/page-13.png',
        alt: 'Trang 13: Ba chuyển động nối thành một chuỗi',
        sourceIds: ['giaoTrinh2021'],
      },
      back: {
        id: 'book1-p14-bridge',
        kind: 'transition',
        texture: '/magazine/book1/page-14.png',
        alt: 'Trang 14: Khi lợi ích vừa gặp nhau vừa khác nhau…',
        sourceIds: ['giaoTrinh2021'],
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
