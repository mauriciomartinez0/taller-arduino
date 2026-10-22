import 'server-only';

import { and, eq, sum } from 'drizzle-orm';
import { db } from '@/db';
import { attempts, caseSettings, progress, type ProgressRow } from '@/db/schema';
import { initialProgress, type CaseProgress } from '@/lib/case-progress';

export function toCaseProgress(row: ProgressRow | undefined): CaseProgress {
  if (!row) return initialProgress;
  return {
    status: row.status,
    located: row.located,
    hintsUsed: row.hintsUsed,
    wrongAttempts: row.wrongAttempts,
    points: row.points,
    startedAt: row.startedAt?.toISOString() ?? null,
    solvedAt: row.solvedAt?.toISOString() ?? null,
  };
}

export async function getProgressMap(studentId: string): Promise<Record<string, CaseProgress>> {
  const rows = await db.select().from(progress).where(eq(progress.studentId, studentId));
  return Object.fromEntries(rows.map((r) => [r.itemId, toCaseProgress(r)]));
}

export async function getItemProgress(studentId: string, itemId: string): Promise<CaseProgress> {
  const [row] = await db
    .select()
    .from(progress)
    .where(and(eq(progress.studentId, studentId), eq(progress.itemId, itemId)))
    .limit(1);
  return toCaseProgress(row);
}

export async function saveItemProgress(studentId: string, itemId: string, p: CaseProgress) {
  const values = {
    status: p.status,
    located: p.located,
    hintsUsed: p.hintsUsed,
    wrongAttempts: p.wrongAttempts,
    points: p.points,
    startedAt: p.startedAt ? new Date(p.startedAt) : null,
    solvedAt: p.solvedAt ? new Date(p.solvedAt) : null,
  };
  await db
    .insert(progress)
    .values({ studentId, itemId, ...values })
    .onConflictDoUpdate({ target: [progress.studentId, progress.itemId], set: values });
}

export async function recordAttemptRow(
  studentId: string,
  itemId: string,
  step: (typeof attempts.$inferInsert)['step'],
  answer: unknown,
  isCorrect: boolean,
) {
  await db.insert(attempts).values({ studentId, itemId, step, answer, isCorrect });
}

export async function getTotalPoints(studentId: string): Promise<number> {
  const [row] = await db
    .select({ total: sum(progress.points) })
    .from(progress)
    .where(eq(progress.studentId, studentId));
  return Number(row?.total ?? 0);
}

export type CaseSetting = { isOpen: boolean; wokwiUrl: string | null };

/** Settings per case for a classroom; cases without a row are open and have no link. */
export async function getCaseSettings(classroomId: string): Promise<Record<string, CaseSetting>> {
  const rows = await db
    .select()
    .from(caseSettings)
    .where(eq(caseSettings.classroomId, classroomId));
  return Object.fromEntries(
    rows.map((r) => [r.caseId, { isOpen: r.isOpen, wokwiUrl: r.wokwiUrl }]),
  );
}

export const DEFAULT_CASE_SETTING: CaseSetting = { isOpen: true, wokwiUrl: null };
