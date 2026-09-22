import { useEffect, useState } from 'react';
import type { MagazineVolume } from './magazineTypes';
import { getMagazinePhysicalSheets } from './magazineModel';
import { MagazinePage } from './MagazinePage';

export interface MagazineBookProps {
  volume: MagazineVolume;
  page: number;
  reducedMotion: boolean;
  onPageChange(page: number): void;
}

export function MagazineBook({
  volume,
  page,
  reducedMotion,
  onPageChange,
}: MagazineBookProps) {
  const [delayedPage, setDelayedPage] = useState(page);
  const sheets = getMagazinePhysicalSheets(volume);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const stepTowardTarget = () => {
      setDelayedPage((current) => {
        if (current === page) {
          return current;
        }

        const distance = Math.abs(page - current);
        const fastDelay = reducedMotion ? 20 : 50;
        const slowDelay = reducedMotion ? 40 : 150;
        const delay = distance > 2 ? fastDelay : slowDelay;

        timeout = setTimeout(stepTowardTarget, delay);

        if (page > current) {
          return current + 1;
        }
        return current - 1;
      });
    };

    stepTowardTarget();

    return () => {
      clearTimeout(timeout);
    };
  }, [page, reducedMotion]);

  return (
    <group rotation-y={-Math.PI / 2}>
      {sheets.map((sheet, index) => (
        <MagazinePage
          key={index}
          number={index}
          front={sheet.front}
          back={sheet.back}
          currentPage={delayedPage}
          opened={delayedPage > index}
          bookClosed={delayedPage === 0 || delayedPage === sheets.length}
          reducedMotion={reducedMotion}
          accentColor={volume.theme.accent}
          onRequestPage={onPageChange}
        />
      ))}
    </group>
  );
}
