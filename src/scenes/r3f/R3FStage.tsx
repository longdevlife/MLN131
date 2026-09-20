import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import type { PresentationScene } from '../../content/types';
import { SceneCameraRig } from './camera/SceneCameraRig';
import { SCENE_REGISTRY } from './sceneRegistry';

interface R3FStageProps {
  scene: PresentationScene;
  beatIndex: number;
  qualityTier?: 'high' | 'medium' | 'safe';
}

export const R3FStage: React.FC<R3FStageProps> = ({
  scene,
  beatIndex,
  qualityTier = 'high',
}) => {
  const dpr: [number, number] = qualityTier === 'safe' ? [1, 1] : [1, 1.5];
  const SceneComponent = SCENE_REGISTRY[scene.visual.id];

  return (
    <div
      className="r3f-stage-root"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'auto',
      }}
    >
      <Canvas
        dpr={dpr}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [0, 0, 10],
        }}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
      >
        {/* Unified Cinematic Camera Choreography Rig */}
        <SceneCameraRig sceneId={scene.id} beatIndex={beatIndex} />

        <Suspense fallback={null}>
          {SceneComponent ? (
            <SceneComponent
              scene={scene}
              sceneId={scene.id}
              beatIndex={beatIndex}
              qualityTier={qualityTier}
            />
          ) : (
            <group position={[0, 0, 0]}>
              <mesh>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshStandardMaterial color="#C87046" roughness={0.3} metalness={0.2} />
              </mesh>
              <ambientLight intensity={0.5} />
              <pointLight position={[3, 3, 3]} intensity={1.5} color="#F5F0E8" />
            </group>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
