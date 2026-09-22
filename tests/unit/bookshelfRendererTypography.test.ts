import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('bookshelfRenderer Typography & Font Static Regression Suite (M0.3)', () => {
  const rendererPath = path.resolve(__dirname, '../../src/vendor/threeui-custom/bookshelf/bookshelfRenderer.js');
  const source = fs.readFileSync(rendererPath, 'utf-8');

  it('contains zero occurrences of deprecated system fonts in font strings', () => {
    // Must not declare Helvetica Neue or Arial, sans-serif anywhere in renderer
    expect(source).not.toContain('"Helvetica Neue"');
    expect(source).not.toContain('Arial, sans-serif');

    // "Inter" should only appear as part of english word "Interlaced"
    const fontInterMatches = source.match(/font\s*=\s*['"][^'"]*\bInter\b/g);
    expect(fontInterMatches).toBeNull();
  });

  it('does not call document.fonts.load for Inter font', () => {
    const interFontLoad = /document\.fonts\.load\([^)]*Inter[^)]*\)/;
    expect(interFontLoad.test(source)).toBe(false);
  });

  it('enforces MLNBookSans and fitting for printed page Tn(e, true)', () => {
    // Find the definition of Tn function
    const tnMatch = source.match(/function\s+Tn\s*\([^)]*\)\s*\{([\s\S]*?)\n\s*function\s+/);
    expect(tnMatch).not.toBeNull();
    const tnBody = tnMatch![1];

    // Must not directly render unfitted e.title
    expect(tnBody).not.toMatch(/fillText\(\s*e\.title\.toUpperCase\(\)\s*,/);

    // Must normalize title and use fitSingleLineText or fitTextToWidth with MLNBookSans
    expect(tnBody).toContain('normalizeVietnameseText');
    expect(tnBody).toContain('MLNBookSans');
    expect(tnBody).toMatch(/fitSingleLineText|fitTextToWidth/);
  });

  it('enforces MLNBookSans and fitting for internal book page textures Pn(e)', () => {
    // Find the definition of Pn function
    const pnMatch = source.match(/function\s+Pn\s*\([^)]*\)\s*\{([\s\S]*?)\n\s*function\s+/);
    expect(pnMatch).not.toBeNull();
    const pnBody = pnMatch![1];

    // Must not directly render unfitted e.discipline
    expect(pnBody).not.toMatch(/fillText\(\s*e\.discipline\.toUpperCase\(\)\s*,/);

    // Must normalize discipline and use fitSingleLineText or fitTextToWidth
    expect(pnBody).toContain('normalizeVietnameseText');
    expect(pnBody).toContain('MLNBookSans');
    expect(pnBody).toMatch(/fitSingleLineText|fitTextToWidth/);

    // All font declarations inside Pn must target MLNBookSans
    const pnFonts = pnBody.match(/\.font\s*=\s*['`][^'`]+['`]/g) || [];
    expect(pnFonts.length).toBeGreaterThan(0);
    for (const fontDecl of pnFonts) {
      expect(fontDecl).toContain('MLNBookSans');
    }
  });
});
