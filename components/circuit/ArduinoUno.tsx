import {
  ARDUINO,
  DIGITAL_HEADER,
  pin,
  PITCH,
  POWER_HEADER,
  PWM_PINS,
  type PinName,
} from './geometry';

export { pin };

type ArduinoUnoProps = {
  /** Pins painted yellow with a highlighted label. */
  usedPins?: string[];
};

const BOARD = '#0f8f94';
const LABEL = '#e8f6f6';
const USED = '#f4c430';

/** Simplified top view of an Arduino UNO. */
export function ArduinoUno({ usedPins = [] }: ArduinoUnoProps) {
  const { x, y, width, height } = ARDUINO;
  const used = new Set(usedPins);

  return (
    <g aria-hidden>
      <rect x={x} y={y} width={width} height={height} rx={10} fill={BOARD} stroke="#0a6b6f" />
      {/* USB and power jack on the left edge */}
      <rect x={x - 10} y={y + 40} width={42} height={40} rx={3} fill="#c7cdd1" stroke="#8b949a" />
      <rect x={x - 6} y={y + 140} width={36} height={44} rx={4} fill="#26292c" />
      {/* Chip */}
      <rect x={x + 150} y={y + 98} width={150} height={40} rx={3} fill="#22272b" />
      <text
        x={x + 225}
        y={y + 122}
        fontSize={11}
        fill="#cfd6da"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
      >
        ATmega328P
      </text>
      <text x={x + 82} y={y + 112} fontSize={16} fontWeight={800} fill={LABEL}>
        UNO
      </text>

      <Header pins={DIGITAL_HEADER} side="top" used={used} />
      <Header pins={POWER_HEADER} side="bottom" used={used} />
    </g>
  );
}

function Header({
  pins,
  side,
  used,
}: {
  pins: readonly (string | null)[];
  side: 'top' | 'bottom';
  used: Set<string>;
}) {
  const real = pins
    .map((name) => {
      if (name === null) return null;
      const key = side === 'top' && name === 'GND' ? 'GND_TOP' : name;
      return { name, key, at: pin(key as PinName) };
    })
    .filter((p) => p !== null);
  const first = real[0].at;
  const last = real[real.length - 1].at;

  return (
    <g>
      <rect
        x={first.x - PITCH / 2}
        y={first.y - 7}
        width={last.x - first.x + PITCH}
        height={14}
        rx={2}
        fill="#1b1e21"
      />
      {real.map(({ name, key, at }) => {
        const isUsed = used.has(key);
        const label = name === 'GND2' ? 'GND' : name;
        const display = side === 'top' && PWM_PINS.has(name) ? `~${label}` : label;
        // Labels are vertical, inside the board, like the silkscreen on the real board.
        const ly = side === 'top' ? at.y + 12 : at.y - 12;
        return (
          <g key={key}>
            <rect
              x={at.x - 4}
              y={at.y - 4}
              width={8}
              height={8}
              rx={1}
              fill={isUsed ? USED : '#4b5258'}
              stroke={isUsed ? '#9a7400' : 'none'}
            />
            {isUsed && (
              <rect
                x={at.x - 7}
                y={side === 'top' ? ly - 2 : ly - 30}
                width={14}
                height={32}
                rx={3}
                fill={USED}
              />
            )}
            <text
              x={at.x}
              y={ly}
              fontSize={isUsed ? 9.5 : 8.5}
              fontWeight={isUsed ? 800 : 500}
              fill={isUsed ? '#1b1e21' : LABEL}
              textAnchor={side === 'top' ? 'end' : 'start'}
              dominantBaseline="central"
              transform={`rotate(-90 ${at.x} ${ly})`}
            >
              {display}
            </text>
          </g>
        );
      })}
    </g>
  );
}
