import { describe, it, expect, beforeEach } from 'vitest';
import { usePresentationStore } from '../../src/state/presentationStore';

describe('PresentationStore Navigation Engine', () => {
  beforeEach(() => {
    usePresentationStore.setState({
      viewMode: 'cover',
      chapterIndex: 0,
      sceneIndex: 0,
      beatIndex: 0,
      direction: 1,
      isBlackout: false,
    });
  });

  it('starts at cover mode', () => {
    const state = usePresentationStore.getState();
    expect(state.viewMode).toBe('cover');
    expect(state.chapterIndex).toBe(0);
    expect(state.sceneIndex).toBe(0);
  });

  it('navigates from cover to library on startPresentation or next', () => {
    usePresentationStore.getState().next();
    expect(usePresentationStore.getState().viewMode).toBe('library');

    usePresentationStore.getState().openCover();
    expect(usePresentationStore.getState().viewMode).toBe('cover');

    usePresentationStore.getState().startPresentation();
    expect(usePresentationStore.getState().viewMode).toBe('library');
  });

  it('opens book I and transitions into chapter 0 scene 0', () => {
    usePresentationStore.getState().openChapter(0);
    const state = usePresentationStore.getState();
    expect(state.viewMode).toBe('chapter');
    expect(state.chapterIndex).toBe(0);
    expect(state.sceneIndex).toBe(0);
    expect(state.beatIndex).toBe(0);
  });

  it('advances beats deterministically and advances scene when beats exhaust', () => {
    usePresentationStore.getState().openChapter(0, 0); // P1.S0 (2 beats)
    expect(usePresentationStore.getState().beatIndex).toBe(0);

    // Advance to beat 1
    usePresentationStore.getState().next();
    expect(usePresentationStore.getState().sceneIndex).toBe(0);
    expect(usePresentationStore.getState().beatIndex).toBe(1);

    // Advance to next scene (P1.S1)
    usePresentationStore.getState().next();
    expect(usePresentationStore.getState().sceneIndex).toBe(1);
    expect(usePresentationStore.getState().beatIndex).toBe(0);

    // P1.S1 has 3 beats: beat 0 -> beat 1 -> beat 2
    usePresentationStore.getState().next();
    expect(usePresentationStore.getState().sceneIndex).toBe(1);
    expect(usePresentationStore.getState().beatIndex).toBe(1);

    usePresentationStore.getState().next();
    expect(usePresentationStore.getState().sceneIndex).toBe(1);
    expect(usePresentationStore.getState().beatIndex).toBe(2);
  });

  it('rewinds beats and scenes deterministically back to library', () => {
    usePresentationStore.getState().openChapter(0, 1);
    usePresentationStore.setState({ beatIndex: 2 });

    // Rewind beat 2 -> 1
    usePresentationStore.getState().prev();
    expect(usePresentationStore.getState().sceneIndex).toBe(1);
    expect(usePresentationStore.getState().beatIndex).toBe(1);

    // Rewind beat 1 -> 0
    usePresentationStore.getState().prev();
    expect(usePresentationStore.getState().sceneIndex).toBe(1);
    expect(usePresentationStore.getState().beatIndex).toBe(0);

    // Rewind to previous scene (P1.S0, last beat)
    usePresentationStore.getState().prev();
    expect(usePresentationStore.getState().sceneIndex).toBe(0);
    expect(usePresentationStore.getState().beatIndex).toBe(1);

    // Rewind P1.S0 beat 1 -> 0
    usePresentationStore.getState().prev();
    expect(usePresentationStore.getState().sceneIndex).toBe(0);
    expect(usePresentationStore.getState().beatIndex).toBe(0);

    // Rewind from first scene beat 0 returns to library
    usePresentationStore.getState().prev();
    expect(usePresentationStore.getState().viewMode).toBe('library');
  });

  it('supports blackout toggle', () => {
    expect(usePresentationStore.getState().isBlackout).toBe(false);
    usePresentationStore.getState().toggleBlackout();
    expect(usePresentationStore.getState().isBlackout).toBe(true);
    usePresentationStore.getState().toggleBlackout();
    expect(usePresentationStore.getState().isBlackout).toBe(false);
  });

  it('supports jumpToChapter and jumpToScene', () => {
    usePresentationStore.getState().jumpToChapter(2);
    expect(usePresentationStore.getState().chapterIndex).toBe(2);
    expect(usePresentationStore.getState().viewMode).toBe('chapter');

    usePresentationStore.getState().jumpToScene('p1-s1');
    expect(usePresentationStore.getState().chapterIndex).toBe(0);
    expect(usePresentationStore.getState().sceneIndex).toBe(1);
  });

  it('enforces Part II boundary: at final beat of P1.S7, next returns to library with Book II selected', () => {
    // Jump to P1.S7 (final scene of Part I, order 7, scenes[7])
    usePresentationStore.getState().openChapter(0, 7);
    usePresentationStore.setState({ beatIndex: 5 }); // last beat of P1.S7 (6 beats total)

    expect(usePresentationStore.getState().viewMode).toBe('chapter');
    expect(usePresentationStore.getState().chapterIndex).toBe(0);
    expect(usePresentationStore.getState().sceneIndex).toBe(7);

    // Call next at final beat of Part I
    usePresentationStore.getState().next();

    const finalState = usePresentationStore.getState();
    expect(finalState.viewMode).toBe('library');
    expect(finalState.chapterIndex).toBe(1); // Book II is selected
    expect(finalState.sceneIndex).toBe(0);
    expect(finalState.beatIndex).toBe(0);
  });
});

