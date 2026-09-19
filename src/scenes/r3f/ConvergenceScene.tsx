import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { PresentationScene } from '../../content/types';

interface ConvergenceSceneProps {
  scene?: PresentationScene;
  beatIndex?: number;
  qualityTier?: 'high' | 'medium' | 'safe';
}

interface ClusterNode {
  id: string;
  name: string;
  angle: number;
  color: string;
  vectorDir: [number, number, number];
}

const CLUSTERS: ClusterNode[] = [
  { id: 'CLUSTER_A', name: 'Giai tầng A', angle: 0, color: '#C87046', vectorDir: [1, 0, 0] },
  { id: 'CLUSTER_B', name: 'Giai tầng B', angle: Math.PI / 2, color: '#76A394', vectorDir: [0, 1, 0] },
  { id: 'CLUSTER_C', name: 'Giai tầng C', angle: Math.PI, color: '#9FB3C9', vectorDir: [-1, 0, 0] },
  { id: 'CLUSTER_D', name: 'Giai tầng D', angle: (3 * Math.PI) / 2, color: '#C8A86A', vectorDir: [0, -1, 0] },
];

export const ConvergenceScene: React.FC<ConvergenceSceneProps> = ({
  scene,
  beatIndex = 0,
  qualityTier = 'high',
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const clusterGroupRefs = useRef<(THREE.Group | null)[]>([]);
  const currentRadiusRef = useRef(3.0);
  const sphereSegments = qualityTier === 'high' ? 24 : 16;

  // Target radius across beats: separates at B0/B1, moves closer at B4/B5
  const targetRadius = useMemo(() => {
    switch (beatIndex) {
      case 0: return 3.2; // Separated clusters
      case 1: return 3.0; // Tension visible
      case 2: return 2.6; // Shared-interest field appears
      case 3: return 2.2; // Alliance links form
      case 4: return 1.4; // Clusters move closer
      case 5: return 1.3; // Converged but distinct
      default: return 3.2;
    }
  }, [beatIndex]);

  const showDivergenceVectors = beatIndex <= 1;
  const showTension = beatIndex === 1;
  const showSharedField = beatIndex >= 2;
  const showAllianceLinks = beatIndex >= 3;
  const isMovingCloser = beatIndex >= 4;
  const showFinalPhrase = beatIndex >= 5;

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
        const ang = c.angle + t * 0.08;
        g.position.x = Math.cos(ang) * r;
        g.position.y = Math.sin(ang) * r;
      }
    });

    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.12) * 0.04;
    }
  });

  const sharedFieldLabel = scene?.visualLabels?.find((l) => l.id === 'SHARED_FIELD');

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Shared-Interest Field (Appears at Beat 2+) */}
      {showSharedField && (
        <group position={[0, 0, 0]}>
          <mesh>
            <sphereGeometry args={[isMovingCloser ? 0.75 : 0.45, 32, 32]} />
            <meshStandardMaterial
              color="#C8A86A"
              emissive="#C8A86A"
              emissiveIntensity={isMovingCloser ? 0.85 : 0.35}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>

          {/* Central Label */}
          <Html position={[0, isMovingCloser ? 1.15 : 0.75, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
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
                {sharedFieldLabel?.sub || 'Trường quy tụ'}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, marginTop: '2px' }}>
                {sharedFieldLabel?.text || 'Lợi ích chung'}
              </div>
            </div>
          </Html>
        </group>
      )}

      {/* 4 Clusters */}
      {CLUSTERS.map((c, i) => (
        <group key={c.id} ref={(el) => { clusterGroupRefs.current[i] = el; }}>
          <mesh>
            <sphereGeometry args={[0.38, sphereSegments, sphereSegments]} />
            <meshStandardMaterial
              color={c.color}
              roughness={0.3}
              metalness={0.4}
              emissive={c.color}
              emissiveIntensity={isMovingCloser ? 0.7 : 0.3}
            />
          </mesh>

          {/* Distinct-interest divergence vectors at Beat 0 and Beat 1 */}
          {showDivergenceVectors && (
            <Line
              points={[
                [0, 0, 0],
                [c.vectorDir[0] * 1.0, c.vectorDir[1] * 1.0, 0],
              ]}
              color={c.color}
              lineWidth={2}
              transparent
              opacity={0.8}
            />
          )}

          {/* Cluster Label Card */}
          <Html position={[0, 0.55, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
            <div
              style={{
                background: 'rgba(15, 18, 24, 0.92)',
                border: `1.5px solid ${c.color}`,
                borderRadius: '6px',
                padding: '4px 10px',
                color: '#F5F0E8',
                textAlign: 'center',
                minWidth: '120px',
                pointerEvents: 'none',
                boxShadow: `0 4px 12px ${c.color}33`,
                backdropFilter: 'blur(4px)',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: c.color }}>
                {c.name}
              </div>
              {showDivergenceVectors && (
                <div style={{ fontSize: '9px', color: '#BD7880', marginTop: '2px' }}>
                  ↖ Lợi ích riêng
                </div>
              )}
            </div>
          </Html>
        </group>
      ))}

      {/* Tension lines across clusters at Beat 1 */}
      {showTension && (
        <group>
          {CLUSTERS.map((c, i) => {
            const next = CLUSTERS[(i + 1) % CLUSTERS.length];
            return (
              <Line
                key={`tension-${c.id}-${next.id}`}
                points={[
                  [Math.cos(c.angle) * targetRadius, Math.sin(c.angle) * targetRadius, 0],
                  [Math.cos(next.angle) * targetRadius, Math.sin(next.angle) * targetRadius, 0],
                ]}
                color="#BD7880"
                lineWidth={1.5}
                dashed
                dashScale={8}
                transparent
                opacity={0.65}
              />
            );
          })}
        </group>
      )}

      {/* Alliance interconnection lines at Beat 3+ */}
      {showAllianceLinks && (
        <group>
          {CLUSTERS.map((c, i) => {
            const next = CLUSTERS[(i + 1) % CLUSTERS.length];
            return (
              <Line
                key={`alliance-${c.id}-${next.id}`}
                points={[
                  [Math.cos(c.angle) * targetRadius, Math.sin(c.angle) * targetRadius, 0],
                  [Math.cos(next.angle) * targetRadius, Math.sin(next.angle) * targetRadius, 0],
                ]}
                color="#C8A86A"
                lineWidth={isMovingCloser ? 2.5 : 1.5}
                transparent
                opacity={isMovingCloser ? 0.85 : 0.45}
              />
            );
          })}
        </group>
      )}

      {/* Final synthesis phrase at Beat 5 */}
      {showFinalPhrase && (
        <Html position={[0, -2.5, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
          <div
            style={{
              background: 'rgba(23, 26, 36, 0.95)',
              border: '1.5px solid #C8A86A',
              borderRadius: '8px',
              padding: '10px 20px',
              color: '#F5F0E8',
              textAlign: 'center',
              fontSize: '13px',
              fontWeight: 700,
              boxShadow: '0 6px 24px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
              maxWidth: '520px',
            }}
          >
            Vừa đấu tranh, vừa liên minh, từng bước xích lại gần nhau.
          </div>
        </Html>
      )}

      {/* Illumination */}
      <ambientLight intensity={0.65} color="#F5F0E8" />
      <directionalLight position={[3, 5, 4]} intensity={1.3} color="#FFF8ED" />
      <pointLight position={[0, 0, 2]} intensity={isMovingCloser ? 2.5 : 1.5} color="#C8A86A" distance={8} />
    </group>
  );
};
