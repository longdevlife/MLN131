import { create } from 'zustand';
import { chapters } from '../content/chapters';
import type { MagazineViewMode } from '../experiences/magazine/magazineTypes';
import {
  clampMagazinePage,
  getMagazinePageCount,
  getMagazineVolume,
} from '../experiences/magazine/magazineModel';

export type ViewMode = 'cover' | 'library' | 'chapter';
export type ExperienceMode =
  | 'cover'
  | 'library'
  | 'magazine'
  | 'interactive'
  | 'museum';
export type QualityTier = 'high' | 'medium' | 'safe';
export type BookshelfMode = 'hero' | 'opening' | 'detail' | 'closing';
export type BookshelfNavigationIntent =
  | { type: 'select'; index: number }
  | { type: 'open-book'; index: number }
  | { type: 'close-to-library' }
  | null;

export interface PresentationState {
  viewMode: ViewMode;
  experienceMode: ExperienceMode;
  selectedBook: number;
  bookshelfMode: BookshelfMode;
  pendingBookshelfNavigation: BookshelfNavigationIntent;
  magazinePage: number;
  magazineViewMode: MagazineViewMode;
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
  setBookshelfMode: (mode: BookshelfMode) => void;
  requestBookshelfNavigation: (intent: BookshelfNavigationIntent) => void;
  clearPendingBookshelfNavigation: () => void;
  // Navigation actions
  startPresentation: () => void;
  openCover: () => void;
  openLibrary: () => void;
  openChapter: (chapterIndex: number, sceneIndex?: number) => void;
  openBook: (index: number) => void;
  selectBook: (index: number) => void;
  closeMagazine: () => void;
  setMagazinePage: (page: number) => void;
  setMagazineViewMode: (mode: MagazineViewMode) => void;
  toggleMagazineViewMode: () => void;
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
  experienceMode: 'cover',
  selectedBook: 0,
  bookshelfMode: 'hero',
  pendingBookshelfNavigation: null,
  magazinePage: 0,
  magazineViewMode: 'showcase',
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
  setBookshelfMode: (mode: BookshelfMode) => set({ bookshelfMode: mode }),
  requestBookshelfNavigation: (intent: BookshelfNavigationIntent) =>
    set({ pendingBookshelfNavigation: intent }),
  clearPendingBookshelfNavigation: () =>
    set({ pendingBookshelfNavigation: null }),

  startPresentation: () => {
    set({ experienceMode: 'library', viewMode: 'library', bookshelfMode: 'hero', direction: 1 });
  },

  openCover: () => {
    set({ experienceMode: 'cover', viewMode: 'cover', bookshelfMode: 'hero', direction: -1 });
  },

  openLibrary: () => {
    set({
      experienceMode: 'library',
      viewMode: 'library',
      bookshelfMode: 'hero',
      chapterIndex: get().selectedBook,
      direction: -1,
    });
  },

  openBook: (index: number) => {
    const selectedBook = Math.max(0, Math.min(3, index));
    const volume = getMagazineVolume(selectedBook);

    if (!volume) {
      set({
        experienceMode: 'library',
        viewMode: 'library',
        selectedBook,
        chapterIndex: selectedBook,
        magazinePage: 0,
      });
      return;
    }

    set({
      experienceMode: 'magazine',
      viewMode: 'library',
      selectedBook,
      chapterIndex: selectedBook,
      magazinePage: 0,
      magazineViewMode: 'showcase',
      direction: 1,
    });
  },

  selectBook: (index: number) => {
    const selectedBook = Math.max(0, Math.min(3, index));
    set({
      selectedBook,
      chapterIndex: selectedBook,
      experienceMode: 'library',
      viewMode: 'library',
    });
  },

  closeMagazine: () => {
    set({
      experienceMode: 'library',
      viewMode: 'library',
      bookshelfMode: 'hero',
      chapterIndex: get().selectedBook,
      magazinePage: 0,
      direction: -1,
    });
  },

  setMagazinePage: (page: number) => {
    const volume = getMagazineVolume(get().selectedBook);
    if (!volume) return;
    const clamped = clampMagazinePage(volume, page);
    set({ magazinePage: clamped });
  },

  setMagazineViewMode: (mode: MagazineViewMode) => set({ magazineViewMode: mode }),

  toggleMagazineViewMode: () =>
    set((state) => ({
      magazineViewMode: state.magazineViewMode === 'showcase' ? 'reading' : 'showcase',
    })),

  openChapter: (chapterIndex: number, sceneIndex = 0) => {
    const validChapterIndex = Math.max(0, Math.min(chapters.length - 1, chapterIndex));
    const targetChapter = chapters[validChapterIndex];
    if (!targetChapter || targetChapter.scenes.length === 0) {
      // Empty chapter guard: remain in Library, keep book selected/highlighted, do not enter chapter view
      set({
        viewMode: 'library',
        chapterIndex: validChapterIndex,
        sceneIndex: 0,
        beatIndex: 0,
      });
      return;
    }
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

    if (state.experienceMode === 'magazine') {
      const volume = getMagazineVolume(state.selectedBook);
      if (volume) {
        const maxPage = getMagazinePageCount(volume) - 1;
        if (state.magazinePage < maxPage) {
          set({ magazinePage: state.magazinePage + 1 });
        }
      }
      return;
    }

    if (state.viewMode === 'cover') {
      set({ viewMode: 'library', direction: 1 });
      return;
    }

    if (state.experienceMode === 'library' || state.viewMode === 'library') {
      get().openBook(state.chapterIndex);
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

    // At final beat of Chapter 0 (Part I final scene P1.S7):
    // Transition back to Library with Book II selected/highlighted
    if (state.chapterIndex === 0) {
      set({
        viewMode: 'library',
        chapterIndex: 1,
        sceneIndex: 0,
        beatIndex: 0,
        direction: 1,
      });
      return;
    }

    // Advance to next chapter if remaining
    if (state.chapterIndex < chapters.length - 1) {
      const nextChapterIndex = state.chapterIndex + 1;
      const nextChapter = chapters[nextChapterIndex];
      if (!nextChapter || nextChapter.scenes.length === 0) {
        set({
          viewMode: 'library',
          chapterIndex: nextChapterIndex,
          sceneIndex: 0,
          beatIndex: 0,
          direction: 1,
        });
        return;
      }
      set({
        chapterIndex: nextChapterIndex,
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

    if (state.experienceMode === 'magazine') {
      if (state.magazinePage > 0) {
        set({ magazinePage: state.magazinePage - 1 });
      } else {
        get().closeMagazine();
      }
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
    const targetChapter = chapters[validIndex];
    if (!targetChapter || targetChapter.scenes.length === 0) {
      // Empty chapter guard: remain in Library, keep book selected/highlighted, do not enter chapter view
      set({
        viewMode: 'library',
        chapterIndex: validIndex,
        sceneIndex: 0,
        beatIndex: 0,
      });
      return;
    }
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
  (window as any).__PRESENTATION_STORE__ = usePresentationStore;
}

