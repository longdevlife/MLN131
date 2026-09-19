import React from 'react';
import { usePresentationStore } from '../state/presentationStore';
import { selectCurrentChapter, selectCurrentScene, selectCurrentBeat } from '../state/selectors';
import { ArticleHeadings } from '../vendor/threeui-custom/headings/ArticleHeadings';
import { SourceDrawer } from './SourceDrawer';
import { BookOpen } from 'lucide-react';

interface CalloutData {
  badge: string;
  quote: string;
  minBeat: number;
  badgeColor: string;
  borderColor: string;
}

function getSceneCallout(sceneId: string): CalloutData | null {
  switch (sceneId) {
    case 'p1-s1':
      return {
        badge: 'Định nghĩa cốt lõi',
        quote: '“Cộng đồng người + các mối quan hệ xã hội do sự tác động lẫn nhau của các cộng đồng ấy tạo nên.”',
        minBeat: 2,
        badgeColor: '#C8A86A',
        borderColor: '#C87046',
      };
    case 'p1-s2':
      return {
        badge: 'Bản chất cấu trúc',
        quote: '“Cơ cấu xã hội – giai cấp là hệ thống các giai cấp, tầng lớp xã hội tồn tại khách quan trong một chế độ xã hội nhất định.”',
        minBeat: 1,
        badgeColor: '#C8A86A',
        borderColor: '#C8A86A',
      };
    case 'p1-s3':
      return {
        badge: 'Nguyên lý biện chứng',
        quote: '“Cơ cấu xã hội – giai cấp giữ vị trí quan trọng hàng đầu và có ảnh hưởng mạnh tới các loại hình cơ cấu xã hội khác trong mối quan hệ biện chứng.”',
        minBeat: 2,
        badgeColor: '#BD7880',
        borderColor: '#BD7880',
      };
    case 'p1-s4':
      return {
        badge: 'Quy luật khách quan 1',
        quote: '“Cơ cấu xã hội – giai cấp biến đổi gắn liền và bị quy định bởi sự biến đổi của cơ cấu kinh tế trong thời kỳ quá độ lên chủ nghĩa xã hội.”',
        minBeat: 1,
        badgeColor: '#C87046',
        borderColor: '#C87046',
      };
    case 'p1-s5':
      return {
        badge: 'Quy luật khách quan 2',
        quote: '“Cơ cấu xã hội – giai cấp biến đổi phức tạp, đa dạng, làm xuất hiện các tầng lớp xã hội mới và phân hóa nội bộ trong thời kỳ quá độ.”',
        minBeat: 2,
        badgeColor: '#E5A93C',
        borderColor: '#E5A93C',
      };
    case 'p1-s6':
      return {
        badge: 'Quy luật khách quan 3',
        quote: '“Vừa đấu tranh, vừa liên minh, từng bước xích lại gần nhau giữa các giai cấp, tầng lớp cơ bản trong xã hội.”',
        minBeat: 2,
        badgeColor: '#C8A86A',
        borderColor: '#C8A86A',
      };
    case 'p1-s7':
      return {
        badge: 'Cầu nối sang Phần thứ hai',
        quote: '“Nếu các giai cấp, tầng lớp vừa có lợi ích chung, vừa tồn tại những khác biệt về lợi ích, vì sao liên minh giữa họ trở thành một yêu cầu khách quan?”',
        minBeat: 1,
        badgeColor: '#C87046',
        borderColor: '#C87046',
      };
    default:
      return null;
  }
}

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

  const callout = getSceneCallout(scene.id);
  const showCallout = callout ? beatIndex >= callout.minBeat : false;

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
        {/* Top Header Section */}
        <header style={{ maxWidth: '900px' }}>
          <ArticleHeadings
            as="h1"
            kicker={scene.kicker || `Quyển ${chapter.roman} · ${chapter.shortTitle}`}
            title={scene.title}
            subtitle={scene.subtitle}
          />
        </header>

        {/* Center Callout / Academic Quote Card (Revealed at specified beat) */}
        {callout && (
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
                border: `1px solid ${callout.borderColor}`,
                borderRadius: '12px',
                padding: '1.25rem 2rem',
                boxShadow: `0 16px 36px rgba(0,0,0,0.6), 0 0 24px ${callout.borderColor}33`,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  color: callout.badgeColor,
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
                  fontStyle: 'italic',
                }}
              >
                {callout.quote}
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
