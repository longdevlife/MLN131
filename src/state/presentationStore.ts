import { create } from 'zustand';
import { chapters } from '../content/chapters';

export type ViewMode = 'cover' | 'library' | 'chapter';
export type QualityTier = 'high' | 'medium' | 'safe';

export interface PresentationState {
  viewMode: ViewMode;
  chapterIndex: number;
  sceneIndex: number;
  beatIndex: number;
  direction: 1 | -1;
  isTransitioning: boolean;
  isBlackout: boolean;
  isFullscreen: boolean;
  reducedMotion: boolean;
  qualityTier: QualityTier;
  presenterStartedAt: number;

  isSourceDrawerOpen: boolean;
  openSourceDrawer: () => void;
  closeSourceDrawer: () => void;
  toggleSourceDrawer: () => void;
  // Navigation actions
  startPresentation: () => void;
  openCover: () => void;
  openLibrary: () => void;
  openChapter: (chapterIndex: number, sceneIndex?: number) => void;
  next: () => void;
  prev: () => void;
  jumpToChapter: (index: number) => void;
  jumpToScene: (sceneId: string) => void;
  setBlackout: (value: boolean) => void;
  toggleBlackout: () => void;
  resetScene: () => void;
  setFullscreen: (value: boolean) => void;
  setQualityTier: (tier: QualityTier) => void;
  setReducedMotion: (value: boolean) => void;
  setTransitioning: (value: boolean) => void;
}

// Check safe mode from query params
const getInitialSafeMode = (): QualityTier => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('safe') === '1') return 'safe';
  }
  return 'high';
};

export const usePresentationStore = create<PresentationState>((set, get) => ({
  viewMode: 'cover',
  chapterIndex: 0,
  sceneIndex: 0,
  beatIndex: 0,
  direction: 1,
  isTransitioning: false,
  isBlackout: false,
  isFullscreen: false,
  reducedMotion: typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false,
  qualityTier: getInitialSafeMode(),
  presenterStartedAt: Date.now(),
  isSourceDrawerOpen: false,

  openSourceDrawer: () => set({ isSourceDrawerOpen: true }),
  closeSourceDrawer: () => set({ isSourceDrawerOpen: false }),
  toggleSourceDrawer: () => set((state) => ({ isSourceDrawerOpen: !state.isSourceDrawerOpen })),

  startPresentation: () => {
    set({ viewMode: 'library', direction: 1 });
  },

  openCover: () => {
    set({ viewMode: 'cover', direction: -1 });
  },

  openLibrary: () => {
    set({ viewMode: 'library', direction: -1 });
  },

  openChapter: (chapterIndex: number, sceneIndex = 0) => {
    const validChapterIndex = Math.max(0, Math.min(chapters.length - 1, chapterIndex));
    set({
      viewMode: 'chapter',
      chapterIndex: validChapterIndex,
      sceneIndex,
      beatIndex: 0,
      direction: 1,
    });
  },

  next: () => {
    const state = get();
    if (state.isBlackout) {
      set({ isBlackout: false });
      return;
    }

    if (state.viewMode === 'cover') {
      set({ viewMode: 'library', direction: 1 });
      return;
    }

    if (state.viewMode === 'library') {
      set({
        viewMode: 'chapter',
        chapterIndex: state.chapterIndex,
        sceneIndex: 0,
        beatIndex: 0,
        direction: 1,
      });
      return;
    }

    // In chapter mode
    const currentChapter = chapters[state.chapterIndex];
    if (!currentChapter) return;
    const currentScene = currentChapter.scenes[state.sceneIndex];
    if (!currentScene) return;

    const totalBeats = currentScene.beats.length;

    // Advance beat if remaining
    if (state.beatIndex < totalBeats - 1) {
      set({ beatIndex: state.beatIndex + 1, direction: 1 });
      return;
    }

    // Advance scene if remaining in chapter
    if (state.sceneIndex < currentChapter.scenes.length - 1) {
      set({
        sceneIndex: state.sceneIndex + 1,
        beatIndex: 0,
        direction: 1,
      });
      return;
    }

    // Advance to next chapter if remaining
    if (state.chapterIndex < chapters.length - 1) {
      set({
        chapterIndex: state.chapterIndex + 1,
        sceneIndex: 0,
        beatIndex: 0,
        direction: 1,
      });
      return;
    }

    // Reached the end of presentation, return to library overview
    set({ viewMode: 'library', direction: 1 });
  },

  prev: () => {
    const state = get();
    if (state.isBlackout) {
      set({ isBlackout: false });
      return;
    }

    if (state.viewMode === 'cover') return;

    if (state.viewMode === 'library') {
      set({ viewMode: 'cover', direction: -1 });
      return;
    }

    // In chapter mode
    // Rewind beat if > 0
    if (state.beatIndex > 0) {
      set({ beatIndex: state.beatIndex - 1, direction: -1 });
      return;
    }

    // Rewind scene if sceneIndex > 0
    if (state.sceneIndex > 0) {
      const prevScene = chapters[state.chapterIndex].scenes[state.sceneIndex - 1];
      const prevBeatIndex = Math.max(0, prevScene.beats.length - 1);
      set({
        sceneIndex: state.sceneIndex - 1,
        beatIndex: prevBeatIndex,
        direction: -1,
      });
      return;
    }

    // If at first scene and first beat of chapter
    // Return to library lobby
    set({ viewMode: 'library', direction: -1 });
  },

  jumpToChapter: (index: number) => {
    const validIndex = Math.max(0, Math.min(chapters.length - 1, index));
    set({
      viewMode: 'chapter',
      chapterIndex: validIndex,
      sceneIndex: 0,
      beatIndex: 0,
      direction: 1,
    });
  },

  jumpToScene: (sceneId: string) => {
    for (let cIdx = 0; cIdx < chapters.length; cIdx++) {
      const sIdx = chapters[cIdx].scenes.findIndex((s) => s.id === sceneId);
      if (sIdx !== -1) {
        set({
          viewMode: 'chapter',
          chapterIndex: cIdx,
          sceneIndex: sIdx,
          beatIndex: 0,
          direction: 1,
        });
        return;
      }
    }
  },

  setBlackout: (value: boolean) => set({ isBlackout: value }),
  toggleBlackout: () => set((state) => ({ isBlackout: !state.isBlackout })),
  resetScene: () => set({ beatIndex: 0 }),
  setFullscreen: (value: boolean) => set({ isFullscreen: value }),
  setQualityTier: (tier: QualityTier) => set({ qualityTier: tier }),
  setReducedMotion: (value: boolean) => set({ reducedMotion: value }),
  setTransitioning: (value: boolean) => set({ isTransitioning: value }),
}));

if (typeof window !== 'undefined') {
  (window as any).__store = usePresentationStore;
}

