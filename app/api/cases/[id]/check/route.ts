import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { CheckResponse } from '@/lib/api-types';
import { currentStep, recordAttempt } from '@/lib/case-progress';
import { apiError, resolveCaseRequest } from '@/server/case-api';
import { getItemProgress, recordAttemptRow, saveItemProgress } from '@/server/progress';
import { tooManyAnswers } from '@/server/rate-limit';
import { getSolution } from '@/server/solution';
import { checkFix, checkLocate } from '@/server/verify';

const bodySchema = z.object({
  step: z.enum(['locate', 'fix']),
  answer: z.string().max(300),
});

export async function POST(request: Request, ctx: RouteContext<'/api/cases/[id]/check'>) {
  const resolved = await resolveCaseRequest((await ctx.params).id);
  if (!resolved.ok) return resolved.response;
  const { student, caseId } = resolved.ctx;

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError('Respuesta no válida.', 400);
  const { step, answer } = parsed.data;

  if (await tooManyAnswers(student.id)) {
    return apiError('Vas muy rápido. Espera un minuto y vuelve a intentar.', 429);
  }

  const before = await getItemProgress(student.id, caseId);
  if (currentStep(before) !== step) {
    return apiError('Ese paso ya no está activo. Recarga la página.', 409);
  }

  const result = step === 'locate' ? checkLocate(caseId, answer) : checkFix(caseId, answer);
  const after = recordAttempt(before, step, result.correct);
  await recordAttemptRow(student.id, caseId, step, { value: answer }, result.correct);
  await saveItemProgress(student.id, caseId, after);

  const nextStep = !result.correct ? step : step === 'locate' ? 'fix' : 'done';
  return NextResponse.json<CheckResponse>({
    ...result,
    nextStep,
    progress: after,
    solution: nextStep === 'done' ? getSolution(caseId) : undefined,
  });
}
