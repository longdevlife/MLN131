import { useEffect } from 'react';
import { usePresentationStore } from '../state/presentationStore';

export function useKeyboardNavigation() {
  const next = usePresentationStore((state) => state.next);
  const prev = usePresentationStore((state) => state.prev);
  const openLibrary = usePresentationStore((state) => state.openLibrary);
  const openCover = usePresentationStore((state) => state.openCover);
  const jumpToChapter = usePresentationStore((state) => state.jumpToChapter);
  const toggleBlackout = usePresentationStore((state) => state.toggleBlackout);
  const resetScene = usePresentationStore((state) => state.resetScene);
  const setFullscreen = usePresentationStore((state) => state.setFullscreen);
  const viewMode = usePresentationStore((state) => state.viewMode);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      switch (e.code) {
        case 'Space':
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          next();
          break;

        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prev();
          break;

        case 'Digit1':
          e.preventDefault();
          jumpToChapter(0);
          break;

        case 'Digit2':
          e.preventDefault();
          jumpToChapter(1);
          break;

        case 'Digit3':
          e.preventDefault();
          jumpToChapter(2);
          break;

        case 'Digit4':
          e.preventDefault();
          jumpToChapter(3);
          break;

        case 'KeyO':
          e.preventDefault();
          openLibrary();
          break;

        case 'KeyF':
          e.preventDefault();
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.().catch(() => {});
            setFullscreen(true);
          } else {
            document.exitFullscreen?.().catch(() => {});
            setFullscreen(false);
          }
          break;

        case 'KeyB':
          e.preventDefault();
          toggleBlackout();
          break;

        case 'KeyR':
          e.preventDefault();
          resetScene();
          break;

        case 'Home':
          e.preventDefault();
          openCover();
          break;

        case 'Escape':
          e.preventDefault();
          if (usePresentationStore.getState().isSourceDrawerOpen) {
            usePresentationStore.getState().closeSourceDrawer();
            return;
          }
          if (viewMode === 'chapter') {
            openLibrary();
          } else if (viewMode === 'library') {
            openCover();
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev, openLibrary, openCover, jumpToChapter, toggleBlackout, resetScene, setFullscreen, viewMode]);
}
