import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface DiversificationSceneProps {
  beatIndex?: number;
  qualityTier?: 'high' | 'medium' | 'safe';
}

interface GroupNode {
  id: string;
  name: string;
  role: string;
  pos: [number, number, number];
  color: string;
  isNew?: boolean;
}

const GROUPS: GroupNode[] = [
  // 3 Traditional Classes
  { id: 'congnhan', name: 'G/C Công nhân', role: 'Lực lượng lãnh đạo cách mạng', pos: [-2.4, 1.4, 0], color: '#C87046' },
  { id: 'nongdan', name: 'G/C Nông dân', role: 'Lực lượng đông đảo nhất', pos: [0, 1.8, 0], color: '#76A394' },
  { id: 'trithuc', name: 'Đội ngũ Trí thức', role: 'Lao động sáng tạo trí óc', pos: [2.4, 1.4, 0], color: '#9FB3C9' },
  // Newly Emerged Strata
  { id: 'doanhnhan', name: 'Đội ngũ Doanh nhân', role: 'Quản trị sản xuất kinh doanh', pos: [-2.2, -1.2, 0], color: '#C8A86A', isNew: true },
  { id: 'tieuchu', name: 'Tầng lớp Tiểu chủ', role: 'Kinh tế cá thể & dịch vụ', pos: [0, -1.5, 0], color: '#E5A93C', isNew: true },
  { id: 'laodongmoi', name: 'Lao động tự do mới', role: 'Gig economy & Công nghệ', pos: [2.2, -1.2, 0], color: '#BD7880', isNew: true },
];

export const DiversificationScene: React.FC<DiversificationSceneProps> = ({
  beatIndex = 0,
  qualityTier = 'high',
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.08;
    }
  });

  const showNewStrata = beatIndex >= 1;
  const showDifferentiation = beatIndex >= 2;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {GROUPS.map((g) => {
        if (g.isNew && !showNewStrata) return null;

        return (
          <group key={g.id} position={g.pos}>
            {/* Core Mesh */}
            <mesh>
              <sphereGeometry args={[g.isNew ? 0.42 : 0.5, 24, 24]} />
              <meshStandardMaterial
                color={g.color}
                roughness={0.3}
                metalness={0.4}
                emissive={g.color}
                emissiveIntensity={0.25}
              />
            </mesh>

            {/* Orbiting differentiation particles for Beat 2 */}
            {showDifferentiation && qualityTier !== 'safe' && (
              <group>
                <mesh position={[0.65, 0.2, 0]} scale={0.12}>
                  <sphereGeometry args={[1, 16, 16]} />
                  <meshStandardMaterial color={g.color} emissive={g.color} emissiveIntensity={0.6} />
                </mesh>
                <mesh position={[-0.6, -0.25, 0.2]} scale={0.1}>
                  <sphereGeometry args={[1, 16, 16]} />
                  <meshStandardMaterial color={g.color} emissive={g.color} emissiveIntensity={0.6} />
                </mesh>
              </group>
            )}

            {/* Label Card */}
            <Html position={[0, -0.65, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
              <div
                style={{
                  background: 'rgba(15, 18, 24, 0.92)',
                  border: `1px solid ${g.color}`,
                  borderRadius: '6px',
                  padding: '5px 10px',
                  color: '#F5F0E8',
                  textAlign: 'center',
                  minWidth: '140px',
                  pointerEvents: 'none',
                  boxShadow: `0 4px 14px ${g.color}33`,
                  backdropFilter: 'blur(5px)',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 800, color: g.color }}>
                  {g.name}
                </div>
                <div style={{ fontSize: '10px', color: '#C8D3DC', marginTop: '2px' }}>
                  {g.role}
                </div>
                {showDifferentiation && (
                  <div style={{ fontSize: '9px', color: '#C8A86A', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '4px', paddingTop: '2px' }}>
                    Phân hóa trình độ & thu nhập
                  </div>
                )}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Header Category Labels */}
      <Html position={[0, 2.7, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
        <div
          style={{
            background: 'rgba(11, 13, 16, 0.85)',
            border: '1px solid #C87046',
            borderRadius: '20px',
            padding: '4px 16px',
            color: '#C8A86A',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            fontWeight: 700,
            pointerEvents: 'none',
          }}
        >
          {showDifferentiation
            ? 'Phân hóa nội bộ đa tầng trong từng giai cấp'
            : showNewStrata
            ? 'Xuất hiện các tầng lớp xã hội mới năng động'
            : '3 Khối giai tầng truyền thống cơ bản'}
        </div>
      </Html>

      {/* Illumination */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 6, 6]} intensity={1.3} color="#F5F0E8" />
      <pointLight position={[0, 0, 3]} intensity={2.0} color="#C8A86A" distance={8} />
    </group>
  );
};
