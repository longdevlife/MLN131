import { describe, expect, it } from 'vitest';
import {
  fitSingleLineText,
  fitTextToWidth,
  normalizeVietnameseText,
  type TextMeasuringContext,
} from '../../src/vendor/threeui-custom/bookshelf/typographyUtils';

/**
 * Creates a deterministic mock measuring context where character widths
 * approximate real sans-serif typography (~0.58 * fontSize for Latin/Vietnamese).
 */
function createMockMeasuringContext(charWidthFactor = 0.58): TextMeasuringContext {
  let currentFont = '400 64px MLNBookSans';

  return {
    get font() {
      return currentFont;
    },
    set font(f: string) {
      currentFont = f;
    },
    measureText(text: string) {
      const match = currentFont.match(/(\d+)px/);
      const fontSize = match ? Number.parseInt(match[1], 10) : 64;
      // Calculate realistic width based on characters
      const width = text.length * (fontSize * charWidthFactor);
      return { width };
    },
  };
}

describe('typographyUtils: normalizeVietnameseText', () => {
  it('normalizes decomposed Unicode (NFD) into precomposed Unicode (NFC)', () => {
    // "Cơ cấu" in NFD: 'C' + 'o' + Combining Horn + ...
    const nfdText = 'Co\u031B ca\u0302\u0301u xa\u0303 ho\u0323\u0302i \u2013 giai ca\u0302\u0301p';
    const nfcText = normalizeVietnameseText(nfdText);

    // NFC length is shorter because combining diacritics are fused
    expect(nfcText.length).toBeLessThan(nfdText.length);
    expect(nfcText).toBe('Cơ cấu xã hội – giai cấp');
  });

  it('collapses extra spaces and trims edges', () => {
    expect(normalizeVietnameseText('   Phương   hướng   &  giải pháp   ')).toBe(
      'Phương hướng & giải pháp'
    );
  });
});

describe('typographyUtils: fitTextToWidth for Bookshelf Titles', () => {
  const titles = [
    { roman: 'I', title: 'Cơ cấu xã hội – giai cấp' },
    { roman: 'II', title: 'Tính tất yếu của liên minh' },
    { roman: 'III', title: 'Việt Nam hiện nay' },
    { roman: 'IV', title: 'Phương hướng & giải pháp' },
  ];

  titles.forEach(({ roman, title }) => {
    it(`fits Volume ${roman} ("${title}") within safe cover width (<= 610px) and <= 2 lines`, () => {
      const ctx = createMockMeasuringContext();
      const maxWidth = 610;

      const result = fitTextToWidth(ctx, title, {
        maxWidth,
        maxLines: 2,
        startSize: 70,
        minSize: 42,
        lineHeight: 1.12,
        fontFamily: 'MLNBookSans',
      });

      // 1. Must fit within 2 lines
      expect(result.lines.length).toBeGreaterThan(0);
      expect(result.lines.length).toBeLessThanOrEqual(2);

      // 2. No empty lines
      result.lines.forEach((line) => {
        expect(line.trim().length).toBeGreaterThan(0);
      });

      // 3. Every line width <= maxWidth
      result.lines.forEach((line) => {
        ctx.font = `400 ${result.fontSize}px MLNBookSans`;
        const measured = ctx.measureText(line).width;
        expect(measured).toBeLessThanOrEqual(maxWidth);
      });

      // 4. Original text preserved when rejoined
      const rejoined = result.lines.join(' ');
      expect(rejoined).toBe(title);

      // 5. Font size within expected range [42, 70]
      expect(result.fontSize).toBeGreaterThanOrEqual(42);
      expect(result.fontSize).toBeLessThanOrEqual(70);

      // 6. Explicitly assert fits === true for production title
      expect(result.fits).toBe(true);
    });
  });

  it('fits decomposed NFD Vietnamese text accurately into NFC lines with fits === true', () => {
    const ctx = createMockMeasuringContext();
    const nfd = 'Ti\u0301nh ta\u0302\u0301t ye\u0302\u0301u cu\u0309a lie\u0302n minh';
    const result = fitTextToWidth(ctx, nfd, {
      maxWidth: 610,
      maxLines: 2,
      startSize: 70,
      minSize: 42,
    });

    expect(result.lines.join(' ')).toBe('Tính tất yếu của liên minh');
    expect(result.lines.length).toBeLessThanOrEqual(2);
    expect(result.fits).toBe(true);
  });

  it('never discards words even when constraints cannot be satisfied (fits === false)', () => {
    const ctx = createMockMeasuringContext();
    const longTitle = 'Một tiêu đề tiếng Việt rất dài có nhiều chữ không thể nhét vừa trong hai dòng';

    // Constrain to narrow width and max 2 lines
    const result = fitTextToWidth(ctx, longTitle, {
      maxWidth: 150,
      maxLines: 2,
      startSize: 42,
      minSize: 36,
    });

    // Must NOT discard words (no slice(0, maxLines))
    expect(result.fits).toBe(false);
    expect(result.lines.length).toBeGreaterThan(2);
    expect(result.lines.join(' ')).toBe(longTitle);
  });
});

describe('typographyUtils: fitSingleLineText for Disciplines & Spine', () => {
  const disciplines = [
    'KHÁI LUẬN & QUY LUẬT',
    'CƠ SỞ LÝ LUẬN & THỰC TIỄN',
    'THỰC TIỄN & BIẾN ĐỔI',
    'ĐỊNH HƯỚNG CHIẾN LƯỢC',
  ];

  disciplines.forEach((discipline) => {
    it(`fits single-line discipline "${discipline}" within maxWidth`, () => {
      const ctx = createMockMeasuringContext();
      const maxWidth = 500;

      const result = fitSingleLineText(ctx, discipline, {
        maxWidth,
        startSize: 18,
        minSize: 12,
        fontFamily: 'MLNBookSans',
        fontWeight: 500,
      });

      expect(result.width).toBeLessThanOrEqual(maxWidth);
      expect(result.fontSize).toBeGreaterThanOrEqual(12);
      expect(result.fontSize).toBeLessThanOrEqual(18);
      expect(result.text).toBe(discipline);
    });
  });
});
