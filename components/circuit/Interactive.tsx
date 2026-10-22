'use client';

import { createContext, use, type KeyboardEvent, type ReactNode } from 'react';
import type { Point } from './geometry';

export type ElementState = 'selected' | 'correct' | 'wrong';

type CircuitInteraction = {
  onSelect?: (id: string) => void;
  states: Record<string, ElementState>;
  labels: Record<string, string>;
};

export const CircuitContext = createContext<CircuitInteraction>({ states: {}, labels: {} });

const haloState: Record<ElementState, string> = {
  selected: 'stroke-accent opacity-100',
  correct: 'stroke-ok opacity-100',
  wrong: 'stroke-bad opacity-100',
};

/** Class for the halo drawn around an element (visible on hover, focus and when it has a state). */
export function haloClass(state: ElementState | undefined) {
  return `halo pointer-events-none fill-none transition-opacity ${
    state
      ? haloState[state]
      : 'stroke-accent opacity-0 group-hover:opacity-60 group-focus-visible:opacity-100'
  }`;
}

type HitProps = {
  id?: string;
  /** Where the ✓ / ✕ badge goes. */
  anchor: Point;
  halo: (className: string) => ReactNode;
  children: ReactNode;
};

/** Makes a circuit element clickable (mouse, touch and keyboard) when it has an id. */
export function Hit({ id, anchor, halo, children }: HitProps) {
  const { onSelect, states, labels } = use(CircuitContext);
  if (!id) return <g>{children}</g>;

  const state = states[id];
  const label = labels[id] ?? id;
  const interactive = Boolean(onSelect);

  const onKeyDown = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(id);
    }
  };

  return (
    <g
      data-target={id}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? label : undefined}
      aria-pressed={interactive ? state === 'selected' : undefined}
      onClick={interactive ? () => onSelect?.(id) : undefined}
      onKeyDown={interactive ? onKeyDown : undefined}
      className={interactive ? 'group cursor-pointer outline-none' : undefined}
    >
      {halo(haloClass(state))}
      {children}
      {state && state !== 'selected' && <Badge at={anchor} state={state} />}
      {interactive && <title>{label}</title>}
    </g>
  );
}

function Badge({ at, state }: { at: Point; state: 'correct' | 'wrong' }) {
  const ok = state === 'correct';
  return (
    <g transform={`translate(${at.x + 10} ${at.y - 10})`} pointerEvents="none" aria-hidden>
      <circle r={7} className={ok ? 'fill-ok' : 'fill-bad'} stroke="white" strokeWidth={1.5} />
      <path
        d={ok ? 'M-3 0 L-1 2.5 L3.5 -2.5' : 'M-2.5 -2.5 L2.5 2.5 M2.5 -2.5 L-2.5 2.5'}
        stroke="white"
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}
