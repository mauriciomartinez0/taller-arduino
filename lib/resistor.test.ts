import { describe, expect, it } from 'vitest';
import { bandsToOhms, formatOhms, ohmsToBands, parseOhms } from './resistor';

describe('resistor colors', () => {
  it('reads 4-band values', () => {
    expect(bandsToOhms(['red', 'red'], 'brown')).toBe(220);
    expect(bandsToOhms(['brown', 'black'], 'orange')).toBe(10_000);
    expect(bandsToOhms(['brown', 'black'], 'red')).toBe(1_000);
  });

  it('reads 5-band values', () => {
    expect(bandsToOhms(['red', 'red', 'black'], 'black')).toBe(220);
    expect(bandsToOhms(['brown', 'black', 'black'], 'red')).toBe(10_000);
  });

  it('formats values', () => {
    expect(formatOhms(220)).toBe('220 Ω');
    expect(formatOhms(1000)).toBe('1 kΩ');
    expect(formatOhms(4700)).toBe('4,7 kΩ');
    expect(formatOhms(10_000)).toBe('10 kΩ');
    expect(formatOhms(1_000_000)).toBe('1 MΩ');
  });

  it('parses what students type', () => {
    expect(parseOhms('220')).toBe(220);
    expect(parseOhms('1k')).toBe(1000);
    expect(parseOhms('10 k')).toBe(10_000);
    expect(parseOhms('4,7k')).toBe(4700);
    expect(parseOhms('220 Ω')).toBe(220);
    expect(parseOhms('hola')).toBeNull();
  });

  it('finds the colors of a value', () => {
    expect(ohmsToBands(220, 2)).toEqual({ digits: ['red', 'red'], multiplier: 'brown' });
    expect(ohmsToBands(1000, 2)).toEqual({ digits: ['brown', 'black'], multiplier: 'red' });
    expect(ohmsToBands(10_000, 2)).toEqual({ digits: ['brown', 'black'], multiplier: 'orange' });
    expect(ohmsToBands(220, 3)).toEqual({ digits: ['red', 'red', 'black'], multiplier: 'black' });
    expect(ohmsToBands(10, 2)).toEqual({ digits: ['brown', 'black'], multiplier: 'black' });
  });

  it('returns null when 2 digits are not enough', () => {
    expect(ohmsToBands(123, 2)).toBeNull();
    expect(ohmsToBands(123, 3)).toEqual({
      digits: ['brown', 'red', 'orange'],
      multiplier: 'black',
    });
  });
});
