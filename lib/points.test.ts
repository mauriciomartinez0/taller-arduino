import { describe, expect, it } from 'vitest';
import { canGiveUp, casePoints } from './points';

describe('casePoints', () => {
  it('gives 10 points with no hints and no mistakes', () => {
    expect(casePoints(0, 0)).toBe(10);
  });

  it('takes 2 per hint and 1 per wrong attempt', () => {
    expect(casePoints(1, 0)).toBe(8);
    expect(casePoints(2, 1)).toBe(5);
  });

  it('never goes below 3 for a solved case', () => {
    expect(casePoints(2, 6)).toBe(3);
    expect(casePoints(2, 40)).toBe(3);
  });
});

describe('canGiveUp', () => {
  it('appears after 6 wrong attempts', () => {
    expect(canGiveUp(5)).toBe(false);
    expect(canGiveUp(6)).toBe(true);
  });
});
