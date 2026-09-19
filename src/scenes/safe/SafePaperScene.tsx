import React from 'react';

interface SafePaperSceneProps {
  beatIndex?: number;
  sceneId?: string;
}

export const SafePaperScene: React.FC<SafePaperSceneProps> = ({
  beatIndex = 0,
  sceneId = 'p1-s0',
}) => {
  const isBridge = sceneId === 'p1-s7';

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '880px',
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
        {isBridge ? 'TỔNG KẾT PHẦN I · CHUYỂN TIẾP QUYỂN II' : 'VĂN BẢN TRANG GIÁO TRÌNH'}
      </div>

      <p
        style={{
          fontSize: '1.25rem',
          fontFamily: 'Georgia, serif',
          color: '#3A2118',
          lineHeight: 1.6,
          maxWidth: '700px',
          margin: '0 auto',
          fontStyle: 'italic',
        }}
      >
        {isBridge
          ? '“Khi các giai cấp, tầng lớp vừa có lợi ích chung vừa có khác biệt, vì sao liên minh công – nông – trí thức trở thành đòi hỏi khách quan quyết định thắng lợi của chủ nghĩa xã hội?”'
          : '“Cơ cấu xã hội – giai cấp giữ vị trí trung tâm hàng đầu, có mối quan hệ biện chứng và ảnh hưởng sâu sắc đến mọi quan hệ cộng đồng trong thời kỳ quá độ lên chủ nghĩa xã hội.”'}
      </p>

      {beatIndex > 0 && !isBridge && (
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
          <div style={{ background: 'rgba(255,255,255,0.7)', padding: '1rem', borderRadius: '6px', borderLeft: '3px solid #C8A86A' }}>
            <strong style={{ color: '#C87046' }}>1. Là gì?</strong>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.88rem', color: '#3A2118' }}>
              Khái niệm cơ cấu xã hội – giai cấp và 4 trục quan hệ sản xuất.
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.7)', padding: '1rem', borderRadius: '6px', borderLeft: '3px solid #C87046' }}>
            <strong style={{ color: '#C87046' }}>2. Vì sao quan trọng?</strong>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.88rem', color: '#3A2118' }}>
              Vị trí trung tâm hàng đầu và tác động biện chứng hai chiều.
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.7)', padding: '1rem', borderRadius: '6px', borderLeft: '3px solid #76A394' }}>
            <strong style={{ color: '#C87046' }}>3. Biến đổi ra sao?</strong>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.88rem', color: '#3A2118' }}>
              3 quy luật biến đổi khách quan trong thời kỳ quá độ.
            </p>
          </div>
        </div>
      )}

      {beatIndex > 0 && isBridge && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1.25rem',
            background: 'rgba(200, 112, 70, 0.15)',
            border: '1px solid #C87046',
            borderRadius: '6px',
            color: '#7A361E',
            fontSize: '0.95rem',
            fontWeight: 600,
          }}
        >
          ➔ Mở đường sang Quyển II: Tính tất yếu của liên minh giai cấp, tầng lớp trong thời kỳ quá độ lên chủ nghĩa xã hội
        </div>
      )}
    </div>
  );
};
