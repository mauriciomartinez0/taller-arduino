import { canGiveUp, casePoints, HINTS_PER_CASE } from './points';

export type ProgressStatus = 'not_started' | 'in_progress' | 'solved' | 'gave_up';
export type CaseStep = 'locate' | 'fix';

export type CaseProgress = {
  status: ProgressStatus;
  located: boolean;
  hintsUsed: number;
  wrongAttempts: number;
  points: number;
  startedAt: string | null;
  solvedAt: string | null;
};

export const initialProgress: CaseProgress = {
  status: 'not_started',
  located: false,
  hintsUsed: 0,
  wrongAttempts: 0,
  points: 0,
  startedAt: null,
  solvedAt: null,
};

export function isFinished(p: CaseProgress): boolean {
  return p.status === 'solved' || p.status === 'gave_up';
}

/** The step the student is on, or null when the case is finished. */
export function currentStep(p: CaseProgress): CaseStep | null {
  if (isFinished(p)) return null;
  return p.located ? 'fix' : 'locate';
}

function start(p: CaseProgress, now: Date): CaseProgress {
  if (p.status !== 'not_started') return p;
  return { ...p, status: 'in_progress', startedAt: now.toISOString() };
}

/** Marks the case as opened (starts the timer). */
export function openCase(p: CaseProgress, now = new Date()): CaseProgress {
  return start(p, now);
}

export function takeHint(p: CaseProgress, now = new Date()): CaseProgress {
  if (isFinished(p) || p.hintsUsed >= HINTS_PER_CASE) return p;
  return { ...start(p, now), hintsUsed: p.hintsUsed + 1 };
}

export function recordAttempt(
  p: CaseProgress,
  step: CaseStep,
  correct: boolean,
  now = new Date(),
): CaseProgress {
  if (currentStep(p) !== step) return p;
  const next = start(p, now);
  if (!correct) return { ...next, wrongAttempts: next.wrongAttempts + 1 };
  if (step === 'locate') return { ...next, located: true };
  return {
    ...next,
    status: 'solved',
    points: casePoints(next.hintsUsed, next.wrongAttempts),
    solvedAt: now.toISOString(),
  };
}

export function giveUp(p: CaseProgress, now = new Date()): CaseProgress {
  if (isFinished(p) || !canGiveUp(p.wrongAttempts)) return p;
  return { ...p, status: 'gave_up', points: 0, solvedAt: now.toISOString() };
}
