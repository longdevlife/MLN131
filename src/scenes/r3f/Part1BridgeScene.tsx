import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { PresentationScene } from '../../content/types';

interface Part1BridgeSceneProps {
  scene: PresentationScene;
  beatIndex: number;
  qualityTier?: 'high' | 'medium' | 'safe';
}

const TARGET_SCALE_VEC = new THREE.Vector3();

export const Part1BridgeScene: React.FC<Part1BridgeSceneProps> = ({
  scene,
  beatIndex,
  qualityTier = 'high',
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const bookRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const recapLabel = scene.visualLabels?.find(l => l.id === 'RECAP_CHAIN');
  const questionLabel = scene.visualLabels?.find(l => l.id === 'CORE_QUESTION');
  const book2Tease = scene.visualLabels?.find(l => l.id === 'BOOK2_TEASE');

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.04;
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(t * 0.3) * 0.2;
      ringRef.current.rotation.y = t * 0.25;
    }

    // Collapse animation at Beat 2+ (zero per-frame allocation)
    if (coreRef.current) {
      const targetScale = beatIndex >= 2 ? 0.01 : 1.0;
      TARGET_SCALE_VEC.setScalar(targetScale);
      coreRef.current.scale.lerp(TARGET_SCALE_VEC, 0.08);
    }

    // Book close rotation simulation at Beat 3+
    if (bookRef.current) {
      const targetAngle = beatIndex >= 3 ? 0 : -Math.PI * 0.35;
      bookRef.current.rotation.y = THREE.MathUtils.lerp(bookRef.current.rotation.y, targetAngle, 0.08);
    }
  });

  const particleCount = qualityTier === 'high' ? 36 : 18;

  const recapSteps = [
    'Cơ cấu xã hội',
    '↓',
    'Cơ cấu XH – Giai cấp',
    '↓',
    'Cơ cấu kinh tế biến đổi',
    '↓',
    'Cơ cấu XH – GC biến đổi',
    '↓',
    'Lợi ích: Thống nhất & Khác biệt',
  ];

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} color="#EDE4D6" />
      <pointLight position={[0, 0, 2.5]} intensity={beatIndex >= 4 ? 3.0 : 1.8} color="#C8A86A" distance={9} />

      {/* BEAT 0: RECAP MAP */}
      {beatIndex === 0 && (
        <group position={[0, 0, 0]}>
          {recapSteps.map((step, idx) => (
            <Text
              key={idx}
              position={[0, 1.8 - idx * 0.42, 0]}
              fontSize={step === '↓' ? 0.16 : 0.2}
              color={step === '↓' ? '#C87046' : '#EDE4D6'}
              anchorX="center"
              anchorY="middle"
            >
              {step}
            </Text>
          ))}
          <Text
            position={[0, -2.2, 0]}
            fontSize={0.14}
            color="#C8A86A"
            anchorX="center"
            anchorY="middle"
          >
            {recapLabel?.text || 'Chuỗi quy luật cốt lõi của Phần thứ nhất'}
          </Text>
        </group>
      )}

      {/* BEAT 1: QUESTION (Hold visually, do not answer) */}
      {beatIndex === 1 && (
        <group position={[0, 0.2, 0]}>
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.24}
            color="#F5F0E8"
            anchorX="center"
            anchorY="middle"
            maxWidth={5.6}
            textAlign="center"
            lineHeight={1.4}
          >
            {questionLabel?.role ||
              'Nếu các giai cấp, tầng lớp vừa có lợi ích chung, vừa tồn tại những khác biệt về lợi ích, vì sao liên minh giữa họ trở thành một yêu cầu khách quan?'}
          </Text>
          <Text
            position={[0, -0.9, 0]}
            fontSize={0.15}
            color="#C87046"
            anchorX="center"
            anchorY="middle"
          >
            ✦ Vấn đề bản lề chuyển giao sang Phần thứ hai ✦
          </Text>
        </group>
      )}

      {/* BEAT 2: COLLAPSE & KNOWLEDGE AURA */}
      {beatIndex >= 2 && beatIndex < 4 && (
        <mesh ref={coreRef} position={[0, 0, -0.5]}>
          <torusGeometry args={[1.6, 0.05, 16, 64]} />
          <meshStandardMaterial color="#C8A86A" emissive="#C8A86A" emissiveIntensity={0.6} />
        </mesh>
      )}

      {/* BEAT 3: BOOK I CLOSING SILHOUETTE */}
      {beatIndex >= 3 && (
        <group ref={bookRef} position={[0, 0, 0]}>
          {/* Book Back Cover */}
          <mesh position={[-0.9, 0, -0.05]}>
            <boxGeometry args={[1.8, 2.6, 0.1]} />
            <meshStandardMaterial color="#3A2118" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* Book Front Cover (Rotating closed) */}
          <mesh position={[0.9, 0, 0.05]}>
            <boxGeometry args={[1.8, 2.6, 0.1]} />
            <meshStandardMaterial color="#16191E" roughness={0.3} metalness={0.6} />
          </mesh>
        </group>
      )}

      {/* BEAT 4: BOOK II TEASE (Warm Highlight) */}
      {beatIndex >= 4 && (
        <group position={[0, 0, 0.8]}>
          <Text
            position={[0, 0.7, 0]}
            fontSize={0.45}
            color="#C8A86A"
            anchorX="center"
            anchorY="middle"
            fontWeight={900}
          >
            II
          </Text>
          <Text
            position={[0, 0.1, 0]}
            fontSize={0.24}
            color="#F5F0E8"
            anchorX="center"
            anchorY="middle"
            fontWeight={700}
            letterSpacing={0.08}
          >
            {book2Tease?.sub || 'TÍNH TẤT YẾU CỦA LIÊN MINH'}
          </Text>
          <Text
            position={[0, -0.45, 0]}
            fontSize={0.14}
            color="#9FB3C9"
            anchorX="center"
            anchorY="middle"
          >
            Liên minh giai cấp, tầng lớp trong thời kỳ quá độ lên chủ nghĩa xã hội
          </Text>
        </group>
      )}

      {/* BEAT 5: HANDOFF READY */}
      {beatIndex >= 5 && (
        <group position={[0, -1.8, 0.8]}>
          <Text
            fontSize={0.16}
            color="#C87046"
            anchorX="center"
            anchorY="middle"
            fontWeight={600}
          >
            ➔ Nhấn phím SPACE hoặc O để chuyển giao sang Quyển II
          </Text>
        </group>
      )}

      {/* Orbiting Resonant Ring */}
      <mesh ref={ringRef} position={[0, 0, 0]}>
        <torusGeometry args={[2.5, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#C8A86A"
          emissive="#C8A86A"
          emissiveIntensity={beatIndex >= 4 ? 0.9 : 0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Floating Background Particles */}
      {Array.from({ length: particleCount }).map((_, idx) => {
        const angle = (idx / particleCount) * Math.PI * 2;
        const radius = 2.4 + (idx % 3) * 0.4;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.sin(idx) * 1.5) - 0.5;
        return (
          <mesh key={idx} position={[x, y, z]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color="#EDE4D6" transparent opacity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
};
