import React, { useMemo } from 'react';
import { OrbitalSphereBackground } from '@designcodeio/threeui';
import type { PresentationScene } from '../../content/types';

interface ThreeUIOrbitalSceneProps {
  scene?: PresentationScene;
  beatIndex?: number;
  qualityTier?: 'high' | 'medium' | 'safe';
}

interface SatelliteNode {
  id: string;
  index: string;
  name: string;
  sub: string;
  // Percentage coordinates relative to visual field (right ~60% of viewport)
  top: string;
  left: string;
  delay: string;
}

const SATELLITE_NODES: SatelliteNode[] = [
  { id: 'DANSO', index: '01', name: 'Cơ cấu Dân cư', sub: 'Quy mô & Phân bố', top: '22%', left: '48%', delay: '0.1s' },
  { id: 'NGHENGHIEP', index: '02', name: 'Cơ cấu Nghề nghiệp', sub: 'Phân công lao động', top: '26%', left: '80%', delay: '0.2s' },
  { id: 'DANTOC', index: '03', name: 'Cơ cấu Dân tộc', sub: 'Quan hệ tộc người', top: '74%', left: '46%', delay: '0.3s' },
  { id: 'TONGIAO', index: '04', name: 'Cơ cấu Tôn giáo', sub: 'Đời sống tín ngưỡng', top: '76%', left: '78%', delay: '0.4s' },
];

export const ThreeUIOrbitalScene: React.FC<ThreeUIOrbitalSceneProps> = ({
  beatIndex = 0,
}) => {
  // Fine-tune ThreeUI orbital options dynamically per beat
  const orbitalOptions = useMemo(() => {
    switch (beatIndex) {
      case 0:
        return { speed: 0.7, particleSize: 0.014, particleOpacity: 0.75, orbitOpacity: 0.22, haloOpacity: 0.2, scale: 1.05 };
      case 1:
        return { speed: 0.9, particleSize: 0.015, particleOpacity: 0.85, orbitOpacity: 0.32, haloOpacity: 0.28, scale: 1.1 };
      case 2:
        return { speed: 1.1, particleSize: 0.016, particleOpacity: 0.9, orbitOpacity: 0.38, haloOpacity: 0.35, scale: 1.12 };
      case 3:
        return { speed: 1.25, particleSize: 0.016, particleOpacity: 0.95, orbitOpacity: 0.42, haloOpacity: 0.4, scale: 1.15 };
      case 4:
      default:
        return { speed: 1.0, particleSize: 0.015, particleOpacity: 0.9, orbitOpacity: 0.35, haloOpacity: 0.32, scale: 1.1 };
    }
  }, [beatIndex]);

  // Two-way interaction states
  const isNucleusActive = beatIndex >= 0;
  const areSatellitesActive = beatIndex >= 1;
  const isOutwardFlowActive = beatIndex >= 2;
  const isInwardFlowActive = beatIndex >= 3;
  const isFinalSynthesis = beatIndex >= 4;

  return (
    <div
      className="threeui-orbital-scene-root"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      {/* 1. Hero ThreeUI Orbital Canvas Background (70% visual weight) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          opacity: 0.96,
        }}
      >
        <OrbitalSphereBackground
          speed={orbitalOptions.speed}
          particleSize={orbitalOptions.particleSize}
          particleOpacity={orbitalOptions.particleOpacity}
          orbitOpacity={orbitalOptions.orbitOpacity}
          haloOpacity={orbitalOptions.haloOpacity}
          scale={orbitalOptions.scale}
          className="threeui-orbital-canvas-wrapper"
        />
      </div>

      {/* Subtle radial depth overlay for high-end cinematic editorial contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 65% 55% at 65% 50%, rgba(200, 112, 70, 0.07) 0%, transparent 70%)',
        }}
      />

      {/* 2. ThreeUI Editorial Typographic Semantic Layer (30% weight, max 5 nodes) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {/* A. Central Nucleus Marker: CƠ CẤU XÃ HỘI – GIAI CẤP */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '62%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            opacity: isNucleusActive ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Subtle pulse aura ring */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              border: '1px solid rgba(200, 168, 106, 0.25)',
              boxShadow: '0 0 35px rgba(200, 112, 70, 0.2)',
              pointerEvents: 'none',
              animation: 'spin 24s linear infinite',
            }}
          />

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '999px',
              background: 'rgba(10, 12, 16, 0.65)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(200, 168, 106, 0.4)',
              marginBottom: '6px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#C8A86A',
                boxShadow: '0 0 8px #C8A86A',
              }}
            />
            <span
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: '10px',
                letterSpacing: '0.14em',
                color: '#C8A86A',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Hạt nhân trung tâm
            </span>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, sans-serif)',
              fontSize: 'clamp(17px, 1.4vw, 22px)',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 14px rgba(0,0,0,0.8)',
              whiteSpace: 'nowrap',
            }}
          >
            Cơ cấu XH – Giai cấp
          </div>

          <div
            style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: '11px',
              color: 'rgba(200, 168, 106, 0.85)',
              letterSpacing: '0.06em',
              marginTop: '3px',
            }}
          >
            Vị trí quan trọng hàng đầu
          </div>
        </div>

        {/* B. Four Peripheral Orbital Nodes (Sparse, elegant, no cards) */}
        {SATELLITE_NODES.map((node) => {
          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                top: node.top,
                left: node.left,
                transform: 'translate(-50%, -50%)',
                opacity: areSatellitesActive ? 1 : 0,
                transition: `opacity 0.7s ease ${node.delay}, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${node.delay}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#C8A86A',
                    opacity: 0.85,
                  }}
                >
                  {node.index}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, sans-serif)',
                    fontSize: 'clamp(12.5px, 0.95vw, 15px)',
                    fontWeight: 600,
                    color: '#E8E8E3',
                    letterSpacing: '-0.01em',
                    textShadow: '0 2px 10px rgba(0,0,0,0.7)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {node.name}
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: '10px',
                  color: 'rgba(160, 168, 180, 0.75)',
                  marginTop: '1px',
                  paddingLeft: '18px',
                  whiteSpace: 'nowrap',
                }}
              >
                {node.sub}
              </div>

              {/* Dynamic bidirectional pulse indicators */}
              {(isOutwardFlowActive || isInwardFlowActive) && (
                <div
                  style={{
                    paddingLeft: '18px',
                    marginTop: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '9px',
                    color: isOutwardFlowActive && isInwardFlowActive ? '#76A394' : '#C8A86A',
                    letterSpacing: '0.04em',
                    opacity: 0.9,
                  }}
                >
                  <span style={{ fontSize: '10px' }}>
                    {isOutwardFlowActive && isInwardFlowActive ? '⇄' : isOutwardFlowActive ? '→' : '←'}
                  </span>
                  <span>
                    {isOutwardFlowActive && isInwardFlowActive
                      ? 'Tác động hai chiều'
                      : isOutwardFlowActive
                      ? 'Chi phối định hướng'
                      : 'Tác động trở lại'}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* C. Subtle Editorial Footer Statement at Final Beat (No bulky warning cards) */}
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
            right: '54px',
            maxWidth: '520px',
            textAlign: 'right',
            opacity: isFinalSynthesis ? 1 : 0,
            transform: isFinalSynthesis ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '999px',
              background: 'rgba(12, 14, 20, 0.72)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(200, 168, 106, 0.28)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#C8A86A',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, sans-serif)',
                fontSize: 'clamp(11.5px, 0.85vw, 13px)',
                fontWeight: 500,
                color: '#F5F0E8',
                letterSpacing: '-0.01em',
              }}
            >
              Tác động qua lại — không tuyệt đối hóa một loại cơ cấu.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
