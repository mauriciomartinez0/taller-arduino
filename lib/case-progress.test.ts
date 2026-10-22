import { describe, expect, it } from 'vitest';
import {
  currentStep,
  giveUp,
  initialProgress,
  openCase,
  recordAttempt,
  takeHint,
  type CaseProgress,
} from './case-progress';

const t0 = new Date('2026-10-21T13:00:00Z');
const t1 = new Date('2026-10-21T13:04:05Z');

function wrong(p: CaseProgress, times: number, step: 'locate' | 'fix' = 'locate') {
  for (let i = 0; i < times; i++) p = recordAttempt(p, step, false, t0);
  return p;
}

describe('case progress', () => {
  it('starts the timer when the case is opened', () => {
    const p = openCase(initialProgress, t0);
    expect(p).toMatchObject({ status: 'in_progress', startedAt: t0.toISOString() });
    expect(openCase(p, t1).startedAt).toBe(t0.toISOString());
  });

  it('goes from locate to fix to solved with full points', () => {
    let p = openCase(initialProgress, t0);
    expect(currentStep(p)).toBe('locate');
    p = recordAttempt(p, 'locate', true, t0);
    expect(currentStep(p)).toBe('fix');
    p = recordAttempt(p, 'fix', true, t1);
    expect(p).toMatchObject({ status: 'solved', points: 10, solvedAt: t1.toISOString() });
    expect(currentStep(p)).toBeNull();
  });

  it('counts wrong attempts of both steps together and subtracts hints', () => {
    let p = wrong(initialProgress, 2);
    p = recordAttempt(p, 'locate', true, t0);
    p = wrong(p, 1, 'fix');
    p = takeHint(p, t0);
    p = recordAttempt(p, 'fix', true, t1);
    expect(p).toMatchObject({ wrongAttempts: 3, hintsUsed: 1, points: 5 });
  });

  it('unlocks at most 2 hints', () => {
    const p = takeHint(takeHint(takeHint(initialProgress, t0), t0), t0);
    expect(p.hintsUsed).toBe(2);
  });

  it('ignores answers for a step the student is not on', () => {
    expect(recordAttempt(initialProgress, 'fix', true, t0)).toBe(initialProgress);
  });

  it('only allows giving up after 6 wrong attempts, with 0 points', () => {
    expect(giveUp(wrong(initialProgress, 5), t1).status).toBe('in_progress');
    const p = giveUp(wrong(initialProgress, 6), t1);
    expect(p).toMatchObject({ status: 'gave_up', points: 0 });
  });

  it('is final once solved or given up', () => {
    const gaveUp = giveUp(wrong(initialProgress, 6), t1);
    expect(recordAttempt(gaveUp, 'locate', true, t1)).toBe(gaveUp);
    expect(takeHint(gaveUp, t1)).toBe(gaveUp);
  });
});
