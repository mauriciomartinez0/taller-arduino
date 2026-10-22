import { describe, expect, it } from 'vitest';
import { normalizeLine } from './normalize';

describe('normalizeLine', () => {
  it('removes all spaces and tabs', () => {
    expect(normalizeLine('  pinMode( 8 ,\tOUTPUT ) ;  ')).toBe('pinMode(8,OUTPUT);');
  });

  it('removes a trailing // comment', () => {
    expect(normalizeLine('if (estado == LOW) {          // presionado')).toBe('if(estado==LOW){');
  });

  it('turns a comment-only line into an empty string', () => {
    expect(normalizeLine('  // configuración')).toBe('');
  });

  it('keeps upper and lower case as typed', () => {
    expect(normalizeLine('digitalwrite(8, HIGH);')).toBe('digitalwrite(8,HIGH);');
    expect(normalizeLine('digitalwrite(8, HIGH);')).not.toBe(
      normalizeLine('digitalWrite(8, HIGH);'),
    );
  });

  it('does not add or remove anything else', () => {
    expect(normalizeLine('pinMode(8, OUTPUT)')).toBe('pinMode(8,OUTPUT)');
    expect(normalizeLine('const int LED = 9;')).toBe('constintLED=9;');
  });
});
