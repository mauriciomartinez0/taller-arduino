import { describe, expect, it } from 'vitest';
import { formatDuration } from './format';

describe('formatDuration', () => {
  it('shows seconds under a minute', () => {
    expect(formatDuration(45_000)).toBe('45 s');
  });

  it('pads seconds when there are minutes', () => {
    expect(formatDuration(245_000)).toBe('4 min 05 s');
  });

  it('never goes negative', () => {
    expect(formatDuration(-1000)).toBe('0 s');
  });
});
