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

export const PresentationShell: React.FC = () => {
  const viewMode = usePresentationStore((state) => state.viewMode);

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
        });
      }
    });
  }, []);

  useEffect(() => {
    return () => channel.close();
  }, [channel]);

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
      <ProgressBar />

      {/* Top Chapter Navigation Dock */}
      {viewMode !== 'cover' && <ChapterRail />}

      {/* Cover Screen */}
      {viewMode === 'cover' && <CoverScreen />}

      {/* 3D Visual Stage (Bookshelf or R3F or Safe Stage) */}
      <VisualStage />

      {/* Semantic Content Overlay */}
      <ContentOverlay />

      {/* Blackout Layer for key B */}
      <BlackoutLayer />
    </div>
  );
};
