import React from 'react';
import { chapters } from '../../content/chapters';
import { usePresentationStore } from '../../state/presentationStore';
import { BookOpen } from 'lucide-react';

export const SafeBookshelf: React.FC = () => {
  const openChapter = usePresentationStore((state) => state.openChapter);

  return (
    <div
      className="safe-bookshelf-container"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        boxSizing: 'border-box',
        background: '#0B0D10',
        color: '#F5F0E8',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '2.4rem',
            color: '#F5F0E8',
            margin: '0 0 0.5rem 0',
          }}
        >
          Thư viện Giáo trình (4 Quyển)
        </h2>
        <p style={{ color: '#C8A86A', fontSize: '1rem', margin: 0 }}>
          Chọn một quyển để mở nội dung bài giảng
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1200px',
          width: '100%',
        }}
      >
        {chapters.map((ch, idx) => (
          <div
            key={ch.id}
            onClick={() => openChapter(idx)}
            style={{
              background: ch.color,
              border: `2px solid ${ch.foil}`,
              borderRadius: '8px',
              padding: '2rem 1.5rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '320px',
              boxShadow: '0 12px 28px rgba(0,0,0,0.6)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 18px 36px rgba(0,0,0,0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.6)';
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'monospace',
                  color: ch.foil,
                  fontSize: '0.8rem',
                  letterSpacing: '0.15em',
                  marginBottom: '0.5rem',
                }}
              >
                QUYỂN {ch.roman}
              </div>
              <h3
                style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: '1.5rem',
                  color: '#F5F0E8',
                  margin: '0 0 0.75rem 0',
                  lineHeight: 1.3,
                }}
              >
                {ch.title}
              </h3>
              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#EDE4D6',
                  opacity: 0.85,
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {ch.description}
              </p>
            </div>

            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ color: ch.foil, fontSize: '0.85rem', fontWeight: 600 }}>
                {ch.discipline}
              </span>
              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '6px 12px',
                  color: '#F5F0E8',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                <BookOpen size={14} />
                <span>Mở sách</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
