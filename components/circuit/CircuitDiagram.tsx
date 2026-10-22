'use client';

import { ArduinoUno } from './ArduinoUno';
import { Breadboard } from './Breadboard';
import { VIEWBOX, type PinName, type Point } from './geometry';
import { CircuitContext, type ElementState } from './Interactive';
import {
  Led,
  PinZone,
  Potentiometer,
  PushButton,
  Resistor,
  Wire,
  Zone,
  type LedColor,
  type WireColor,
} from './parts';

/** Serializable description of a circuit (built on the server, see `server/circuits.ts`). */
export type ScenePart =
  | { kind: 'wire'; id?: string; color: WireColor; points: Point[] }
  | {
      kind: 'led';
      id?: string;
      cathodeId?: string;
      anode: Point;
      cathode: Point;
      color: LedColor;
      lit?: 'normal' | 'intense';
    }
  | { kind: 'resistor'; id?: string; from: Point; to: Point; bands: string[] }
  | { kind: 'button'; id?: string; col: number }
  | { kind: 'potentiometer'; id?: string; col: number }
  | { kind: 'zone'; id: string; label: string; x: number; y: number; width: number; height: number }
  | { kind: 'pin'; id: string; name: PinName };

export type Scene = { usedPins: string[]; parts: ScenePart[] };

type CircuitDiagramProps = {
  scene: Scene;
  label: string;
  onSelect?: (id: string) => void;
  states?: Record<string, ElementState>;
  labels?: Record<string, string>;
};

// Zones and pin targets go last so they sit on top and stay clickable.
const layer = (p: ScenePart) =>
  p.kind === 'zone' || p.kind === 'pin' ? 2 : p.kind === 'wire' ? 1 : 0;

export function CircuitDiagram({
  scene,
  label,
  onSelect,
  states = {},
  labels = {},
}: CircuitDiagramProps) {
  const parts = [...scene.parts].sort((a, b) => layer(a) - layer(b));

  return (
    <CircuitContext value={{ onSelect, states, labels }}>
      <svg
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        role="group"
        aria-label={label}
        className="mx-auto block h-auto w-full max-w-[560px] touch-manipulation select-none lg:max-h-[78vh]"
      >
        <Breadboard />
        <ArduinoUno usedPins={scene.usedPins} />
        {parts.map((part, i) => (
          <ScenePartView key={part.id ?? `${part.kind}-${i}`} part={part} />
        ))}
      </svg>
    </CircuitContext>
  );
}

function ScenePartView({ part }: { part: ScenePart }) {
  switch (part.kind) {
    case 'wire':
      return <Wire {...part} />;
    case 'led':
      return <Led {...part} />;
    case 'resistor':
      return <Resistor {...part} />;
    case 'button':
      return <PushButton {...part} />;
    case 'potentiometer':
      return <Potentiometer {...part} />;
    case 'zone':
      return <Zone {...part} />;
    case 'pin':
      return <PinZone {...part} />;
  }
}
