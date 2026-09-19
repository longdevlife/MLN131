import React from 'react';
import type { PresentationScene } from '../../content/types';

interface SafeConvergenceSceneProps {
  scene?: PresentationScene;
  beatIndex?: number;
}

export const SafeConvergenceScene: React.FC<SafeConvergenceSceneProps> = ({
  scene,
  beatIndex = 0,
}) => {
  const showTension = beatIndex === 1;
  const showSharedField = beatIndex >= 2;
  const showAlliance = beatIndex >= 3;
  const isMovingCloser = beatIndex >= 4;
  const showFinalPhrase = beatIndex >= 5;

  const clusters = [
    { id: 'CLUSTER_A', name: 'Giai tầng A', color: '#C87046' },
    { id: 'CLUSTER_B', name: 'Giai tầng B', color: '#76A394' },
    { id: 'CLUSTER_C', name: 'Giai tầng C', color: '#9FB3C9' },
    { id: 'CLUSTER_D', name: 'Giai tầng D', color: '#C8A86A' },
  ];

  const sharedFieldLabel = scene?.visualLabels?.find((l) => l.id === 'SHARED_FIELD');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '860px',
        margin: '0 auto',
        gap: '1.5rem',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.85rem', color: '#C8A86A', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
          Sự biến đổi có tính quy luật — Xu hướng 3
        </div>
        <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F5F0E8', marginTop: '0.25rem' }}>
          Vừa đấu tranh vừa liên minh, từng bước xích lại gần nhau
        </div>
      </div>

      {/* Central Goal Convergence Target at Beat 2+ */}
      {showSharedField && (
        <div
          style={{
            background: isMovingCloser
              ? 'radial-gradient(circle, rgba(200, 168, 106, 0.45) 0%, rgba(11, 13, 16, 0.95) 100%)'
              : 'rgba(23, 26, 36, 0.85)',
            border: '2px solid #C8A86A',
            borderRadius: '12px',
            padding: '1.25rem 2rem',
            textAlign: 'center',
            boxShadow: isMovingCloser ? '0 8px 32px rgba(200, 168, 106, 0.4)' : 'none',
            transition: 'all 0.5s ease',
            maxWidth: '560px',
            width: '100%',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#C8A86A', fontWeight: 700, textTransform: 'uppercase' }}>
            {isMovingCloser ? '✦ Giao thoa hội tụ mục tiêu ✦' : 'Trường lực quy tụ'}
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.25rem' }}>
            {sharedFieldLabel?.text || 'Lợi ích chung'}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#C8D3DC', marginTop: '0.25rem' }}>
            {sharedFieldLabel?.sub || 'Mục tiêu xây dựng Chủ nghĩa xã hội'}
          </div>
        </div>
      )}

      {/* 4 Clusters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          width: '100%',
          maxWidth: isMovingCloser ? '620px' : '780px',
          transition: 'max-width 0.4s ease',
        }}
      >
        {clusters.map((c) => (
          <div
            key={c.id}
            style={{
              background: 'rgba(23, 26, 36, 0.9)',
              border: `1px solid ${c.color}`,
              borderRadius: '8px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              boxShadow: `0 4px 14px ${c.color}22`,
            }}
          >
            <div style={{ fontWeight: 700, color: c.color, fontSize: '1rem' }}>
              {showAlliance ? '🤝 ' : ''}
              {c.name}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#9FB3C9' }}>
              {showAlliance
                ? 'Hợp tác và liên minh trên nền tảng lợi ích chung'
                : showTension
                ? '⚡ Tồn tại khác biệt và mâu thuẫn về lợi ích'
                : 'Mang các điều kiện và lợi ích kinh tế riêng'}
            </div>
          </div>
        ))}
      </div>

      {/* Synthesis phrase at Beat 5 */}
      {showFinalPhrase && (
        <div
          style={{
            background: 'rgba(200, 168, 106, 0.15)',
            border: '1.5px solid #C8A86A',
            borderRadius: '8px',
            padding: '1rem 1.5rem',
            color: '#F5F0E8',
            fontWeight: 700,
            fontSize: '1rem',
            textAlign: 'center',
            maxWidth: '680px',
            width: '100%',
          }}
        >
          Vừa đấu tranh, vừa liên minh, từng bước xích lại gần nhau.
        </div>
      )}
    </div>
  );
};
