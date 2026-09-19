import React from 'react';

interface SafeDiversificationSceneProps {
  beatIndex?: number;
}

export const SafeDiversificationScene: React.FC<SafeDiversificationSceneProps> = ({
  beatIndex = 0,
}) => {
  const showNewStrata = beatIndex >= 1;
  const showDifferentiation = beatIndex >= 2;

  const traditional = [
    { name: 'Giai cấp Công nhân', role: 'Lực lượng lãnh đạo cách mạng thông qua Đảng', color: '#C87046' },
    { name: 'Giai cấp Nông dân', role: 'Lực lượng đông đảo, cơ sở liên minh chiến lược', color: '#76A394' },
    { name: 'Đội ngũ Trí thức', role: 'Lao động sáng tạo trí tuệ đặc biệt quan trọng', color: '#9FB3C9' },
  ];

  const newStrata = [
    { name: 'Đội ngũ Doanh nhân', role: 'Động lực quản trị, sản xuất kinh doanh thị trường', color: '#C8A86A' },
    { name: 'Tầng lớp Tiểu chủ', role: 'Kinh tế hộ gia đình, dịch vụ vi mô linh hoạt', color: '#E5A93C' },
    { name: 'Lao động tự do mới', role: 'Lao động nền tảng số, kinh tế chia sẻ (Gig economy)', color: '#BD7880' },
  ];

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
          Quy luật biến đổi 2
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F5F0E8', marginTop: '0.25rem' }}>
          Biến đổi phức tạp, đa dạng và xuất hiện các tầng lớp xã hội mới
        </div>
      </div>

      {/* Traditional Section */}
      <div style={{ width: '100%' }}>
        <div style={{ fontSize: '0.9rem', color: '#C8A86A', fontWeight: 700, marginBottom: '0.5rem' }}>
          ✦ 3 Khối giai cấp, tầng lớp truyền thống:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
          {traditional.map((t, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(23, 26, 36, 0.9)',
                border: `1px solid ${t.color}`,
                borderRadius: '8px',
                padding: '0.9rem',
                boxShadow: `0 4px 12px ${t.color}22`,
              }}
            >
              <div style={{ fontWeight: 700, color: t.color, fontSize: '0.95rem' }}>{t.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#C8D3DC', marginTop: '0.25rem' }}>{t.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Newly Emerged Section */}
      <div style={{ width: '100%', opacity: showNewStrata ? 1 : 0.3, transition: 'opacity 0.4s ease' }}>
        <div style={{ fontSize: '0.9rem', color: '#E5A93C', fontWeight: 700, marginBottom: '0.5rem' }}>
          ✦ Các tầng lớp xã hội mới xuất hiện trong thời kỳ quá độ:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
          {newStrata.map((n, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(23, 26, 36, 0.9)',
                border: `1px solid ${n.color}`,
                borderRadius: '8px',
                padding: '0.9rem',
                boxShadow: `0 4px 12px ${n.color}22`,
              }}
            >
              <div style={{ fontWeight: 700, color: n.color, fontSize: '0.95rem' }}>{n.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#C8D3DC', marginTop: '0.25rem' }}>{n.role}</div>
            </div>
          ))}
        </div>
      </div>

      {showDifferentiation && (
        <div
          style={{
            background: 'rgba(200, 168, 106, 0.12)',
            border: '1px solid #C8A86A',
            borderRadius: '6px',
            padding: '0.75rem 1.25rem',
            color: '#F5F0E8',
            fontSize: '0.85rem',
            textAlign: 'center',
            maxWidth: '750px',
          }}
        >
          <strong>Phân hóa nội bộ sâu sắc:</strong> Trong từng giai tầng diễn ra sự phân hóa theo trình độ văn hóa, năng lực công nghệ, mức thu nhập và điều kiện sống thực tế.
        </div>
      )}
    </div>
  );
};
