import React from 'react';
import type { PresentationScene } from '../../content/types';

interface SafePart1BridgeSceneProps {
  scene: PresentationScene;
  beatIndex: number;
}

export const SafePart1BridgeScene: React.FC<SafePart1BridgeSceneProps> = ({
  scene: _scene,
  beatIndex,
}) => {
  const recapSteps = [
    { title: 'Cơ cấu xã hội', desc: 'Hệ thống các cộng đồng người và các mối quan hệ xã hội' },
    { title: 'Cơ cấu xã hội – giai cấp', desc: 'Giữ vị trí quan trọng hàng đầu trong hệ thống xã hội' },
    { title: 'Cơ cấu kinh tế biến đổi', desc: 'Quy định và dẫn dắt sự biến đổi của cơ cấu xã hội – giai cấp' },
    { title: 'Cơ cấu XH – GC biến đổi', desc: 'Phức tạp, đa dạng và làm nảy sinh các tầng lớp xã hội mới' },
    { title: 'Lợi ích: Thống nhất & Khác biệt', desc: 'Vừa đấu tranh vừa liên minh, từng bước xích lại gần nhau' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        padding: '2rem',
        boxSizing: 'border-box',
        color: '#F5F0E8',
      }}
    >
      <div
        style={{
          maxWidth: '850px',
          width: '100%',
          background: 'rgba(22, 25, 30, 0.9)',
          border: '1px solid rgba(200, 168, 106, 0.4)',
          borderRadius: '16px',
          padding: '2rem 2.5rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
        }}
      >
        {/* BEAT 0: RECAP MAP */}
        {beatIndex === 0 && (
          <div>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: '#C8A86A',
                fontWeight: 600,
                marginBottom: '0.5rem',
              }}
            >
              Tổng kết Phần thứ nhất
            </span>
            <h2 style={{ fontSize: '1.6rem', color: '#EDE4D6', margin: '0.25rem 0 1.5rem 0' }}>
              Chuỗi biến đổi có tính quy luật của Cơ cấu Xã hội – Giai cấp
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
              {recapSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div
                    style={{
                      background: 'rgba(11, 13, 16, 0.8)',
                      border: '1px solid rgba(200, 112, 70, 0.3)',
                      borderRadius: '8px',
                      padding: '0.6rem 1.5rem',
                      width: '100%',
                      maxWidth: '600px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontWeight: 700, color: '#C8A86A', fontSize: '0.95rem' }}>
                      {step.title}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#B0BEC5' }}>
                      {step.desc}
                    </span>
                  </div>
                  {idx < recapSteps.length - 1 && (
                    <span style={{ color: '#C87046', fontSize: '1.1rem', lineHeight: 1 }}>↓</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* BEAT 1: QUESTION (Hold visually) */}
        {beatIndex === 1 && (
          <div style={{ padding: '2rem 1rem' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: '#C87046',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              Vấn đề cốt lõi bản lề
            </span>
            <blockquote
              style={{
                fontSize: '1.45rem',
                fontFamily: 'serif',
                color: '#F5F0E8',
                lineHeight: 1.6,
                margin: '0 auto 1.5rem auto',
                maxWidth: '680px',
                fontStyle: 'italic',
              }}
            >
              “Nếu các giai cấp, tầng lớp vừa có lợi ích chung, vừa tồn tại những khác biệt về lợi ích, vì sao liên minh giữa họ trở thành một yêu cầu khách quan?”
            </blockquote>
            <p style={{ color: '#9FB3C9', fontSize: '0.95rem', margin: 0 }}>
              (Chuyển giao sang Phần thứ hai để giải quyết câu hỏi trung tâm này)
            </p>
          </div>
        )}

        {/* BEAT 2 & 3: COLLAPSE & BOOK CLOSE */}
        {(beatIndex === 2 || beatIndex === 3) && (
          <div style={{ padding: '2rem 1rem' }}>
            <div
              style={{
                width: '70px',
                height: '90px',
                margin: '0 auto 1.5rem auto',
                background: '#3A2118',
                border: '2px solid #C8A86A',
                borderRadius: '4px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: '#C8A86A',
                fontWeight: 800,
              }}
            >
              I
            </div>
            <h3 style={{ fontSize: '1.4rem', color: '#EDE4D6', margin: '0 0 0.5rem 0' }}>
              {beatIndex === 2 ? 'Mạng lưới tri thức thu nhỏ về dạng trang sách' : 'Khép lại Phần thứ nhất'}
            </h3>
            <p style={{ color: '#B0BEC5', fontSize: '0.95rem', maxWidth: '550px', margin: '0 auto' }}>
              Khái luận về cơ cấu xã hội – giai cấp trong thời kỳ quá độ lên chủ nghĩa xã hội đã được làm sáng tỏ.
            </p>
          </div>
        )}

        {/* BEAT 4 & 5: BOOK II TEASE & HANDOFF */}
        {beatIndex >= 4 && (
          <div style={{ padding: '2rem 1rem' }}>
            <div
              style={{
                fontSize: '2.4rem',
                fontWeight: 900,
                color: '#C8A86A',
                fontFamily: 'serif',
                marginBottom: '0.25rem',
              }}
            >
              II
            </div>
            <h2
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: '#F5F0E8',
                letterSpacing: '0.05em',
                margin: '0 0 0.75rem 0',
              }}
            >
              TÍNH TẤT YẾU CỦA LIÊN MINH
            </h2>
            <p style={{ color: '#B0BEC5', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
              Liên minh giai cấp, tầng lớp trong thời kỳ quá độ lên chủ nghĩa xã hội: Cơ sở khách quan và nội dung liên minh.
            </p>

            {beatIndex >= 5 && (
              <div
                style={{
                  background: 'rgba(200, 112, 70, 0.2)',
                  border: '1px solid #C87046',
                  borderRadius: '8px',
                  padding: '0.75rem 1.25rem',
                  display: 'inline-block',
                  color: '#EDE4D6',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                ➔ Nhấn phím SPACE hoặc O để mở Thư viện và chuyển tiếp sang Quyển II
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
