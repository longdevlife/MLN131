import { describe, expect, it } from 'vitest';
import {
  clampMagazinePage,
  getMagazinePageCount,
  getMagazinePhysicalSheets,
  getMagazineVolume,
} from '../../src/experiences/magazine/magazineModel';

describe('magazineModel', () => {
  it('registers only Book I during M0 and M1A', () => {
    expect(getMagazineVolume(0)?.id).toBe('part1');
    expect(getMagazineVolume(1)).toBeNull();
    expect(getMagazineVolume(2)).toBeNull();
    expect(getMagazineVolume(3)).toBeNull();
  });

  it('wires Book I into seven interior sheets and eight physical sheets', () => {
    const volume = getMagazineVolume(0)!;

    expect(volume.sheets).toHaveLength(7);
    expect(volume.sheets[0].front.texture).toBe('/magazine/book1/page-01.png');
    expect(volume.sheets[0].back.texture).toBe('/magazine/book1/page-02.png');
    expect(volume.sheets[6].front.texture).toBe('/magazine/book1/page-13.png');
    expect(volume.sheets[6].back.texture).toBe('/magazine/book1/page-14.png');

    const interiorPageIds = volume.sheets.flatMap((sheet) => [
      sheet.front.id,
      sheet.back.id,
    ]);
    expect(new Set(interiorPageIds).size).toBe(14);
    expect(interiorPageIds).toHaveLength(14);

    const sheets = getMagazinePhysicalSheets(volume);
    expect(sheets).toHaveLength(8);
    expect(sheets[0].front).toBe('/magazine/book1/cover-front.png');
    expect(sheets[0].back).toBe('/magazine/book1/page-01.png');
    expect(sheets[7].front).toBe('/magazine/book1/page-14.png');
    expect(sheets[7].back).toBe('/magazine/book1/cover-back.png');
  });

  it('exposes page positions from closed front cover through closed back cover (0 to 8)', () => {
    const volume = getMagazineVolume(0)!;
    expect(getMagazinePageCount(volume)).toBe(9);
  });

  it('clamps invalid page positions', () => {
    const volume = getMagazineVolume(0)!;
    expect(clampMagazinePage(volume, -10)).toBe(0);
    expect(clampMagazinePage(volume, 4)).toBe(4);
    expect(clampMagazinePage(volume, 99)).toBe(8);
    expect(clampMagazinePage(volume, Number.NaN)).toBe(0);
  });
});
