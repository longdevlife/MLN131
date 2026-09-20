import React, { useMemo } from 'react';
import { StructureFlowBackground } from '../../vendor/threeui-custom/structure-flow/StructureFlowBackground';
import type { PresentationScene } from '../../content/types';

interface ThreeUIStructureFlowSceneProps {
  scene?: PresentationScene;
  beatIndex?: number;
  qualityTier?: 'high' | 'medium' | 'safe';
}

interface FlowStage {
  id: string;
  index: string;
  title: string;
  sub: string;
  left: string;
  top: string;
}

const FLOW_STAGES: FlowStage[] = [
  { id: 'STAGE_1', index: '01', title: 'Cơ cấu kinh tế', sub: 'Hạ tầng nhiều thành phần', left: '26%', top: '56%' },
  { id: 'STAGE_2', index: '02', title: 'Ngành & Sở hữu', sub: 'Phương thức sản xuất', left: '40%', top: '44%' },
  { id: 'STAGE_3', index: '03', title: 'Lao động & Nghề nghiệp', sub: 'Phân công việc làm', left: '55%', top: '58%' },
  { id: 'STAGE_4', index: '04', title: 'Địa vị & Vai trò', sub: 'Vị thế các giai tầng', left: '70%', top: '42%' },
  { id: 'STAGE_5', index: '05', title: 'Cơ cấu XH – Giai cấp', sub: 'Biến đổi tương ứng', left: '85%', top: '54%' },
];

export const ThreeUIStructureFlowScene: React.FC<ThreeUIStructureFlowSceneProps> = ({
  beatIndex = 0,
}) => {
  // Fine-tune flow visual options dynamically according to causal beat progression
  const flowOptions = useMemo(() => {
    switch (beatIndex) {
      case 0:
        return { speed: 0.8, pointSize: 0.08, opacity: 0.5 };
      case 1:
        return { speed: 1.0, pointSize: 0.085, opacity: 0.6 };
      case 2:
        return { speed: 1.2, pointSize: 0.09, opacity: 0.65 };
      case 3:
        return { speed: 1.4, pointSize: 0.095, opacity: 0.7 };
      case 4:
      default:
        return { speed: 1.1, pointSize: 0.09, opacity: 0.65 };
    }
  }, [beatIndex]);

  return (
    <div
      className="threeui-structure-flow-scene-root"
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
      {/* 1. Hero ThreeUI Continuous StructureFlow Canvas (70% visual field) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          opacity: 0.95,
        }}
      >
        <StructureFlowBackground
          speed={flowOptions.speed}
          pointSize={flowOptions.pointSize}
          opacity={flowOptions.opacity}
          maskStart={0.05}
          maskSolid={0.45}
        />
      </div>

      {/* Cinematic vector atmosphere gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          background: 'linear-gradient(90deg, rgba(8, 9, 13, 0.4) 0%, transparent 40%, rgba(200, 112, 70, 0.05) 80%, rgba(8, 9, 13, 0.3) 100%)',
        }}
      />

      {/* 2. Restrained Typographic Markers (No boxes, no rings) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {FLOW_STAGES.map((stage, i) => {
          const isReached = beatIndex >= i;
          const isCurrent = beatIndex === i;

          return (
            <div
              key={stage.id}
              style={{
                position: 'absolute',
                top: stage.top,
                left: stage.left,
                transform: 'translate(-50%, -50%)',
                opacity: isReached ? 1 : 0.3,
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div
                style={{
                  background: isCurrent ? 'rgba(18, 22, 30, 0.82)' : 'rgba(10, 12, 16, 0.6)',
                  backdropFilter: 'blur(8px)',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: isCurrent
                    ? '1px solid rgba(200, 112, 70, 0.55)'
                    : isReached
                    ? '1px solid rgba(200, 168, 106, 0.28)'
                    : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: isCurrent ? '0 6px 20px rgba(0,0,0,0.6)' : 'none',
                }}
              >
                {/* Minimalist marker index & dot */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '2px',
                  }}
                >
                  <span
                    style={{
                      width: isCurrent ? '6px' : '4px',
                      height: isCurrent ? '6px' : '4px',
                      borderRadius: '50%',
                      background: isCurrent ? '#C87046' : isReached ? '#C8A86A' : 'rgba(160, 168, 180, 0.4)',
                      boxShadow: isCurrent ? '0 0 10px #C87046' : 'none',
                      transition: 'all 0.4s ease',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'ui-monospace, monospace',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      color: isCurrent ? '#C8A86A' : 'rgba(200, 168, 106, 0.7)',
                    }}
                  >
                    {stage.index}
                  </span>
                </div>

                {/* Stage Title */}
                <div
                  style={{
                    fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, sans-serif)',
                    fontSize: 'clamp(12px, 0.95vw, 15px)',
                    fontWeight: isCurrent ? 700 : 600,
                    color: isCurrent ? '#FFFFFF' : isReached ? '#E8E8E3' : 'rgba(160, 168, 180, 0.5)',
                    letterSpacing: '-0.01em',
                    textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.4s ease',
                  }}
                >
                  {stage.title}
                </div>

                {/* Stage Subtitle */}
                <div
                  style={{
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: '10px',
                    color: isCurrent ? 'rgba(200, 168, 106, 0.85)' : 'rgba(160, 168, 180, 0.55)',
                    letterSpacing: '0.04em',
                    marginTop: '1px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {stage.sub}
                </div>
              </div>
            </div>
          );
        })}

        {/* 3. Concise Lower-Third at Final Beat (No giant quote box) */}
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
            right: '54px',
            maxWidth: '560px',
            textAlign: 'right',
            opacity: beatIndex >= 4 ? 1 : 0,
            transform: beatIndex >= 4 ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '999px',
              background: 'rgba(12, 14, 20, 0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(200, 112, 70, 0.35)',
              boxShadow: '0 8px 26px rgba(0,0,0,0.5), 0 0 20px rgba(200, 112, 70, 0.15)',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#C87046',
                boxShadow: '0 0 8px #C87046',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, sans-serif)',
                fontSize: 'clamp(11.5px, 0.88vw, 13.5px)',
                fontWeight: 600,
                color: '#F5F0E8',
                letterSpacing: '-0.01em',
              }}
            >
              Kinh tế biến đổi → cơ cấu xã hội – giai cấp biến đổi tương ứng.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
