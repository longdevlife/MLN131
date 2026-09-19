import React from 'react';
import type { PresentationScene } from '../../content/types';

interface SafeClassRelationsSceneProps {
  scene?: PresentationScene;
  beatIndex?: number;
}

export const SafeClassRelationsScene: React.FC<SafeClassRelationsSceneProps> = ({
  scene,
  beatIndex = 0,
}) => {
  const isVisible = beatIndex >= 1;

  const defaultAxes = [
    { id: 'TLSX', activeBeat: 2, title: '1. Quan hệ sở hữu TLSX', sub: 'Quyết định trực tiếp địa vị giai cấp', color: '#C8A86A', icon: '🏭' },
    { id: 'QUAN_LY', activeBeat: 2, title: '2. Tổ chức quản lý', sub: 'Phân công lao động xã hội và điều hành', color: '#9FB3C9', icon: '⚙️' },
    { id: 'DIA_VI', activeBeat: 3, title: '3. Địa vị chính trị – XH', sub: 'Quy định quyền lực và vai trò xã hội', color: '#76A394', icon: '⚖️' },
    { id: 'PHAN_PHOI', activeBeat: 3, title: '4. Phân phối thu nhập', sub: 'Phương thức và quy mô thụ hưởng của cải', color: '#BD7880', icon: '📈' },
  ];

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
      {/* Central Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(200, 112, 70, 0.25), rgba(11, 13, 16, 0.95))',
          border: '2px solid #C87046',
          borderRadius: '12px',
          padding: '1.25rem 2.5rem',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(200, 112, 70, 0.25)',
        }}
      >
        <div style={{ fontSize: '0.85rem', color: '#C8A86A', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
          Hạt nhân cấu trúc
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F5F0E8', margin: '0.25rem 0' }}>
          Cơ cấu xã hội – giai cấp
        </div>
        <div style={{ fontSize: '0.95rem', color: '#C8D3DC' }}>
          Hệ thống các giai cấp, tầng lớp xã hội tồn tại khách quan trong một chế độ xã hội nhất định
        </div>
      </div>

      {/* 4 Relational Axes Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          width: '100%',
          opacity: isVisible ? 1 : 0.45,
          transition: 'opacity 0.4s ease',
        }}
      >
        {defaultAxes.map((axis) => {
          const canonical = scene?.visualLabels?.find((l) => l.id === axis.id);
          const title = canonical?.text ? `${axis.title.slice(0, 3)} ${canonical.text}` : axis.title;
          const sub = canonical?.sub || axis.sub;
          const role = canonical?.role;
          const isHighlighted = beatIndex >= axis.activeBeat;

          return (
            <div
              key={axis.id}
              style={{
                background: isHighlighted ? 'rgba(23, 26, 36, 0.95)' : 'rgba(23, 26, 36, 0.65)',
                border: `1.5px solid ${isHighlighted ? axis.color : `${axis.color}44`}`,
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                boxShadow: isHighlighted ? `0 4px 16px ${axis.color}25` : 'none',
                transition: 'all 0.35s ease',
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{axis.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: axis.color, fontSize: '1rem' }}>
                  {title}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#C8D3DC', marginTop: '0.25rem' }}>
                  {sub}
                </div>
                {isHighlighted && role && (
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#B0BEC5',
                      marginTop: '0.35rem',
                      paddingTop: '0.25rem',
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      lineHeight: 1.3,
                    }}
                  >
                    {role}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
