'use client';

import { columnX, hole, PITCH, pin, type PinName, type Point } from './geometry';
import { Hit } from './Interactive';

export const WIRE_COLORS = {
  blue: '#2f6fd6',
  black: '#2b2b2b',
  red: '#d24a3c',
  green: '#2f9e57',
  yellow: '#e6b800',
} as const;
export type WireColor = keyof typeof WIRE_COLORS;

const pathOf = (points: Point[]) => points.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');

function midpoint(points: Point[]): Point {
  // Middle of the longest segment: a good spot for the badge.
  let best = { len: -1, at: points[0] };
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (len > best.len) best = { len, at: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
  }
  return best.at;
}

// ---------- Wire ----------

type WireProps = { id?: string; color: WireColor; points: Point[] };

/** Jumper wire with orthogonal segments, dark outline and terminals at both ends. */
export function Wire({ id, color, points }: WireProps) {
  const d = pathOf(points);
  const fill = WIRE_COLORS[color];
  const ends = [points[0], points[points.length - 1]];

  return (
    <Hit
      id={id}
      anchor={midpoint(points)}
      halo={(cls) => (
        <path d={d} className={cls} strokeWidth={13} strokeLinejoin="round" strokeLinecap="round" />
      )}
    >
      {/* Wide transparent stroke: easier to hit with a finger. */}
      {id && <path d={d} stroke="transparent" strokeWidth={16} fill="none" />}
      <path d={d} stroke="#1f2328" strokeWidth={6} fill="none" strokeLinejoin="round" />
      <path d={d} stroke={fill} strokeWidth={4} fill="none" strokeLinejoin="round" />
      {ends.map((p, i) => (
        <rect
          key={i}
          x={p.x - 3.5}
          y={p.y - 3.5}
          width={7}
          height={7}
          rx={1.5}
          fill="#9aa1a7"
          stroke="#1f2328"
        />
      ))}
    </Hit>
  );
}

// ---------- LED ----------

const LED_COLORS = {
  red: { body: '#e3412f', glow: '#ff6a4d' },
  green: { body: '#2fb24f', glow: '#6dff8a' },
  yellow: { body: '#f2c21b', glow: '#ffe066' },
} as const;
export type LedColor = keyof typeof LED_COLORS;

type LedProps = {
  id?: string;
  /** Separate clickable id for the short leg (A3). */
  cathodeId?: string;
  anode: Point;
  cathode: Point;
  color: LedColor;
  lit?: 'normal' | 'intense';
};

/** LED standing on the breadboard: long leg (+, anode) and short leg (−, cathode). */
export function Led({ id, cathodeId, anode, cathode, color, lit }: LedProps) {
  const { body, glow } = LED_COLORS[color];
  const cx = (anode.x + cathode.x) / 2;
  const cy = Math.min(anode.y, cathode.y) - 32;
  const legTop = cy + 12;
  const anodeOnLeft = anode.x < cathode.x;
  const gradientId = `led-glow-${anode.x}-${anode.y}`;
  const markerOffset = 13;

  const anodeLeg = `M${anode.x} ${anode.y} L${anode.x} ${legTop + 8} L${cx + (anodeOnLeft ? -4 : 4)} ${legTop}`;
  const cathodeLeg = `M${cathode.x} ${cathode.y} L${cathode.x} ${legTop + 4} L${cx + (anodeOnLeft ? 4 : -4)} ${legTop}`;

  // The + and − marks are the key to case A1: big, bold and outlined in white.
  const markers = (
    <g
      fontSize={17}
      fontWeight={900}
      textAnchor="middle"
      stroke="white"
      strokeWidth={3}
      paintOrder="stroke"
      aria-hidden
    >
      <text
        x={anode.x + (anodeOnLeft ? -markerOffset : markerOffset)}
        y={anode.y - 8}
        fill="#b42318"
      >
        +
      </text>
      <text
        x={cathode.x + (anodeOnLeft ? markerOffset : -markerOffset)}
        y={cathode.y - 8}
        fill="#1d4ed8"
      >
        −
      </text>
    </g>
  );

  const bodyShape = (
    <>
      {lit && (
        <>
          <defs>
            <radialGradient id={gradientId}>
              <stop offset="0%" stopColor={glow} stopOpacity={0.95} />
              <stop offset="100%" stopColor={glow} stopOpacity={0} />
            </radialGradient>
          </defs>
          <circle
            cx={cx}
            cy={cy}
            r={lit === 'intense' ? 46 : 24}
            fill={`url(#${gradientId})`}
            className={lit === 'intense' ? 'animate-pulse' : undefined}
          />
        </>
      )}
      <path d={anodeLeg} stroke="#9aa1a7" strokeWidth={2.2} fill="none" />
      <rect x={cx - 14} y={cy + 6} width={28} height={6} rx={1} fill={body} opacity={0.9} />
      <path
        d={`M${cx - 12} ${cy + 7} L${cx - 12} ${cy - 4} A12 12 0 0 1 ${cx + 12} ${cy - 4} L${cx + 12} ${cy + 7} Z`}
        fill={body}
        stroke="#00000033"
        opacity={lit ? 1 : 0.85}
      />
      {lit && <circle cx={cx - 4} cy={cy - 5} r={3.5} fill="white" opacity={0.75} />}
    </>
  );

  const cathodeShape = <path d={cathodeLeg} stroke="#9aa1a7" strokeWidth={2.2} fill="none" />;

  return (
    <g>
      <Hit
        id={id}
        anchor={{ x: cx, y: cy - 6 }}
        halo={(cls) => (
          <rect
            x={cx - 20}
            y={cy - 21}
            width={40}
            height={anode.y - cy + 26}
            rx={8}
            className={cls}
            strokeWidth={3}
          />
        )}
      >
        {bodyShape}
        {!cathodeId && cathodeShape}
      </Hit>
      {cathodeId && (
        <Hit
          id={cathodeId}
          anchor={{ x: cathode.x, y: cathode.y - 14 }}
          halo={(cls) => (
            <rect
              x={cathode.x - 7}
              y={legTop - 2}
              width={14}
              height={cathode.y - legTop + 8}
              rx={5}
              className={cls}
              strokeWidth={3}
            />
          )}
        >
          <path d={cathodeLeg} stroke="transparent" strokeWidth={12} fill="none" />
          {cathodeShape}
        </Hit>
      )}
      {markers}
    </g>
  );
}

// ---------- Resistor ----------

export const BAND_COLORS: Record<string, string> = {
  black: '#1f1f1f',
  brown: '#7a4a21',
  red: '#d0312d',
  orange: '#f07f13',
  yellow: '#f5d90a',
  green: '#2f9e57',
  blue: '#2563b8',
  violet: '#7c3aed',
  gray: '#8b8b8b',
  white: '#f8f8f8',
  gold: '#c9a227',
  silver: '#c0c0c0',
};

type ResistorProps = { id?: string; from: Point; to: Point; bands: string[] };

/** Horizontal resistor between two holes of the same row. */
export function Resistor({ id, from, to, bands }: ResistorProps) {
  const cx = (from.x + to.x) / 2;
  const cy = from.y;
  const w = 34;
  const h = 12;

  return (
    <Hit
      id={id}
      anchor={{ x: cx, y: cy - 4 }}
      halo={(cls) => (
        <rect
          x={from.x - 7}
          y={cy - h / 2 - 6}
          width={to.x - from.x + 14}
          height={h + 12}
          rx={8}
          className={cls}
          strokeWidth={3}
        />
      )}
    >
      {id && (
        <rect x={from.x - 4} y={cy - 9} width={to.x - from.x + 8} height={18} fill="transparent" />
      )}
      <line x1={from.x} x2={to.x} y1={cy} y2={cy} stroke="#9aa1a7" strokeWidth={2.2} />
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={5}
        fill="#e8d3a7"
        stroke="#b49a68"
      />
      {bands.map((band, i) => (
        <rect
          key={i}
          x={cx - w / 2 + 6 + i * (i === bands.length - 1 ? 7.5 : 6)}
          y={cy - h / 2 + 0.5}
          width={3}
          height={h - 1}
          fill={BAND_COLORS[band] ?? band}
        />
      ))}
    </Hit>
  );
}

// ---------- Push button ----------

type PushButtonProps = { id?: string; col: number };

/** 4-leg push button over the channel: legs at columns c and c+2, rows e and f. */
export function PushButton({ id, col }: PushButtonProps) {
  const legs = [hole(col, 'e'), hole(col + 2, 'e'), hole(col, 'f'), hole(col + 2, 'f')];
  const x1 = columnX(col) - 6;
  const x2 = columnX(col + 2) + 6;
  const y1 = legs[0].y - 4;
  const y2 = legs[2].y + 4;
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;

  return (
    <Hit
      id={id}
      anchor={{ x: cx + 8, y: y1 }}
      halo={(cls) => (
        <rect
          x={x1 - 5}
          y={y1 - 5}
          width={x2 - x1 + 10}
          height={y2 - y1 + 10}
          rx={8}
          className={cls}
          strokeWidth={3}
        />
      )}
    >
      {legs.map((p, i) => (
        <rect key={i} x={p.x - 2} y={p.y - 2} width={4} height={4} fill="#9aa1a7" />
      ))}
      <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} rx={4} fill="#3a3f44" stroke="#1f2328" />
      <circle cx={cx} cy={cy} r={9} fill="#202326" stroke="#5c636a" strokeWidth={2} />
    </Hit>
  );
}

// ---------- Potentiometer ----------

type PotentiometerProps = { id?: string; col: number };

/** Blue trimmer with 3 legs at columns c, c+2 and c+4 (row f). */
export function Potentiometer({ id, col }: PotentiometerProps) {
  const legs = [hole(col, 'f'), hole(col + 2, 'f'), hole(col + 4, 'f')];
  const x1 = columnX(col) - 8;
  const x2 = columnX(col + 4) + 8;
  const y2 = legs[0].y - 10;
  const y1 = y2 - 64;
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2 - 4;

  return (
    <Hit
      id={id}
      anchor={{ x: x2 - 6, y: y1 + 4 }}
      halo={(cls) => (
        <rect
          x={x1 - 5}
          y={y1 - 5}
          width={x2 - x1 + 10}
          height={legs[0].y - y1 + 10}
          rx={8}
          className={cls}
          strokeWidth={3}
        />
      )}
    >
      {legs.map((p, i) => (
        <line key={i} x1={p.x} x2={p.x} y1={y2} y2={p.y} stroke="#9aa1a7" strokeWidth={2.5} />
      ))}
      <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} rx={6} fill="#2563b8" stroke="#173f7a" />
      <circle cx={cx} cy={cy} r={18} fill="#f3f4f6" stroke="#9ca3af" />
      <rect x={cx - 2} y={cy - 15} width={4} height={14} rx={2} fill="#6b7280" />
      <text x={cx} y={y2 - 5} fontSize={8} fill="white" textAnchor="middle" fontWeight={700}>
        B10K
      </text>
    </Hit>
  );
}

// ---------- Invisible zones ----------

type ZoneProps = { id: string; label: string; x: number; y: number; width: number; height: number };

/** Invisible clickable area that shows its label on hover (e.g. "columna 16"). */
export function Zone({ id, label, x, y, width, height }: ZoneProps) {
  return (
    <Hit
      id={id}
      anchor={{ x: x + width / 2, y }}
      halo={(cls) => (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={6}
          className={cls}
          strokeWidth={3}
          strokeDasharray="4 3"
        />
      )}
    >
      <rect x={x} y={y} width={width} height={height} fill="transparent" />
      <text
        x={x + width / 2}
        y={y - 4}
        fontSize={10}
        fontWeight={700}
        textAnchor="middle"
        className="fill-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {label}
      </text>
    </Hit>
  );
}

/** Clickable Arduino pin (A4: pin 9). */
export function PinZone({ id, name }: { id: string; name: PinName }) {
  const p = pin(name);
  return (
    <Hit
      id={id}
      anchor={{ x: p.x, y: p.y }}
      halo={(cls) => (
        <rect
          x={p.x - 9}
          y={p.y - 9}
          width={PITCH}
          height={44}
          rx={5}
          className={cls}
          strokeWidth={3}
        />
      )}
    >
      <rect x={p.x - 9} y={p.y - 9} width={PITCH} height={44} fill="transparent" />
    </Hit>
  );
}
