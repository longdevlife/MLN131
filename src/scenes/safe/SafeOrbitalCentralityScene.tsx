import React from 'react';
import type { PresentationScene } from '../../content/types';

interface SafeOrbitalCentralitySceneProps {
  scene?: PresentationScene;
  beatIndex?: number;
}

export const SafeOrbitalCentralityScene: React.FC<SafeOrbitalCentralitySceneProps> = ({
  scene,
  beatIndex = 0,
}) => {
  const showSatellites = beatIndex >= 1;
  const showOutbound = beatIndex >= 2;
  const showReciprocal = beatIndex >= 3;
  const showWarning = beatIndex >= 4;

  const satellites = [
    { id: 'DANSO', name: 'Cơ cấu Dân cư / Dân số', sub: 'Quy mô & Phân bố địa bàn sinh sống', color: '#C8A86A' },
    { id: 'NGHENGHIEP', name: 'Cơ cấu Nghề nghiệp', sub: 'Phân công lao động xã hội', color: '#9FB3C9' },
    { id: 'DANTOC', name: 'Cơ cấu Dân tộc', sub: 'Quan hệ tộc người & bản sắc', color: '#76A394' },
    { id: 'TONGIAO', name: 'Cơ cấu Tôn giáo', sub: 'Tín ngưỡng & đời sống tâm linh', color: '#BD7880' },
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
      {/* Central Core */}
      <div
        style={{
          background: 'radial-gradient(circle, rgba(200, 112, 70, 0.4) 0%, rgba(11, 13, 16, 0.95) 100%)',
          border: '2px solid #C87046',
          borderRadius: '50px',
          padding: '1.25rem 3rem',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(200, 112, 70, 0.3)',
        }}
      >
        <div style={{ fontSize: '0.85rem', color: '#C8A86A', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
          Vị trí quan trọng hàng đầu
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F5F0E8' }}>
          Cơ cấu Xã hội – Giai cấp
        </div>
        <div style={{ fontSize: '0.9rem', color: '#C8D3DC', marginTop: '4px' }}>
          Giữ vị trí quan trọng hàng đầu và có ảnh hưởng mạnh tới các loại hình cơ cấu xã hội khác
        </div>
      </div>

      {/* Satellites */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          width: '100%',
          opacity: showSatellites ? 1 : 0.3,
          transition: 'opacity 0.4s ease',
        }}
      >
        {satellites.map((sat) => {
          const canonical = scene?.visualLabels?.find((l) => l.id === sat.id);
          const name = canonical?.text || sat.name;
          const sub = canonical?.sub || sat.sub;
          const role = canonical?.role;

          let arrow = '·';
          if (showReciprocal) arrow = '⇄';
          else if (showOutbound) arrow = '↓';

          return (
            <div
              key={sat.id}
              style={{
                background: 'rgba(23, 26, 36, 0.85)',
                border: `1px solid ${sat.color}`,
                borderRadius: '8px',
                padding: '1rem 0.75rem',
                textAlign: 'center',
                boxShadow: `0 4px 16px ${sat.color}22`,
              }}
            >
              <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: sat.color }}>
                {arrow}
              </div>
              <div style={{ fontWeight: 700, color: sat.color, fontSize: '0.95rem' }}>
                {name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#C8D3DC', marginTop: '0.25rem' }}>
                {sub}
              </div>
              {showReciprocal && role && (
                <div
                  style={{
                    fontSize: '0.72rem',
                    color: '#B0BEC5',
                    marginTop: '0.5rem',
                    paddingTop: '0.35rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    lineHeight: 1.3,
                  }}
                >
                  {role}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reciprocal Note & Methodological Warning */}
      {(showReciprocal || showWarning) && (
        <div
          style={{
            background: 'rgba(189, 120, 128, 0.15)',
            border: '1px solid #BD7880',
            borderRadius: '8px',
            padding: '0.85rem 1.5rem',
            color: '#F5F0E8',
            fontSize: '0.95rem',
            textAlign: 'center',
            maxWidth: '650px',
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: '#BD7880', fontWeight: 700 }}>Nguyên lý biện chứng:</span>{' '}
          Không được tuyệt đối hóa vai trò của cơ cấu xã hội – giai cấp và xem nhẹ các loại hình cơ cấu xã hội khác.
        </div>
      )}
    </div>
  );
};
