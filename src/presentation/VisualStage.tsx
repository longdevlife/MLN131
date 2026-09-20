import React from 'react';
import { usePresentationStore } from '../state/presentationStore';
import { selectCurrentScene } from '../state/selectors';
import { BookshelfScene } from '../vendor/threeui-custom/bookshelf/BookshelfScene';
import { R3FStage } from '../scenes/r3f/R3FStage';
import { SafeStage } from '../scenes/safe/SafeStage';
import { SafeBookshelf } from '../scenes/safe/SafeBookshelf';
import { ThreeUIOrbitalScene } from '../scenes/threeui/ThreeUIOrbitalScene';
import { ThreeUIStructureFlowScene } from '../scenes/threeui/ThreeUIStructureFlowScene';
import { MagazineExperience } from '../experiences/magazine/MagazineExperience';

export const VisualStage: React.FC = () => {
  const viewMode = usePresentationStore((state) => state.viewMode);
  const experienceMode = usePresentationStore((state) => state.experienceMode);
  const selectedBook = usePresentationStore((state) => state.selectedBook);
  const chapterIndex = usePresentationStore((state) => state.chapterIndex);
  const beatIndex = usePresentationStore((state) => state.beatIndex);
  const qualityTier = usePresentationStore((state) => state.qualityTier);
  const openBook = usePresentationStore((state) => state.openBook);
  const currentScene = usePresentationStore(selectCurrentScene);

  if (experienceMode === 'cover' || (viewMode === 'cover' && experienceMode !== 'magazine')) {
    return null;
  }

  // Exclusive Magazine Mode
  if (experienceMode === 'magazine') {
    return <MagazineExperience />;
  }

  // 3D Library Lobby View
  if (experienceMode === 'library' || viewMode === 'library') {
    if (qualityTier === 'safe') {
      return <SafeBookshelf />;
    }

    return (
      <BookshelfScene
        initialIndex={selectedBook ?? chapterIndex}
        onOpenBook={(index) => {
          openBook(index);
        }}
        onSelectBook={(index) => {
          usePresentationStore.setState({ selectedBook: index, chapterIndex: index });
        }}
      />
    );
  }

  // Chapter Content Scene View
  if (viewMode === 'chapter' && currentScene) {
    if (qualityTier === 'safe') {
      return <SafeStage scene={currentScene} beatIndex={beatIndex} />;
    }

    // Phase 2.2 Gate: Route P1.S3 and P1.S4 to ThreeUI Native Components
    if (currentScene.visual.id === 'orbital-centrality') {
      return (
        <ThreeUIOrbitalScene
          scene={currentScene}
          beatIndex={beatIndex}
          qualityTier={qualityTier}
        />
      );
    }

    if (currentScene.visual.id === 'structure-flow') {
      return (
        <ThreeUIStructureFlowScene
          scene={currentScene}
          beatIndex={beatIndex}
          qualityTier={qualityTier}
        />
      );
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
