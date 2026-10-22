export const COLOR_DIGITS = [
  'black',
  'brown',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'violet',
  'gray',
  'white',
] as const;
export type DigitColor = (typeof COLOR_DIGITS)[number];
export type ToleranceColor = 'gold' | 'silver' | 'brown';

export const COLOR_NAMES: Record<DigitColor | ToleranceColor, string> = {
  black: 'negro',
  brown: 'café',
  red: 'rojo',
  orange: 'naranja',
  yellow: 'amarillo',
  green: 'verde',
  blue: 'azul',
  violet: 'violeta',
  gray: 'gris',
  white: 'blanco',
  gold: 'dorado',
  silver: 'plateado',
};

export const TOLERANCES: Record<ToleranceColor, string> = {
  gold: '±5 %',
  silver: '±10 %',
  brown: '±1 %',
};

/** Ohms from the digit bands and the multiplier band (4-band: 2 digits, 5-band: 3 digits). */
export function bandsToOhms(digits: DigitColor[], multiplier: DigitColor): number {
  const value = digits.reduce((acc, c) => acc * 10 + COLOR_DIGITS.indexOf(c), 0);
  return value * 10 ** COLOR_DIGITS.indexOf(multiplier);
}

/** "220 Ω", "1 kΩ", "4,7 kΩ", "1 MΩ" */
export function formatOhms(ohms: number): string {
  const fmt = (n: number) => String(Number(n.toPrecision(3))).replace('.', ',');
  if (ohms >= 1e6) return `${fmt(ohms / 1e6)} MΩ`;
  if (ohms >= 1e3) return `${fmt(ohms / 1e3)} kΩ`;
  return `${fmt(ohms)} Ω`;
}

/** "220", "1k", "4.7k", "10 k", "1M" → ohms; null when it can't be read. */
export function parseOhms(input: string): number | null {
  const m = input
    .trim()
    .toLowerCase()
    .replace(',', '.')
    .replace(/\s|Ω|ω|ohms?/g, '')
    .match(/^(\d+(?:\.\d+)?)([km]?)$/);
  if (!m) return null;
  const n = Number(m[1]) * (m[2] === 'k' ? 1e3 : m[2] === 'm' ? 1e6 : 1);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 1000) / 1000 : null;
}

/**
 * Colors for a value with 2 significant digits (4 bands) or 3 (5 bands).
 * Returns null when the value can't be written exactly with those bands.
 */
export function ohmsToBands(
  ohms: number,
  digitCount: 2 | 3,
): { digits: DigitColor[]; multiplier: DigitColor } | null {
  if (!(ohms > 0)) return null;
  for (let exp = 0; exp <= 9; exp++) {
    const base = ohms / 10 ** exp;
    const rounded = Math.round(base);
    if (Math.abs(base - rounded) > 1e-9) break;
    const digits = String(rounded);
    if (digits.length === digitCount) {
      return {
        digits: [...digits].map((d) => COLOR_DIGITS[Number(d)]),
        multiplier: COLOR_DIGITS[exp],
      };
    }
    if (digits.length < digitCount) break;
  }
  return null;
}
