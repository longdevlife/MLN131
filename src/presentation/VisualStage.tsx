import React from 'react';
import { usePresentationStore } from '../state/presentationStore';
import { selectCurrentScene } from '../state/selectors';
import { BookshelfScene } from '../vendor/threeui-custom/bookshelf/BookshelfScene';
import { R3FStage } from '../scenes/r3f/R3FStage';
import { SafeStage } from '../scenes/safe/SafeStage';
import { SafeBookshelf } from '../scenes/safe/SafeBookshelf';

export const VisualStage: React.FC = () => {
  const viewMode = usePresentationStore((state) => state.viewMode);
  const chapterIndex = usePresentationStore((state) => state.chapterIndex);
  const beatIndex = usePresentationStore((state) => state.beatIndex);
  const qualityTier = usePresentationStore((state) => state.qualityTier);
  const openChapter = usePresentationStore((state) => state.openChapter);
  const currentScene = usePresentationStore(selectCurrentScene);

  if (viewMode === 'cover') {
    return null;
  }

  // 3D Library Lobby View
  if (viewMode === 'library') {
    if (qualityTier === 'safe') {
      return <SafeBookshelf />;
    }

    return (
      <BookshelfScene
        initialIndex={chapterIndex}
        onOpenBook={(index) => {
          openChapter(index);
        }}
        onSelectBook={(index) => {
          usePresentationStore.setState({ chapterIndex: index });
        }}
      />
    );
  }

  // Chapter Content Scene View
  if (viewMode === 'chapter' && currentScene) {
    if (qualityTier === 'safe') {
      return <SafeStage scene={currentScene} beatIndex={beatIndex} />;
    }

    return (
      <R3FStage
        scene={currentScene}
        beatIndex={beatIndex}
        qualityTier={qualityTier}
      />
    );
  }

  return null;
};
