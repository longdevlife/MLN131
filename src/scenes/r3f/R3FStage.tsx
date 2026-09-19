import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import type { PresentationScene } from '../../content/types';
import { SceneCameraRig } from './camera/SceneCameraRig';
import {
  PaperSceneLazy,
  SocialNetworkSceneLazy,
  ClassRelationsSceneLazy,
  OrbitalCentralitySceneLazy,
  StructureFlowSceneLazy,
  DiversificationSceneLazy,
  ConvergenceSceneLazy,
  Part1BridgeSceneLazy,
} from './sceneRegistry';

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
          {scene.visual.id === 'paper' && (
            <PaperSceneLazy sceneId={scene.id} beatIndex={beatIndex} />
          )}

          {scene.visual.id === 'constellation' && (
            <SocialNetworkSceneLazy beatIndex={beatIndex} qualityTier={qualityTier} />
          )}

          {scene.visual.id === 'class-relations' && (
            <ClassRelationsSceneLazy scene={scene} beatIndex={beatIndex} qualityTier={qualityTier} />
          )}

          {scene.visual.id === 'orbital-centrality' && (
            <OrbitalCentralitySceneLazy scene={scene} beatIndex={beatIndex} qualityTier={qualityTier} />
          )}

          {scene.visual.id === 'structure-flow' && (
            <StructureFlowSceneLazy scene={scene} beatIndex={beatIndex} qualityTier={qualityTier} />
          )}

          {scene.visual.id === 'diversification' && (
            <DiversificationSceneLazy scene={scene} beatIndex={beatIndex} qualityTier={qualityTier} />
          )}

          {scene.visual.id === 'convergence' && (
            <ConvergenceSceneLazy scene={scene} beatIndex={beatIndex} qualityTier={qualityTier} />
          )}

          {scene.visual.id === 'part1-bridge' && (
            <Part1BridgeSceneLazy scene={scene} beatIndex={beatIndex} qualityTier={qualityTier} />
          )}

          {![
            'paper',
            'constellation',
            'class-relations',
            'orbital-centrality',
            'structure-flow',
            'diversification',
            'convergence',
            'part1-bridge',
          ].includes(scene.visual.id) && (
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
