import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';

interface OrbitalCentralitySceneProps {
  beatIndex?: number;
  qualityTier?: 'high' | 'medium' | 'safe';
}

interface SatelliteConfig {
  id: string;
  name: string;
  sub: string;
  radius: number;
  speed: number;
  phase: number;
  color: string;
  tilt: number;
}

const SATELLITES: SatelliteConfig[] = [
  { id: 'dancu', name: 'Cơ cấu Dân cư', sub: 'Địa bàn / Vùng lãnh thổ', radius: 2.3, speed: 0.45, phase: 0, color: '#C8A86A', tilt: 0.2 },
  { id: 'nghenghiep', name: 'Cơ cấu Nghề nghiệp', sub: 'Phân công lao động', radius: 3.1, speed: 0.32, phase: 1.5, color: '#9FB3C9', tilt: -0.15 },
  { id: 'dantoc', name: 'Cơ cấu Dân tộc', sub: 'Quan hệ tộc người', radius: 3.8, speed: 0.25, phase: 3.1, color: '#76A394', tilt: 0.25 },
  { id: 'tongiao', name: 'Cơ cấu Tôn giáo', sub: 'Tín ngưỡng / Đời sống tâm linh', radius: 4.4, speed: 0.18, phase: 4.6, color: '#BD7880', tilt: -0.2 },
];

function generateOrbitPoints(radius: number, segments = 64): [number, number, number][] {
  const points: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push([Math.cos(theta) * radius, 0, Math.sin(theta) * radius]);
  }
  return points;
}

export const OrbitalCentralityScene: React.FC<OrbitalCentralitySceneProps> = ({
  beatIndex = 0,
  qualityTier = 'high',
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const satellitesRef = useRef<(THREE.Group | null)[]>([]);

  // Pre-calculate orbits with segments adapted to quality tier
  const orbits = useMemo(() => {
    const segments = qualityTier === 'high' ? 64 : 32;
    return SATELLITES.map((sat) => generateOrbitPoints(sat.radius, segments));
  }, [qualityTier]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.x = 0.55; // Tilt scene towards camera
      groupRef.current.rotation.y = t * 0.05;
    }

    // Move satellites along their respective orbits
    SATELLITES.forEach((sat, i) => {
      const el = satellitesRef.current[i];
      if (el) {
        const angle = t * sat.speed + sat.phase;
        el.position.x = Math.cos(angle) * sat.radius;
        el.position.z = Math.sin(angle) * sat.radius;
        el.position.y = Math.sin(angle * 2) * sat.tilt;
      }
    });
  });

  const showSatellites = beatIndex >= 1;
  const showReciprocal = beatIndex >= 2;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Core: Cơ cấu xã hội - giai cấp */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshStandardMaterial
          color="#C87046"
          roughness={0.2}
          metalness={0.7}
          emissive="#A34621"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Center Label */}
      <Html position={[0, 1.15, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
        <div
          style={{
            background: 'rgba(11, 13, 16, 0.94)',
            border: '2px solid #C87046',
            borderRadius: '8px',
            padding: '8px 16px',
            color: '#F5F0E8',
            textAlign: 'center',
            minWidth: '200px',
            pointerEvents: 'none',
            boxShadow: '0 8px 30px rgba(200, 112, 70, 0.4)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ fontSize: '11px', color: '#C8A86A', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            Vị trí hàng đầu
          </div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
            Cơ cấu XH – Giai cấp
          </div>
        </div>
      </Html>

      {/* Orbit paths & Satellites */}
      {SATELLITES.map((sat, i) => (
        <group key={sat.id}>
          {/* Orbit line ring */}
          <Line
            points={orbits[i]}
            color={sat.color}
            lineWidth={1}
            transparent
            opacity={showSatellites ? 0.35 : 0.1}
          />

          {/* Satellite body */}
          {showSatellites && (
            <group ref={(el) => { satellitesRef.current[i] = el; }}>
              <mesh scale={0.35}>
                <sphereGeometry args={[1, 24, 24]} />
                <meshStandardMaterial
                  color={sat.color}
                  roughness={0.3}
                  metalness={0.5}
                  emissive={sat.color}
                  emissiveIntensity={showReciprocal ? 0.4 : 0.2}
                />
              </mesh>

              {/* Dynamic reciprocal line connecting to center */}
              {showReciprocal && (
                <Line
                  points={[[0, 0, 0], [0, 0, 0]]} // Placeholder handled visually by surrounding aura
                  color="#C8A86A"
                  lineWidth={1.5}
                  dashed
                />
              )}

              {/* Satellite label */}
              <Html position={[0, 0.5, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
                <div
                  style={{
                    background: 'rgba(15, 18, 24, 0.88)',
                    border: `1px solid ${sat.color}`,
                    borderRadius: '6px',
                    padding: '4px 10px',
                    color: '#F5F0E8',
                    textAlign: 'center',
                    minWidth: '130px',
                    pointerEvents: 'none',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700, color: sat.color }}>
                    {sat.name}
                  </div>
                  <div style={{ fontSize: '10px', color: '#9FB3C9' }}>
                    {sat.sub}
                  </div>
                </div>
              </Html>
            </group>
          )}
        </group>
      ))}

      {/* Dialectical warning overlay at bottom */}
      {showReciprocal && (
        <Html position={[0, -2.8, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
          <div
            style={{
              background: 'rgba(23, 26, 36, 0.95)',
              border: '1px solid #BD7880',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#F5F0E8',
              textAlign: 'center',
              maxWidth: '460px',
              fontSize: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              lineHeight: 1.4,
            }}
          >
            <span style={{ color: '#BD7880', fontWeight: 700 }}>Nguyên lý biện chứng:</span> Không được tuyệt đối hóa vai trò của cơ cấu xã hội – giai cấp và xem nhẹ các loại hình cơ cấu xã hội khác.
          </div>
        </Html>
      )}

      {/* Illumination */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 8, 4]} intensity={1.4} color="#F5F0E8" />
      <pointLight position={[0, 0, 1]} intensity={2.5} color="#C87046" distance={8} />
    </group>
  );
};
