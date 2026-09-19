import React from 'react';

interface SafeStructureFlowSceneProps {
  beatIndex?: number;
}

export const SafeStructureFlowScene: React.FC<SafeStructureFlowSceneProps> = ({
  beatIndex = 0,
}) => {
  const gates = [
    { step: '01', title: 'Cơ cấu kinh tế', sub: 'Kinh tế nhiều thành phần, đẩy mạnh CNH – HĐH', color: '#C8A86A' },
    { step: '02', title: 'Cơ cấu lao động', sub: 'Chuyển dịch phân công lao động và việc làm', color: '#9FB3C9' },
    { step: '03', title: 'Địa vị các giai tầng', sub: 'Thay đổi vị thế trong quan hệ sản xuất', color: '#76A394' },
    { step: '04', title: 'Cơ cấu XH – giai cấp', sub: 'Diện mạo giai cấp vận động tương ứng', color: '#C87046' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '920px',
        margin: '0 auto',
        gap: '2rem',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.85rem', color: '#C8A86A', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
          Quy luật chuyển dịch 1 chiều cốt lõi
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F5F0E8', marginTop: '0.25rem' }}>
          Cơ cấu kinh tế quy định sự biến đổi của cơ cấu xã hội – giai cấp
        </div>
      </div>

      {/* Horizontal Flow Stepper */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          width: '100%',
          position: 'relative',
        }}
      >
        {gates.map((g, i) => {
          const isReached = beatIndex >= 1 || i <= 1;
          return (
            <div
              key={i}
              style={{
                background: 'rgba(23, 26, 36, 0.9)',
                border: `2px solid ${isReached ? g.color : '#3A2118'}`,
                borderRadius: '8px',
                padding: '1.25rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                opacity: isReached ? 1 : 0.4,
                boxShadow: isReached ? `0 6px 20px ${g.color}25` : 'none',
                transition: 'all 0.4s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: g.color }}>
                  {g.step}
                </span>
                {i < 3 && <span style={{ color: isReached ? '#C8A86A' : '#555' }}>➔</span>}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F5F0E8' }}>
                {g.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#C8D3DC' }}>
                {g.sub}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          background: 'rgba(200, 112, 70, 0.1)',
          borderLeft: '4px solid #C87046',
          padding: '0.75rem 1.25rem',
          color: '#F5F0E8',
          fontSize: '0.9rem',
          maxWidth: '750px',
        }}
      >
        Kinh tế là gốc: Bất kỳ sự thay đổi nào trong phương thức sản xuất và cơ cấu thành phần kinh tế cũng tất yếu dẫn tới sự vận động, chuyển dịch diện mạo giai cấp tương ứng.
      </div>
    </div>
  );
};
