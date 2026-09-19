import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface StructureFlowSceneProps {
  beatIndex?: number;
  qualityTier?: 'high' | 'medium' | 'safe';
}

interface FlowGate {
  id: string;
  step: string;
  title: string;
  sub: string;
  x: number;
  color: string;
}

const GATES: FlowGate[] = [
  { id: 'gate-kt', step: 'Bước 1', title: 'Cơ cấu kinh tế', sub: 'Nhiều thành phần / CNH-HĐH', x: -3.3, color: '#C8A86A' },
  { id: 'gate-ld', step: 'Bước 2', title: 'Cơ cấu lao động', sub: 'Chuyển dịch ngành nghề', x: -1.1, color: '#9FB3C9' },
  { id: 'gate-dv', step: 'Bước 3', title: 'Địa vị các giai tầng', sub: 'Vị thế trong phân công LĐ', x: 1.1, color: '#76A394' },
  { id: 'gate-gc', step: 'Bước 4', title: 'Cơ cấu XH – giai cấp', sub: 'Biến đổi tương ứng', x: 3.3, color: '#C87046' },
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
    positions[i * 3] = (rand() - 0.5) * 8; // X across the flow
    positions[i * 3 + 1] = (rand() - 0.5) * 1.5; // Y spread
    positions[i * 3 + 2] = (rand() - 0.5) * 0.8; // Z depth
    speeds[i] = 0.8 + rand() * 1.2;
    offsets[i * 2] = positions[i * 3 + 1];
    offsets[i * 2 + 1] = positions[i * 3 + 2];
  }

  return { positions, speeds, offsets };
}

export const StructureFlowScene: React.FC<StructureFlowSceneProps> = ({
  beatIndex = 0,
  qualityTier = 'high',
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = qualityTier === 'high' ? 240 : 100;
  const particleData = useMemo(() => createFlowParticles(particleCount), [particleCount]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (pointsRef.current) {
      const geo = pointsRef.current.geometry;
      const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
      const maxX = beatIndex >= 1 ? 4.2 : 0.2; // Gate barrier depending on beat
      const minX = -4.5;

      for (let i = 0; i < particleCount; i++) {
        let x = particleData.positions[i * 3] + t * particleData.speeds[i] * 0.4;
        // Wrap around
        const span = maxX - minX;
        x = minX + ((x - minX) % span);
        posAttr.setXYZ(i, x, particleData.offsets[i * 2] + Math.sin(t * 2 + x) * 0.1, particleData.offsets[i * 2 + 1]);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 4 Gates across the flow */}
      {GATES.map((gate, i) => {
        const isReached = beatIndex >= 1 || i <= 1;
        return (
          <group key={gate.id} position={[gate.x, 0, 0]}>
            {/* Gate frame ring */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[1.2, 0.04, 16, 32]} />
              <meshStandardMaterial
                color={gate.color}
                emissive={gate.color}
                emissiveIntensity={isReached ? 0.6 : 0.1}
                transparent
                opacity={isReached ? 0.9 : 0.25}
              />
            </mesh>

            {/* Inner glow disc */}
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[1.15, 32]} />
              <meshBasicMaterial
                color={gate.color}
                transparent
                opacity={isReached ? 0.08 : 0.02}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Gate label HTML */}
            <Html position={[0, -1.6, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
              <div
                style={{
                  background: 'rgba(15, 18, 24, 0.92)',
                  border: `1px solid ${isReached ? gate.color : '#3A2118'}`,
                  borderRadius: '6px',
                  padding: '6px 12px',
                  color: '#F5F0E8',
                  textAlign: 'center',
                  minWidth: '150px',
                  pointerEvents: 'none',
                  backdropFilter: 'blur(6px)',
                  opacity: isReached ? 1 : 0.4,
                  boxShadow: isReached ? `0 4px 16px ${gate.color}33` : 'none',
                }}
              >
                <div style={{ fontSize: '10px', color: gate.color, fontWeight: 700, textTransform: 'uppercase' }}>
                  {gate.step}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, marginTop: '2px' }}>
                  {gate.title}
                </div>
                <div style={{ fontSize: '10px', color: '#9FB3C9', marginTop: '2px' }}>
                  {gate.sub}
                </div>
              </div>
            </Html>
          </group>
        );
      })}

      {/* Connecting Flow Beam */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 7.5, 16]} />
        <meshBasicMaterial color="#C8A86A" transparent opacity={0.3} />
      </mesh>

      {/* Flowing Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleData.positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#F5F0E8"
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>

      {/* Illumination */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 5, 5]} intensity={1.2} color="#F5F0E8" />
      <pointLight position={[-3, 0, 2]} intensity={1.5} color="#C8A86A" distance={6} />
      <pointLight position={[3, 0, 2]} intensity={beatIndex >= 1 ? 2.0 : 0.5} color="#C87046" distance={6} />
    </group>
  );
};
