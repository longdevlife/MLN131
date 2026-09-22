/**
 * Deterministic local font loader for Bookshelf 3D canvas textures.
 * Registers MLNBookSans (Roboto regular and bold) using the FontFace API.
 * Guarantees fonts are fully loaded into the browser document before
 * CanvasRenderingContext2D draws book covers and spines.
 */

let fontPromise: Promise<void> | null = null;

export function ensureBookshelfFonts(): Promise<void> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve();
  }

  // If FontFace is not supported in the current environment (e.g. older browser or mock)
  if (!('FontFace' in window) || !('fonts' in document)) {
    return Promise.resolve();
  }

  // If already initiated, return the cached promise
  if (fontPromise) {
    return fontPromise;
  }

  fontPromise = (async () => {
    try {
      // Check if already registered and loaded
      if (document.fonts.check('700 64px MLNBookSans') && document.fonts.check('400 64px MLNBookSans')) {
        return;
      }

      const unicodeVi =
        'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB';
      const unicodeLatin =
        'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

      const regular = new FontFace('MLNBookSans', 'url(/fonts/roboto-regular.woff)', {
        weight: '400',
        style: 'normal',
        unicodeRange: unicodeLatin,
      });

      const bold = new FontFace('MLNBookSans', 'url(/fonts/roboto-bold.woff)', {
        weight: '700',
        style: 'normal',
        unicodeRange: unicodeLatin,
      });

      const vietnameseRegular = new FontFace('MLNBookSans', 'url(/fonts/roboto-vietnamese.woff)', {
        weight: '400',
        style: 'normal',
        unicodeRange: unicodeVi,
      });

      const vietnameseBold = new FontFace('MLNBookSans', 'url(/fonts/roboto-vietnamese.woff)', {
        weight: '700',
        style: 'normal',
        unicodeRange: unicodeVi,
      });

      const [loadedRegular, loadedBold, loadedViReg, loadedViBold] = await Promise.all([
        regular.load().catch(() => null),
        bold.load().catch(() => null),
        vietnameseRegular.load().catch(() => null),
        vietnameseBold.load().catch(() => null),
      ]);

      if (loadedRegular) document.fonts.add(loadedRegular);
      if (loadedBold) document.fonts.add(loadedBold);
      if (loadedViReg) document.fonts.add(loadedViReg);
      if (loadedViBold) document.fonts.add(loadedViBold);

      await Promise.all([
        document.fonts.load('400 64px MLNBookSans'),
        document.fonts.load('700 64px MLNBookSans'),
      ]);
    } catch (err) {
      console.warn('[Bookshelf] Font loading failed, falling back to system typography:', err);
      // Clear cache on error so subsequent attempts can retry
      fontPromise = null;
      throw err;
    }
  })();

  return fontPromise;
}

/**
 * Utility for tests to reset cached font state if needed.
 */
export function resetBookshelfFontCache(): void {
  fontPromise = null;
}
