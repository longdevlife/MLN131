import React from 'react';
import { usePresentationStore } from '../state/presentationStore';
import { selectCurrentChapter, selectCurrentScene, selectCurrentBeat } from '../state/selectors';
import { ArticleHeadings } from '../vendor/threeui-custom/headings/ArticleHeadings';
import { SourceDrawer } from './SourceDrawer';
import { BookOpen } from 'lucide-react';

export const ContentOverlay: React.FC = () => {
  const isSourceDrawerOpen = usePresentationStore((state) => state.isSourceDrawerOpen);
  const openSourceDrawer = usePresentationStore((state) => state.openSourceDrawer);
  const closeSourceDrawer = usePresentationStore((state) => state.closeSourceDrawer);
  const viewMode = usePresentationStore((state) => state.viewMode);
  const chapter = usePresentationStore(selectCurrentChapter);
  const scene = usePresentationStore(selectCurrentScene);
  const beat = usePresentationStore(selectCurrentBeat);
  const beatIndex = usePresentationStore((state) => state.beatIndex);

  if (viewMode !== 'chapter' || !scene) return null;

  const callout = scene.callout;
  const showCallout = callout ? beatIndex >= (callout.minBeat ?? 0) : false;

  return (
    <>
      <div
        className="content-overlay-layer"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '5rem 4rem 2.5rem',
          boxSizing: 'border-box',
          zIndex: 50,
        }}
      >
        {/* Top Header Section: Restrained Editorial Width (38-42vw) */}
        <header style={{ maxWidth: 'min(42vw, 580px)', pointerEvents: 'auto' }}>
          <ArticleHeadings
            as="h1"
            kicker={scene.kicker || `Quyển ${chapter.roman} · ${chapter.shortTitle}`}
            title={scene.title}
            subtitle={scene.subtitle}
          />
        </header>

        {/* Center Callout / Academic Quote Card: Excluded on ThreeUI scenes to avoid visual clutter */}
        {callout && !['p1-s3', 'p1-s4'].includes(scene.id) && (
          <div
            style={{
              alignSelf: 'center',
              maxWidth: '720px',
              width: '100%',
              opacity: showCallout ? 1 : 0,
              transform: showCallout ? 'translateY(0)' : 'translateY(18px)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              pointerEvents: showCallout ? 'auto' : 'none',
            }}
          >
            <div
              style={{
                background: 'rgba(11, 13, 16, 0.90)',
                backdropFilter: 'blur(16px)',
                border: `1px solid ${callout.borderColor || '#C8A86A'}`,
                borderRadius: '12px',
                padding: '1.25rem 2rem',
                boxShadow: `0 16px 36px rgba(0,0,0,0.6), 0 0 24px ${callout.borderColor || '#C8A86A'}33`,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  color: callout.badgeColor || '#C8A86A',
                  fontSize: '0.8rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  marginBottom: '0.4rem',
                }}
              >
                ✦ {callout.badge} ✦
              </div>
              <p
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
                  lineHeight: 1.45,
                  color: '#F5F0E8',
                  margin: 0,
                  fontStyle: callout.isExactQuote ? 'italic' : 'normal',
                }}
              >
                {callout.isExactQuote ? `“${callout.text}”` : callout.text}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Footer Section: Beat info and Citation */}
        <footer
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            width: '100%',
          }}
        >
          {/* Left: Beat info, step dots & keyboard hint */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              color: 'rgba(245, 240, 232, 0.7)',
              fontSize: '0.8rem',
            }}
          >
            {beat?.label && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#C8A86A', fontWeight: 700, fontSize: '0.85rem' }}>
                  Nhịp {beatIndex + 1}/{scene.beats.length}
                </span>
                <span style={{ color: 'rgba(200, 168, 106, 0.8)', letterSpacing: '2px', fontSize: '0.9rem' }}>
                  {scene.beats.map((_, idx) => (idx <= beatIndex ? '●' : '○')).join(' ')}
                </span>
                <span style={{ color: '#EDE4D6', fontWeight: 600 }}>· {beat.label}</span>
              </div>
            )}
            <div style={{ opacity: 0.7, fontFamily: 'monospace', fontSize: '0.75rem' }}>
              [ Space / → ]: Tiếp tục · [ ← ]: Lùi lại · [ O / Esc ]: Thư viện · [ B ]: Màn hình đen
            </div>
          </div>

          {/* Right: Academic Source Citation Chip */}
          {scene.sourceNote && (
            <button
              type="button"
              onClick={openSourceDrawer}
              title="Click để xem toàn bộ danh mục tài liệu trích dẫn"
              style={{
                pointerEvents: 'auto',
                background: 'rgba(11, 13, 16, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(200, 168, 106, 0.4)',
                borderRadius: '6px',
                padding: '7px 14px',
                fontSize: '0.78rem',
                color: '#EDE4D6',
                fontFamily: 'sans-serif',
                letterSpacing: '0.02em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C87046';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200, 168, 106, 0.4)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <BookOpen size={13} color="#C8A86A" />
              <span style={{ color: '#C8A86A', fontWeight: 600 }}>Nguồn:</span>
              <span>{scene.sourceNote}</span>
            </button>
          )}
        </footer>
      </div>

      {/* Slide-over Citation Drawer */}
      <SourceDrawer
        isOpen={isSourceDrawerOpen}
        onClose={closeSourceDrawer}
        currentSourceId="giaoTrinh2021"
      />
    </>
  );
};
