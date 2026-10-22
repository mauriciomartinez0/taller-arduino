'use client';

import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Card } from '@/components/ui/Card';

const MIN_ANGLE = -135;
const MAX_ANGLE = 135;

/** Arduino's map() with integer math. */
const arduinoMap = (x: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  Math.trunc(((x - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin);

export function PotentiometerSim() {
  const [reading, setReading] = useState(512);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const angle = MIN_ANGLE + (reading / 1023) * (MAX_ANGLE - MIN_ANGLE);
  const volts = (reading / 1023) * 5;

  function updateFromPointer(e: PointerEvent) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const deg = (Math.atan2(dx, -dy) * 180) / Math.PI; // 0° = up
    const clamped = Math.max(MIN_ANGLE, Math.min(MAX_ANGLE, deg));
    setReading(Math.round(((clamped - MIN_ANGLE) / (MAX_ANGLE - MIN_ANGLE)) * 1023));
  }

  function onKeyDown(e: KeyboardEvent) {
    const step = e.shiftKey ? 100 : 20;
    const keys: Record<string, number> = {
      ArrowRight: step,
      ArrowUp: step,
      ArrowLeft: -step,
      ArrowDown: -step,
      Home: -1023,
      End: 1023,
    };
    if (e.key in keys) {
      e.preventDefault();
      setReading((r) => Math.max(0, Math.min(1023, r + keys[e.key])));
    }
  }

  return (
    <Card tone="accent" className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <svg
        ref={svgRef}
        viewBox="-60 -60 120 120"
        className="h-48 w-48 shrink-0 cursor-grab touch-none select-none"
        role="slider"
        tabIndex={0}
        aria-label="Perilla del potenciómetro"
        aria-valuemin={0}
        aria-valuemax={1023}
        aria-valuenow={reading}
        aria-valuetext={`${volts.toFixed(2)} voltios, lectura ${reading}`}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          updateFromPointer(e);
        }}
        onPointerMove={(e) => dragging.current && updateFromPointer(e)}
        onPointerUp={() => (dragging.current = false)}
      >
        <rect x={-50} y={-50} width={100} height={100} rx={12} fill="#2563b8" />
        <path
          d="M -32 32 A 45 45 0 1 1 32 32"
          fill="none"
          stroke="#ffffff55"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <g transform={`rotate(${angle})`}>
          <circle r={30} fill="#f3f4f6" stroke="#9ca3af" strokeWidth={2} />
          <rect x={-3} y={-28} width={6} height={22} rx={3} fill="#4b5563" />
        </g>
        <text y={46} fontSize={8} fill="white" textAnchor="middle" fontWeight={700}>
          B10K
        </text>
      </svg>

      <dl className="grid flex-1 grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-lg">
        <dt className="text-slate-600">Voltaje en A0</dt>
        <dd className="text-ink font-mono font-bold">{volts.toFixed(2).replace('.', ',')} V</dd>
        <dt className="text-slate-600">
          <code>analogRead(A0)</code>
        </dt>
        <dd className="text-ink font-mono font-bold">{reading}</dd>
        <dt className="text-slate-600">
          <code>map(valor, 0, 1023, 0, 255)</code>
        </dt>
        <dd className="text-ink font-mono font-bold">{arduinoMap(reading, 0, 1023, 0, 255)}</dd>
        <dd className="col-span-2 text-sm text-slate-600">
          Gira la perilla con el mouse o el dedo (o con las flechas del teclado).
        </dd>
      </dl>
    </Card>
  );
}
