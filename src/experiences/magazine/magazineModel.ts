import type { MagazineVolume } from './magazineTypes';
import { book1Volume } from './volumes/book1';

export interface MagazinePhysicalSheet {
  front: string;
  back: string;
}

export function getMagazineVolume(index: number): MagazineVolume | null {
  if (index === 0) {
    return book1Volume;
  }
  return null;
}

export function getMagazinePhysicalSheets(volume: MagazineVolume): MagazinePhysicalSheet[] {
  const physicalSheets: MagazinePhysicalSheet[] = [];
  const interiorSheets = volume.sheets;

  if (interiorSheets.length === 0) {
    return [
      {
        front: volume.coverFront.texture,
        back: volume.coverBack.texture,
      },
    ];
  }

  // Sheet 0: coverFront -> first interior sheet front
  physicalSheets.push({
    front: volume.coverFront.texture,
    back: interiorSheets[0].front.texture,
  });

  // Intermediate sheets: interior[i-1].back -> interior[i].front
  for (let i = 1; i < interiorSheets.length; i++) {
    physicalSheets.push({
      front: interiorSheets[i - 1].back.texture,
      back: interiorSheets[i].front.texture,
    });
  }

  // Final sheet: last interior sheet back -> coverBack
  physicalSheets.push({
    front: interiorSheets[interiorSheets.length - 1].back.texture,
    back: volume.coverBack.texture,
  });

  return physicalSheets;
}

export function getMagazinePageCount(volume: MagazineVolume): number {
  const physicalSheets = getMagazinePhysicalSheets(volume);
  return physicalSheets.length + 1;
}

export function clampMagazinePage(volume: MagazineVolume, page: number): number {
  if (typeof page !== 'number' || Number.isNaN(page)) {
    return 0;
  }
  const maxPage = Math.max(0, getMagazinePageCount(volume) - 1);
  return Math.max(0, Math.min(maxPage, Math.floor(page)));
}
