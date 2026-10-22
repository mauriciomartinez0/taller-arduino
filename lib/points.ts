export const CASE_MAX_POINTS = 10;
export const HINT_COST = 2;
export const WRONG_ATTEMPT_COST = 1;
export const CASE_MIN_POINTS = 3;
/** Wrong attempts (step 1 and step 2 combined) before "Ver la solución" appears. */
export const GIVE_UP_AFTER = 6;
export const HINTS_PER_CASE = 2;
export const QUIZ_POINTS_PER_QUESTION = 2;

/** Points for a solved case. A case the student gave up on is worth 0. */
export function casePoints(hintsUsed: number, wrongAttempts: number): number {
  const points = CASE_MAX_POINTS - HINT_COST * hintsUsed - WRONG_ATTEMPT_COST * wrongAttempts;
  return Math.max(CASE_MIN_POINTS, points);
}

export function canGiveUp(wrongAttempts: number): boolean {
  return wrongAttempts >= GIVE_UP_AFTER;
}
