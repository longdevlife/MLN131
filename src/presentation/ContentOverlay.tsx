import React from 'react';
import { usePresentationStore } from '../state/presentationStore';
import { selectCurrentChapter, selectCurrentScene, selectCurrentBeat } from '../state/selectors';
import { ArticleHeadings } from '../vendor/threeui-custom/headings/ArticleHeadings';

export const ContentOverlay: React.FC = () => {
  const viewMode = usePresentationStore((state) => state.viewMode);
  const chapter = usePresentationStore(selectCurrentChapter);
  const scene = usePresentationStore(selectCurrentScene);
  const beat = usePresentationStore(selectCurrentBeat);
  const beatIndex = usePresentationStore((state) => state.beatIndex);

  if (viewMode !== 'chapter' || !scene) return null;

  return (
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
      {/* Top Header Section */}
      <header style={{ maxWidth: '900px' }}>
        <ArticleHeadings
          as="h1"
          kicker={scene.kicker || `Quyển ${chapter.roman} · ${chapter.shortTitle}`}
          title={scene.title}
          subtitle={scene.subtitle}
        />
      </header>

      {/* Center Callout / Definition Card for P1.S1 (Revealed in Beat 2) */}
      {scene.id === 'p1-s1' && (
        <div
          style={{
            alignSelf: 'center',
            maxWidth: '680px',
            width: '100%',
            opacity: beatIndex >= 2 ? 1 : 0,
            transform: beatIndex >= 2 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'auto',
          }}
        >
          <div
            style={{
              background: 'rgba(11, 13, 16, 0.88)',
              backdropFilter: 'blur(16px)',
              border: '1px solid #C87046',
              borderRadius: '12px',
              padding: '1.5rem 2rem',
              boxShadow: '0 16px 36px rgba(0,0,0,0.6), 0 0 20px rgba(200, 112, 70, 0.2)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                color: '#C8A86A',
                fontSize: '0.85rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginBottom: '0.5rem',
              }}
            >
              Định nghĩa cốt lõi
            </div>
            <p
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 'clamp(1.15rem, 2vw, 1.45rem)',
                lineHeight: 1.45,
                color: '#F5F0E8',
                margin: 0,
              }}
            >
              “Cộng đồng người + các mối quan hệ xã hội giữa các cộng đồng ấy.”
            </p>
          </div>
        </div>
      )}

      {/* Bottom Footer Section: Beat hint and Citation */}
      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          width: '100%',
        }}
      >
        {/* Left: Beat info & keyboard hint */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            color: 'rgba(245, 240, 232, 0.6)',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
          }}
        >
          {beat?.label && (
            <div style={{ color: '#C8A86A', fontWeight: 600 }}>
              ▶ Nhịp {beatIndex + 1}/{scene.beats.length}: {beat.label}
            </div>
          )}
          <div style={{ opacity: 0.7 }}>
            [ Space / → ]: Tiếp tục · [ ← ]: Lùi lại · [ O / Esc ]: Thư viện · [ B ]: Màn hình đen
          </div>
        </div>

        {/* Right: Academic Source Citation Chip */}
        {scene.sourceNote && (
          <aside
            style={{
              background: 'rgba(11, 13, 16, 0.75)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(200, 168, 106, 0.3)',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '0.78rem',
              color: '#EDE4D6',
              fontFamily: 'sans-serif',
              letterSpacing: '0.02em',
            }}
          >
            <span style={{ color: '#C8A86A', fontWeight: 600, marginRight: '6px' }}>
              Nguồn:
            </span>
            {scene.sourceNote}
          </aside>
        )}
      </footer>
    </div>
  );
};
