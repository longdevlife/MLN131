import React from 'react';
import type { PresentationScene } from '../../content/types';
import { SafePaperScene } from './SafePaperScene';
import { SafeSocialNetworkScene } from './SafeSocialNetworkScene';

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
        <SafePaperScene beatIndex={beatIndex} />
      )}

      {scene.visual.id === 'constellation' && (
        <SafeSocialNetworkScene beatIndex={beatIndex} />
      )}

      {scene.visual.id !== 'paper' && scene.visual.id !== 'constellation' && (
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
