import 'server-only';

import { and, count, eq, gt } from 'drizzle-orm';
import { db } from '@/db';
import { attempts, loginAttempts } from '@/db/schema';

export const LOGIN_MAX_FAILURES = 5;
export const LOGIN_LOCK_MS = 10 * 60 * 1000;
export const ANSWERS_PER_MINUTE = 30;

/** True when `key` had too many failures in the lock window. */
export async function isLocked(key: string): Promise<boolean> {
  const since = new Date(Date.now() - LOGIN_LOCK_MS);
  const [row] = await db
    .select({ n: count() })
    .from(loginAttempts)
    .where(and(eq(loginAttempts.key, key), gt(loginAttempts.createdAt, since)));
  return (row?.n ?? 0) >= LOGIN_MAX_FAILURES;
}

export async function recordFailure(key: string) {
  await db.insert(loginAttempts).values({ key });
}

export async function clearFailures(key: string) {
  await db.delete(loginAttempts).where(eq(loginAttempts.key, key));
}

/** True when the student already sent the maximum answers in the last minute. */
export async function tooManyAnswers(studentId: string): Promise<boolean> {
  const since = new Date(Date.now() - 60_000);
  const [row] = await db
    .select({ n: count() })
    .from(attempts)
    .where(and(eq(attempts.studentId, studentId), gt(attempts.createdAt, since)));
  return (row?.n ?? 0) >= ANSWERS_PER_MINUTE;
}
