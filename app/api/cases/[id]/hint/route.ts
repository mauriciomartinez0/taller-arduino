import { NextResponse } from 'next/server';
import { takeHint } from '@/lib/case-progress';
import type { CaseProgress } from '@/lib/case-progress';
import { resolveCaseRequest } from '@/server/case-api';
import { getItemProgress, recordAttemptRow, saveItemProgress } from '@/server/progress';

export async function POST(_request: Request, ctx: RouteContext<'/api/cases/[id]/hint'>) {
  const resolved = await resolveCaseRequest((await ctx.params).id);
  if (!resolved.ok) return resolved.response;
  const { student, caseId } = resolved.ctx;

  const before = await getItemProgress(student.id, caseId);
  const after = takeHint(before);
  if (after !== before) {
    await recordAttemptRow(student.id, caseId, 'hint', { hint: after.hintsUsed }, true);
    await saveItemProgress(student.id, caseId, after);
  }
  return NextResponse.json<CaseProgress>(after);
}
