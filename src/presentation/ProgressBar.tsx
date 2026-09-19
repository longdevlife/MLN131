import React from 'react';
import { usePresentationStore } from '../state/presentationStore';
import { selectCurrentChapter } from '../state/selectors';

export const ProgressBar: React.FC = () => {
  const viewMode = usePresentationStore((state) => state.viewMode);
  const chapter = usePresentationStore(selectCurrentChapter);
  const sceneIndex = usePresentationStore((state) => state.sceneIndex);
  const beatIndex = usePresentationStore((state) => state.beatIndex);

  if (viewMode !== 'chapter' || !chapter) return null;

  const totalScenes = chapter.scenes.length;
  const currentScene = chapter.scenes[sceneIndex];
  const totalBeats = currentScene?.beats.length || 1;

  // Calculate percentage
  const sceneProgress = sceneIndex / Math.max(1, totalScenes);
  const beatProgress = (beatIndex / Math.max(1, totalBeats)) * (1 / Math.max(1, totalScenes));
  const progressPercent = Math.min(100, Math.round((sceneProgress + beatProgress) * 100));

  return (
    <div
      className="progress-bar-track"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        background: 'rgba(255, 255, 255, 0.08)',
        zIndex: 100,
      }}
    >
      <div
        className="progress-bar-fill"
        style={{
          height: '100%',
          width: `${progressPercent}%`,
          background: 'linear-gradient(90deg, #C87046, #C8A86A)',
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
};
