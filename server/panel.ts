import 'server-only';

import { and, asc, eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { attempts, progress, students } from '@/db/schema';
import { CASE_IDS } from '@/content/cases';
import { toCaseProgress } from './progress';
import type { CaseProgress } from '@/lib/case-progress';

export type PanelStudent = {
  id: string;
  displayName: string;
  partnerName: string | null;
  lastSeenAt: string;
  totalPoints: number;
  items: Record<string, CaseProgress>;
};

export type CaseTotals = { solvedPct: number; avgHints: number; started: number };

export type ClassroomOverview = {
  students: PanelStudent[];
  totals: Record<string, CaseTotals>;
  generatedAt: string;
};

export async function getClassroomOverview(classroomId: string): Promise<ClassroomOverview> {
  const studentRows = await db
    .select()
    .from(students)
    .where(eq(students.classroomId, classroomId))
    .orderBy(asc(students.displayName));

  const ids = studentRows.map((s) => s.id);
  const progressRows = ids.length
    ? await db.select().from(progress).where(inArray(progress.studentId, ids))
    : [];

  const byStudent = new Map<string, Record<string, CaseProgress>>();
  for (const row of progressRows) {
    const items = byStudent.get(row.studentId) ?? {};
    items[row.itemId] = toCaseProgress(row);
    byStudent.set(row.studentId, items);
  }

  const panelStudents: PanelStudent[] = studentRows.map((s) => {
    const items = byStudent.get(s.id) ?? {};
    return {
      id: s.id,
      displayName: s.displayName,
      partnerName: s.partnerName,
      lastSeenAt: s.lastSeenAt.toISOString(),
      totalPoints: Object.values(items).reduce((sum, p) => sum + p.points, 0),
      items,
    };
  });

  return {
    students: panelStudents,
    totals: computeTotals(panelStudents),
    generatedAt: new Date().toISOString(),
  };
}

/** Per case: % of the class that solved it and average hints among those who started it. */
export function computeTotals(list: Pick<PanelStudent, 'items'>[]): Record<string, CaseTotals> {
  const totals: Record<string, CaseTotals> = {};
  for (const caseId of CASE_IDS) {
    const started = list.map((s) => s.items[caseId]).filter((p) => p && p.status !== 'not_started');
    const solved = started.filter((p) => p.status === 'solved').length;
    totals[caseId] = {
      solvedPct: list.length ? Math.round((solved / list.length) * 100) : 0,
      avgHints: started.length
        ? Math.round((started.reduce((sum, p) => sum + p.hintsUsed, 0) / started.length) * 10) / 10
        : 0,
      started: started.length,
    };
  }
  return totals;
}

export type AttemptView = {
  id: number;
  step: string;
  answer: unknown;
  isCorrect: boolean;
  createdAt: string;
};

export async function getAttemptHistory(studentId: string, itemId: string): Promise<AttemptView[]> {
  const rows = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.studentId, studentId), eq(attempts.itemId, itemId)))
    .orderBy(asc(attempts.createdAt))
    .limit(200);
  return rows.map((r) => ({
    id: r.id,
    step: r.step,
    answer: r.answer,
    isCorrect: r.isCorrect,
    createdAt: r.createdAt.toISOString(),
  }));
}
