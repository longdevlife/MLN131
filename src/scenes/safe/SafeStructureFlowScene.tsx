import React from 'react';
import type { PresentationScene } from '../../content/types';

interface SafeStructureFlowSceneProps {
  scene?: PresentationScene;
  beatIndex?: number;
}

export const SafeStructureFlowScene: React.FC<SafeStructureFlowSceneProps> = ({
  scene,
  beatIndex = 0,
}) => {
  const defaultGates = [
    { id: 'GATE_1', step: '01', title: 'Cơ cấu kinh tế', sub: 'Nền kinh tế nhiều thành phần định hướng XHCN', color: '#C8A86A' },
    { id: 'GATE_2', step: '02', title: 'Ngành & Sở hữu', sub: 'Công nghiệp hóa, hiện đại hóa và đa dạng sở hữu', color: '#9FB3C9' },
    { id: 'GATE_3', step: '03', title: 'Phân công lao động', sub: 'Chuyển dịch cơ cấu lao động và việc làm', color: '#76A394' },
    { id: 'GATE_4', step: '04', title: 'Địa vị & Vai trò', sub: 'Vị trí kinh tế – xã hội của từng giai tầng', color: '#E0A96D' },
    { id: 'GATE_5', step: '05', title: 'Cơ cấu XH – Giai cấp', sub: 'Diện mạo giai tầng biến đổi tương ứng', color: '#C87046' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '960px',
        margin: '0 auto',
        gap: '1.75rem',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.85rem', color: '#C8A86A', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
          Sự biến đổi có tính quy luật — Xu hướng 1
        </div>
        <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F5F0E8', marginTop: '0.25rem' }}>
          Gắn liền và bị quy định bởi cơ cấu kinh tế
        </div>
      </div>

      {/* 5-step Horizontal Causal Sequence */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0.75rem',
          width: '100%',
          position: 'relative',
        }}
      >
        {defaultGates.map((g, i) => {
          const canonical = scene?.visualLabels?.find((l) => l.id === g.id);
          const title = canonical?.text || g.title;
          const sub = canonical?.sub || g.sub;
          const role = canonical?.role;
          const isReached = beatIndex >= i;

          return (
            <div
              key={g.id}
              style={{
                background: isReached ? 'rgba(23, 26, 36, 0.95)' : 'rgba(23, 26, 36, 0.4)',
                border: `2px solid ${isReached ? g.color : '#3A2118'}`,
                borderRadius: '8px',
                padding: '1rem 0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                opacity: isReached ? 1 : 0.35,
                boxShadow: isReached ? `0 6px 20px ${g.color}25` : 'none',
                transition: 'all 0.4s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: g.color }}>
                  {g.step}
                </span>
                {i < 4 && <span style={{ color: isReached ? '#C8A86A' : '#444', fontSize: '0.9rem' }}>➔</span>}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F5F0E8', lineHeight: 1.3 }}>
                {title}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#C8D3DC', lineHeight: 1.3 }}>
                {sub}
              </div>
              {isReached && role && (
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: '#B0BEC5',
                    marginTop: '0.25rem',
                    paddingTop: '0.25rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    lineHeight: 1.25,
                  }}
                >
                  {role}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          background: 'rgba(200, 112, 70, 0.1)',
          borderLeft: '4px solid #C87046',
          borderRadius: '0 8px 8px 0',
          padding: '0.75rem 1.25rem',
          color: '#F5F0E8',
          fontSize: '0.9rem',
          maxWidth: '820px',
          lineHeight: 1.5,
        }}
      >
        Cơ cấu xã hội – giai cấp biến đổi gắn liền và bị quy định bởi sự biến đổi của cơ cấu kinh tế trong thời kỳ quá độ lên chủ nghĩa xã hội.
      </div>
    </div>
  );
};
