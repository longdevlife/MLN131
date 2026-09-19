import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';

interface ConvergenceSceneProps {
  beatIndex?: number;
  qualityTier?: 'high' | 'medium' | 'safe';
}

interface ClusterNode {
  id: string;
  name: string;
  sub: string;
  angle: number;
  color: string;
}

const CLUSTERS: ClusterNode[] = [
  { id: 'cn', name: 'Giai cấp Công nhân', sub: 'Lãnh đạo, nòng cốt', angle: 0, color: '#C87046' },
  { id: 'nd', name: 'Giai cấp Nông dân', sub: 'Cơ sở nền tảng vững chắc', angle: Math.PI / 2, color: '#76A394' },
  { id: 'tt', name: 'Đội ngũ Trí thức', sub: 'Tiên phong khoa học công nghệ', angle: Math.PI, color: '#9FB3C9' },
  { id: 'dn', name: 'Đội ngũ Doanh nhân', sub: 'Động lực kinh tế thị trường', angle: (3 * Math.PI) / 2, color: '#C8A86A' },
];

export const ConvergenceScene: React.FC<ConvergenceSceneProps> = ({
  beatIndex = 0,
  qualityTier = 'high',
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const clusterGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const currentRadiusRef = useRef(2.8);
  const sphereSegments = qualityTier === 'high' ? 24 : 16;

  const targetRadius = beatIndex === 0 ? 2.8 : beatIndex === 1 ? 2.3 : 1.35;
  const showAllianceLines = beatIndex >= 1;
  const isConverged = beatIndex >= 2;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Smooth lerp radius towards target
    currentRadiusRef.current = THREE.MathUtils.lerp(
      currentRadiusRef.current,
      targetRadius,
      0.05
    );

    const r = currentRadiusRef.current;

    CLUSTERS.forEach((c, i) => {
      const g = clusterGroupRefs.current[i];
      if (g) {
        const ang = c.angle + t * 0.1;
        g.position.x = Math.cos(ang) * r;
        g.position.y = Math.sin(ang) * r;
      }
    });

    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.15) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Convergence Core (Shared National & Socialist Interest) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[isConverged ? 0.75 : 0.45, 32, 32]} />
        <meshStandardMaterial
          color="#C8A86A"
          emissive="#C8A86A"
          emissiveIntensity={isConverged ? 0.8 : 0.25}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Center Label */}
      <Html position={[0, isConverged ? 1.1 : 0.7, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
        <div
          style={{
            background: 'rgba(11, 13, 16, 0.94)',
            border: '2px solid #C8A86A',
            borderRadius: '8px',
            padding: '6px 14px',
            color: '#F5F0E8',
            textAlign: 'center',
            minWidth: '180px',
            pointerEvents: 'none',
            boxShadow: '0 6px 24px rgba(200, 168, 106, 0.4)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <div style={{ fontSize: '10px', color: '#C8A86A', fontWeight: 700, textTransform: 'uppercase' }}>
            {isConverged ? 'Giao thoa hội tụ' : 'Lợi ích cốt lõi'}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 800, marginTop: '2px' }}>
            Mục tiêu Xã hội chủ nghĩa
          </div>
          <div style={{ fontSize: '10px', color: '#9FB3C9' }}>
            Độc lập dân tộc & Dân giàu nước mạnh
          </div>
        </div>
      </Html>

      {/* 4 Clusters */}
      {CLUSTERS.map((c, i) => (
        <group key={c.id} ref={(el) => { clusterGroupRefs.current[i] = el; }}>
          <mesh>
            <sphereGeometry args={[0.4, sphereSegments, sphereSegments]} />
            <meshStandardMaterial
              color={c.color}
              emissive={c.color}
              emissiveIntensity={0.3}
              roughness={0.3}
              metalness={0.4}
            />
          </mesh>

          {/* Cluster Label */}
          <Html position={[0, -0.55, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
            <div
              style={{
                background: 'rgba(15, 18, 24, 0.92)',
                border: `1px solid ${c.color}`,
                borderRadius: '6px',
                padding: '4px 8px',
                color: '#F5F0E8',
                textAlign: 'center',
                minWidth: '130px',
                pointerEvents: 'none',
                backdropFilter: 'blur(4px)',
                boxShadow: `0 4px 12px ${c.color}25`,
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: c.color }}>{c.name}</div>
              <div style={{ fontSize: '9px', color: '#C8D3DC' }}>{c.sub}</div>
            </div>
          </Html>
        </group>
      ))}

      {/* Alliance Lines when beat >= 1 */}
      {showAllianceLines && (
        <group>
          {/* Ring representing mutual cooperation */}
          <Line
            points={[
              [-1.8, 0, 0],
              [0, 1.8, 0],
              [1.8, 0, 0],
              [0, -1.8, 0],
              [-1.8, 0, 0],
            ]}
            color="#C8A86A"
            lineWidth={isConverged ? 2.5 : 1.5}
            transparent
            opacity={isConverged ? 0.8 : 0.4}
          />
        </group>
      )}

      {/* Illumination */}
      <ambientLight intensity={0.65} />
      <directionalLight position={[0, 6, 6]} intensity={1.3} color="#F5F0E8" />
      <pointLight position={[0, 0, 2]} intensity={isConverged ? 3.0 : 1.5} color="#C8A86A" distance={8} />
    </group>
  );
};
