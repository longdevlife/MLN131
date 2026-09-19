import React from 'react';

interface SafePaperSceneProps {
  beatIndex?: number;
}

export const SafePaperScene: React.FC<SafePaperSceneProps> = ({
  beatIndex = 0,
}) => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '860px',
        margin: '0 auto',
        padding: '3rem 2.5rem',
        background: '#EDE4D6',
        borderRadius: '8px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        border: '3px double #C8A86A',
        color: '#10131B',
        textAlign: 'center',
        position: 'relative',
        transition: 'all 0.5s ease',
      }}
    >
      <div
        style={{
          fontSize: '0.85rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#C87046',
          fontWeight: 700,
          marginBottom: '1rem',
        }}
      >
        VĂN BẢN TRANG GIÁO TRÌNH
      </div>

      <p
        style={{
          fontSize: '1.25rem',
          fontFamily: 'Georgia, serif',
          color: '#3A2118',
          lineHeight: 1.6,
          maxWidth: '650px',
          margin: '0 auto',
          fontStyle: 'italic',
        }}
      >
        “Cơ cấu xã hội – giai cấp giữ vị trí trung tâm, chi phối mọi quan hệ cộng đồng trong thời kỳ quá độ lên chủ nghĩa xã hội.”
      </p>

      {beatIndex > 0 && (
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(58, 33, 24, 0.25)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            textAlign: 'left',
          }}
        >
          <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '4px' }}>
            <strong style={{ color: '#C87046' }}>1. Là gì?</strong>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>Khái niệm cơ cấu xã hội – giai cấp và các phân hệ.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '4px' }}>
            <strong style={{ color: '#C87046' }}>2. Vì sao quan trọng?</strong>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>Vị trí trung tâm chi phối các quan hệ cộng đồng.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1rem', borderRadius: '4px' }}>
            <strong style={{ color: '#C87046' }}>3. Biến đổi ra sao?</strong>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>3 quy luật vận động trong thời kỳ quá độ.</p>
          </div>
        </div>
      )}
    </div>
  );
};
