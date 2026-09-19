import { useEffect, useRef } from 'react';
import { usePresentationStore } from '../state/presentationStore';

export function usePerformanceTier() {
  const qualityTier = usePresentationStore((state) => state.qualityTier);
  const setQualityTier = usePresentationStore((state) => state.setQualityTier);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const lowFpsCountRef = useRef(0);

  useEffect(() => {
    // If already in safe mode, no need to monitor
    if (qualityTier === 'safe') return;

    // Honor explicit tier lock in query param for testing / presentation lock
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tier') === 'high' || params.get('lock-tier') === '1') {
        return;
      }
    }

    let animId: number;

    const checkFps = (now: number) => {
      frameCountRef.current++;
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= 2000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / elapsed);
        frameCountRef.current = 0;
        lastTimeRef.current = now;

        // If sustained FPS < 28, step down quality tier
        if (currentFps < 28) {
          lowFpsCountRef.current++;
          if (lowFpsCountRef.current >= 2) {
            if (qualityTier === 'high') {
              console.warn(`[PerformanceGuard] FPS dropped to ${currentFps}. Downgrading qualityTier to medium.`);
              setQualityTier('medium');
            } else if (qualityTier === 'medium') {
              console.warn(`[PerformanceGuard] FPS still low (${currentFps}). Switching to safe mode.`);
              setQualityTier('safe');
            }
            lowFpsCountRef.current = 0;
          }
        } else {
          lowFpsCountRef.current = Math.max(0, lowFpsCountRef.current - 1);
        }
      }

      animId = requestAnimationFrame(checkFps);
    };

    animId = requestAnimationFrame(checkFps);
    return () => cancelAnimationFrame(animId);
  }, [qualityTier, setQualityTier]);

  // Particle scale factor based on tier
  const particleScale = qualityTier === 'high' ? 1.0 : qualityTier === 'medium' ? 0.35 : 0;

  return { qualityTier, particleScale };
}
