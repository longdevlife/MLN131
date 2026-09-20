import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import { usePresentationStore } from '../../state/presentationStore';
import { getMagazinePageCount, getMagazineVolume } from './magazineModel';
import { book1Volume } from './volumes/book1';
import { MagazineChrome } from './MagazineChrome';
import { MagazineScene } from './MagazineScene';
import './magazine.css';

export function MagazineExperience() {
  const selectedBook = usePresentationStore((s) => s.selectedBook);
  const magazinePage = usePresentationStore((s) => s.magazinePage);
  const magazineViewMode = usePresentationStore((s) => s.magazineViewMode);
  const reducedMotion = usePresentationStore((s) => s.reducedMotion);

  const closeMagazine = usePresentationStore((s) => s.closeMagazine);
  const setMagazinePage = usePresentationStore((s) => s.setMagazinePage);
  const toggleMagazineViewMode = usePresentationStore((s) => s.toggleMagazineViewMode);

  const volume = getMagazineVolume(selectedBook) || book1Volume;
  const pageCount = getMagazinePageCount(volume);

  const [cameraSettled, setCameraSettled] = useState(true);
  const [pageSettled, setPageSettled] = useState(true);

  // Audio management: preloaded once, played non-fatally on page change
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInitialRender = useRef(true);

  useEffect(() => {
    try {
      const audio = new Audio('/audios/page-flip-01a.mp3');
      audio.preload = 'auto';
      audioRef.current = audio;
    } catch {
      // Audio not supported in environment
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    setPageSettled(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    const settleTimer = setTimeout(() => {
      setPageSettled(true);
    }, reducedMotion ? 100 : 500);

    return () => {
      clearTimeout(settleTimer);
    };
  }, [magazinePage, reducedMotion]);

  const handlePrev = () => {
    if (magazinePage > 0) {
      setMagazinePage(magazinePage - 1);
    }
  };

  const handleNext = () => {
    if (magazinePage < pageCount - 1) {
      setMagazinePage(magazinePage + 1);
    }
  };

  const isSettled = cameraSettled && pageSettled;

  return (
    <div
      className="magazine-experience"
      data-magazine-settled={isSettled ? 'true' : 'false'}
    >
      <div className="magazine-canvas-container">
        <Canvas
          camera={{ position: [0, 1.2, 5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ powerPreference: 'high-performance', antialias: true }}
          shadows
        >
          <Suspense fallback={null}>
            <MagazineScene
              volume={volume}
              page={magazinePage}
              viewMode={magazineViewMode}
              reducedMotion={reducedMotion}
              onPageChange={setMagazinePage}
              onCameraSettled={setCameraSettled}
            />
          </Suspense>
        </Canvas>
      </div>

      <MagazineChrome
        volume={volume}
        page={magazinePage}
        viewMode={magazineViewMode}
        pageCount={pageCount}
        onClose={closeMagazine}
        onPrev={handlePrev}
        onNext={handleNext}
        onToggleViewMode={toggleMagazineViewMode}
      />
    </div>
  );
}

export default MagazineExperience;
