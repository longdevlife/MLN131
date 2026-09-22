import { ContactShadows, Float, OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import type { MagazineViewMode, MagazineVolume } from './magazineTypes';
import { MagazineBook } from './MagazineBook';
import { MagazineParticles } from './MagazineParticles';

export interface MagazineSceneProps {
  volume: MagazineVolume;
  page: number;
  viewMode: MagazineViewMode;
  reducedMotion: boolean;
  onPageChange(page: number): void;
  onCameraSettled?(settled: boolean): void;
}

const SHOWCASE_POS = new Vector3(0, 1.2, 5);
const READING_POS = new Vector3(0, 0.6, 3);

function CameraAnimator({
  viewMode,
  reducedMotion,
  onSettled,
}: {
  viewMode: MagazineViewMode;
  reducedMotion: boolean;
  onSettled?(settled: boolean): void;
}) {
  const { camera } = useThree();
  const animating = useRef(false);
  const prevMode = useRef(viewMode);

  useEffect(() => {
    if (prevMode.current !== viewMode) {
      animating.current = true;
      prevMode.current = viewMode;
      onSettled?.(false);
    }
  }, [viewMode, onSettled]);

  useFrame((_, delta) => {
    if (!animating.current) return;

    const target = viewMode === 'reading' ? READING_POS : SHOWCASE_POS;

    if (reducedMotion) {
      camera.position.copy(target);
      animating.current = false;
      onSettled?.(true);
      return;
    }

    const step = Math.min(1, delta * 3);
    camera.position.lerp(target, step);

    if (camera.position.distanceTo(target) < 0.04) {
      camera.position.copy(target);
      animating.current = false;
      onSettled?.(true);
    }
  });

  return null;
}

export function MagazineScene({
  volume,
  page,
  viewMode,
  reducedMotion,
  onPageChange,
  onCameraSettled,
}: MagazineSceneProps) {
  const isReading = viewMode === 'reading';

  return (
    <>
      <CameraAnimator
        viewMode={viewMode}
        reducedMotion={reducedMotion}
        onSettled={onCameraSettled}
      />

      {/* Ambient and directional lights */}
      <ambientLight intensity={0.9} />
      <directionalLight
        position={[2, 5, 2]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-2, 5, -2]} intensity={0.5} />

      {/* Floating 3D Magazine */}
      <Float
        rotation-x={-Math.PI / 4}
        floatIntensity={isReading ? 0.1 : 1}
        speed={isReading ? 0.5 : 1}
        rotationIntensity={isReading ? 0.02 : 0.1}
      >
        <MagazineBook
          volume={volume}
          page={page}
          reducedMotion={reducedMotion}
          onPageChange={onPageChange}
        />
        <MagazineParticles
          page={page}
          reducedMotion={reducedMotion}
          accentColor={volume.theme.accent}
        />
      </Float>

      {/* Ground contact shadow */}
      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.6}
        scale={10}
        blur={2}
        far={4}
      />

      {/* OrbitControls */}
      <OrbitControls
        enableRotate={!isReading}
        enablePan={false}
        minDistance={2}
        maxDistance={10}
      />
    </>
  );
}
