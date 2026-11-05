import 'server-only';

import type { Scene, ScenePart } from '@/components/circuit/CircuitDiagram';
import {
  BOTTOM_LANES,
  BREADBOARD,
  columnX,
  hole,
  LANES,
  PITCH,
  pin,
  railHole,
  route,
  SIDE_LANES,
  type PinName,
} from '@/components/circuit/geometry';
import type { LedColor } from '@/components/circuit/parts';

/**
 * Circuit scenes for the cases and the review pages. Built on the server so the corrected
 * versions only reach the browser once the case is solved.
 */

const BANDS_220 = ['red', 'red', 'brown', 'gold'];

/** GND (bottom header) → − rail, column 2, around the left side of the Arduino. */
function gndToRail(): ScenePart {
  return {
    kind: 'wire',
    id: 'wireGnd',
    color: 'black',
    points: route(
      pin('GND'),
      { y: BOTTOM_LANES.second },
      { x: SIDE_LANES.left1 },
      { y: railHole(2, 'bottom-').y },
      { x: columnX(2) },
    ),
  };
}

/** Digital pin (top header) → hole in row j, entering from below. */
function pinToRowJ(id: string, color: 'blue' | 'green', from: PinName, col: number): ScenePart {
  return {
    kind: 'wire',
    id,
    color,
    points: route(pin(from), { y: LANES.lower }, { x: columnX(col) }, { y: hole(col, 'j').y }),
  };
}

type LedGroup = {
  pin: PinName;
  /** Column of the signal wire (row j) and of the resistor's left lead. */
  col: number;
  color: LedColor;
  wire: 'blue' | 'green' | 'red' | 'yellow';
  lane: number;
};

/**
 * Compact LED group (C3): pin → col j, resistor col h → col+2 h, LED col+2 f (+) / col+3 f (−),
 * jumper col+3 i → − rail. Uses 4 columns instead of 6 so three LEDs and a potentiometer fit.
 */
function compactLed({ pin: from, col, color, wire, lane }: LedGroup): ScenePart[] {
  return [
    {
      kind: 'wire',
      color: wire,
      points: route(pin(from), { y: lane }, { x: columnX(col) }, { y: hole(col, 'j').y }),
    },
    { kind: 'resistor', from: hole(col, 'h'), to: hole(col + 2, 'h'), bands: BANDS_220 },
    { kind: 'led', anode: hole(col + 2, 'f'), cathode: hole(col + 3, 'f'), color },
    { kind: 'wire', color: 'black', points: [hole(col + 3, 'i'), railHole(col + 3, 'bottom-')] },
  ];
}

/** 5V (bottom header) → + rail, column 1, around the left side of the Arduino. */
function fiveVoltToRail(): ScenePart {
  return {
    kind: 'wire',
    color: 'red',
    points: route(
      pin('5V'),
      { y: BOTTOM_LANES.first },
      { x: SIDE_LANES.left2 },
      { y: railHole(1, 'bottom+').y },
      { x: columnX(1) },
    ),
  };
}

/** Potentiometer with legs 16 (+ rail), 18 (A0) and 20 (− rail). */
function potOnA0Right(): ScenePart[] {
  return [
    { kind: 'potentiometer', col: 16 },
    {
      kind: 'wire',
      color: 'blue',
      points: route(
        pin('A0'),
        { y: BOTTOM_LANES.first },
        { x: SIDE_LANES.right },
        { y: LANES.upper },
        { x: columnX(18) },
        { y: hole(18, 'j').y },
      ),
    },
    { kind: 'wire', color: 'red', points: [hole(16, 'i'), railHole(16, 'bottom+')] },
    { kind: 'wire', color: 'black', points: [hole(20, 'i'), railHole(20, 'bottom-')] },
  ];
}

/** C3: green 8, yellow 9, red 10 and a potentiometer on A0 (legs 16, 18, 20). */
function alarmCircuit(): ScenePart[] {
  return [
    gndToRail(),
    fiveVoltToRail(),
    ...compactLed({ pin: '10', col: 3, color: 'red', wire: 'red', lane: LANES.lower - 4 }),
    ...compactLed({ pin: '9', col: 7, color: 'yellow', wire: 'yellow', lane: LANES.upper }),
    ...compactLed({ pin: '8', col: 11, color: 'green', wire: 'green', lane: LANES.lower + 8 }),
    ...potOnA0Right(),
  ];
}

/** Review: the potentiometer on A0 sets the brightness of an LED on pin 9 (PWM). */
function dimmerCircuit(): ScenePart[] {
  return [
    gndToRail(),
    fiveVoltToRail(),
    ...compactLed({ pin: '9', col: 3, color: 'yellow', wire: 'green', lane: LANES.lower }),
    ...potOnA0Right(),
  ];
}

function jumperToRail(id: string, col: number, color: 'black' | 'red' = 'black'): ScenePart {
  const rail = color === 'red' ? 'bottom+' : 'bottom-';
  return { kind: 'wire', id, color, points: [hole(col, 'i'), railHole(col, rail)] };
}

type LedCircuitOptions = {
  signalPin?: PinName;
  reversedLed?: boolean;
  withResistor?: boolean;
  withGndJumper?: boolean;
  lit?: 'normal' | 'intense';
  color?: LedColor;
  cathodeId?: string;
};

/** Base LED circuit: pin 8 → 11j, 220 Ω 11h–15h, LED 15f (+) / 16f (−), 16i → − rail. */
function ledCircuit({
  signalPin = '8',
  reversedLed = false,
  withResistor = true,
  withGndJumper = true,
  lit,
  color = 'red',
  cathodeId,
}: LedCircuitOptions = {}): ScenePart[] {
  const parts: ScenePart[] = [
    gndToRail(),
    pinToRowJ('wireSignal', 'blue', signalPin, withResistor ? 11 : 15),
  ];
  if (withResistor) {
    parts.push({
      kind: 'resistor',
      id: 'resistor',
      from: hole(11, 'h'),
      to: hole(15, 'h'),
      bands: BANDS_220,
    });
  }
  parts.push({
    kind: 'led',
    id: 'led',
    cathodeId,
    anode: hole(reversedLed ? 16 : 15, 'f'),
    cathode: hole(reversedLed ? 15 : 16, 'f'),
    color,
    lit,
  });
  if (withGndJumper) parts.push(jumperToRail('jumperGnd', 16));
  return parts;
}

/** Push button on pin 2 (signal 4h) with its GND jumper in column 4 (A5 bug) or 6. */
function buttonOnPin2(gndColumn: 4 | 6): ScenePart[] {
  return [
    { kind: 'button', id: 'button', col: 4 },
    {
      kind: 'wire',
      id: 'wireButtonSignal',
      color: 'green',
      points: route(
        pin('2'),
        { y: LANES.upper },
        { x: columnX(3) + PITCH / 2 },
        { y: hole(4, 'h').y },
        { x: columnX(4) },
      ),
    },
    jumperToRail('jumperButtonGnd', gndColumn),
  ];
}

function buttonCircuit(gndColumn: 4 | 6): ScenePart[] {
  return [
    ...buttonOnPin2(gndColumn),
    // With the bug the pin always reads LOW ("pressed"), so the LED is always on.
    ...ledCircuit({ color: 'green', lit: gndColumn === 4 ? 'normal' : undefined }),
  ];
}

function potCircuit(fixed: boolean): ScenePart[] {
  const a0Column = fixed ? 10 : 8;
  const plusColumn = fixed ? 8 : 10;
  return [
    {
      kind: 'wire',
      id: 'wire5v',
      color: 'red',
      points: route(
        pin('5V'),
        { y: BOTTOM_LANES.first },
        { x: SIDE_LANES.left2 },
        { y: railHole(1, 'bottom+').y },
        { x: columnX(1) },
      ),
    },
    gndToRail(),
    { kind: 'potentiometer', id: 'potentiometer', col: 8 },
    {
      kind: 'wire',
      id: 'wireA0',
      color: 'yellow',
      points: route(
        pin('A0'),
        { y: BOTTOM_LANES.first },
        { x: SIDE_LANES.right },
        { y: LANES.upper },
        { x: columnX(a0Column) },
        { y: hole(a0Column, 'j').y },
      ),
    },
    jumperToRail('jumperPotMiddle', plusColumn, 'red'),
    jumperToRail('jumperPotRight', 12),
  ];
}

const column16Zone: ScenePart = {
  kind: 'zone',
  id: 'column16',
  label: 'columna 16',
  x: columnX(16) - PITCH / 2,
  y: BREADBOARD.y + BREADBOARD.rowY.g - PITCH / 2,
  width: PITCH,
  height: BREADBOARD.rowY.j - BREADBOARD.rowY.g + PITCH,
};

const scenes: Record<string, Scene> = {
  A1: { usedPins: ['GND', '8'], parts: ledCircuit({ reversedLed: true }) },
  'A1-fixed': { usedPins: ['GND', '8'], parts: ledCircuit({ lit: 'normal' }) },

  A2: { usedPins: ['GND', '8'], parts: ledCircuit({ withResistor: false, lit: 'intense' }) },
  'A2-fixed': { usedPins: ['GND', '8'], parts: ledCircuit({ lit: 'normal' }) },

  A3: {
    usedPins: ['GND', '8'],
    parts: [...ledCircuit({ withGndJumper: false, cathodeId: 'ledCathode' }), column16Zone],
  },
  'A3-fixed': { usedPins: ['GND', '8'], parts: ledCircuit({ lit: 'normal' }) },

  A4: {
    usedPins: ['GND', '9'],
    parts: [...ledCircuit({ signalPin: '9' }), { kind: 'pin', id: 'arduinoPin9', name: '9' }],
  },
  'A4-fixed': { usedPins: ['GND', '8'], parts: ledCircuit({ lit: 'normal' }) },

  A5: { usedPins: ['GND', '2', '8'], parts: buttonCircuit(4) },
  'A5-fixed': { usedPins: ['GND', '2', '8'], parts: buttonCircuit(6) },

  A6: { usedPins: ['5V', 'GND', 'A0'], parts: potCircuit(false) },
  'A6-fixed': { usedPins: ['5V', 'GND', 'A0'], parts: potCircuit(true) },

  // Logic cases: the circuit is right (reference only), the error is in the code.
  C1: { usedPins: ['GND', '8'], parts: ledCircuit() },
  C2: { usedPins: ['GND', '2', '8'], parts: buttonCircuit(6) },
  C3: { usedPins: ['5V', 'GND', 'A0', '8', '9', '10'], parts: alarmCircuit() },
  C4: { usedPins: ['5V', 'GND', 'A0'], parts: potCircuit(true) },
  C5: { usedPins: ['GND', '8'], parts: ledCircuit() },
  'C5-fixed': { usedPins: ['GND', '9'], parts: ledCircuit({ signalPin: '9', lit: 'normal' }) },
  C6: { usedPins: ['GND', '2', '8'], parts: buttonCircuit(6) },

  // Review pages (/repaso): reference circuits, always correct.
  'repaso-pot': { usedPins: ['5V', 'GND', 'A0'], parts: potCircuit(true) },
  'repaso-pot-led': { usedPins: ['5V', 'GND', 'A0', '9'], parts: dimmerCircuit() },
  'repaso-boton': { usedPins: ['GND', '2'], parts: [gndToRail(), ...buttonOnPin2(6)] },
  'repaso-boton-led': { usedPins: ['GND', '2', '8'], parts: buttonCircuit(6) },
};

export function getScene(id: string): Scene | undefined {
  return scenes[id];
}

export const SCENE_IDS = Object.keys(scenes);
