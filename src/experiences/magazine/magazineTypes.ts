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
  id: 'part1' | 'part2' | 'part3';
  roman: 'I' | 'II' | 'III';
  title: string;
  subtitle?: string;
  coverFront: MagazinePageContent;
  sheets: MagazineSheet[];
  coverBack: MagazinePageContent;
  theme: MagazineTheme;
}

export type MagazineEditorialLayout =
  | 'definition'
  | 'constellation'
  | 'four-dimensions'
  | 'orbital'
  | 'flow'
  | 'branching'
  | 'convergence'
  | 'synthesis'
  | 'transition';

export type Book1Visual =
  | {
      kind: 'equation';
      terms: string[];
      result: string;
    }
  | {
      kind: 'constellation';
      center: string;
      nodes: { id: string; label: string; highlighted?: boolean }[];
      highlightedCaption?: string;
    }
  | {
      kind: 'class-system';
      center: string;
      nodes: string[];
      caption?: string;
    }
  | {
      kind: 'four-dimensions';
      dimensions: string[];
    }
  | {
      kind: 'orbital';
      center: string;
      nodes: string[];
      direction: 'outward' | 'reciprocal';
      caption: string;
    }
  | {
      kind: 'flow';
      steps: string[];
    }
  | {
      kind: 'branching';
      heading: string;
      items: string[];
    }
  | {
      kind: 'convergence';
      leftLabel: string;
      leftTitle: string;
      rightLabel: string;
      rightTitle: string;
      convergenceLabel: string;
    }
  | {
      kind: 'synthesis';
      steps: string[];
    }
  | {
      kind: 'transition';
      label: string;
    };

export interface Book1EditorialPage {
  number: number;
  id: string;
  kicker: string;
  headline: string;
  body?: string;
  labels?: string[];
  footer?: string;
  layout: MagazineEditorialLayout;
  sourceIds: string[];
  visual?: Book1Visual;
}
