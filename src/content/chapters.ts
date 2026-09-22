import type { Chapter } from './types';
import { part1Scenes } from './part1';
import { part2Scenes } from './part2';
import { part3Scenes } from './part3';

export const chapters: Chapter[] = [
  {
    id: 'part-1',
    index: 0,
    roman: 'I',
    title: 'Cơ cấu xã hội – giai cấp trong thời kỳ quá độ',
    shortTitle: 'Cơ cấu xã hội – giai cấp',
    discipline: 'Khái luận & Quy luật',
    description: 'Khái niệm, vị trí và sự biến đổi có tính quy luật trong thời kỳ quá độ.',
    deck: 'Khái luận về cơ cấu xã hội – giai cấp trong thời kỳ quá độ lên chủ nghĩa xã hội.',
    binding: 'Ultramarine cloth · copper foil',
    theme: 'Cơ cấu xã hội – giai cấp',
    color: '#182a43',
    foil: '#c87046',
    scenes: part1Scenes,
  },
  {
    id: 'part-2',
    index: 1,
    roman: 'II',
    title: 'Liên minh giai cấp, tầng lớp trong thời kỳ quá độ',
    shortTitle: 'Liên minh giai cấp, tầng lớp',
    discipline: 'Cơ sở & nội dung liên minh',
    description: 'Tính tất yếu và các phương diện kinh tế, chính trị, văn hóa – xã hội.',
    deck: 'Liên minh giai cấp, tầng lớp trong thời kỳ quá độ lên chủ nghĩa xã hội.',
    binding: 'Burnt-orange cloth · antique-gold foil',
    theme: 'Liên minh giai cấp, tầng lớp',
    color: '#c24d24',
    foil: '#efc16d',
    scenes: part2Scenes,
  },
  {
    id: 'part-3',
    index: 2,
    roman: 'III',
    title: 'Cơ cấu xã hội – giai cấp và liên minh ở Việt Nam',
    shortTitle: 'Việt Nam: cơ cấu & liên minh',
    discipline: 'Thực tiễn & phương hướng',
    description: 'Cơ cấu xã hội – giai cấp, liên minh và phương hướng củng cố ở Việt Nam.',
    deck: 'Thực tiễn Việt Nam trong thời kỳ quá độ, bao gồm cơ cấu xã hội – giai cấp, liên minh giai cấp, tầng lớp và phương hướng, giải pháp.',
    binding: 'Forest-emerald cloth · warm-gold foil',
    theme: 'Thực tiễn Việt Nam',
    color: '#1d3e35',
    foil: '#d4af37',
    scenes: part3Scenes,
  },
];

export function getChapter(index: number): Chapter | undefined {
  return chapters[index];
}

export function getAllScenes(): Array<{ chapter: Chapter; scene: Chapter['scenes'][0] }> {
  return chapters.flatMap((chapter) =>
    chapter.scenes.map((scene) => ({ chapter, scene }))
  );
}
