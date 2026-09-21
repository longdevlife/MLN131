import React from 'react';
import { usePresentationStore } from '../state/presentationStore';
import { chapters } from '../content/chapters';
import { Library, Maximize, Minimize, ShieldCheck } from 'lucide-react';

export const ChapterRail: React.FC = () => {
  const viewMode = usePresentationStore((state) => state.viewMode);
  const experienceMode = usePresentationStore((state) => state.experienceMode);
  const selectedBook = usePresentationStore((state) => state.selectedBook);
  const chapterIndex = usePresentationStore((state) => state.chapterIndex);
  const isFullscreen = usePresentationStore((state) => state.isFullscreen);
  const qualityTier = usePresentationStore((state) => state.qualityTier);
  const openLibrary = usePresentationStore((state) => state.openLibrary);
  const openBook = usePresentationStore((state) => state.openBook);
  const selectBook = usePresentationStore((state) => state.selectBook);
  const jumpToChapter = usePresentationStore((state) => state.jumpToChapter);
  const setFullscreen = usePresentationStore((state) => state.setFullscreen);
  const setQualityTier = usePresentationStore((state) => state.setQualityTier);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setFullscreen(false);
    }
  };

  const toggleSafeMode = () => {
    setQualityTier(qualityTier === 'safe' ? 'high' : 'safe');
  };

  return (
    <nav
      className="chapter-rail-dock"
      aria-label="Điều hướng chương và chế độ trình bày"
      style={{
        position: 'fixed',
        top: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        background: 'rgba(11, 13, 16, 0.78)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(200, 168, 106, 0.25)',
        borderRadius: '30px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      }}
    >
      {/* Return to library button */}
      <button
        type="button"
        onClick={openLibrary}
        title="Quay lại Thư viện (phím O / Esc)"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: viewMode === 'library' ? 'rgba(200, 112, 70, 0.25)' : 'transparent',
          border: viewMode === 'library' ? '1px solid #C87046' : '1px solid transparent',
          borderRadius: '20px',
          padding: '6px 12px',
          color: viewMode === 'library' ? '#F5F0E8' : '#EDE4D6',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 500,
          transition: 'all 0.2s ease',
        }}
      >
        <Library size={16} color="#C8A86A" />
        <span>Thư viện</span>
      </button>

      <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />

      {/* 4 Books / Chapters */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {chapters.map((ch, idx) => {
          const isLibrary = experienceMode === 'library' || viewMode === 'library';
          const isActive = isLibrary ? selectedBook === idx : (viewMode === 'chapter' && chapterIndex === idx);

          const handleBookClick = () => {
            if (isLibrary) {
              if (idx === 0) {
                openBook(0);
              } else {
                selectBook(idx);
              }
            } else {
              jumpToChapter(idx);
            }
          };

          return (
            <button
              key={ch.id}
              type="button"
              onClick={handleBookClick}
              title={`Quyển ${ch.roman}: ${ch.title} (phím ${idx + 1})`}
              aria-label={`Quyển ${ch.roman}: ${ch.title}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: isActive ? 'rgba(200, 168, 106, 0.2)' : 'transparent',
                border: isActive ? '1px solid #C8A86A' : '1px solid transparent',
                borderRadius: '20px',
                padding: '6px 12px',
                color: isActive ? '#F5F0E8' : 'rgba(237, 228, 214, 0.7)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s ease',
              }}
            >
              <span
                style={{
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                  color: isActive ? '#C8A86A' : 'rgba(200, 168, 106, 0.6)',
                }}
              >
                {ch.roman}
              </span>
              <span className="chapter-rail-title">
                {ch.shortTitle}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />

      {/* Safe mode toggle */}
      <button
        type="button"
        onClick={toggleSafeMode}
        title={qualityTier === 'safe' ? 'Đang bật chế độ 2D Safe Mode' : 'Chuyển chế độ an toàn (Safe Mode)'}
        style={{
          background: qualityTier === 'safe' ? 'rgba(200, 112, 70, 0.3)' : 'transparent',
          border: 'none',
          borderRadius: '50%',
          padding: '6px',
          color: qualityTier === 'safe' ? '#C87046' : '#EDE4D6',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ShieldCheck size={16} />
      </button>

      {/* Fullscreen toggle button */}
      <button
        type="button"
        onClick={toggleFullscreen}
        title="Toàn màn hình (phím F)"
        style={{
          background: 'transparent',
          border: 'none',
          borderRadius: '50%',
          padding: '6px',
          color: '#EDE4D6',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
      </button>
    </nav>
  );
};
