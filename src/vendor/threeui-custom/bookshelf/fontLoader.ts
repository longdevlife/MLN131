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

      const regular = new FontFace('MLNBookSans', 'url(/fonts/roboto-regular.woff)', {
        weight: '400',
        style: 'normal',
      });

      const bold = new FontFace('MLNBookSans', 'url(/fonts/roboto-bold.woff)', {
        weight: '700',
        style: 'normal',
      });

      const [loadedRegular, loadedBold] = await Promise.all([regular.load(), bold.load()]);

      document.fonts.add(loadedRegular);
      document.fonts.add(loadedBold);

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
