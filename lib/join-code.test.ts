import { describe, expect, it } from 'vitest';
import { normalizeDisplayName, normalizeJoinCode, randomJoinCode } from './join-code';

describe('join codes and names', () => {
  it('normalizes the class code', () => {
    expect(normalizeJoinCode(' ard-7b ')).toBe('ARD-7B');
    expect(normalizeJoinCode('ARD 7B')).toBe('ARD7B');
  });

  it('normalizes the display name', () => {
    expect(normalizeDisplayName('  sara   m. ')).toBe('Sara M.');
    expect(normalizeDisplayName('ángel r.')).toBe('Ángel R.');
  });

  it('generates readable codes', () => {
    for (let i = 0; i < 30; i++) expect(randomJoinCode()).toMatch(/^ARD-[A-HJ-NP-Z2-9]{4}$/);
  });
});
