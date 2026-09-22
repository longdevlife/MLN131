import { describe, expect, it } from 'vitest';
import {
  clampMagazinePage,
  getMagazinePageCount,
  getMagazinePhysicalSheets,
  getMagazineVolume,
} from '../../src/experiences/magazine/magazineModel';

describe('magazineModel', () => {
  it('registers exactly three independent magazine volumes', () => {
    expect(getMagazineVolume(0)?.id).toBe('part1');
    expect(getMagazineVolume(1)?.id).toBe('part2');
    expect(getMagazineVolume(2)?.id).toBe('part3');
    expect(getMagazineVolume(3)).toBeNull();
  });

  it('keeps Book I authored magazine intact', () => {
    const volume = getMagazineVolume(0)!;
    expect(volume.sheets).toHaveLength(7);
    expect(volume.sheets[0].front.texture).toBe('/magazine/book1/page-01.png');
    expect(volume.sheets[6].back.texture).toBe('/magazine/book1/page-14.png');
    expect(getMagazinePhysicalSheets(volume)).toHaveLength(8);
    expect(getMagazinePageCount(volume)).toBe(9);
  });

  it('gives Book II and III distinct magazine identities and assets', () => {
    const book2 = getMagazineVolume(1)!;
    const book3 = getMagazineVolume(2)!;
    expect(book2.id).toBe('part2');
    expect(book3.id).toBe('part3');
    expect(book2.coverFront.texture).toBe('/magazine/book2/cover-front.svg');
    expect(book3.coverFront.texture).toBe('/magazine/book3/cover-front.svg');
    expect(book2.sheets).toHaveLength(2);
    expect(book3.sheets).toHaveLength(2);
    expect(getMagazinePageCount(book2)).toBe(4);
    expect(getMagazinePageCount(book3)).toBe(4);
  });

  it('clamps page positions per selected volume', () => {
    expect(clampMagazinePage(getMagazineVolume(0)!, 99)).toBe(8);
    expect(clampMagazinePage(getMagazineVolume(1)!, 99)).toBe(3);
    expect(clampMagazinePage(getMagazineVolume(2)!, Number.NaN)).toBe(0);
  });
});
