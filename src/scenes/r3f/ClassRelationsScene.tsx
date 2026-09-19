import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { PresentationScene } from '../../content/types';

interface ClassRelationsSceneProps {
  scene?: PresentationScene;
  beatIndex?: number;
  qualityTier?: 'high' | 'medium' | 'safe';
}

interface AxisConfig {
  id: string;
  defaultTitle: string;
  defaultSub: string;
  pos: [number, number, number];
  color: string;
  activeBeat: number;
}

const AXIS_CONFIGS: AxisConfig[] = [
  {
    id: 'TLSX',
    defaultTitle: '1. Quan hệ sở hữu',
    defaultSub: 'Tư liệu sản xuất',
    pos: [0, 2.3, 0],
    color: '#C8A86A',
    activeBeat: 2,
  },
  {
    id: 'QUAN_LY',
    defaultTitle: '2. Tổ chức quản lý',
    defaultSub: 'Lao động và sản xuất',
    pos: [-2.9, 0, 0],
    color: '#9FB3C9',
    activeBeat: 2,
  },
  {
    id: 'DIA_VI',
    defaultTitle: '3. Địa vị chính trị – XH',
    defaultSub: 'Trong hệ thống quan hệ',
    pos: [2.9, 0, 0],
    color: '#76A394',
    activeBeat: 3,
  },
  {
    id: 'PHAN_PHOI',
    defaultTitle: '4. Phân phối thu nhập',
    defaultSub: 'Sản phẩm lao động',
    pos: [0, -2.3, 0],
    color: '#BD7880',
    activeBeat: 3,
  },
];

export const ClassRelationsScene: React.FC<ClassRelationsSceneProps> = ({
  scene,
  beatIndex = 0,
  qualityTier = 'high',
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const centerMeshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.06;
      groupRef.current.rotation.z = Math.cos(t * 0.15) * 0.03;
    }
    if (centerMeshRef.current) {
      centerMeshRef.current.rotation.y = t * 0.3;
      const s = 1 + Math.sin(t * 1.5) * 0.03;
      centerMeshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central core: Cơ cấu xã hội - giai cấp */}
      <mesh ref={centerMeshRef} position={[0, 0, 0]}>
        <dodecahedronGeometry args={[0.95, 0]} />
        <meshStandardMaterial
          color="#C87046"
          roughness={0.25}
          metalness={0.6}
          emissive="#7A361E"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Central Core Label */}
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
          <div style={{ fontSize: '12px', color: '#C8A86A', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>
            Hạt nhân bản chất
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, margin: '3px 0', color: '#FFFFFF' }}>
            Cơ cấu XH – Giai cấp
          </div>
          <div style={{ fontSize: '11px', color: '#C8D3DC', opacity: 0.9 }}>
            {beatIndex >= 4 ? 'Hệ thống giai cấp thông qua 4 quan hệ cốt lõi' : 'Hệ thống các giai cấp, tầng lớp xã hội'}
          </div>
        </div>
      </Html>

      {/* 4 Relational Axes with 5-beat progressive revelation */}
      {AXIS_CONFIGS.map((cfg) => {
        const canonical = scene?.visualLabels?.find((l) => l.id === cfg.id);
        const title = canonical?.text || cfg.defaultTitle;
        const sub = canonical?.sub || cfg.defaultSub;
        const role = canonical?.role;

        const isVisible = beatIndex >= 1;
        const isFocusedInThisBeat =
          (beatIndex === 2 && (cfg.id === 'TLSX' || cfg.id === 'QUAN_LY')) ||
          (beatIndex === 3 && (cfg.id === 'DIA_VI' || cfg.id === 'PHAN_PHOI')) ||
          beatIndex >= 4;

        return (
          <group key={cfg.id} position={cfg.pos}>
            {/* Connection line to center */}
            <Line
              points={[[0, 0, 0], [-cfg.pos[0], -cfg.pos[1], -cfg.pos[2]]]}
              color={cfg.color}
              lineWidth={isFocusedInThisBeat ? 3 : isVisible ? 1.5 : 0.8}
              transparent
              opacity={isFocusedInThisBeat ? 0.95 : isVisible ? 0.4 : 0.15}
            />

            {/* Axis Node sphere */}
            <mesh scale={isFocusedInThisBeat ? 0.5 : isVisible ? 0.38 : 0.25}>
              <sphereGeometry args={[1, 24, 24]} />
              <meshStandardMaterial
                color={cfg.color}
                roughness={0.3}
                metalness={0.4}
                emissive={cfg.color}
                emissiveIntensity={isFocusedInThisBeat ? 0.6 : isVisible ? 0.2 : 0.05}
              />
            </mesh>

            {/* Axis Label */}
            {isVisible && (
              <Html
                position={[0, cfg.pos[1] > 0 ? 0.6 : -0.6, 0]}
                center
                distanceFactor={10}
                zIndexRange={[100, 0]}
              >
                <div
                  style={{
                    background: isFocusedInThisBeat
                      ? 'rgba(15, 18, 24, 0.95)'
                      : 'rgba(15, 18, 24, 0.75)',
                    border: `1px solid ${isFocusedInThisBeat ? cfg.color : `${cfg.color}55`}`,
                    borderRadius: '8px',
                    padding: isFocusedInThisBeat ? '8px 14px' : '5px 10px',
                    color: '#F5F0E8',
                    textAlign: 'center',
                    minWidth: isFocusedInThisBeat ? '200px' : '160px',
                    pointerEvents: 'none',
                    boxShadow: isFocusedInThisBeat ? `0 6px 20px ${cfg.color}44` : 'none',
                    backdropFilter: 'blur(6px)',
                    transition: 'all 0.4s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: isFocusedInThisBeat ? '13px' : '11px',
                      fontWeight: 700,
                      color: cfg.color,
                    }}
                  >
                    {title}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#C8D3DC', marginTop: '2px' }}>
                    {sub}
                  </div>
                  {isFocusedInThisBeat && role && (
                    <div
                      style={{
                        fontSize: '9.5px',
                        color: '#E0E0E0',
                        marginTop: '4px',
                        paddingTop: '4px',
                        borderTop: '1px solid rgba(255,255,255,0.15)',
                        lineHeight: 1.3,
                      }}
                    >
                      {role}
                    </div>
                  )}
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
