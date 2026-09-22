import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface PaperSceneProps {
  beatIndex?: number;
}

// Procedural subtle paper texture generator
function createPaperTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#EDE4D6';
    ctx.fillRect(0, 0, 512, 512);

    // Deterministic pseudo-random parchment grain
    let seed = 12345;
    const nextRand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    for (let i = 0; i < 4000; i++) {
      const x = nextRand() * 512;
      const y = nextRand() * 512;
      ctx.fillStyle = nextRand() > 0.5 ? 'rgba(0,0,0,0.015)' : 'rgba(255,255,255,0.025)';
      ctx.fillRect(x, y, 1.5, 1.5);
    }

    // Elegant inner gold foil border
    ctx.strokeStyle = 'rgba(200, 168, 106, 0.45)';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 472, 472);

    ctx.strokeStyle = 'rgba(200, 112, 70, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(28, 28, 456, 456);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

function createAmbientParticles(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  let seed = 888;
  for (let i = 0; i < count * 3; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    arr[i] = (seed / 233280 - 0.5) * 8;
  }
  return arr;
}

export const PaperScene: React.FC<PaperSceneProps> = ({ beatIndex = 0 }) => {
  const meshRef = useRef<THREE.Group>(null);
  const leftPageRef = useRef<THREE.Group>(null);
  const rightPageRef = useRef<THREE.Group>(null);

  const paperTexture = useMemo(() => createPaperTexture(), []);
  const dustParticles = useMemo(() => createAmbientParticles(60), []);

  // Dispose CanvasTexture on unmount to prevent WebGL resource leaks
  useEffect(() => {
    return () => {
      paperTexture.dispose();
    };
  }, [paperTexture]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Gentle cinematic breathing motion
      meshRef.current.position.y = Math.sin(t * 0.7) * 0.04;
      meshRef.current.rotation.y = Math.sin(t * 0.35) * 0.025;
      meshRef.current.rotation.x = Math.cos(t * 0.3) * 0.015;
    }
    if (leftPageRef.current) {
      const targetAngle = beatIndex > 0 ? -0.12 : -0.25;
      leftPageRef.current.rotation.y = THREE.MathUtils.lerp(leftPageRef.current.rotation.y, targetAngle, 0.05);
    }
    if (rightPageRef.current) {
      const targetAngle = beatIndex > 0 ? 0.12 : 0.25;
      rightPageRef.current.rotation.y = THREE.MathUtils.lerp(rightPageRef.current.rotation.y, targetAngle, 0.05);
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Folio spine / center - Leather walnut finish */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[0.1, 4.0, 0.18]} />
        <meshStandardMaterial color="#3A2118" roughness={0.65} metalness={0.2} />
      </mesh>

      {/* Gold metallic spine ribbing accents */}
      {[-1.2, -0.6, 0, 0.6, 1.2].map((y, i) => (
        <mesh key={i} position={[0, y, -0.01]}>
          <boxGeometry args={[0.12, 0.03, 0.2]} />
          <meshStandardMaterial color="#C8A86A" metalness={0.8} roughness={0.25} />
        </mesh>
      ))}

      {/* Left leather cover backing */}
      <mesh position={[-1.38, 0, -0.05]} rotation={[0, -0.22, 0]}>
        <boxGeometry args={[2.65, 3.85, 0.04]} />
        <meshStandardMaterial color="#2B1812" roughness={0.8} metalness={0.15} />
      </mesh>

      {/* Right leather cover backing */}
      <mesh position={[1.38, 0, -0.05]} rotation={[0, 0.22, 0]}>
        <boxGeometry args={[2.65, 3.85, 0.04]} />
        <meshStandardMaterial color="#2B1812" roughness={0.8} metalness={0.15} />
      </mesh>

      {/* Left page leaf */}
      <group ref={leftPageRef} position={[-0.05, 0, 0]}>
        <mesh position={[-1.28, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 3.65, 0.02]} />
          <meshStandardMaterial
            map={paperTexture}
            roughness={0.92}
            metalness={0.02}
            color="#EDE4D6"
          />
        </mesh>

        {/* Left page academic crest / watermark */}
        <Html position={[-1.28, 0, 0.03]} center distanceFactor={10} zIndexRange={[100, 0]}>
          <div
            style={{
              textAlign: 'center',
              color: 'rgba(58, 33, 24, 0.75)',
              userSelect: 'none',
              pointerEvents: 'none',
              width: '200px',
              fontFamily: 'serif',
            }}
          >
            <div style={{ fontSize: '28px', opacity: 0.5, marginBottom: '6px' }}>✦ ✦ ✦</div>
            <div style={{ fontSize: '12px', letterSpacing: '2px', fontWeight: 700, textTransform: 'uppercase', color: '#7A361E' }}>
              Giáo trình Học thuật
            </div>
            <div style={{ fontSize: '15px', fontStyle: 'italic', marginTop: '4px', color: '#3A2118' }}>
              Chủ nghĩa Xã hội Khoa học
            </div>
            <div style={{ fontSize: '11px', marginTop: '8px', color: '#555', borderTop: '1px solid rgba(200, 168, 106, 0.3)', paddingTop: '6px' }}>
              Bộ GD&ĐT — NXB Chính trị quốc gia Sự thật
            </div>
          </div>
        </Html>
      </group>

      {/* Right page leaf */}
      <group ref={rightPageRef} position={[0.05, 0, 0]}>
        <mesh position={[1.28, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 3.65, 0.02]} />
          <meshStandardMaterial
            map={paperTexture}
            roughness={0.92}
            metalness={0.02}
            color="#EDE4D6"
          />
        </mesh>

        {/* Right page dynamic academic focus */}
        <Html position={[1.28, 0, 0.03]} center distanceFactor={10} zIndexRange={[100, 0]}>
          <div
            style={{
              width: '230px',
              color: '#3A2118',
              fontFamily: 'var(--font-serif)',
              pointerEvents: 'none',
              userSelect: 'none',
              lineHeight: 1.45,
            }}
          >
            {/* P1.S0 Academic Agenda */}
            <div>
              <div style={{ fontSize: '11px', color: '#C87046', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                3 Câu hỏi dẫn luận cốt lõi:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', fontSize: '12.5px' }}>
                <div style={{ padding: '4px 6px', background: 'rgba(200, 168, 106, 0.15)', borderRadius: '4px', borderLeft: '3px solid #C8A86A' }}>
                  <strong>1. Là gì?</strong> Bản chất cấu trúc & 4 trục quan hệ sản xuất.
                </div>
                <div style={{ padding: '4px 6px', background: 'rgba(200, 168, 106, 0.15)', borderRadius: '4px', borderLeft: '3px solid #C87046' }}>
                  <strong>2. Vị trí ra sao?</strong> Trung tâm hàng đầu trong hệ thống xã hội.
                </div>
                <div style={{ padding: '4px 6px', background: 'rgba(200, 168, 106, 0.15)', borderRadius: '4px', borderLeft: '3px solid #76A394' }}>
                  <strong>3. Biến đổi thế nào?</strong> 3 xu hướng biến đổi có tính quy luật trong thời kỳ quá độ.
                </div>
              </div>
            </div>
          </div>
        </Html>
      </group>

      {/* Floating golden dust particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustParticles, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.035} color="#C8A86A" transparent opacity={0.35} sizeAttenuation />
      </points>

      {/* Warm cinematic illumination */}
      <ambientLight intensity={0.7} color="#F5F0E8" />
      <directionalLight position={[3, 5, 4]} intensity={1.4} color="#FFF8ED" castShadow />
      <directionalLight position={[-3, -3, 2]} intensity={0.4} color="#C87046" />
      <pointLight position={[0, 0, 2.5]} intensity={1.5} color="#C8A86A" distance={6} />
    </group>
  );
};
