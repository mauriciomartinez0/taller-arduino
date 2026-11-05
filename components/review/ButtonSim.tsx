'use client';

import { useState, type KeyboardEvent } from 'react';
import { Card } from '@/components/ui/Card';

const HIGH_COLOR = '#d24a3c';
const LOW_COLOR = '#1d4ed8';
const WIRE = '#4b5563';

/** Push button with INPUT_PULLUP: hold it to see `digitalRead` change from HIGH to LOW. */
export function ButtonSim() {
  const [pressed, setPressed] = useState(false);
  const reading = pressed ? 'LOW' : 'HIGH';
  const nodeColor = pressed ? LOW_COLOR : HIGH_COLOR;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setPressed(true);
    }
  };
  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') setPressed(false);
  };

  return (
    <Card tone="accent" className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <svg
        viewBox="0 0 220 250"
        className="mx-auto h-64 w-auto shrink-0"
        role="img"
        aria-label={`Esquema: 5V, resistencia pull-up interna, pin 2, botón y GND. El pin 2 está en ${reading}.`}
      >
        <rect
          x={8}
          y={6}
          width={150}
          height={124}
          rx={10}
          fill="#f3f9f9"
          stroke="#0f8c90"
          strokeDasharray="5 4"
        />
        <text x={150} y={22} fontSize={10} fontWeight={700} fill="#0b6f73" textAnchor="end">
          Dentro del Arduino
        </text>

        {/* 5V and the internal pull-up resistor */}
        <text x={40} y={26} fontSize={12} fontWeight={700} fill={HIGH_COLOR} textAnchor="middle">
          5V
        </text>
        <path
          d="M40 32 L40 44 L48 48 L32 56 L48 64 L32 72 L48 80 L40 84 L40 110"
          fill="none"
          stroke={HIGH_COLOR}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <text x={56} y={62} fontSize={10} fill="#334155">
          resistencia
        </text>
        <text x={56} y={74} fontSize={10} fill="#334155">
          pull-up interna
        </text>

        {/* Pin 2 node */}
        <circle cx={40} cy={110} r={6} fill={nodeColor} />
        <text x={54} y={114} fontSize={12} fontWeight={700} fill="#10494f">
          pin 2 →
        </text>
        <text x={110} y={114} fontSize={14} fontWeight={900} fill={nodeColor}>
          {reading}
        </text>

        {/* Pin → button → GND: at 0 V when the button is pressed */}
        <path
          d="M40 116 L40 160"
          stroke={pressed ? LOW_COLOR : HIGH_COLOR}
          strokeWidth={2.5}
          fill="none"
        />
        <circle cx={40} cy={160} r={3.5} fill={WIRE} />
        <circle cx={40} cy={196} r={3.5} fill={WIRE} />
        <line
          x1={40}
          y1={196}
          x2={pressed ? 40 : 62}
          y2={pressed ? 160 : 166}
          stroke={WIRE}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <text x={72} y={182} fontSize={11} fill="#334155">
          {pressed ? 'botón cerrado' : 'botón abierto'}
        </text>
        <path d="M40 196 L40 222" stroke={pressed ? LOW_COLOR : WIRE} strokeWidth={2.5} />
        <g stroke={WIRE} strokeWidth={2.5} strokeLinecap="round">
          <line x1={24} x2={56} y1={222} y2={222} />
          <line x1={30} x2={50} y1={229} y2={229} />
          <line x1={36} x2={44} y1={236} y2={236} />
        </g>
        <text x={64} y={232} fontSize={12} fontWeight={700} fill="#334155">
          GND (0 V)
        </text>
      </svg>

      <div className="flex flex-1 flex-col gap-4">
        <button
          type="button"
          className={`mx-auto flex h-24 w-24 touch-none items-center justify-center rounded-2xl border-4 border-[#1f2328] bg-[#3a3f44] select-none sm:mx-0 ${
            pressed ? 'scale-95' : ''
          } focus-visible:ring-accent transition-transform outline-none focus-visible:ring-4`}
          aria-label="Botón: mantenlo presionado"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setPressed(true);
          }}
          onPointerUp={() => setPressed(false)}
          onPointerCancel={() => setPressed(false)}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onBlur={() => setPressed(false)}
          onContextMenu={(e) => e.preventDefault()}
        >
          <span
            className={`block h-12 w-12 rounded-full border-2 border-[#5c636a] ${
              pressed ? 'bg-[#111315]' : 'bg-[#202326]'
            }`}
          />
        </button>

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-lg" aria-live="polite">
          <dt className="text-slate-600">Botón</dt>
          <dd className="text-ink font-bold">{pressed ? 'Presionado' : 'Suelto'}</dd>
          <dt className="text-slate-600">
            <code>digitalRead(2)</code>
          </dt>
          <dd className="font-mono font-bold" style={{ color: nodeColor }}>
            {reading}
          </dd>
          <dt className="text-slate-600">LED del pin 8</dt>
          <dd className="text-ink flex items-center gap-2 font-bold">
            <span
              aria-hidden
              className="inline-block h-4 w-4 rounded-full border border-black/20"
              style={{
                background: pressed ? '#6dff8a' : '#2fb24f55',
                boxShadow: pressed ? '0 0 12px 4px #6dff8a' : 'none',
              }}
            />
            {pressed ? 'Encendido' : 'Apagado'}
          </dd>
          <dd className="col-span-2 text-sm text-slate-600">
            Mantén presionado el botón (con el mouse, el dedo o la barra espaciadora).
          </dd>
        </dl>
      </div>
    </Card>
  );
}
