import React from 'react';
import type { PresentationScene } from '../../content/types';

interface SafeDiversificationSceneProps {
  scene?: PresentationScene;
  beatIndex?: number;
}

export const SafeDiversificationScene: React.FC<SafeDiversificationSceneProps> = ({
  scene,
  beatIndex = 0,
}) => {
  const showInternalDiff = beatIndex >= 1;
  const showNewGroups = beatIndex >= 2;
  const showConnections = beatIndex >= 3;
  const isZoomedOut = beatIndex >= 4;

  const baselineIds = ['GROUP_A', 'GROUP_B', 'GROUP_C'];
  const newGroupIds = ['GROUP_D', 'GROUP_E'];

  const colorMap: Record<string, string> = {
    GROUP_A: '#C87046',
    GROUP_B: '#76A394',
    GROUP_C: '#9FB3C9',
    GROUP_D: '#C8A86A',
    GROUP_E: '#E5A93C',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '880px',
        margin: '0 auto',
        gap: '1.5rem',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.85rem', color: '#C8A86A', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
          Sự biến đổi có tính quy luật — Xu hướng 2
        </div>
        <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F5F0E8', marginTop: '0.25rem' }}>
          Biến đổi phức tạp, đa dạng và xuất hiện các tầng lớp xã hội mới
        </div>
      </div>

      {/* Baseline Section */}
      <div style={{ width: '100%' }}>
        <div style={{ fontSize: '0.85rem', color: '#C8A86A', fontWeight: 700, marginBottom: '0.5rem' }}>
          ✦ Các nhóm/giai tầng tiêu biểu ban đầu trong mô hình minh họa:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
          {baselineIds.map((id) => {
            const canonical = scene?.visualLabels?.find((l) => l.id === id);
            const color = colorMap[id] || '#C87046';
            return (
              <div
                key={id}
                style={{
                  background: 'rgba(23, 26, 36, 0.9)',
                  border: `1px solid ${color}`,
                  borderRadius: '8px',
                  padding: '0.9rem',
                  boxShadow: `0 4px 12px ${color}22`,
                }}
              >
                <div style={{ fontWeight: 700, color, fontSize: '0.95rem' }}>
                  {canonical?.text || id}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#C8D3DC', marginTop: '0.25rem' }}>
                  {canonical?.sub}
                </div>
                {showInternalDiff && (
                  <div style={{ fontSize: '0.72rem', color: '#C8A86A', marginTop: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.25rem' }}>
                    ⚡ Phân hóa nội bộ theo ngành & thu nhập
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Newly Emerged Section */}
      <div style={{ width: '100%', opacity: showNewGroups ? 1 : 0.35, transition: 'opacity 0.4s ease' }}>
        <div style={{ fontSize: '0.85rem', color: '#E5A93C', fontWeight: 700, marginBottom: '0.5rem' }}>
          ✦ Các tầng lớp xã hội mới xuất hiện mang tính minh họa:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {newGroupIds.map((id) => {
            const canonical = scene?.visualLabels?.find((l) => l.id === id);
            const color = colorMap[id] || '#E5A93C';
            return (
              <div
                key={id}
                style={{
                  background: 'rgba(23, 26, 36, 0.9)',
                  border: `1px solid ${color}`,
                  borderRadius: '8px',
                  padding: '0.9rem',
                  boxShadow: `0 4px 12px ${color}22`,
                }}
              >
                <div style={{ fontWeight: 700, color, fontSize: '0.95rem' }}>
                  {canonical?.text || id}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#C8D3DC', marginTop: '0.25rem' }}>
                  {canonical?.sub}
                </div>
                {canonical?.role && (
                  <div style={{ fontSize: '0.72rem', color: '#B0BEC5', marginTop: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.25rem', lineHeight: 1.25 }}>
                    {canonical.role}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-relational interconnections at Beat 3+ and Zoom-out at Beat 4 */}
      {(showConnections || isZoomedOut) && (
        <div
          style={{
            background: 'rgba(200, 168, 106, 0.12)',
            border: '1px solid #C8A86A',
            borderRadius: '6px',
            padding: '0.75rem 1.25rem',
            color: '#F5F0E8',
            fontSize: '0.88rem',
            lineHeight: 1.45,
            width: '100%',
            textAlign: 'center',
          }}
        >
          {isZoomedOut
            ? 'Toàn cảnh diện mạo xã hội gia tăng độ phức tạp cấu trúc: Các mối liên hệ kinh tế, lao động và văn hóa đan xen đa chiều giữa các tầng lớp trong thời kỳ quá độ.'
            : 'Các mối quan hệ và tương tác xã hội giữa các giai tầng ngày càng nhân rộng và đan xen chặt chẽ.'}
        </div>
      )}
    </div>
  );
};
