import { describe, expect, it } from 'vitest';
import {
  clampMagazinePage,
  getMagazinePageCount,
  getMagazinePhysicalSheets,
  getMagazineVolume,
} from '../../src/experiences/magazine/magazineModel';

describe('magazineModel', () => {
  it('registers only Book I during M0', () => {
    expect(getMagazineVolume(0)?.id).toBe('part1');
    expect(getMagazineVolume(1)).toBeNull();
    expect(getMagazineVolume(2)).toBeNull();
    expect(getMagazineVolume(3)).toBeNull();
  });

  it('normalizes Book I into physical sheets with cover and back cover', () => {
    const volume = getMagazineVolume(0)!;
    const sheets = getMagazinePhysicalSheets(volume);

    expect(sheets.length).toBe(3);
    expect(sheets[0].front).toBe('/magazine/book1/cover-front.png');
    expect(sheets[2].back).toBe('/magazine/book1/cover-back.png');
  });

  it('exposes page positions from closed front cover through closed back cover', () => {
    const volume = getMagazineVolume(0)!;
    expect(getMagazinePageCount(volume)).toBe(4);
  });

  it('clamps invalid page positions', () => {
    const volume = getMagazineVolume(0)!;
    expect(clampMagazinePage(volume, -10)).toBe(0);
    expect(clampMagazinePage(volume, 2)).toBe(2);
    expect(clampMagazinePage(volume, 99)).toBe(3);
    expect(clampMagazinePage(volume, Number.NaN)).toBe(0);
  });
});
