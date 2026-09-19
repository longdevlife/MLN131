import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';

interface ClassRelationsSceneProps {
  beatIndex?: number;
  qualityTier?: 'high' | 'medium' | 'safe';
}

interface AxisNode {
  id: string;
  title: string;
  sub: string;
  pos: [number, number, number];
  color: string;
}

const AXES: AxisNode[] = [
  {
    id: 'so-huu',
    title: '1. Sở hữu TLSX',
    sub: 'Chế độ sở hữu tư liệu sản xuất',
    pos: [0, 2.2, 0],
    color: '#C8A86A',
  },
  {
    id: 'to-chuc',
    title: '2. Tổ chức quản lý',
    sub: 'Phân công lao động xã hội',
    pos: [-2.8, 0, 0],
    color: '#9FB3C9',
  },
  {
    id: 'dia-vi',
    title: '3. Địa vị chính trị – XH',
    sub: 'Vị thế quyền lực trong hệ thống',
    pos: [2.8, 0, 0],
    color: '#76A394',
  },
  {
    id: 'phan-phoi',
    title: '4. Phân phối lợi ích',
    sub: 'Hình thức & quy mô thu nhập',
    pos: [0, -2.2, 0],
    color: '#BD7880',
  },
];

export const ClassRelationsScene: React.FC<ClassRelationsSceneProps> = ({
  beatIndex = 0,
  qualityTier = 'high',
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const centerMeshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.08;
      groupRef.current.rotation.z = Math.cos(t * 0.2) * 0.04;
    }
    if (centerMeshRef.current) {
      centerMeshRef.current.rotation.y = t * 0.3;
      const s = 1 + Math.sin(t * 1.5) * 0.03;
      centerMeshRef.current.scale.set(s, s, s);
    }
  });

  const showAxes = beatIndex >= 1;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central core: Cơ cấu xã hội - giai cấp */}
      <mesh ref={centerMeshRef} position={[0, 0, 0]}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#C87046"
          roughness={0.25}
          metalness={0.6}
          emissive="#7A361E"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Central Label */}
      <Html position={[0, 0, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
        <div
          style={{
            background: 'rgba(11, 13, 16, 0.92)',
            border: '2px solid #C87046',
            borderRadius: '10px',
            padding: '10px 18px',
            color: '#F5F0E8',
            textAlign: 'center',
            minWidth: '220px',
            pointerEvents: 'none',
            boxShadow: '0 8px 32px rgba(200, 112, 70, 0.3)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ fontSize: '13px', color: '#C8A86A', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>
            Hạt nhân bản chất
          </div>
          <div style={{ fontSize: '17px', fontWeight: 800, margin: '3px 0', color: '#FFFFFF' }}>
            Cơ cấu XH – Giai cấp
          </div>
          <div style={{ fontSize: '12px', color: '#C8D3DC', opacity: 0.9 }}>
            Hệ thống các giai cấp, tầng lớp xã hội
          </div>
        </div>
      </Html>

      {/* 4 Relational Axes */}
      {AXES.map((axis) => {
        return (
          <group key={axis.id} position={axis.pos}>
            {/* Connection line to center */}
            <Line
              points={[[0, 0, 0], [-axis.pos[0], -axis.pos[1], -axis.pos[2]]]}
              color={axis.color}
              lineWidth={showAxes ? 2.5 : 1}
              transparent
              opacity={showAxes ? 0.85 : 0.2}
            />

            {/* Axis Node sphere */}
            <mesh scale={showAxes ? 0.45 : 0.3}>
              <sphereGeometry args={[1, 24, 24]} />
              <meshStandardMaterial
                color={axis.color}
                roughness={0.3}
                metalness={0.4}
                emissive={axis.color}
                emissiveIntensity={showAxes ? 0.35 : 0.1}
              />
            </mesh>

            {/* Axis Label */}
            {showAxes && (
              <Html position={[0, axis.pos[1] > 0 ? 0.55 : -0.55, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
                <div
                  style={{
                    background: 'rgba(15, 18, 24, 0.9)',
                    border: `1px solid ${axis.color}`,
                    borderRadius: '6px',
                    padding: '6px 12px',
                    color: '#F5F0E8',
                    textAlign: 'center',
                    minWidth: '170px',
                    pointerEvents: 'none',
                    boxShadow: `0 4px 16px ${axis.color}33`,
                    backdropFilter: 'blur(6px)',
                    transition: 'all 0.5s ease',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, color: axis.color }}>
                    {axis.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#C8D3DC', marginTop: '2px' }}>
                    {axis.sub}
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Scene illumination */}
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 6, 5]} intensity={1.3} color="#F5F0E8" />
      <pointLight position={[0, 0, 3]} intensity={2.0} color="#C87046" distance={8} />
      {qualityTier === 'high' && (
        <pointLight position={[0, -2, 2]} intensity={1.0} color="#C8A86A" distance={5} />
      )}
    </group>
  );
};
