/**
 * Pure typography and text fitting utilities for Bookshelf Canvas textures.
 * Enforces NFC normalization, local font usage, and strict line/width boundaries.
 */

export interface TextMeasuringContext {
  font: string;
  measureText(text: string): { width: number };
}

export interface FitTextOptions {
  maxWidth: number;
  maxLines?: number;
  startSize?: number;
  minSize?: number;
  lineHeight?: number; // e.g. 1.12
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  step?: number;
}

export interface FitTextResult {
  text: string;
  fontSize: number;
  lines: string[];
  lineHeightPx: number;
  totalHeightPx: number;
  maxLineWidth: number;
  fits: boolean;
}

/**
 * Normalizes Vietnamese text to Unicode NFC and collapses extraneous whitespace.
 */
export function normalizeVietnameseText(text: string): string {
  if (!text) return '';
  return text.normalize('NFC').trim().replace(/\s+/g, ' ');
}

/**
 * Helper to build the CSS font string.
 */
export function buildFontString(
  fontSize: number,
  fontFamily = 'MLNBookSans',
  fontWeight: string | number = 400,
  fontStyle = 'normal'
): string {
  return `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`.trim();
}

/**
 * Word wraps text for a given candidate font size and maxWidth.
 */
function wrapText(
  ctx: TextMeasuringContext,
  text: string,
  maxWidth: number
): { lines: string[]; maxLineWidth: number } {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return { lines: [], maxLineWidth: 0 };
  }

  const lines: string[] = [];
  let currentLine = words[0];
  let maxLineWidth = 0;

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = `${currentLine} ${word}`;
    const measured = ctx.measureText(testLine).width;

    if (measured <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      const curWidth = ctx.measureText(currentLine).width;
      if (curWidth > maxLineWidth) maxLineWidth = curWidth;
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
    const curWidth = ctx.measureText(currentLine).width;
    if (curWidth > maxLineWidth) maxLineWidth = curWidth;
  }

  return { lines, maxLineWidth };
}

/**
 * Fits text within maxWidth and maxLines by reducing font size from startSize to minSize.
 * Never allows text to exceed maxWidth or maxLines.
 */
export function fitTextToWidth(
  ctx: TextMeasuringContext,
  rawText: string,
  options: FitTextOptions
): FitTextResult {
  const text = normalizeVietnameseText(rawText);
  const {
    maxWidth,
    maxLines = 2,
    startSize = 70,
    minSize = 42,
    lineHeight = 1.12,
    fontFamily = 'MLNBookSans',
    fontWeight = 400,
    fontStyle = 'normal',
    step = 1,
  } = options;

  if (!text) {
    return {
      text: '',
      fontSize: startSize,
      lines: [],
      lineHeightPx: Math.round(startSize * lineHeight),
      totalHeightPx: 0,
      maxLineWidth: 0,
      fits: true,
    };
  }

  let currentFontSize = startSize;
  let bestResult: { lines: string[]; maxLineWidth: number } | null = null;
  let fits = false;

  while (currentFontSize >= minSize) {
    ctx.font = buildFontString(currentFontSize, fontFamily, fontWeight, fontStyle);
    const wrapped = wrapText(ctx, text, maxWidth);

    const withinLines = wrapped.lines.length <= maxLines;
    const withinWidth = wrapped.maxLineWidth <= maxWidth;

    if (withinLines && withinWidth) {
      bestResult = wrapped;
      fits = true;
      break;
    }

    // Keep the least-overflowing wrap in case even minSize exceeds
    if (!bestResult || wrapped.lines.length < bestResult.lines.length) {
      bestResult = wrapped;
    }

    currentFontSize -= step;
  }

  // If even minSize did not satisfy line count, enforce maxLines
  const finalFontSize = fits ? currentFontSize : minSize;
  ctx.font = buildFontString(finalFontSize, fontFamily, fontWeight, fontStyle);
  let finalWrap = bestResult || wrapText(ctx, text, maxWidth);

  // If still exceeds maxLines at minSize, truncate into maxLines
  if (finalWrap.lines.length > maxLines) {
    const forcedLines = finalWrap.lines.slice(0, maxLines);
    finalWrap = {
      lines: forcedLines,
      maxLineWidth: Math.max(...forcedLines.map((l) => ctx.measureText(l).width), 0),
    };
  }

  const lineHeightPx = Math.round(finalFontSize * lineHeight);
  const totalHeightPx = finalWrap.lines.length * lineHeightPx;

  return {
    text,
    fontSize: finalFontSize,
    lines: finalWrap.lines,
    lineHeightPx,
    totalHeightPx,
    maxLineWidth: finalWrap.maxLineWidth,
    fits,
  };
}

/**
 * Fits a single-line label (such as discipline) into maxWidth by decreasing font size.
 */
export function fitSingleLineText(
  ctx: TextMeasuringContext,
  rawText: string,
  options: {
    maxWidth: number;
    startSize: number;
    minSize: number;
    fontFamily?: string;
    fontWeight?: string | number;
    fontStyle?: string;
    step?: number;
  }
): { text: string; fontSize: number; width: number } {
  const text = normalizeVietnameseText(rawText);
  const {
    maxWidth,
    startSize,
    minSize,
    fontFamily = 'MLNBookSans',
    fontWeight = 500,
    fontStyle = 'normal',
    step = 1,
  } = options;

  let size = startSize;
  while (size >= minSize) {
    ctx.font = buildFontString(size, fontFamily, fontWeight, fontStyle);
    const measured = ctx.measureText(text).width;
    if (measured <= maxWidth) {
      return { text, fontSize: size, width: measured };
    }
    size -= step;
  }

  const finalSize = Math.max(minSize, size);
  ctx.font = buildFontString(finalSize, fontFamily, fontWeight, fontStyle);
  return {
    text,
    fontSize: finalSize,
    width: ctx.measureText(text).width,
  };
}
