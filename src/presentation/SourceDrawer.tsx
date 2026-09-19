import React from 'react';
import { sources } from '../content/sources';
import { BookMarked, X, ExternalLink } from 'lucide-react';

interface SourceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSourceId?: string;
}

export const SourceDrawer: React.FC<SourceDrawerProps> = ({
  isOpen,
  onClose,
  currentSourceId,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="source-drawer-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        className="source-drawer-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          background: '#10131B',
          borderLeft: '1px solid rgba(200, 168, 106, 0.3)',
          padding: '2rem',
          boxSizing: 'border-box',
          color: '#F5F0E8',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.7)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #3A2118',
            paddingBottom: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookMarked size={22} color="#C87046" />
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'serif', color: '#F5F0E8' }}>
              Tài liệu tham khảo & Trích dẫn
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#EDE4D6',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Source List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.values(sources).map((src) => {
            const isHighlighted = src.id === currentSourceId;

            return (
              <div
                key={src.id}
                style={{
                  background: isHighlighted ? 'rgba(200, 112, 70, 0.15)' : 'rgba(23, 26, 36, 0.8)',
                  border: `1px solid ${isHighlighted ? '#C87046' : '#3A2118'}`,
                  borderRadius: '8px',
                  padding: '1.25rem',
                  lineHeight: 1.55,
                }}
              >
                <div style={{ color: '#C8A86A', fontWeight: 600, fontSize: '0.95rem', marginBottom: '6px' }}>
                  {src.short}
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#EDE4D6', opacity: 0.9 }}>
                  {src.full}
                </p>
                {src.url && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#9FB3C9',
                      fontSize: '0.8rem',
                      marginTop: '8px',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Xem văn bản gốc</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div
          style={{
            borderTop: '1px solid #3A2118',
            paddingTop: '1rem',
            marginTop: '1rem',
            fontSize: '0.75rem',
            color: 'rgba(237, 228, 214, 0.5)',
            textAlign: 'center',
          }}
        >
          [ Nhấn Esc hoặc click bên ngoài để đóng bảng trích dẫn ]
        </div>
      </div>
    </div>
  );
};
