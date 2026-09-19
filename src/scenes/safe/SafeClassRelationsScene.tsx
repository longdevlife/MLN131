import React from 'react';

interface SafeClassRelationsSceneProps {
  beatIndex?: number;
}

export const SafeClassRelationsScene: React.FC<SafeClassRelationsSceneProps> = ({
  beatIndex = 0,
}) => {
  const showAxes = beatIndex >= 1;

  const axes = [
    {
      title: '1. Sở hữu tư liệu sản xuất',
      sub: 'Quyết định địa vị thống trị hoặc bình đẳng kinh tế',
      color: '#C8A86A',
      icon: '🏭',
    },
    {
      title: '2. Tổ chức quản lý sản xuất',
      sub: 'Phân công lao động xã hội, điều hành và thực thi',
      color: '#9FB3C9',
      icon: '⚙️',
    },
    {
      title: '3. Địa vị chính trị – xã hội',
      sub: 'Quyền lực và mức độ ảnh hưởng trong xã hội',
      color: '#76A394',
      icon: '⚖️',
    },
    {
      title: '4. Phân phối lợi ích & thu nhập',
      sub: 'Phương thức và quy mô thụ hưởng của cải làm ra',
      color: '#BD7880',
      icon: '📈',
    },
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
          opacity: showAxes ? 1 : 0.45,
          transition: 'opacity 0.4s ease',
        }}
      >
        {axes.map((axis, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(23, 26, 36, 0.85)',
              border: `1px solid ${axis.color}`,
              borderRadius: '8px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              boxShadow: `0 4px 16px ${axis.color}22`,
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{axis.icon}</span>
            <div>
              <div style={{ fontWeight: 700, color: axis.color, fontSize: '1rem' }}>
                {axis.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#C8D3DC', marginTop: '0.25rem' }}>
                {axis.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
