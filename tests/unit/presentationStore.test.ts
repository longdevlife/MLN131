import { describe, it, expect, beforeEach } from 'vitest';
import { usePresentationStore } from '../../src/state/presentationStore';

describe('PresentationStore Navigation Engine', () => {
  beforeEach(() => {
    usePresentationStore.setState({
      viewMode: 'cover',
      experienceMode: 'cover',
      selectedBook: 0,
      magazinePage: 0,
      magazineViewMode: 'showcase',
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

  it('supports jumpToChapter and jumpToScene for populated chapters', () => {
    usePresentationStore.getState().jumpToChapter(0);
    expect(usePresentationStore.getState().chapterIndex).toBe(0);
    expect(usePresentationStore.getState().viewMode).toBe('chapter');

    usePresentationStore.getState().jumpToScene('p1-s1');
    expect(usePresentationStore.getState().chapterIndex).toBe(0);
    expect(usePresentationStore.getState().sceneIndex).toBe(1);
  });

  it('enforces empty chapter guard: opening or jumping to an empty book never enters blank chapter mode', () => {
    // Attempting to open Book II (chapterIndex 1) which has scenes = []
    usePresentationStore.getState().openChapter(1);
    let state = usePresentationStore.getState();
    expect(state.viewMode).toBe('library');
    expect(state.chapterIndex).toBe(1);

    // Attempting to jumpToChapter 1 which has scenes = []
    usePresentationStore.getState().jumpToChapter(1);
    state = usePresentationStore.getState();
    expect(state.viewMode).toBe('library');
    expect(state.chapterIndex).toBe(1);

    // When in library with empty Book selected, next() does not enter chapter mode
    usePresentationStore.setState({ viewMode: 'library', chapterIndex: 1 });
    usePresentationStore.getState().next();
    state = usePresentationStore.getState();
    expect(state.viewMode).toBe('library');
    expect(state.chapterIndex).toBe(1);
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

  it('opens only available Book I into Magazine', () => {
    usePresentationStore.getState().openLibrary();
    usePresentationStore.getState().openBook(0);

    const state = usePresentationStore.getState();
    expect(state.experienceMode).toBe('magazine');
    expect(state.selectedBook).toBe(0);
    expect(state.magazinePage).toBe(0);
    expect(state.magazineViewMode).toBe('showcase');
  });

  it('guards unavailable Books II-IV without leaving Library', () => {
    usePresentationStore.getState().openLibrary();
    usePresentationStore.getState().openBook(1);

    const state = usePresentationStore.getState();
    expect(state.experienceMode).toBe('library');
    expect(state.selectedBook).toBe(1);
  });

  it('closes Magazine back to selected Book I', () => {
    usePresentationStore.getState().openBook(0);
    usePresentationStore.getState().setMagazinePage(2);
    usePresentationStore.getState().closeMagazine();

    const state = usePresentationStore.getState();
    expect(state.experienceMode).toBe('library');
    expect(state.selectedBook).toBe(0);
    expect(state.magazinePage).toBe(0);
  });

  it('clamps Magazine pages', () => {
    usePresentationStore.getState().openBook(0);
    usePresentationStore.getState().setMagazinePage(99);
    expect(usePresentationStore.getState().magazinePage).toBe(3);
  });

  it('keeps legacy viewMode valid while Magazine is active', () => {
    usePresentationStore.getState().openLibrary();
    usePresentationStore.getState().openBook(0);
    expect(['cover', 'library', 'chapter']).toContain(usePresentationStore.getState().viewMode);
  });

  it('advances and rewinds Magazine pages via next() and prev() only when in magazine mode', () => {
    usePresentationStore.getState().openBook(0);
    expect(usePresentationStore.getState().magazinePage).toBe(0);

    usePresentationStore.getState().next();
    expect(usePresentationStore.getState().magazinePage).toBe(1);

    usePresentationStore.getState().next();
    expect(usePresentationStore.getState().magazinePage).toBe(2);

    usePresentationStore.getState().prev();
    expect(usePresentationStore.getState().magazinePage).toBe(1);
  });

  it('exits Magazine via openLibrary() and preserves selected book', () => {
    usePresentationStore.getState().openBook(0);
    usePresentationStore.getState().setMagazinePage(2);
    usePresentationStore.getState().openLibrary();

    const state = usePresentationStore.getState();
    expect(state.experienceMode).toBe('library');
    expect(state.selectedBook).toBe(0);
  });

  it('state regression: selectBook(3) keeps experienceMode=library and Space/next does NOT open Book I', () => {
    const store = usePresentationStore.getState();
    store.openLibrary();

    // Select Book IV (index 3)
    store.selectBook(3);
    let state = usePresentationStore.getState();
    expect(state.selectedBook).toBe(3);
    expect(state.chapterIndex).toBe(3);
    expect(state.experienceMode).toBe('library');

    // Space / next() in Library must NOT open Book I when Book IV is selected
    store.next();
    state = usePresentationStore.getState();
    expect(state.selectedBook).toBe(3);
    expect(state.chapterIndex).toBe(3);
    expect(state.experienceMode).toBe('library');
    expect(state.magazinePage).toBe(0);
  });

  it('selectBook(0) followed by openBook(0) transitions to experienceMode=magazine', () => {
    const store = usePresentationStore.getState();
    store.openLibrary();
    store.selectBook(0);
    store.openBook(0);

    const state = usePresentationStore.getState();
    expect(state.selectedBook).toBe(0);
    expect(state.experienceMode).toBe('magazine');
  });
});


