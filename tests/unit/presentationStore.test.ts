import { describe, it, expect, beforeEach } from 'vitest';
import { usePresentationStore } from '../../src/state/presentationStore';

describe('PresentationStore Navigation Engine', () => {
  beforeEach(() => {
    usePresentationStore.setState({
      viewMode: 'cover',
      experienceMode: 'cover',
      selectedBook: 0,
      bookshelfMode: 'hero',
      isShelfSettled: true,
      pendingBookshelfNavigation: null,
      pendingQualityTier: null,
      pendingPresenterSync: null,
      qualityTier: 'high',
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
    expect(usePresentationStore.getState().magazinePage).toBe(8);
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

  it('synchronizes experienceMode and viewMode to avoid split-brain states', () => {
    const store = usePresentationStore.getState();
    // Start at cover
    store.openCover();
    expect(store.experienceMode).toBe('cover');
    expect(store.viewMode).toBe('cover');

    // next() from cover
    store.next();
    expect(usePresentationStore.getState().experienceMode).toBe('library');
    expect(usePresentationStore.getState().viewMode).toBe('library');

    // prev() from library
    usePresentationStore.getState().prev();
    expect(usePresentationStore.getState().experienceMode).toBe('cover');
    expect(usePresentationStore.getState().viewMode).toBe('cover');
  });

  it('centralizes non-hero safety guards: actions queue intents instead of early resetting or unmounting', () => {
    const store = usePresentationStore.getState();
    store.openLibrary();
    usePresentationStore.setState({ bookshelfMode: 'detail', selectedBook: 1 });

    // openLibrary() during detail
    store.openLibrary();
    let state = usePresentationStore.getState();
    expect(state.pendingBookshelfNavigation).toEqual({ type: 'close-to-library' });
    expect(state.bookshelfMode).toBe('detail'); // Not reset early

    // selectBook(3) during detail
    store.clearPendingBookshelfNavigation();
    store.selectBook(3);
    state = usePresentationStore.getState();
    expect(state.pendingBookshelfNavigation).toEqual({ type: 'select', index: 3 });

    // openBook(0) during detail
    store.clearPendingBookshelfNavigation();
    store.openBook(0);
    state = usePresentationStore.getState();
    expect(state.pendingBookshelfNavigation).toEqual({ type: 'open-book', index: 0 });
    expect(state.experienceMode).toBe('library'); // Does NOT transition to magazine early

    // openCover() during detail
    store.clearPendingBookshelfNavigation();
    store.setShelfSettled(true);
    store.openCover();
    state = usePresentationStore.getState();
    expect(state.pendingBookshelfNavigation).toEqual({ type: 'open-cover' });
    expect(state.experienceMode).toBe('library'); // Does NOT unmount to cover early
  });

  it('defers Safe Mode switch when non-hero until bookshelf settles back to hero', () => {
    const store = usePresentationStore.getState();
    store.openLibrary();
    usePresentationStore.setState({ bookshelfMode: 'detail', qualityTier: 'high' });

    // Attempt to switch to safe mode while in detail
    store.setQualityTier('safe');
    let state = usePresentationStore.getState();
    expect(state.qualityTier).toBe('high'); // Still high
    expect(state.pendingQualityTier).toBe('safe'); // Queued
    expect(state.pendingBookshelfNavigation).toEqual({ type: 'close-to-library' });

    // Mode=hero alone is not enough: the mirrored renderer intent is still active.
    store.setBookshelfMode('hero');
    state = usePresentationStore.getState();
    expect(state.qualityTier).toBe('high');
    expect(state.pendingQualityTier).toBe('safe');

    // Renderer resolves close-to-library, then reports final settled=true.
    store.clearPendingBookshelfNavigation();
    store.setShelfSettled(true);
    state = usePresentationStore.getState();
    expect(state.qualityTier).toBe('safe');
    expect(state.pendingQualityTier).toBeNull();
  });

  it('queues Book I open-book intent when carousel is still moving (isShelfSettled=false)', () => {
    const store = usePresentationStore.getState();
    store.openLibrary();
    usePresentationStore.setState({ bookshelfMode: 'hero', isShelfSettled: false });

    // Click Book I while carousel is moving
    store.openBook(0);
    const state = usePresentationStore.getState();
    expect(state.experienceMode).toBe('library'); // Does NOT unmount WebGL during animation
    expect(state.pendingBookshelfNavigation).toEqual({ type: 'open-book', index: 0 });
  });

  // --- M0.4.4 SPECIFICATION TEST SUITE (A, B, C, D, E) ---

  it('A: pending open-book I -> newer select III -> final intent III', () => {
    const store = usePresentationStore.getState();
    store.openLibrary();
    usePresentationStore.setState({ bookshelfMode: 'hero', isShelfSettled: false, selectedBook: 0 });

    // User clicks Book I while shelf is moving
    store.openBook(0);
    expect(usePresentationStore.getState().pendingBookshelfNavigation).toEqual({ type: 'open-book', index: 0 });

    // User then selects Book III (index 2) before shelf settles -> latest intent wins
    store.selectBook(2);
    expect(usePresentationStore.getState().pendingBookshelfNavigation).toEqual({ type: 'select', index: 2 });
    expect(usePresentationStore.getState().selectedBook).toBe(2);

    // In Codex's handshake model, renderer acknowledges the navigation on settle
    store.clearPendingBookshelfNavigation();
    store.setShelfSettled(true);
    const state = usePresentationStore.getState();
    expect(state.selectedBook).toBe(2);
    expect(state.pendingBookshelfNavigation).toBeNull();
    expect(state.experienceMode).toBe('library'); // Stays library, did not pop open Magazine for Book I
  });

  it('B: detail -> openCover -> close -> Cover', () => {
    const store = usePresentationStore.getState();
    store.openLibrary();
    usePresentationStore.setState({
      bookshelfMode: 'detail',
      isShelfSettled: false,
      selectedBook: 0,
    });

    // In detail, user clicks Home / openCover
    store.openCover();
    let state = usePresentationStore.getState();
    expect(state.pendingBookshelfNavigation).toEqual({ type: 'open-cover' });
    expect(state.experienceMode).toBe('library'); // Still library while closing

    // Physical book closes to hero, shelf settles, then renderer acknowledges and triggers openCover
    store.setBookshelfMode('hero');
    store.setShelfSettled(true);
    state = usePresentationStore.getState();
    expect(state.experienceMode).toBe('library');
    expect(state.pendingBookshelfNavigation).toEqual({ type: 'open-cover' });

    store.clearPendingBookshelfNavigation();
    store.openCover();
    state = usePresentationStore.getState();
    expect(state.experienceMode).toBe('cover');
    expect(state.viewMode).toBe('cover');
    expect(state.pendingBookshelfNavigation).toBeNull();
  });

  it('C: pending Safe Mode -> newer Book IV navigation -> deterministic documented final state', () => {
    const store = usePresentationStore.getState();
    store.openLibrary();
    usePresentationStore.setState({ bookshelfMode: 'detail', selectedBook: 1, qualityTier: 'high' });

    // User requests safe mode while in detail
    store.setQualityTier('safe');
    let state = usePresentationStore.getState();
    expect(state.pendingQualityTier).toBe('safe');
    expect(state.pendingBookshelfNavigation).toEqual({ type: 'close-to-library' });

    // While closing, user selects Book IV (index 3) - latest user intent wins
    store.selectBook(3);
    state = usePresentationStore.getState();
    expect(state.pendingBookshelfNavigation).toEqual({ type: 'select', index: 3 });
    expect(state.pendingQualityTier).toBe('safe');

    // Physical shelf reaches hero, but deferred quality must wait for Book IV to settle.
    store.setBookshelfMode('hero');
    state = usePresentationStore.getState();
    expect(state.qualityTier).toBe('high');
    expect(state.pendingBookshelfNavigation).toEqual({ type: 'select', index: 3 });

    // Renderer completes the latest selection and only then Safe Mode may apply.
    store.clearPendingBookshelfNavigation();
    usePresentationStore.setState({ selectedBook: 3, chapterIndex: 3 });
    store.setShelfSettled(true);
    state = usePresentationStore.getState();
    expect(state.bookshelfMode).toBe('hero');
    expect(state.selectedBook).toBe(3);
    expect(state.qualityTier).toBe('safe');
    expect(state.pendingQualityTier).toBeNull();
    expect(state.pendingBookshelfNavigation).toBeNull();
  });

  it('D: settled=true is not emitted before chained pending navigation is resolved', () => {
    const store = usePresentationStore.getState();
    store.openLibrary();
    usePresentationStore.setState({ bookshelfMode: 'hero', isShelfSettled: false });

    // Queue a select navigation
    store.requestBookshelfNavigation({ type: 'select', index: 3 });
    expect(usePresentationStore.getState().pendingBookshelfNavigation).toEqual({ type: 'select', index: 3 });

    // Store must not consume renderer-owned navigation on a synthetic settled flag.
    store.setShelfSettled(true);
    let state = usePresentationStore.getState();
    expect(state.pendingBookshelfNavigation).toEqual({ type: 'select', index: 3 });

    // Renderer resolves the intent first, then the final settled state is accepted.
    store.clearPendingBookshelfNavigation();
    usePresentationStore.setState({ selectedBook: 3, chapterIndex: 3 });
    store.setShelfSettled(true);
    state = usePresentationStore.getState();
    expect(state.selectedBook).toBe(3);
    expect(state.pendingBookshelfNavigation).toBeNull();
    expect(state.isShelfSettled).toBe(true);
  });

  it('E: Presenter sync during detail does not raw-transition experienceMode', () => {
    const store = usePresentationStore.getState();
    store.openLibrary();
    usePresentationStore.setState({ bookshelfMode: 'detail', selectedBook: 1, experienceMode: 'library' });

    // Remote presenter sync requests cover mode
    store.applyPresenterSync({ experienceMode: 'cover', viewMode: 'cover' });
    let state = usePresentationStore.getState();
    // Must NOT abruptly switch experienceMode to cover mid-detail
    expect(state.experienceMode).toBe('library');
    expect(state.pendingBookshelfNavigation).toEqual({ type: 'open-cover' });

    // Remote presenter sync requests magazine for book 0
    store.applyPresenterSync({
      experienceMode: 'magazine',
      viewMode: 'chapter',
      selectedBook: 0,
      magazinePage: 4,
      magazineViewMode: 'reading',
    });
    state = usePresentationStore.getState();
    expect(state.experienceMode).toBe('library');
    expect(state.pendingBookshelfNavigation).toEqual({ type: 'open-book', index: 0 });
    expect(state.pendingPresenterSync?.magazinePage).toBe(4);
    expect(state.pendingPresenterSync?.magazineViewMode).toBe('reading');

    // Remote presenter sync requests book 3
    store.applyPresenterSync({ selectedBook: 3 });
    state = usePresentationStore.getState();
    expect(state.bookshelfMode).toBe('detail');
    expect(state.pendingBookshelfNavigation).toEqual({ type: 'select', index: 3 });
  });
  it('cancels a deferred Safe Mode switch when the user re-selects the active quality tier', () => {
    const store = usePresentationStore.getState();
    store.openLibrary();
    usePresentationStore.setState({
      bookshelfMode: 'detail',
      isShelfSettled: false,
      qualityTier: 'high',
    });

    store.setQualityTier('safe');
    expect(usePresentationStore.getState().pendingQualityTier).toBe('safe');

    // Latest quality intent is to remain on high.
    store.setQualityTier('high');
    expect(usePresentationStore.getState().qualityTier).toBe('high');
    expect(usePresentationStore.getState().pendingQualityTier).toBeNull();
  });

});


