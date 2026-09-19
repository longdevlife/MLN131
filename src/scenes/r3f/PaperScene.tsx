import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PaperSceneProps {
  beatIndex?: number;
}

// Procedural subtle paper texture generator
function createPaperTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#EDE4D6';
    ctx.fillRect(0, 0, 512, 512);

    // Deterministic pseudo-random parchment grain
    let seed = 12345;
    const nextRand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    for (let i = 0; i < 4000; i++) {
      const x = nextRand() * 512;
      const y = nextRand() * 512;
      ctx.fillStyle = nextRand() > 0.5 ? 'rgba(0,0,0,0.015)' : 'rgba(255,255,255,0.025)';
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    // Elegant inner border
    ctx.strokeStyle = 'rgba(200, 168, 106, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 24, 464, 464);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

export const PaperScene: React.FC<PaperSceneProps> = ({ beatIndex = 0 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const leftPageRef = useRef<THREE.Group>(null);
  const rightPageRef = useRef<THREE.Group>(null);

  const paperTexture = useMemo(() => createPaperTexture(), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Gentle breathing motion
      meshRef.current.position.y = Math.sin(t * 0.8) * 0.05;
      meshRef.current.rotation.y = Math.sin(t * 0.4) * 0.03;
    }
    if (leftPageRef.current) {
      const targetAngle = beatIndex > 0 ? -0.15 : -0.28;
      leftPageRef.current.rotation.y = THREE.MathUtils.lerp(leftPageRef.current.rotation.y, targetAngle, 0.05);
    }
    if (rightPageRef.current) {
      const targetAngle = beatIndex > 0 ? 0.15 : 0.28;
      rightPageRef.current.rotation.y = THREE.MathUtils.lerp(rightPageRef.current.rotation.y, targetAngle, 0.05);
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Folio spine / center */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[0.08, 3.8, 0.15]} />
        <meshStandardMaterial color="#3A2118" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Left page leaf */}
      <group ref={leftPageRef} position={[-0.04, 0, 0]}>
        <mesh position={[-1.3, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 3.6, 0.02]} />
          <meshStandardMaterial
            map={paperTexture}
            roughness={0.92}
            metalness={0.02}
            color="#EDE4D6"
          />
        </mesh>
      </group>

      {/* Right page leaf */}
      <group ref={rightPageRef} position={[0.04, 0, 0]}>
        <mesh position={[1.3, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 3.6, 0.02]} />
          <meshStandardMaterial
            map={paperTexture}
            roughness={0.92}
            metalness={0.02}
            color="#EDE4D6"
          />
        </mesh>
      </group>

      {/* Warm accent light */}
      <pointLight position={[0, 2, 3]} intensity={1.2} color="#F5F0E8" distance={8} />
      <pointLight position={[0, -2, 2]} intensity={0.5} color="#C8A86A" distance={6} />
    </group>
  );
};
