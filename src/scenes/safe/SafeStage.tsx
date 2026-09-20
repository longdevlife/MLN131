import React from 'react';
import type { PresentationScene, VisualId } from '../../content/types';
import { SafePaperScene } from './SafePaperScene';
import { SafeSocialNetworkScene } from './SafeSocialNetworkScene';
import { SafeClassRelationsScene } from './SafeClassRelationsScene';
import { SafeOrbitalCentralityScene } from './SafeOrbitalCentralityScene';
import { SafeStructureFlowScene } from './SafeStructureFlowScene';
import { SafeDiversificationScene } from './SafeDiversificationScene';
import { SafeConvergenceScene } from './SafeConvergenceScene';
import { SafePart1BridgeScene } from './SafePart1BridgeScene';

interface SafeStageProps {
  scene: PresentationScene;
  beatIndex: number;
}

type SafeSceneComponent = React.ComponentType<{
  scene?: PresentationScene;
  sceneId?: string;
  beatIndex: number;
}>;

const SAFE_SCENE_REGISTRY: Record<VisualId, SafeSceneComponent | null> = {
  'paper': SafePaperScene as unknown as SafeSceneComponent,
  'constellation': SafeSocialNetworkScene as unknown as SafeSceneComponent,
  'class-relations': SafeClassRelationsScene as unknown as SafeSceneComponent,
  'orbital-centrality': SafeOrbitalCentralityScene as unknown as SafeSceneComponent,
  'structure-flow': SafeStructureFlowScene as unknown as SafeSceneComponent,
  'diversification': SafeDiversificationScene as unknown as SafeSceneComponent,
  'convergence': SafeConvergenceScene as unknown as SafeSceneComponent,
  'part1-bridge': SafePart1BridgeScene as unknown as SafeSceneComponent,
  'bookshelf': null,
  'none': null,
};

export const SafeStage: React.FC<SafeStageProps> = ({ scene, beatIndex }) => {
  const SceneComponent = SAFE_SCENE_REGISTRY[scene.visual.id];

  return (
    <div
      className="safe-stage-container"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        boxSizing: 'border-box',
      }}
    >
      {SceneComponent ? (
        <SceneComponent scene={scene} sceneId={scene.id} beatIndex={beatIndex} />
      ) : (
        <div
          style={{
            background: 'rgba(23, 26, 36, 0.9)',
            border: '1px solid #3A2118',
            borderRadius: '8px',
            padding: '2rem',
            color: '#F5F0E8',
            textAlign: 'center',
            maxWidth: '600px',
          }}
        >
          <h3 style={{ color: '#C8A86A' }}>{scene.title}</h3>
          <p>{scene.body?.[0]}</p>
        </div>
      )}
    </div>
  );
};
