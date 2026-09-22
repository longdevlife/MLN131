import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ensureBookshelfFonts,
  resetBookshelfFontCache,
} from '../../src/vendor/threeui-custom/bookshelf/fontLoader';

describe('fontLoader: ensureBookshelfFonts', () => {
  beforeEach(() => {
    resetBookshelfFontCache();
  });

  afterEach(() => {
    resetBookshelfFontCache();
    vi.restoreAllMocks();
  });

  it('resolves immediately if window or document is undefined', async () => {
    const originalWindow = globalThis.window;
    // @ts-expect-error simulating non-browser environment
    delete globalThis.window;

    await expect(ensureBookshelfFonts()).resolves.toBeUndefined();

    globalThis.window = originalWindow;
  });

  it('loads fonts and registers them into document.fonts in browser environment', async () => {
    const loadMock = vi.fn().mockResolvedValue({});
    const addMock = vi.fn();
    const docLoadMock = vi.fn().mockResolvedValue([]);
    const checkMock = vi.fn().mockReturnValue(false);

    // Mock FontFace
    class MockFontFace {
      family: string;
      source: string;
      descriptors: any;
      load = loadMock;
      constructor(family: string, source: string, descriptors?: any) {
        this.family = family;
        this.source = source;
        this.descriptors = descriptors;
      }
    }

    // @ts-expect-error mock FontFace
    globalThis.FontFace = MockFontFace;
    // @ts-expect-error mock document.fonts
    document.fonts = {
      add: addMock,
      load: docLoadMock,
      check: checkMock,
    };

    await ensureBookshelfFonts();

    // Must have loaded regular, bold, and Vietnamese glyphs fonts
    expect(loadMock).toHaveBeenCalledTimes(4);
    expect(addMock).toHaveBeenCalledTimes(4);
    expect(docLoadMock).toHaveBeenCalledWith('400 64px MLNBookSans');
    expect(docLoadMock).toHaveBeenCalledWith('700 64px MLNBookSans');
  });

  it('reuses the cached promise on subsequent invocations', async () => {
    const loadMock = vi.fn().mockResolvedValue({});
    const addMock = vi.fn();
    const docLoadMock = vi.fn().mockResolvedValue([]);

    class MockFontFace {
      load = loadMock;
      constructor(public family: string, public source: string, public descriptors?: any) {}
    }

    // @ts-expect-error mock FontFace
    globalThis.FontFace = MockFontFace;
    // @ts-expect-error mock document.fonts
    document.fonts = {
      add: addMock,
      load: docLoadMock,
      check: vi.fn().mockReturnValue(false),
    };

    const promise1 = ensureBookshelfFonts();
    const promise2 = ensureBookshelfFonts();

    expect(promise1).toBe(promise2);
    await Promise.all([promise1, promise2]);

    expect(loadMock).toHaveBeenCalledTimes(4);
  });
});
