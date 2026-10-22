'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';

const PERIODS = 4;
const WIDTH = 400;
const HIGH_Y = 15;
const LOW_Y = 75;

export function PwmSlider() {
  const [value, setValue] = useState(128);
  const duty = value / 255;
  const period = WIDTH / PERIODS;

  let d = `M0 ${duty > 0 ? HIGH_Y : LOW_Y}`;
  for (let i = 0; i < PERIODS; i++) {
    const start = i * period;
    const on = period * duty;
    if (duty === 0) d += ` L${start + period} ${LOW_Y}`;
    else if (duty === 1) d += ` L${start + period} ${HIGH_Y}`;
    else
      d += ` L${start} ${HIGH_Y} L${start + on} ${HIGH_Y} L${start + on} ${LOW_Y} L${start + period} ${LOW_Y}`;
  }

  return (
    <Card tone="accent" className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-semibold">
          <code>analogWrite(9, {value})</code> → encendido el {Math.round(duty * 100)} % del tiempo
        </span>
        <input
          type="range"
          min={0}
          max={255}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full accent-[#0b6f73]"
        />
      </label>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <svg
          viewBox={`-30 0 ${WIDTH + 40} 95`}
          className="w-full"
          role="img"
          aria-label={`Onda cuadrada al ${Math.round(duty * 100)} %`}
        >
          <text x={-6} y={HIGH_Y + 4} fontSize={11} textAnchor="end" fill="#475569">
            5 V
          </text>
          <text x={-6} y={LOW_Y + 4} fontSize={11} textAnchor="end" fill="#475569">
            0 V
          </text>
          <line x1={0} x2={WIDTH} y1={LOW_Y} y2={LOW_Y} stroke="#cbd5e1" />
          <path d={d} fill="none" stroke="#0f8c90" strokeWidth={3} strokeLinejoin="round" />
        </svg>
        <svg
          viewBox="-40 -40 80 80"
          className="h-28 w-28 shrink-0"
          role="img"
          aria-label={`LED con brillo ${Math.round(duty * 100)} %`}
        >
          <circle r={36} fill="#ff6a4d" opacity={duty * 0.55} />
          <path
            d="M-14 14 L-14 -4 A14 14 0 0 1 14 -4 L14 14 Z"
            fill="#e3412f"
            opacity={0.35 + duty * 0.65}
          />
          <rect x={-17} y={13} width={34} height={6} rx={1} fill="#e3412f" opacity={0.6} />
        </svg>
      </div>
    </Card>
  );
}
