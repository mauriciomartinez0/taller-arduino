import { beforeAll, describe, expect, it } from 'vitest';
import { decryptPin, encryptPin, generatePin, hashToken, pinMatches, randomToken } from './crypto';

beforeAll(() => {
  process.env.TOKEN_PEPPER = 'test-pepper-test-pepper-test-pepper-1234';
});

describe('crypto helpers', () => {
  it('creates long random tokens and hashes them deterministically', () => {
    const token = randomToken();
    expect(token.length).toBeGreaterThanOrEqual(43);
    expect(hashToken(token)).toBe(hashToken(token));
    expect(hashToken(token)).not.toBe(hashToken(randomToken()));
    expect(hashToken(token)).not.toContain(token);
  });

  it('generates 4-digit PINs', () => {
    for (let i = 0; i < 50; i++) expect(generatePin()).toMatch(/^\d{4}$/);
  });

  it('encrypts PINs reversibly, with a different ciphertext each time', () => {
    const a = encryptPin('0427');
    const b = encryptPin('0427');
    expect(a).not.toBe(b);
    expect(a).not.toContain('0427');
    expect(decryptPin(a)).toBe('0427');
    expect(pinMatches(a, '0427')).toBe(true);
    expect(pinMatches(a, '0428')).toBe(false);
    expect(pinMatches(a, '427')).toBe(false);
  });
});
