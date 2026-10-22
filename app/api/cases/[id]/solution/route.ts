import { NextResponse } from 'next/server';
import type { CheckResponse } from '@/lib/api-types';
import { giveUp, isFinished } from '@/lib/case-progress';
import { canGiveUp } from '@/lib/points';
import { apiError, resolveCaseRequest } from '@/server/case-api';
import { getItemProgress, recordAttemptRow, saveItemProgress } from '@/server/progress';
import { getSolution } from '@/server/solution';

/**
 * "Ver la solución": after 6 wrong attempts the case is marked as given up (0 points).
 * When the teacher made solutions visible, the explanation is returned without changing progress.
 */
export async function POST(_request: Request, ctx: RouteContext<'/api/cases/[id]/solution'>) {
  const resolved = await resolveCaseRequest((await ctx.params).id);
  if (!resolved.ok) return resolved.response;
  const { student, classroom, caseId } = resolved.ctx;

  const before = await getItemProgress(student.id, caseId);
  if (isFinished(before) || classroom.solutionsVisible) {
    return NextResponse.json<CheckResponse>({
      correct: false,
      feedback: '',
      nextStep: 'done',
      progress: before,
      solution: getSolution(caseId),
    });
  }
  if (!canGiveUp(before.wrongAttempts)) {
    return apiError('Todavía puedes intentarlo. La solución aparece después de 6 intentos.', 403);
  }

  const after = giveUp(before);
  await recordAttemptRow(student.id, caseId, 'give_up', null, false);
  await saveItemProgress(student.id, caseId, after);
  return NextResponse.json<CheckResponse>({
    correct: false,
    feedback: '',
    nextStep: 'done',
    progress: after,
    solution: getSolution(caseId),
  });
}
