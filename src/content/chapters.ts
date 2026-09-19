import type { Chapter } from './types';
import { part1Scenes } from './part1';
import { part2Scenes } from './part2';
import { part3Scenes } from './part3';
import { part4Scenes } from './part4';

export const chapters: Chapter[] = [
  {
    id: 'part-1',
    index: 0,
    roman: 'I',
    title: 'Cơ cấu xã hội – giai cấp trong thời kỳ quá độ',
    shortTitle: 'Cơ cấu xã hội – giai cấp',
    discipline: 'Khái luận & Quy luật',
    description: 'Khái niệm, vị trí và các quy luật biến đổi trong TKQĐ.',
    deck: 'Khái luận về cơ cấu xã hội - giai cấp trong thời kỳ quá độ lên chủ nghĩa xã hội: vị trí trung tâm chi phối các cơ cấu xã hội khác và xu hướng biến đổi có tính quy luật.',
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
    title: 'Tính tất yếu của liên minh giai cấp, tầng lớp',
    shortTitle: 'Tính tất yếu của liên minh',
    discipline: 'Cơ sở lý luận & thực tiễn',
    description: 'Yêu cầu khách quan về kinh tế, chính trị và văn hóa - xã hội.',
    deck: 'Tính tất yếu và nội dung của liên minh giai cấp công nhân với giai cấp nông dân và tầng lớp trí thức trong thời kỳ quá độ lên CNXH.',
    binding: 'Burnt-orange cloth · antique-gold foil',
    theme: 'Tính tất yếu của liên minh',
    color: '#c24d24',
    foil: '#efc16d',
    scenes: part2Scenes,
  },
  {
    id: 'part-3',
    index: 2,
    roman: 'III',
    title: 'Việt Nam hiện nay: Thực tiễn & Biến đổi',
    shortTitle: 'Việt Nam hiện nay',
    discipline: 'Thực tiễn & Biến đổi',
    description: 'Đặc điểm cơ cấu giai cấp và liên minh trong bối cảnh đổi mới.',
    deck: 'Cơ cấu xã hội - giai cấp và liên minh giai cấp, tầng lớp trong thời kỳ đổi mới và phát triển kinh tế thị trường định hướng XHCN tại Việt Nam.',
    binding: 'Forest-emerald cloth · warm-gold foil',
    theme: 'Thực tiễn Việt Nam',
    color: '#1d3e35',
    foil: '#d4af37',
    scenes: part3Scenes,
  },
  {
    id: 'part-4',
    index: 3,
    roman: 'IV',
    title: 'Phương hướng & giải pháp tăng cường liên minh',
    shortTitle: 'Phương hướng & giải pháp',
    discipline: 'Định hướng chiến lược',
    description: 'Hệ thống giải pháp hoàn thiện cơ cấu và củng cố khối liên minh vững chắc.',
    deck: 'Phương hướng và các giải pháp cơ bản nhằm tăng cường khối đại đoàn kết toàn dân tộc và liên minh giai cấp, tầng lớp trong giai đoạn hiện nay.',
    binding: 'Crimson velvet cloth · muted-gold foil',
    theme: 'Phương hướng & Giải pháp',
    color: '#5c1d24',
    foil: '#dfb15b',
    scenes: part4Scenes,
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
