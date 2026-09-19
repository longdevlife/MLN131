import React from 'react';

interface SafeSocialNetworkSceneProps {
  beatIndex?: number;
}

export const SafeSocialNetworkScene: React.FC<SafeSocialNetworkSceneProps> = ({ beatIndex = 0 }) => {
  const nodes = [
    { id: 'giaicap', name: 'Giai cấp', sub: 'Địa vị kinh tế - xã hội', cx: 300, cy: 180, r: 42, color: '#C87046', isCenter: true },
    { id: 'dancu', name: 'Dân cư', sub: 'Địa bàn / Lãnh thổ', cx: 120, cy: 90, r: 34, color: '#C8A86A' },
    { id: 'nghenghiep', name: 'Nghề nghiệp', sub: 'Phân công LĐ', cx: 480, cy: 90, r: 34, color: '#9FB3C9' },
    { id: 'dantoc', name: 'Dân tộc', sub: 'Tộc người', cx: 150, cy: 290, r: 34, color: '#76A394' },
    { id: 'tongiao', name: 'Tôn giáo', sub: 'Tâm linh', cx: 450, cy: 290, r: 34, color: '#BD7880' },
  ];

  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4],
    [1, 2], [1, 3], [2, 4], [3, 4],
  ];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '780px',
        margin: '0 auto',
        padding: '1.5rem',
        background: 'rgba(23, 26, 36, 0.95)',
        borderRadius: '12px',
        border: '1px solid #3A2118',
        boxShadow: '0 16px 32px rgba(0,0,0,0.6)',
        textAlign: 'center',
      }}
    >
      <svg viewBox="0 0 600 360" style={{ width: '100%', height: 'auto', maxHeight: '360px' }}>
        {/* Connecting links (Beat >= 1) */}
        {edges.map(([start, end], idx) => {
          const n1 = nodes[start];
          const n2 = nodes[end];
          const isPrimary = start === 0 || end === 0;
          return (
            <line
              key={`edge-${idx}`}
              x1={n1.cx}
              y1={n1.cy}
              x2={n2.cx}
              y2={n2.cy}
              stroke={isPrimary ? '#C87046' : '#C8A86A'}
              strokeWidth={isPrimary ? 3 : 1.5}
              strokeDasharray={isPrimary ? 'none' : '4,4'}
              opacity={beatIndex >= 1 ? (isPrimary ? 0.9 : 0.5) : 0}
              style={{ transition: 'opacity 0.6s ease' }}
            />
          );
        })}

        {/* 5 Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.cx}
              cy={node.cy}
              r={node.r}
              fill={node.color}
              stroke="#EDE4D6"
              strokeWidth={node.isCenter ? 3 : 1.5}
            />
            <text
              x={node.cx}
              y={node.cy + 4}
              textAnchor="middle"
              fill="#F5F0E8"
              fontSize={node.isCenter ? '14px' : '11px'}
              fontWeight={node.isCenter ? 'bold' : '600'}
            >
              {node.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
