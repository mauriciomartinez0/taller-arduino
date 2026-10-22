import { NextResponse } from 'next/server';
import { openCase, type CaseProgress } from '@/lib/case-progress';
import { resolveCaseRequest } from '@/server/case-api';
import { getItemProgress, saveItemProgress } from '@/server/progress';

/** Starts the timer the first time a student opens a case. */
export async function POST(_request: Request, ctx: RouteContext<'/api/cases/[id]/open'>) {
  const resolved = await resolveCaseRequest((await ctx.params).id);
  if (!resolved.ok) return resolved.response;
  const { student, caseId } = resolved.ctx;

  const before = await getItemProgress(student.id, caseId);
  const after = openCase(before);
  if (after !== before) await saveItemProgress(student.id, caseId, after);
  return NextResponse.json<CaseProgress>(after);
}
