import React, { useEffect, useMemo } from 'react';
import { usePresentationStore } from '../state/presentationStore';
import { CoverScreen } from './CoverScreen';
import { VisualStage } from './VisualStage';
import { ContentOverlay } from './ContentOverlay';
import { ChapterRail } from './ChapterRail';
import { ProgressBar } from './ProgressBar';
import { KeyboardController } from './KeyboardController';
import { BlackoutLayer } from './BlackoutLayer';
import { PresentationChannel } from '../presenter/broadcast';
import type { PresentationSyncMessage } from '../presenter/broadcast';
import { usePerformanceTier } from '../hooks/usePerformanceTier';

export const PresentationShell: React.FC = () => {
  const viewMode = usePresentationStore((state) => state.viewMode);
  const experienceMode = usePresentationStore((state) => state.experienceMode);
  usePerformanceTier();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__PRESENTATION_STORE__ = usePresentationStore;
    }
  }, []);

  // Synchronize from presenter console via BroadcastChannel
  const channel = useMemo(() => {
    return new PresentationChannel((msg: PresentationSyncMessage) => {
      if (msg.type === 'SYNC_STATE') {
        usePresentationStore.setState({
          viewMode: msg.viewMode,
          chapterIndex: msg.chapterIndex,
          sceneIndex: msg.sceneIndex,
          beatIndex: msg.beatIndex,
          isBlackout: msg.isBlackout,
          ...(msg.experienceMode ? { experienceMode: msg.experienceMode } : {}),
          ...(msg.selectedBook !== undefined ? { selectedBook: msg.selectedBook } : {}),
          ...(msg.magazinePage !== undefined ? { magazinePage: msg.magazinePage } : {}),
          ...(msg.magazineViewMode ? { magazineViewMode: msg.magazineViewMode } : {}),
        });
      }
    });
  }, []);

  useEffect(() => {
    return () => channel.close();
  }, [channel]);

  const isLegacyPresentation =
    experienceMode === 'cover' || experienceMode === 'library';

  return (
    <div
      className="presentation-shell"
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#0B0D10',
        color: '#F5F0E8',
      }}
    >
      {/* Keyboard shortcuts controller */}
      <KeyboardController />

      {/* Progress Bar */}
      {isLegacyPresentation && <ProgressBar />}

      {/* Top Chapter Navigation Dock */}
      {experienceMode === 'library' && <ChapterRail />}

      {/* Cover Screen */}
      {experienceMode === 'cover' && <CoverScreen />}

      {/* 3D Visual Stage (Bookshelf or Magazine or R3F or Safe Stage) */}
      <VisualStage />

      {/* Semantic Content Overlay */}
      {experienceMode !== 'magazine' && viewMode !== 'cover' && <ContentOverlay />}

      {/* Blackout Layer for key B */}
      <BlackoutLayer />
    </div>
  );
};
