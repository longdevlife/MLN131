import React from 'react';
import type { PresentationScene } from '../../content/types';
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

export const SafeStage: React.FC<SafeStageProps> = ({ scene, beatIndex }) => {
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
      {scene.visual.id === 'paper' && (
        <SafePaperScene beatIndex={beatIndex} sceneId={scene.id} />
      )}

      {scene.visual.id === 'constellation' && (
        <SafeSocialNetworkScene beatIndex={beatIndex} />
      )}

      {scene.visual.id === 'class-relations' && (
        <SafeClassRelationsScene scene={scene} beatIndex={beatIndex} />
      )}

      {scene.visual.id === 'orbital-centrality' && (
        <SafeOrbitalCentralityScene scene={scene} beatIndex={beatIndex} />
      )}

      {scene.visual.id === 'structure-flow' && (
        <SafeStructureFlowScene scene={scene} beatIndex={beatIndex} />
      )}

      {scene.visual.id === 'diversification' && (
        <SafeDiversificationScene scene={scene} beatIndex={beatIndex} />
      )}

      {scene.visual.id === 'convergence' && (
        <SafeConvergenceScene scene={scene} beatIndex={beatIndex} />
      )}

      {scene.visual.id === 'part1-bridge' && (
        <SafePart1BridgeScene scene={scene} beatIndex={beatIndex} />
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
