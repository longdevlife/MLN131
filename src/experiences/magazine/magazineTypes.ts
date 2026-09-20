export type MagazineViewMode = 'showcase' | 'reading';

export type MagazinePageKind =
  | 'cover'
  | 'editorial'
  | 'diagram'
  | 'transition'
  | 'back-cover';

export interface MagazineTheme {
  shellBackground: string;
  paperTone: string;
  accent: string;
  secondaryAccent: string;
}

export interface MagazinePageContent {
  id: string;
  kind: MagazinePageKind;
  texture: string;
  alt: string;
  sourceIds?: string[];
}

export interface MagazineSheet {
  id: string;
  front: MagazinePageContent;
  back: MagazinePageContent;
}

export interface MagazineVolume {
  id: 'part1' | 'part2' | 'part3' | 'part4';
  roman: 'I' | 'II' | 'III' | 'IV';
  title: string;
  subtitle?: string;
  coverFront: MagazinePageContent;
  sheets: MagazineSheet[];
  coverBack: MagazinePageContent;
  theme: MagazineTheme;
}
