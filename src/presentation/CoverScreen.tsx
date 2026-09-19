import React from 'react';
import { usePresentationStore } from '../state/presentationStore';
import { BookOpen } from 'lucide-react';

export const CoverScreen: React.FC = () => {
  const startPresentation = usePresentationStore((state) => state.startPresentation);

  return (
    <div
      className="cover-screen-container"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'radial-gradient(ellipse at center, #171A24 0%, #0B0D10 75%)',
        color: '#F5F0E8',
        textAlign: 'center',
      }}
    >
      {/* Decorative academic frame */}
      <div
        style={{
          maxWidth: '920px',
          width: '100%',
          padding: '4rem 3rem',
          border: '1px solid rgba(200, 168, 106, 0.25)',
          borderRadius: '12px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(200, 168, 106, 0.05)',
          background: 'rgba(11, 13, 16, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Kicker badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: 'rgba(200, 112, 70, 0.15)',
            border: '1px solid rgba(200, 112, 70, 0.4)',
            color: '#C8A86A',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '2rem',
          }}
        >
          <span>MLN131 · GIÁO TRÌNH SỐ KHÔNG GIAN 3D</span>
        </div>

        {/* Main Title */}
        <h1
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: '#F5F0E8',
            margin: '0 0 1.5rem 0',
            maxWidth: '820px',
          }}
        >
          Cơ cấu xã hội – giai cấp và liên minh giai cấp, tầng lớp
        </h1>

        <p
          style={{
            fontFamily: 'sans-serif',
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            color: '#EDE4D6',
            opacity: 0.85,
            maxWidth: '680px',
            lineHeight: 1.6,
            margin: '0 0 2.5rem 0',
          }}
        >
          Chương 5: Thời kỳ quá độ lên chủ nghĩa xã hội
        </p>

        {/* CTA Button "MỞ GIÁO TRÌNH" */}
        <button
          type="button"
          onClick={startPresentation}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 42px',
            background: 'linear-gradient(135deg, #C87046 0%, #A54B26 100%)',
            color: '#F5F0E8',
            border: '1px solid #DFB15B',
            borderRadius: '40px',
            fontSize: '1.2rem',
            fontFamily: 'sans-serif',
            fontWeight: 600,
            letterSpacing: '0.08em',
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(200, 112, 70, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(200, 112, 70, 0.6), inset 0 1px 0 rgba(255,255,255,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(200, 112, 70, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)';
          }}
        >
          <BookOpen size={22} color="#F5F0E8" />
          <span>MỞ GIÁO TRÌNH</span>
        </button>

        {/* Hint */}
        <div
          style={{
            marginTop: '2rem',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            color: 'rgba(237, 228, 214, 0.5)',
            letterSpacing: '0.05em',
          }}
        >
          [ Nhấn phím SPACE hoặc click MỞ GIÁO TRÌNH để vào Thư viện ]
        </div>
      </div>
    </div>
  );
};
