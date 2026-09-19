import React from 'react';
import { usePresentationStore } from '../state/presentationStore';

export const BlackoutLayer: React.FC = () => {
  const isBlackout = usePresentationStore((state) => state.isBlackout);
  const toggleBlackout = usePresentationStore((state) => state.toggleBlackout);

  if (!isBlackout) return null;

  return (
    <div
      className="blackout-layer"
      onClick={toggleBlackout}
      role="region"
      aria-label="Màn hình tạm ẩn (Blackout). Nhấn phím B hoặc chạm màn hình để tiếp tục."
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          color: 'rgba(245, 240, 232, 0.25)',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        [ Màn hình tạm tắt · Nhấn phím B để hiển thị lại ]
      </div>
    </div>
  );
};
