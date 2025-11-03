import React, { useState } from 'react';

const ExactPieChart = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const data = [
    { name: 'Johannesburg', value: 30, color: '#525B7A', startAngle: 0, endAngle: 108 },
    { name: 'Cairo', value: 15, color: '#FF7A1A', startAngle: 108, endAngle: 162 },
    { name: 'Cape Town', value: 35, color: '#2563EB', startAngle: 162, endAngle: 288 },
    { name: 'Nairobi', value: 20, color: '#FF00FF', startAngle: 288, endAngle: 360 }
  ];

  const createPath = (cx, cy, r, startAngle, endAngle, isHovered) => {
    const rad = isHovered ? r + 8 : r;
    const start = (startAngle - 90) * (Math.PI / 180);
    const end = (endAngle - 90) * (Math.PI / 180);

    const x1 = cx + rad * Math.cos(start);
    const y1 = cy + rad * Math.sin(start);
    const x2 = cx + rad * Math.cos(end);
    const y2 = cy + rad * Math.sin(end);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${cx} ${cy} L ${x1} ${y1} A ${rad} ${rad} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (cx, cy, r, startAngle, endAngle) => {
    const midAngle = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180);
    const tr = r * 0.6;
    return {
      x: cx + tr * Math.cos(midAngle),
      y: cy + tr * Math.sin(midAngle)
    };
  };

  return (
    <div className="rounded-3xl  p-4" style={{ width: 380, height: 368 }}>
      <h2 className="text-[18px] font-bold mb-2 px-3">
        Heat Map(<span className="font-bold">Cities</span>)
      </h2>
      <svg width="100%" height="300" viewBox="0 0 320 320">
        {data.map((slice, i) => {
          const cx = 160;
          const cy = 160;
          const r = 120;
          const isHovered = hoveredIndex === i;
          const textPos = getTextPosition(cx, cy, r, slice.startAngle, slice.endAngle);

          return (
            <g key={i}>
              <path
                d={createPath(cx, cy, r, slice.startAngle, slice.endAngle, isHovered)}
                fill={slice.color}
                stroke="#fff"
                strokeWidth="6"
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              <text
                x={textPos.x}
                y={textPos.y - 8}
                textAnchor="middle"
                fill="#fff"
                fontSize="16"
                fontWeight="700"
              >
                {slice.value}%
              </text>
              <text
                x={textPos.x}
                y={textPos.y + 12}
                textAnchor="middle"
                fill="#fff"
                fontSize="13"
                fontWeight="600"
              >
                {slice.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ExactPieChart;
