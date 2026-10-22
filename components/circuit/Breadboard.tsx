import { BREADBOARD, columnX, COLUMNS, hole, railHole, ROWS, type Rail } from './geometry';

export { hole, railHole };

const RAILS: { rail: Rail; sign: '+' | '−' }[] = [
  { rail: 'top+', sign: '+' },
  { rail: 'top-', sign: '−' },
  { rail: 'bottom-', sign: '−' },
  { rail: 'bottom+', sign: '+' },
];

const LABELED_COLUMNS = [1, 5, 10, 15, 20];

/** 20-column breadboard: rows a–e and f–j split by the channel, two rails on each side. */
export function Breadboard() {
  const { x, y, width, height, railY, rowY, numbersY, channelY } = BREADBOARD;
  const left = x + 14;
  const right = x + width - 6;

  return (
    <g aria-hidden>
      <rect x={x} y={y} width={width} height={height} rx={10} fill="#f4f4f1" stroke="#cfcfc8" />
      {/* Channel */}
      <rect x={x + 6} y={y + channelY - 5} width={width - 12} height={10} rx={3} fill="#e2e2dc" />

      {/* Rails */}
      {RAILS.map(({ rail, sign }) => {
        const ry = y + railY[rail];
        const color = sign === '+' ? '#d24a3c' : '#2563b8';
        const lineY = rail.endsWith('+') === rail.startsWith('top') ? ry - 9 : ry + 9;
        return (
          <g key={rail}>
            <line x1={left + 8} x2={right} y1={lineY} y2={lineY} stroke={color} strokeWidth={2} />
            <text
              x={x + 8}
              y={ry + 4}
              fontSize={12}
              fontWeight={700}
              fill={color}
              textAnchor="middle"
            >
              {sign}
            </text>
            {Array.from({ length: COLUMNS }, (_, i) => (
              <HoleMark key={i} cx={columnX(i + 1)} cy={ry} />
            ))}
          </g>
        );
      })}

      {/* Column numbers */}
      {numbersY.map((ny) =>
        LABELED_COLUMNS.map((c) => (
          <text
            key={`${ny}-${c}`}
            x={columnX(c)}
            y={y + ny + 4}
            fontSize={9}
            fill="#6b7280"
            textAnchor="middle"
          >
            {c}
          </text>
        )),
      )}

      {/* Terminal strips */}
      {ROWS.map((row) => (
        <g key={row}>
          <text x={x + 10} y={y + rowY[row] + 3.5} fontSize={10} fill="#6b7280" textAnchor="middle">
            {row}
          </text>
          {Array.from({ length: COLUMNS }, (_, i) => (
            <HoleMark key={i} cx={columnX(i + 1)} cy={y + rowY[row]} />
          ))}
        </g>
      ))}
    </g>
  );
}

function HoleMark({ cx, cy }: { cx: number; cy: number }) {
  return <rect x={cx - 3} y={cy - 3} width={6} height={6} rx={1} fill="#3f3f46" opacity={0.75} />;
}
