import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { PresentationScene } from '../../content/types';

interface OrbitalCentralitySceneProps {
  scene?: PresentationScene;
  beatIndex?: number;
  qualityTier?: 'high' | 'medium' | 'safe';
}

interface SatelliteConfig {
  id: string;
  defaultName: string;
  defaultSub: string;
  radius: number;
  speed: number;
  phase: number;
  color: string;
  tilt: number;
}

const SATELLITE_CONFIGS: SatelliteConfig[] = [
  { id: 'DANSO', defaultName: 'Cơ cấu Dân cư / Dân số', defaultSub: 'Quy mô & Phân bố địa bàn', radius: 2.2, speed: 0.45, phase: 0, color: '#C8A86A', tilt: 0.2 },
  { id: 'NGHENGHIEP', defaultName: 'Cơ cấu Nghề nghiệp', defaultSub: 'Phân công lao động', radius: 3.0, speed: 0.32, phase: 1.5, color: '#9FB3C9', tilt: -0.15 },
  { id: 'DANTOC', defaultName: 'Cơ cấu Dân tộc', defaultSub: 'Quan hệ tộc người', radius: 3.7, speed: 0.25, phase: 3.1, color: '#76A394', tilt: 0.25 },
  { id: 'TONGIAO', defaultName: 'Cơ cấu Tôn giáo', defaultSub: 'Tín ngưỡng tâm linh', radius: 4.3, speed: 0.18, phase: 4.6, color: '#BD7880', tilt: -0.2 },
];

function generateOrbitPoints(radius: number, segments = 64): [number, number, number][] {
  const points: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push([Math.cos(theta) * radius, 0, Math.sin(theta) * radius]);
  }
  return points;
}

function createRayGeometry(): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  const positions = new Float32Array(6); // [0,0,0,  x,y,z]
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return geom;
}

export const OrbitalCentralityScene: React.FC<OrbitalCentralitySceneProps> = ({
  scene,
  beatIndex = 0,
  qualityTier = 'high',
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const satellitesRef = useRef<(THREE.Group | null)[]>([]);
  const auraRef = useRef<THREE.Mesh>(null);

  // Pre-allocated geometries for the 4 dynamic rays - zero React state updates, zero per-frame allocations
  const rayGeometries = useMemo(() => SATELLITE_CONFIGS.map(() => createRayGeometry()), []);

  const rayLines = useMemo(() => {
    return rayGeometries.map((geom, i) => {
      const mat = new THREE.LineBasicMaterial({
        color: SATELLITE_CONFIGS[i].color,
        transparent: true,
        opacity: 0.6,
      });
      return new THREE.Line(geom, mat);
    });
  }, [rayGeometries]);

  // Cleanly dispose manual Three primitives on unmount to prevent resource lifecycle leaks
  useEffect(() => {
    return () => {
      rayLines.forEach((line) => {
        line.geometry.dispose();
        const mat = line.material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => m.dispose());
        } else {
          mat.dispose();
        }
      });
    };
  }, [rayLines]);

  const orbits = useMemo(() => {
    const segments = qualityTier === 'high' ? 64 : 32;
    return SATELLITE_CONFIGS.map((sat) => generateOrbitPoints(sat.radius, segments));
  }, [qualityTier]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.x = 0.52; // Academic tilt towards camera
      groupRef.current.rotation.y = t * 0.04;
    }

    if (auraRef.current) {
      auraRef.current.rotation.z = t * 0.2;
      const s = 1 + Math.sin(t * 2) * 0.05;
      auraRef.current.scale.set(s, s, 1);
    }

    // Update satellites position and dynamic connection rays directly via buffer attribute
    for (let i = 0; i < SATELLITE_CONFIGS.length; i++) {
      const sat = SATELLITE_CONFIGS[i];
      const el = satellitesRef.current[i];
      const angle = t * sat.speed + sat.phase;
      const x = Math.cos(angle) * sat.radius;
      const z = Math.sin(angle) * sat.radius;
      const y = Math.sin(angle * 2) * sat.tilt;

      if (el) {
        el.position.set(x, y, z);
      }

      // Direct buffer mutation: vertex 1 is (x, y, z)
      const rayGeom = rayGeometries[i];
      if (rayGeom) {
        const posAttr = rayGeom.attributes.position as THREE.BufferAttribute;
        posAttr.setXYZ(1, x, y, z);
        posAttr.needsUpdate = true;
      }

      const rayLine = rayLines[i];
      if (rayLine) {
        rayLine.visible = showOutbound;
        const mat = rayLine.material as THREE.LineBasicMaterial;
        mat.color.set(showReciprocal ? '#F5F0E8' : sat.color);
        mat.opacity = showReciprocal ? 0.85 : 0.6;
      }
    }
  });

  const showSatellites = beatIndex >= 1;
  const showOutbound = beatIndex >= 2;
  const showReciprocal = beatIndex >= 3;
  const showWarning = beatIndex >= 4;

  const centralLabel = scene?.visualLabels?.find((l) => l.id === 'CENTRAL');

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Core: Cơ cấu xã hội - giai cấp */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.88, 32, 32]} />
        <meshStandardMaterial
          color="#C87046"
          roughness={0.2}
          metalness={0.7}
          emissive="#A34621"
          emissiveIntensity={showReciprocal ? 0.85 : 0.5}
        />
      </mesh>

      {/* Golden Aura Ring around Core */}
      <mesh ref={auraRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.25, 32]} />
        <meshBasicMaterial
          color="#C8A86A"
          transparent
          opacity={showOutbound ? 0.75 : 0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Center Label */}
      <Html position={[0, 1.25, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
        <div
          style={{
            background: 'rgba(11, 13, 16, 0.94)',
            border: '2px solid #C87046',
            borderRadius: '8px',
            padding: '8px 18px',
            color: '#F5F0E8',
            textAlign: 'center',
            minWidth: '210px',
            pointerEvents: 'none',
            boxShadow: '0 8px 30px rgba(200, 112, 70, 0.4)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ fontSize: '11px', color: '#C8A86A', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            {centralLabel?.sub || 'Vị trí quan trọng hàng đầu'}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
            {centralLabel?.text || 'Cơ cấu XH – Giai cấp'}
          </div>
        </div>
      </Html>

      {SATELLITE_CONFIGS.map((sat, i) => {
        const canonical = scene?.visualLabels?.find((l) => l.id === sat.id);
        const name = canonical?.text || sat.defaultName;
        const sub = canonical?.sub || sat.defaultSub;
        const role = canonical?.role;

        return (
          <group key={sat.id}>
            {/* Orbit ring */}
            <Line
              points={orbits[i]}
              color={sat.color}
              lineWidth={showSatellites ? 1.4 : 0.6}
              transparent
              opacity={showSatellites ? 0.45 : 0.15}
            />

            {/* Dynamic Real Outbound Ray: from Center [0,0,0] to satellite position */}
            {showOutbound && (
              <primitive object={rayLines[i]} />
            )}

            {/* Satellite body */}
            {showSatellites && (
              <group ref={(el) => { satellitesRef.current[i] = el; }}>
                <mesh scale={0.36}>
                  <sphereGeometry args={[1, 24, 24]} />
                  <meshStandardMaterial
                    color={sat.color}
                    roughness={0.3}
                    metalness={0.5}
                    emissive={sat.color}
                    emissiveIntensity={showReciprocal ? 0.6 : 0.25}
                  />
                </mesh>

                {/* Satellite label */}
                <Html position={[0, 0.55, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
                  <div
                    style={{
                      background: 'rgba(15, 18, 24, 0.92)',
                      border: `1px solid ${sat.color}`,
                      borderRadius: '6px',
                      padding: '5px 12px',
                      color: '#F5F0E8',
                      textAlign: 'center',
                      minWidth: '150px',
                      pointerEvents: 'none',
                      backdropFilter: 'blur(4px)',
                      boxShadow: `0 4px 14px ${sat.color}33`,
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 700, color: sat.color }}>
                      {name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#9FB3C9', marginTop: '1px' }}>
                      {sub}
                    </div>
                    {showReciprocal && (
                      <div style={{ fontSize: '9px', color: '#C8A86A', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '3px', paddingTop: '2px' }}>
                        ⇄ Tác động qua lại
                      </div>
                    )}
                    {showReciprocal && role && (
                      <div style={{ fontSize: '8.5px', color: '#E0E0E0', marginTop: '2px', lineHeight: 1.25 }}>
                        {role}
                      </div>
                    )}
                  </div>
                </Html>
              </group>
            )}
          </group>
        );
      })}

      {/* Dialectical warning overlay at bottom */}
      {(showReciprocal || showWarning) && (
        <Html position={[0, -2.85, 0]} center distanceFactor={10} zIndexRange={[100, 0]}>
          <div
            style={{
              background: 'rgba(23, 26, 36, 0.95)',
              border: '1px solid #BD7880',
              borderRadius: '8px',
              padding: '8px 18px',
              color: '#F5F0E8',
              textAlign: 'center',
              maxWidth: '520px',
              fontSize: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              lineHeight: 1.45,
            }}
          >
            <span style={{ color: '#BD7880', fontWeight: 700 }}>Nguyên lý biện chứng:</span> Không được tuyệt đối hóa vai trò của cơ cấu xã hội – giai cấp và xem nhẹ các loại hình cơ cấu xã hội khác.
          </div>
        </Html>
      )}

      {/* Illumination */}
      <ambientLight intensity={0.65} color="#F5F0E8" />
      <directionalLight position={[4, 8, 4]} intensity={1.4} color="#FFF8ED" />
      <pointLight position={[0, 0, 1.5]} intensity={showReciprocal ? 3.0 : 2.2} color="#C87046" distance={9} />
    </group>
  );
};
