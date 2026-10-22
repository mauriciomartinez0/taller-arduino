import { NextResponse } from 'next/server';
import { z } from 'zod';
import { quizItemId } from '@/content/review';
import { QUIZ_POINTS_PER_QUESTION } from '@/lib/points';
import { apiError } from '@/server/case-api';
import { getItemProgress, recordAttemptRow, saveItemProgress } from '@/server/progress';
import { quizAnswers } from '@/server/quiz-answers';
import { tooManyAnswers } from '@/server/rate-limit';
import { getStudentSession } from '@/server/student-session';
import type { QuizResponse } from '@/lib/api-types';
import type { CaseProgress } from '@/lib/case-progress';

const bodySchema = z.object({ questionId: z.string().max(60), answer: z.string().max(60) });

/** 2 points when a question is answered correctly on the first attempt. */
export async function POST(request: Request) {
  const session = await getStudentSession();
  if (!session) return apiError('Tu sesión terminó. Vuelve a entrar.', 401);

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !(parsed.data.questionId in quizAnswers)) {
    return apiError('Pregunta no válida.', 400);
  }
  const { questionId, answer } = parsed.data;
  const { student } = session;
  if (await tooManyAnswers(student.id)) {
    return apiError('Vas muy rápido. Espera un minuto y vuelve a intentar.', 429);
  }

  const itemId = quizItemId(questionId);
  const before = await getItemProgress(student.id, itemId);
  const correct = quizAnswers[questionId] === answer;
  await recordAttemptRow(student.id, itemId, 'quiz', { value: answer }, correct);

  if (before.status === 'solved')
    return NextResponse.json<QuizResponse>({ correct, progress: before });

  const now = new Date().toISOString();
  const firstTry = before.wrongAttempts === 0;
  const after: CaseProgress = correct
    ? {
        ...before,
        status: 'solved',
        points: firstTry ? QUIZ_POINTS_PER_QUESTION : 0,
        startedAt: before.startedAt ?? now,
        solvedAt: now,
      }
    : {
        ...before,
        status: 'in_progress',
        wrongAttempts: before.wrongAttempts + 1,
        startedAt: before.startedAt ?? now,
      };
  await saveItemProgress(student.id, itemId, after);
  return NextResponse.json<QuizResponse>({ correct, progress: after });
}
