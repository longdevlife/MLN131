import { Sparkles } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';

export interface MagazineParticlesProps {
  page: number;
  reducedMotion: boolean;
  accentColor?: string;
}

export function MagazineParticles({
  page,
  reducedMotion,
  accentColor = '#C8A86A',
}: MagazineParticlesProps) {
  if (reducedMotion) return null;

  const [showParticles, setShowParticles] = useState(false);
  const prevPage = useRef(page);

  useEffect(() => {
    if (prevPage.current !== page) {
      prevPage.current = page;
      setShowParticles(true);
      const timer = setTimeout(() => {
        setShowParticles(false);
      }, 1500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [page]);

  if (!showParticles) return null;

  return (
    <group position={[0, 0, 0.05]}>
      {/* Golden dust burst */}
      <Sparkles
        count={35}
        scale={[1.5, 2, 0.5]}
        size={3}
        speed={1.5}
        opacity={0.7}
        color="#D4CCC4"
      />
      {/* Accent sparkles */}
      <Sparkles
        count={12}
        scale={[1, 1.5, 0.3]}
        size={2}
        speed={2}
        opacity={0.5}
        color={accentColor}
      />
    </group>
  );
}
