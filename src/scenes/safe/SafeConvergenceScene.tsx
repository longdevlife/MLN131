import React from 'react';

interface SafeConvergenceSceneProps {
  beatIndex?: number;
}

export const SafeConvergenceScene: React.FC<SafeConvergenceSceneProps> = ({
  beatIndex = 0,
}) => {
  const showAlliance = beatIndex >= 1;
  const isConverged = beatIndex >= 2;

  const clusters = [
    { name: 'Giai cấp Công nhân', role: 'Nòng cốt lãnh đạo sự nghiệp xây dựng CNXH', color: '#C87046' },
    { name: 'Giai cấp Nông dân', role: 'Cơ sở giai tầng to lớn bảo đảm lương thực & xã hội', color: '#76A394' },
    { name: 'Đội ngũ Trí thức', role: 'Động lực phát triển kinh tế tri thức và công nghệ', color: '#9FB3C9' },
    { name: 'Đội ngũ Doanh nhân', role: 'Động lực phát triển sản xuất kinh doanh thị trường', color: '#C8A86A' },
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
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.85rem', color: '#C8A86A', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
          Quy luật biến đổi 3
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F5F0E8', marginTop: '0.25rem' }}>
          Vừa đấu tranh vừa liên minh, từng bước xích lại gần nhau
        </div>
      </div>

      {/* Central Goal Convergence Target */}
      <div
        style={{
          background: isConverged
            ? 'radial-gradient(circle, rgba(200, 168, 106, 0.45) 0%, rgba(11, 13, 16, 0.95) 100%)'
            : 'rgba(23, 26, 36, 0.85)',
          border: '2px solid #C8A86A',
          borderRadius: '12px',
          padding: '1.25rem 2rem',
          textAlign: 'center',
          boxShadow: isConverged ? '0 8px 32px rgba(200, 168, 106, 0.4)' : 'none',
          transition: 'all 0.5s ease',
          maxWidth: '560px',
        }}
      >
        <div style={{ fontSize: '0.8rem', color: '#C8A86A', fontWeight: 700, textTransform: 'uppercase' }}>
          {isConverged ? '✦ Điểm giao thoa lợi ích cao nhất ✦' : 'Mục tiêu chung'}
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.25rem' }}>
          Xây dựng thành công Chủ nghĩa Xã hội
        </div>
        <div style={{ fontSize: '0.9rem', color: '#C8D3DC', marginTop: '0.25rem' }}>
          Dân giàu, nước mạnh, dân chủ, công bằng, văn minh
        </div>
      </div>

      {/* 4 Clusters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          width: '100%',
          maxWidth: isConverged ? '650px' : '820px',
          transition: 'max-width 0.5s ease',
        }}
      >
        {clusters.map((c, i) => (
          <div
            key={i}
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
            <div style={{ fontSize: '0.85rem', color: '#C8D3DC' }}>{c.role}</div>
          </div>
        ))}
      </div>

      {/* Dialectical Explanation Note */}
      <div
        style={{
          background: 'rgba(200, 112, 70, 0.12)',
          borderLeft: '4px solid #C87046',
          padding: '0.75rem 1.25rem',
          color: '#F5F0E8',
          fontSize: '0.85rem',
          maxWidth: '750px',
        }}
      >
        {isConverged ? (
          <span>
            <strong>Hội tụ và xích lại gần nhau:</strong> Sự xích lại gần nhau giữa các giai cấp diễn ra trên nền tảng lợi ích cơ bản thống nhất, thu hẹp dần khoảng cách về kinh tế, văn hóa và trình độ phát triển.
          </span>
        ) : showAlliance ? (
          <span>
            <strong>Liên minh hợp tác:</strong> Các giai cấp tìm thấy tiếng nói chung và lợi ích tương đồng, củng cố khối đại đoàn kết toàn dân tộc.
          </span>
        ) : (
          <span>
            <strong>Đấu tranh biện chứng:</strong> Tồn tại những khác biệt về phương thức sản xuất và lợi ích cục bộ đòi hỏi sự điều hòa và định hướng của Nhà nước XHCN.
          </span>
        )}
      </div>
    </div>
  );
};
