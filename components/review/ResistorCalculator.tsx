'use client';

import { useState } from 'react';
import { BAND_COLORS } from '@/components/circuit/parts';
import { Card } from '@/components/ui/Card';
import {
  bandsToOhms,
  COLOR_DIGITS,
  COLOR_NAMES,
  formatOhms,
  ohmsToBands,
  parseOhms,
  TOLERANCES,
  type DigitColor,
  type ToleranceColor,
} from '@/lib/resistor';

const selectClass =
  'rounded-lg border-2 border-slate-300 bg-white px-2 py-1.5 focus:border-accent-strong focus:outline-none';

function ResistorDrawing({ bands }: { bands: string[] }) {
  return (
    <svg viewBox="0 0 220 50" className="h-14 w-full max-w-xs" role="img" aria-label="Resistencia">
      <line x1={0} x2={220} y1={25} y2={25} stroke="#9aa1a7" strokeWidth={4} />
      <rect x={45} y={8} width={130} height={34} rx={14} fill="#e8d3a7" stroke="#b49a68" />
      {bands.map((b, i) => {
        const last = i === bands.length - 1;
        const x = last ? 150 : 62 + i * 18;
        return <rect key={i} x={x} y={8} width={9} height={34} fill={BAND_COLORS[b]} />;
      })}
    </svg>
  );
}

export function ResistorCalculator() {
  const [bandCount, setBandCount] = useState<4 | 5>(4);
  const [digits, setDigits] = useState<DigitColor[]>(['red', 'red', 'black']);
  const [multiplier, setMultiplier] = useState<DigitColor>('brown');
  const [tolerance, setTolerance] = useState<ToleranceColor>('gold');
  const [typed, setTyped] = useState('220');

  const digitCount = bandCount === 4 ? 2 : 3;
  const used = digits.slice(0, digitCount);
  const value = bandsToOhms(used, multiplier);

  const parsed = parseOhms(typed);
  const reverse4 = parsed ? ohmsToBands(parsed, 2) : null;
  const reverse5 = parsed ? ohmsToBands(parsed, 3) : null;

  return (
    <Card tone="accent" className="flex flex-col gap-6">
      <section>
        <h2 className="text-base">De colores a valor</h2>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Número de bandas">
          {([4, 5] as const).map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={bandCount === n}
              onClick={() => setBandCount(n)}
              className={`rounded-lg border-2 px-3 py-1.5 font-semibold ${
                bandCount === n
                  ? 'border-accent-strong text-ink bg-white'
                  : 'border-slate-300 text-slate-600'
              }`}
            >
              {n} bandas
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          {used.map((c, i) => (
            <label key={i} className="flex flex-col text-sm">
              Banda {i + 1}
              <select
                className={selectClass}
                value={c}
                onChange={(e) =>
                  setDigits((d) =>
                    d.map((old, j) => (j === i ? (e.target.value as DigitColor) : old)),
                  )
                }
              >
                {COLOR_DIGITS.map((color, n) => (
                  <option key={color} value={color}>
                    {COLOR_NAMES[color]} ({n})
                  </option>
                ))}
              </select>
            </label>
          ))}
          <label className="flex flex-col text-sm">
            Multiplicador
            <select
              className={selectClass}
              value={multiplier}
              onChange={(e) => setMultiplier(e.target.value as DigitColor)}
            >
              {COLOR_DIGITS.map((color, n) => (
                <option key={color} value={color}>
                  {COLOR_NAMES[color]} (×{(10 ** n).toLocaleString('es-CO')})
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-sm">
            Tolerancia
            <select
              className={selectClass}
              value={tolerance}
              onChange={(e) => setTolerance(e.target.value as ToleranceColor)}
            >
              {(Object.keys(TOLERANCES) as ToleranceColor[]).map((color) => (
                <option key={color} value={color}>
                  {COLOR_NAMES[color]} ({TOLERANCES[color]})
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <ResistorDrawing bands={[...used, multiplier, tolerance]} />
          <p className="text-ink text-2xl font-bold" aria-live="polite">
            {formatOhms(value)}{' '}
            <span className="text-base font-normal">{TOLERANCES[tolerance]}</span>
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-base">De valor a colores</h2>
        <label className="mt-2 flex flex-col text-sm sm:w-64">
          Escribe un valor (por ejemplo 220, 1k o 10k)
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            className={`${selectClass} mt-1 font-mono`}
            inputMode="text"
          />
        </label>
        <div className="mt-3 flex flex-col gap-2" aria-live="polite">
          {!parsed ? (
            <p className="text-slate-600">Escribe un número, por ejemplo 220 o 10k.</p>
          ) : (
            [
              { label: '4 bandas', bands: reverse4 },
              { label: '5 bandas', bands: reverse5 },
            ].map(({ label, bands }) => (
              <div key={label} className="flex flex-wrap items-center gap-3">
                <span className="w-20 text-sm font-semibold">{label}</span>
                {bands ? (
                  <>
                    <ResistorDrawing bands={[...bands.digits, bands.multiplier, 'gold']} />
                    <span>
                      {[...bands.digits, bands.multiplier].map((c) => COLOR_NAMES[c]).join(' – ')} –
                      dorado
                    </span>
                  </>
                ) : (
                  <span className="text-slate-600">
                    No se puede escribir {formatOhms(parsed)} con {label}.
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </Card>
  );
}
