'use client';

import { useState } from 'react';
import { CodeBlock } from '@/components/code/CodeBlock';
import { Card } from '@/components/ui/Card';

const CODE = `int nivel = analogRead(A0);

if (nivel > 400) {
  digitalWrite(LED_ROJO, HIGH);
} else if (nivel > 100) {
  digitalWrite(LED_AMARILLO, HIGH);
} else {
  digitalWrite(LED_VERDE, HIGH);
}`;

const PATHS = {
  red: { lines: [3, 4], label: 'rojo', color: '#d24a3c', text: '¡Inundación!' },
  yellow: { lines: [5, 6], label: 'amarillo', color: '#e0a21b', text: '¡Cuidado, hay agua!' },
  green: { lines: [7, 8], label: 'verde', color: '#2f9e57', text: 'Todo seco' },
} as const;

export function IfSlider() {
  const [nivel, setNivel] = useState(250);
  const path = nivel > 400 ? 'red' : nivel > 100 ? 'yellow' : 'green';
  const active = PATHS[path];

  return (
    <Card tone="accent" className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-semibold">
          nivel = <span className="text-ink font-mono">{nivel}</span>
        </span>
        <input
          type="range"
          min={0}
          max={1023}
          value={nivel}
          onChange={(e) => setNivel(Number(e.target.value))}
          className="w-full accent-[#0b6f73]"
        />
      </label>
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <CodeBlock
          code={CODE}
          label="Código de la alarma"
          lineStates={Object.fromEntries(active.lines.map((l) => [l, 'selected' as const]))}
        />
        <div className="flex items-center gap-4 md:flex-col" aria-live="polite">
          <div className="flex gap-3 md:flex-col">
            {(Object.keys(PATHS) as (keyof typeof PATHS)[]).map((key) => (
              <span
                key={key}
                aria-hidden
                className="block h-10 w-10 rounded-full border-2 border-slate-300 transition-all"
                style={{
                  background: key === path ? PATHS[key].color : '#e5e7eb',
                  boxShadow: key === path ? `0 0 18px ${PATHS[key].color}` : 'none',
                }}
              />
            ))}
          </div>
          <p className="font-semibold">
            Enciende el {active.label}: «{active.text}»
          </p>
        </div>
      </div>
    </Card>
  );
}
