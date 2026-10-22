'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { RichText } from '@/components/ui/RichText';
import type { QuizQuestion } from '@/content/review';
import type { ApiError, QuizResponse } from '@/lib/api-types';
import type { CaseProgress } from '@/lib/case-progress';
import { QUIZ_POINTS_PER_QUESTION } from '@/lib/points';

type QuizProps = {
  /** Options already shuffled on the server. */
  questions: QuizQuestion[];
  /** Progress per question id (not item id). */
  initial: Record<string, CaseProgress | undefined>;
};

export function Quiz({ questions, initial }: QuizProps) {
  const solved = questions.filter((q) => initial[q.id]?.status === 'solved').length;
  return (
    <section aria-labelledby="quiz-title" className="flex flex-col gap-4">
      <div>
        <h2 id="quiz-title" className="text-xl">
          Mini-quiz
        </h2>
        <p className="text-slate-600">
          {QUIZ_POINTS_PER_QUESTION} puntos por cada respuesta correcta al primer intento.
          {solved > 0 && ` Llevas ${solved} de ${questions.length}.`}
        </p>
      </div>
      {questions.map((q, i) => (
        <QuestionCard key={q.id} number={i + 1} question={q} initial={initial[q.id]} />
      ))}
    </section>
  );
}

function QuestionCard({
  number,
  question,
  initial,
}: {
  number: number;
  question: QuizQuestion;
  initial?: CaseProgress;
}) {
  const router = useRouter();
  const [wrong, setWrong] = useState<string[]>([]);
  const [correctId, setCorrectId] = useState<string | null>(null);
  const [progress, setProgress] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const done = progress?.status === 'solved';

  async function answer(id: string) {
    setPending(true);
    setError(null);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.id, answer: id }),
      });
      const data = (await res.json()) as QuizResponse | ApiError;
      if (!res.ok || 'error' in data) throw new Error('error' in data ? data.error : undefined);
      setProgress(data.progress);
      if (data.correct) {
        setCorrectId(id);
        router.refresh(); // points in the top bar
      } else {
        setWrong((w) => [...w, id]);
      }
    } catch (e) {
      setError((e as Error).message || 'No pudimos guardar tu respuesta.');
    } finally {
      setPending(false);
    }
  }

  return (
    <Card tone={done ? 'ok' : 'neutral'}>
      <fieldset disabled={pending}>
        <legend className="font-semibold">
          {number}. <RichText text={question.prompt} />
        </legend>
        {done && !correctId ? (
          <p className="text-ok-ink mt-2 font-semibold">
            ✅ Ya la respondiste{progress.points > 0 ? ` (+${progress.points} pts)` : ''}.
          </p>
        ) : (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {question.options.map((o) => {
              const isWrong = wrong.includes(o.id);
              const isCorrect = correctId === o.id;
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    disabled={isWrong || done}
                    onClick={() => answer(o.id)}
                    className={`flex min-h-11 w-full items-center gap-2 rounded-xl border-2 px-3 py-2 text-left transition-colors ${
                      isCorrect
                        ? 'border-ok bg-ok/10 font-semibold'
                        : isWrong
                          ? 'border-bad/50 bg-bad/5 text-slate-600'
                          : 'hover:border-accent hover:bg-card border-slate-200 bg-white disabled:hover:border-slate-200 disabled:hover:bg-white'
                    }`}
                  >
                    {isCorrect && (
                      <span role="img" aria-label="Correcta">
                        ✅
                      </span>
                    )}
                    {isWrong && (
                      <span role="img" aria-label="Incorrecta">
                        ❌
                      </span>
                    )}
                    <RichText text={o.text} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <p aria-live="polite" className="mt-2 text-sm font-semibold">
          {correctId && (
            <span className="text-ok-ink">
              ¡Correcto!{' '}
              {progress && progress.points > 0
                ? `+${progress.points} pts`
                : '(sin puntos: no fue al primer intento)'}
            </span>
          )}
          {!correctId && wrong.length > 0 && !done && (
            <span className="text-bad-ink">
              Todavía no. Vuelve a leer la sección e intenta otra vez.
            </span>
          )}
          {error && <span className="text-bad-ink">{error}</span>}
        </p>
      </fieldset>
    </Card>
  );
}
