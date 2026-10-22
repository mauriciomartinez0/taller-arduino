'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { progress } from '@/db/schema';
import { getChallenge } from '@/content/challenges';
import { recordAttemptRow, saveItemProgress } from '../progress';
import { getStudentSession } from '../student-session';

/** "Ya lo hice" (self-reported, 0 points). Calling it with `done = false` unmarks it. */
export async function markChallengeDone(challengeId: string, done: boolean) {
  const session = await getStudentSession();
  if (!session || !getChallenge(challengeId)) return;
  const { student } = session;

  if (done) {
    const now = new Date().toISOString();
    await saveItemProgress(student.id, challengeId, {
      status: 'solved',
      located: false,
      hintsUsed: 0,
      wrongAttempts: 0,
      points: 0,
      startedAt: now,
      solvedAt: now,
    });
  } else {
    await db
      .delete(progress)
      .where(and(eq(progress.studentId, student.id), eq(progress.itemId, challengeId)));
  }
  await recordAttemptRow(student.id, challengeId, 'done', { done }, done);
  revalidatePath('/retos');
}
