import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { PresentationScene } from '../../content/types';

interface DiversificationSceneProps {
  scene?: PresentationScene;
  beatIndex?: number;
  qualityTier?: 'high' | 'medium' | 'safe';
}

interface NodeLayout {
  id: string;
  pos: [number, number, number];
  color: string;
  isNew?: boolean;
}

const LAYOUTS: NodeLayout[] = [
  // Baseline illustrative clusters (Beat 0+)
  { id: 'GROUP_A', pos: [-2.4, 1.4, 0], color: '#C87046' },
  { id: 'GROUP_B', pos: [0, 1.8, 0], color: '#76A394' },
  { id: 'GROUP_C', pos: [2.4, 1.4, 0], color: '#9FB3C9' },
  // Newly emerged illustrative groups (Beat 2+)
  { id: 'GROUP_D', pos: [-1.6, -1.2, 0], color: '#C8A86A', isNew: true },
  { id: 'GROUP_E', pos: [1.6, -1.2, 0], color: '#E5A93C', isNew: true },
];

export const DiversificationScene: React.FC<DiversificationSceneProps> = ({
  scene,
  beatIndex = 0,
  qualityTier = 'high',
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Pre-calculate line connections for Beat 3+
  const networkLines = useMemo(() => {
    return [
      [LAYOUTS[0].pos, LAYOUTS[1].pos],
      [LAYOUTS[1].pos, LAYOUTS[2].pos],
      [LAYOUTS[0].pos, LAYOUTS[3].pos],
      [LAYOUTS[1].pos, LAYOUTS[3].pos],
      [LAYOUTS[1].pos, LAYOUTS[4].pos],
      [LAYOUTS[2].pos, LAYOUTS[4].pos],
      [LAYOUTS[3].pos, LAYOUTS[4].pos],
    ] as [number, number, number][][];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.06;
    }
  });

  const showInternalDiff = beatIndex >= 1;
  const showNewGroups = beatIndex >= 2;
  const showConnections = beatIndex >= 3;
  const isZoomedOut = beatIndex >= 4;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {LAYOUTS.map((layout) => {
        if (layout.isNew && !showNewGroups) return null;

        const canonical = scene?.visualLabels?.find((l) => l.id === layout.id);
        const name = canonical?.text || layout.id;
        const sub = canonical?.sub || '';
        const role = canonical?.role || '';

        return (
          <group key={layout.id} position={layout.pos}>
            {/* Core Sphere */}
            <mesh>
              <sphereGeometry args={[layout.isNew ? 0.44 : 0.52, 24, 24]} />
              <meshStandardMaterial
                color={layout.color}
                roughness={0.3}
                metalness={0.4}
                emissive={layout.color}
                emissiveIntensity={isZoomedOut ? 0.4 : 0.25}
              />
            </mesh>

            {/* Orbiting internal differentiation satellite particles for Beat 1+ */}
            {showInternalDiff && qualityTier !== 'safe' && (
              <group>
                <mesh position={[0.65, 0.2, 0]} scale={0.12}>
                  <sphereGeometry args={[1, 16, 16]} />
                  <meshStandardMaterial color={layout.color} emissive={layout.color} emissiveIntensity={0.6} />
                </mesh>
                <mesh position={[-0.6, -0.25, 0.2]} scale={0.1}>
                  <sphereGeometry args={[1, 16, 16]} />
                  <meshStandardMaterial color={layout.color} emissive={layout.color} emissiveIntensity={0.6} />
                </mesh>
              </group>
            )}

            {/* Label Card */}
            <Html position={[0, -0.68, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
              <div
                style={{
                  background: 'rgba(15, 18, 24, 0.94)',
                  border: `1.5px solid ${layout.color}`,
                  borderRadius: '6px',
                  padding: '6px 12px',
                  color: '#F5F0E8',
                  textAlign: 'center',
                  minWidth: '160px',
                  pointerEvents: 'none',
                  boxShadow: `0 4px 14px ${layout.color}33`,
                  backdropFilter: 'blur(5px)',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 800, color: layout.color }}>
                  {name}
                </div>
                {sub && (
                  <div style={{ fontSize: '10px', color: '#C8D3DC', marginTop: '1px' }}>
                    {sub}
                  </div>
                )}
                {role && (
                  <div
                    style={{
                      fontSize: '8.5px',
                      color: '#B0BEC5',
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

      {/* Network Connections multiplying at Beat 3+ */}
      {showConnections && (
        <group>
          {networkLines.map((pair, idx) => (
            <Line
              key={idx}
              points={pair}
              color="#C8A86A"
              lineWidth={isZoomedOut ? 2 : 1.4}
              transparent
              opacity={isZoomedOut ? 0.75 : 0.45}
            />
          ))}
        </group>
      )}

      {/* Illumination */}
      <ambientLight intensity={0.65} color="#F5F0E8" />
      <directionalLight position={[4, 6, 4]} intensity={1.3} color="#FFF8ED" />
      <pointLight position={[0, 0, 2]} intensity={1.8} color="#C8A86A" distance={8} />
    </group>
  );
};
