export type VisualId =
  | 'bookshelf'
  | 'paper'
  | 'constellation'
  | 'class-relations'
  | 'orbital-centrality'
  | 'structure-flow'
  | 'diversification'
  | 'convergence'
  | 'part1-bridge'
  | 'none';

export interface VisualLabel {
  id: string;
  text: string;
  sub?: string;
  role?: string;
  category?: string;
  tag?: string;
}

export interface SceneVisualConfig {
  id: VisualId;
  variant?: string;
  props?: Record<string, string | number | boolean>;
  quality?: 'auto' | 'high' | 'medium' | 'safe';
}

export interface SceneBeat {
  id: string;
  label?: string;
  reveal?: string[];
  hide?: string[];
  emphasis?: string[];
  animation?: string;
  durationMs?: number;
  displayText?: string;
  speakerNote?: string;
  callout?: string;
}

export interface PresentationScene {
  id: string;
  chapterId: string;
  order: number;
  kicker?: string;
  title: string;
  subtitle?: string;
  body?: string[];
  labels?: Array<{ id: string; text: string; sub?: string }>;
  visualLabels?: VisualLabel[];
  visualCopy?: Record<string, string>;
  visual: SceneVisualConfig;
  beats: SceneBeat[];
  speakerNotes?: string[];
  sourceNote?: string;
  transitionIn?: 'book-open' | 'fade' | 'push' | 'zoom' | 'morph';
  transitionOut?: 'book-close' | 'fade' | 'push' | 'zoom' | 'morph';
}

export interface Chapter {
  id: string;
  index: number;
  roman: string;
  title: string;
  shortTitle: string;
  discipline: string;
  description: string;
  deck: string;
  binding: string;
  theme: string;
  color: string;
  foil: string;
  scenes: PresentationScene[];
}

export interface SourceRef {
  id: string;
  short: string;
  full: string;
  url?: string;
}
