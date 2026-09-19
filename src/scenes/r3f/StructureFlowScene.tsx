import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { PresentationScene } from '../../content/types';

interface StructureFlowSceneProps {
  scene?: PresentationScene;
  beatIndex?: number;
  qualityTier?: 'high' | 'medium' | 'safe';
}

interface FlowGateConfig {
  id: string;
  step: string;
  defaultTitle: string;
  defaultSub: string;
  x: number;
  color: string;
}

const GATE_CONFIGS: FlowGateConfig[] = [
  { id: 'GATE_1', step: 'Bước 1', defaultTitle: 'Cơ cấu kinh tế', defaultSub: 'Nhiều thành phần / CNH-HĐH', x: -3.6, color: '#C8A86A' },
  { id: 'GATE_2', step: 'Bước 2', defaultTitle: 'Ngành & Sở hữu', defaultSub: 'Phương thức sản xuất', x: -1.8, color: '#9FB3C9' },
  { id: 'GATE_3', step: 'Bước 3', defaultTitle: 'Phân công lao động', defaultSub: 'Cơ cấu việc làm & ngành nghề', x: 0.0, color: '#76A394' },
  { id: 'GATE_4', step: 'Bước 4', defaultTitle: 'Địa vị & Vai trò', defaultSub: 'Vị thế giai tầng xã hội', x: 1.8, color: '#E0A96D' },
  { id: 'GATE_5', step: 'Bước 5', defaultTitle: 'Cơ cấu XH – Giai cấp', defaultSub: 'Biến đổi tương ứng', x: 3.6, color: '#C87046' },
];

function createFlowParticles(count: number): { positions: Float32Array; speeds: Float32Array; offsets: Float32Array } {
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  const offsets = new Float32Array(count * 2);

  let seed = 777;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (rand() - 0.5) * 8.5;
    positions[i * 3 + 1] = (rand() - 0.5) * 1.5;
    positions[i * 3 + 2] = (rand() - 0.5) * 0.8;
    speeds[i] = 0.9 + rand() * 1.2;
    offsets[i * 2] = positions[i * 3 + 1];
    offsets[i * 2 + 1] = positions[i * 3 + 2];
  }

  return { positions, speeds, offsets };
}

export const StructureFlowScene: React.FC<StructureFlowSceneProps> = ({
  scene,
  beatIndex = 0,
  qualityTier = 'high',
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = qualityTier === 'high' ? 260 : 120;
  const particleData = useMemo(() => createFlowParticles(particleCount), [particleCount]);

  // Max X boundary for particle flow advances with each beat
  const targetMaxX = useMemo(() => {
    switch (beatIndex) {
      case 0: return -3.2;
      case 1: return -1.4;
      case 2: return 0.4;
      case 3: return 2.2;
      default: return 4.8;
    }
  }, [beatIndex]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (pointsRef.current) {
      const geo = pointsRef.current.geometry;
      const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
      const minX = -4.8;
      const maxX = targetMaxX;
      const span = Math.max(maxX - minX, 0.5);

      for (let i = 0; i < particleCount; i++) {
        let x = particleData.positions[i * 3] + t * particleData.speeds[i] * 0.45;
        x = minX + ((x - minX) % span);
        posAttr.setXYZ(
          i,
          x,
          particleData.offsets[i * 2] + Math.sin(t * 2 + x) * 0.12,
          particleData.offsets[i * 2 + 1]
        );
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 5 Sequential Causal Gates */}
      {GATE_CONFIGS.map((gate, i) => {
        const canonical = scene?.visualLabels?.find((l) => l.id === gate.id);
        const title = canonical?.text || gate.defaultTitle;
        const sub = canonical?.sub || gate.defaultSub;
        const role = canonical?.role;
        const isReached = beatIndex >= i;
        const isCurrentBeat = beatIndex === i;

        return (
          <group key={gate.id} position={[gate.x, 0, 0]}>
            {/* Gate frame ring */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[1.2, 0.045, 16, 32]} />
              <meshStandardMaterial
                color={gate.color}
                emissive={gate.color}
                emissiveIntensity={isCurrentBeat ? 0.9 : isReached ? 0.5 : 0.1}
                transparent
                opacity={isReached ? 0.95 : 0.25}
              />
            </mesh>

            {/* Inner glow disc */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[1.15, 32]} />
              <meshBasicMaterial
                color={gate.color}
                transparent
                opacity={isCurrentBeat ? 0.25 : isReached ? 0.12 : 0.02}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Gate step tag & Title */}
            <Html
              position={[0, 1.55, 0]}
              center
              distanceFactor={10}
              zIndexRange={[100, 0]}
            >
              <div
                style={{
                  background: isCurrentBeat ? 'rgba(23, 26, 36, 0.98)' : 'rgba(23, 26, 36, 0.85)',
                  border: `1.5px solid ${isCurrentBeat ? gate.color : `${gate.color}66`}`,
                  borderRadius: '6px',
                  padding: '5px 10px',
                  color: '#F5F0E8',
                  textAlign: 'center',
                  minWidth: '150px',
                  pointerEvents: 'none',
                  backdropFilter: 'blur(6px)',
                  boxShadow: isCurrentBeat ? `0 6px 20px ${gate.color}44` : 'none',
                  opacity: isReached ? 1 : 0.4,
                  transform: isCurrentBeat ? 'scale(1.05)' : 'scale(1.0)',
                  transition: 'all 0.4s ease',
                }}
              >
                <div style={{ fontSize: '10px', fontWeight: 800, color: gate.color }}>
                  {gate.step}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', marginTop: '1px' }}>
                  {title}
                </div>
                <div style={{ fontSize: '9.5px', color: '#9FB3C9', marginTop: '1px' }}>
                  {sub}
                </div>
                {isCurrentBeat && role && (
                  <div
                    style={{
                      fontSize: '8.5px',
                      color: '#E0E0E0',
                      marginTop: '3px',
                      paddingTop: '2px',
                      borderTop: '1px solid rgba(255,255,255,0.15)',
                      lineHeight: 1.25,
                    }}
                  >
                    {role}
                  </div>
                )}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Particle Flow Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(particleCount * 3), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={qualityTier === 'high' ? 0.085 : 0.07}
          color="#C8A86A"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Illumination */}
      <ambientLight intensity={0.6} color="#F5F0E8" />
      <directionalLight position={[0, 5, 5]} intensity={1.2} color="#FFF8ED" />
      <pointLight position={[0, 0, 2]} intensity={2.0} color="#C87046" distance={8} />
    </group>
  );
};
