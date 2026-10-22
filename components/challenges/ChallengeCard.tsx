'use client';

import { useOptimistic, useState, useTransition } from 'react';
import { CodeBlock } from '@/components/code/CodeBlock';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RichText } from '@/components/ui/RichText';
import type { Challenge } from '@/content/challenges';
import { markChallengeDone } from '@/server/actions/challenges';

const LEVEL_BADGE = { 1: '🟢 Nivel 1', 2: '🟡 Nivel 2', 3: '🔴 Nivel 3' } as const;

type ChallengeCardProps = {
  challenge: Challenge;
  done: boolean;
  /** Present only when the teacher made solutions visible. */
  solution?: string;
};

export function ChallengeCard({ challenge, done, solution }: ChallengeCardProps) {
  const [hintsShown, setHintsShown] = useState(0);
  const [optimisticDone, setOptimisticDone] = useOptimistic(done);
  const [pending, startTransition] = useTransition();
  const [showSolution, setShowSolution] = useState(false);

  const toggleDone = () =>
    startTransition(async () => {
      setOptimisticDone(!optimisticDone);
      await markChallengeDone(challenge.id, !optimisticDone);
    });

  return (
    <Card tone={optimisticDone ? 'ok' : 'neutral'} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="bg-card text-ink rounded-full px-2 py-0.5 font-semibold">
          Clase {challenge.lesson}
        </span>
        {challenge.kind === 'ejemplo' && (
          <span className="bg-card text-ink rounded-full px-2 py-0.5 font-semibold">Ejemplo</span>
        )}
        {challenge.level && <span className="font-semibold">{LEVEL_BADGE[challenge.level]}</span>}
        {optimisticDone && <span className="text-ok-ink ml-auto font-semibold">✅ Lo hiciste</span>}
      </div>
      <h3 className="text-lg">{challenge.title}</h3>
      <p>
        <RichText text={challenge.statement} />
      </p>

      {challenge.successCriteria && (
        <p className="bg-card rounded-xl px-3 py-2">
          <span className="font-semibold">Lo lograste si: </span>
          <RichText text={challenge.successCriteria} />
        </p>
      )}

      {challenge.steps && (
        <div>
          <p className="font-semibold">Pasos</p>
          <ol className="ml-5 list-decimal">
            {challenge.steps.map((s, i) => (
              <li key={i}>
                <RichText text={s} />
              </li>
            ))}
          </ol>
        </div>
      )}

      {challenge.givenCode && (
        <div>
          <p className="mb-1 font-semibold">{challenge.givenCode.title}</p>
          <CodeBlock code={challenge.givenCode.code} label={challenge.givenCode.title} />
        </div>
      )}

      {challenge.hints.length > 0 && (
        <div className="flex flex-col gap-2" aria-live="polite">
          {challenge.hints.slice(0, hintsShown).map((h, i) => (
            <p key={i} className="border-warn bg-warn/10 rounded-xl border-2 px-3 py-2">
              <span className="font-semibold">💡 Pista {i + 1}: </span>
              <RichText text={h} />
            </p>
          ))}
          {hintsShown < challenge.hints.length && (
            <Button
              variant="warn"
              className="self-start"
              onClick={() => setHintsShown((n) => n + 1)}
            >
              {challenge.hints.length === 1
                ? 'Ver la pista'
                : `Ver pista ${hintsShown + 1} de ${challenge.hints.length}`}
            </Button>
          )}
        </div>
      )}

      {challenge.extras && (
        <details>
          <summary className="text-accent-strong cursor-pointer font-semibold">
            Extras para ir más allá
          </summary>
          <ul className="mt-1 ml-5 list-disc">
            {challenge.extras.map((e, i) => (
              <li key={i}>
                <RichText text={e} />
              </li>
            ))}
          </ul>
        </details>
      )}

      {solution && (
        <div>
          <Button variant="secondary" onClick={() => setShowSolution((v) => !v)}>
            {showSolution ? 'Ocultar la solución' : 'Ver la solución'}
          </Button>
          {showSolution && (
            <div className="mt-2">
              <CodeBlock code={solution} label={`Solución de ${challenge.title}`} />
            </div>
          )}
        </div>
      )}

      <Button
        variant={optimisticDone ? 'ghost' : 'primary'}
        className="self-start"
        disabled={pending}
        onClick={toggleDone}
      >
        {optimisticDone ? 'Desmarcar' : 'Ya lo hice'}
      </Button>
    </Card>
  );
}
