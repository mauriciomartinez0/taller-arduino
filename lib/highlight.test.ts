import { describe, expect, it } from 'vitest';
import { highlightLine } from './highlight';

const kinds = (line: string) =>
  highlightLine(line)
    .filter((t) => t.kind !== 'text')
    .map((t) => [t.kind, t.text]);

describe('highlightLine', () => {
  it('colors functions, constants and numbers', () => {
    expect(kinds('  digitalWrite(8, HIGH);')).toEqual([
      ['function', 'digitalWrite'],
      ['number', '8'],
      ['keyword', 'HIGH'],
    ]);
  });

  it('colors keywords and comments', () => {
    expect(kinds('const int LED = 9;   // pin con ~ (PWM)')).toEqual([
      ['keyword', 'const'],
      ['keyword', 'int'],
      ['number', '9'],
      ['comment', '// pin con ~ (PWM)'],
    ]);
  });

  it('colors strings without touching what is inside', () => {
    expect(kinds('Serial.print("Potenciómetro: ");')).toEqual([
      ['keyword', 'Serial'],
      ['function', 'print'],
      ['string', '"Potenciómetro: "'],
    ]);
  });

  it('treats if( as a keyword, not a function', () => {
    expect(kinds('if (estado == LOW) {')[0]).toEqual(['keyword', 'if']);
  });

  it('keeps the full text of the line', () => {
    const line = '  for (int b = 0; b <= 255; b++) {     // sube el brillo';
    expect(
      highlightLine(line)
        .map((t) => t.text)
        .join(''),
    ).toBe(line);
  });
});
