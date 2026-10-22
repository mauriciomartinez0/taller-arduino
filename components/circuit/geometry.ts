/**
 * Shared geometry for the circuit diagrams.
 * The breadboard sits on top and the Arduino below it, so wires from the Arduino
 * enter the breadboard from the bottom rails, like on a real desk.
 */

export type Point = { x: number; y: number };

export const PITCH = 18;
export const COLUMNS = 20;

export const ROWS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'] as const;
export type Row = (typeof ROWS)[number];
export type Rail = 'top+' | 'top-' | 'bottom-' | 'bottom+';

// ---------- Breadboard ----------

export const BREADBOARD = {
  x: 40,
  y: 0,
  width: 22 + COLUMNS * PITCH + 12,
  height: 318,
  /** x of column 1's center, relative to the breadboard. */
  firstColumn: 31,
  rowY: { a: 68, b: 86, c: 104, d: 122, e: 140, f: 176, g: 194, h: 212, i: 230, j: 248 } as Record<
    Row,
    number
  >,
  railY: { 'top+': 14, 'top-': 32, 'bottom-': 284, 'bottom+': 302 } as Record<Rail, number>,
  numbersY: [52, 266],
  channelY: 158,
} as const;

export function columnX(col: number): number {
  return BREADBOARD.x + BREADBOARD.firstColumn + (col - 1) * PITCH;
}

/** Center of a breadboard hole, e.g. `hole(11, 'j')`. */
export function hole(col: number, row: Row): Point {
  return { x: columnX(col), y: BREADBOARD.y + BREADBOARD.rowY[row] };
}

/** Center of a power-rail hole aligned with a column. */
export function railHole(col: number, rail: Rail): Point {
  return { x: columnX(col), y: BREADBOARD.y + BREADBOARD.railY[rail] };
}

// ---------- Arduino UNO ----------

export const ARDUINO = {
  x: 40,
  y: 368,
  width: 340,
  height: 214,
  topHeaderY: 14,
  bottomHeaderY: 200,
} as const;

/** Top (digital) header, left to right; `null` is the gap between 8 and 7. */
export const DIGITAL_HEADER = [
  'GND',
  '13',
  '12',
  '11',
  '10',
  '9',
  '8',
  null,
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
  '1',
  '0',
] as const;

/** Bottom (power + analog) header; `null` is the gap between VIN and A0. */
export const POWER_HEADER = [
  'IOREF',
  'RESET',
  '3.3V',
  '5V',
  'GND',
  'GND2',
  'VIN',
  null,
  'A0',
  'A1',
  'A2',
  'A3',
  'A4',
  'A5',
] as const;

export const PWM_PINS = new Set(['3', '5', '6', '9', '10', '11']);

export type PinName =
  | Exclude<(typeof DIGITAL_HEADER)[number], null | 'GND'>
  | 'GND_TOP'
  | Exclude<(typeof POWER_HEADER)[number], null>;

const TOP_START = 30;
const BOTTOM_START = 70;

/** Center of an Arduino pin. `GND` is the bottom-header GND; `GND_TOP` the one next to 13. */
export function pin(name: PinName | 'GND'): Point {
  if (name === 'GND_TOP') {
    return { x: ARDUINO.x + TOP_START, y: ARDUINO.y + ARDUINO.topHeaderY };
  }
  const top = DIGITAL_HEADER.indexOf(name as (typeof DIGITAL_HEADER)[number]);
  if (top > 0) {
    return { x: ARDUINO.x + TOP_START + top * PITCH, y: ARDUINO.y + ARDUINO.topHeaderY };
  }
  const bottom = POWER_HEADER.indexOf(name as (typeof POWER_HEADER)[number]);
  if (bottom >= 0) {
    return { x: ARDUINO.x + BOTTOM_START + bottom * PITCH, y: ARDUINO.y + ARDUINO.bottomHeaderY };
  }
  throw new Error(`Unknown pin ${name}`);
}

export const VIEWBOX = { width: 470, height: 612 } as const;

/** Horizontal lanes in the gap between the breadboard and the Arduino. */
export const LANES = { upper: 332, lower: 348 } as const;
/** Lanes below the Arduino and to its sides, for the bottom header. */
export const BOTTOM_LANES = { first: 594, second: 604 } as const;
export const SIDE_LANES = { left1: 12, left2: 24, right: 404 } as const;

/** Orthogonal route: each step moves only horizontally (`{ x }`) or vertically (`{ y }`). */
export function route(start: Point, ...steps: ({ x: number } | { y: number })[]): Point[] {
  const points = [start];
  let current = start;
  for (const step of steps) {
    current = 'x' in step ? { x: step.x, y: current.y } : { x: current.x, y: step.y };
    points.push(current);
  }
  return points;
}
