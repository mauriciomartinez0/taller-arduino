import { CodeBlock } from '@/components/code/CodeBlock';
import { ButtonLink, buttonClasses } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { NO_SIMULATOR_NOTICE } from '@/content/cases';
import type { SolutionPayload } from '@/lib/api-types';
import type { ReactNode } from 'react';

type SolutionCardProps = {
  solution: SolutionPayload;
  status: 'solved' | 'gave_up' | 'preview';
  points: number;
  note?: string;
  hasWokwi: boolean;
  wokwiUrl?: string | null;
  nextCaseId?: string;
  /** Rendered corrected circuit (A cases). */
  fixedDiagram?: ReactNode;
};

const headline = {
  solved: '¡Lo resolviste!',
  gave_up: 'Esta es la solución',
  preview: 'Solución (el profe la dejó visible)',
};

export function SolutionCard({
  solution,
  status,
  points,
  note,
  hasWokwi,
  wokwiUrl,
  nextCaseId,
  fixedDiagram,
}: SolutionCardProps) {
  return (
    <section aria-labelledby="solution-title" className="flex flex-col gap-4">
      <Card tone={status === 'solved' ? 'ok' : 'accent'} className="animate-pop">
        <h2 id="solution-title" className="flex flex-wrap items-baseline gap-x-3 text-xl">
          {headline[status]}
          {status !== 'preview' && (
            <span className={status === 'solved' ? 'text-ok-ink' : 'text-slate-600'}>
              {status === 'solved' ? `+${points} puntos` : '0 puntos'}
            </span>
          )}
        </h2>
        {(note || solution.solvedNote) && status === 'solved' && (
          <ul className="text-ok-ink mt-2 flex flex-col gap-1 font-semibold">
            {note && <li>{note}</li>}
            {solution.solvedNote && <li>{solution.solvedNote}</li>}
          </ul>
        )}
        <h3 className="mt-4 text-base">Por qué pasaba</h3>
        <p className="mt-1">{solution.explanation}</p>
      </Card>

      {solution.fixedCode && (
        <div>
          <h3 className="mb-2 text-base">Versión corregida</h3>
          <CodeBlock code={solution.fixedCode} label="Código corregido" />
        </div>
      )}
      {fixedDiagram && (
        <div>
          <h3 className="mb-2 text-base">Circuito corregido</h3>
          {fixedDiagram}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {hasWokwi && wokwiUrl && (
          <a
            href={wokwiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses('secondary')}
          >
            Probar en Wokwi <span aria-hidden>↗</span>
          </a>
        )}
        {!hasWokwi && <p className="text-sm text-slate-600">{NO_SIMULATOR_NOTICE}</p>}
        {nextCaseId ? (
          <ButtonLink href={`/casos/${nextCaseId}`} className="ml-auto">
            Siguiente caso <span aria-hidden>→</span>
          </ButtonLink>
        ) : (
          <ButtonLink href="/casos" className="ml-auto">
            Volver a los casos
          </ButtonLink>
        )}
      </div>
    </section>
  );
}
