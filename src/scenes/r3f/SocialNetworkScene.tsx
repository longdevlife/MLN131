import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';

interface SocialNetworkSceneProps {
  beatIndex?: number;
}

interface NodeData {
  id: string;
  name: string;
  sub: string;
  pos: [number, number, number];
  color: string;
  isPrimary?: boolean;
}

const NODES: NodeData[] = [
  { id: 'giaicap', name: 'Giai cấp', sub: 'Địa vị kinh tế - xã hội', pos: [0, 0.3, 0.4], color: '#C87046', isPrimary: true },
  { id: 'dancu', name: 'Dân cư', sub: 'Địa bàn / Lãnh thổ', pos: [-2.2, 1.3, -0.2], color: '#C8A86A' },
  { id: 'nghenghiep', name: 'Nghề nghiệp', sub: 'Phân công lao động', pos: [2.2, 1.2, -0.1], color: '#9FB3C9' },
  { id: 'dantoc', name: 'Dân tộc', sub: 'Quan hệ tộc người', pos: [-1.8, -1.3, 0.1], color: '#76A394' },
  { id: 'tongiao', name: 'Tôn giáo', sub: 'Tín ngưỡng / Tâm linh', pos: [1.8, -1.4, 0.2], color: '#BD7880' },
];

// Connection edges between all nodes
const EDGES: [number, number][] = [
  [0, 1], // Giai cấp <-> Dân cư
  [0, 2], // Giai cấp <-> Nghề nghiệp
  [0, 3], // Giai cấp <-> Dân tộc
  [0, 4], // Giai cấp <-> Tôn giáo
  [1, 2], // Dân cư <-> Nghề nghiệp
  [1, 3], // Dân cư <-> Dân tộc
  [2, 4], // Nghề nghiệp <-> Tôn giáo
  [3, 4], // Dân tộc <-> Tôn giáo
];

export const SocialNetworkScene: React.FC<SocialNetworkSceneProps> = ({ beatIndex = 0 }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Gentle rotational breathing of the network
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.12;
      groupRef.current.rotation.x = Math.cos(t * 0.25) * 0.06;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 5 Social Nodes */}
      {NODES.map((node) => {
        const isCenter = node.isPrimary;
        const scale = isCenter ? 0.42 : 0.32;

        return (
          <group key={node.id} position={node.pos}>
            {/* Core sphere */}
            <mesh castShadow>
              <sphereGeometry args={[scale, 32, 32]} />
              <meshStandardMaterial
                color={node.color}
                roughness={0.25}
                metalness={0.4}
                emissive={node.color}
                emissiveIntensity={beatIndex >= 1 ? (isCenter ? 0.6 : 0.35) : 0.2}
              />
            </mesh>

            {/* Glowing outer halo ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[scale * 1.15, scale * 1.35, 32]} />
              <meshBasicMaterial
                color={node.color}
                transparent
                opacity={beatIndex >= 1 ? (isCenter ? 0.8 : 0.5) : 0.3}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Micro HTML Label floating over node */}
            <Html
              position={[0, scale + 0.35, 0]}
              center
              distanceFactor={8}
              style={{
                pointerEvents: 'none',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                transition: 'opacity 0.5s ease',
              }}
            >
              <div
                style={{
                  background: 'rgba(11, 13, 16, 0.82)',
                  backdropFilter: 'blur(6px)',
                  border: `1px solid ${isCenter ? '#C87046' : 'rgba(200, 168, 106, 0.4)'}`,
                  borderRadius: '6px',
                  padding: '4px 10px',
                  textAlign: 'center',
                  boxShadow: isCenter ? '0 0 12px rgba(200, 112, 70, 0.35)' : 'none',
                }}
              >
                <div
                  style={{
                    color: isCenter ? '#F5F0E8' : '#EDE4D6',
                    fontWeight: isCenter ? 700 : 500,
                    fontSize: isCenter ? '14px' : '12px',
                    letterSpacing: '0.05em',
                  }}
                >
                  {node.name}
                </div>
                <div
                  style={{
                    color: '#C8A86A',
                    fontSize: '10px',
                    opacity: 0.85,
                  }}
                >
                  {node.sub}
                </div>
              </div>
            </Html>
          </group>
        );
      })}

      {/* Connecting links between nodes (revealed in Beat 1 & 2) using Drei Line */}
      {EDGES.map(([startIndex, endIndex], index) => {
        const isPrimaryEdge = startIndex === 0 || endIndex === 0;
        const opacity = beatIndex === 0 ? 0 : beatIndex === 1 ? (isPrimaryEdge ? 0.7 : 0.35) : (isPrimaryEdge ? 0.95 : 0.6);
        const lineColor = isPrimaryEdge ? '#C87046' : '#C8A86A';

        if (opacity === 0) return null;

        return (
          <Line
            key={`edge-${index}`}
            points={[NODES[startIndex].pos, NODES[endIndex].pos]}
            color={lineColor}
            lineWidth={isPrimaryEdge ? 2.5 : 1.2}
            transparent
            opacity={opacity}
          />
        );
      })}

      {/* Floating particles background for depth */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(
                Array.from({ length: 180 }, () => (Math.random() - 0.5) * 10)
              ),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#C8A86A"
          transparent
          opacity={0.3}
          sizeAttenuation
        />
      </points>

      {/* Scene illumination */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#F5F0E8" />
      <pointLight position={[0, 0, 2]} intensity={1.5} color="#C87046" distance={6} />
    </group>
  );
};
