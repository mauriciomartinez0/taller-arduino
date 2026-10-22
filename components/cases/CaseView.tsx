'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CircuitDiagram, type Scene } from '@/components/circuit/CircuitDiagram';
import { CodeBlock, CompilerOutput, type LineState } from '@/components/code/CodeBlock';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RichText } from '@/components/ui/RichText';
import { lineTarget, type Case, type ChoiceOption } from '@/content/cases';
import type { ApiError, CheckResponse, SolutionPayload } from '@/lib/api-types';
import { currentStep, isFinished, type CaseProgress, type CaseStep } from '@/lib/case-progress';
import { canGiveUp, CASE_MAX_POINTS } from '@/lib/points';
import { SituationCards } from './SituationCards';
import { SolutionCard } from './SolutionCard';

type Feedback = { tone: 'ok' | 'bad'; text: string };

type CaseViewProps = {
  caseData: Case;
  initialProgress: CaseProgress;
  /** Present when the case is finished or the teacher made solutions visible. */
  initialSolution?: SolutionPayload;
  nextCaseId?: string;
  wokwiUrl?: string | null;
  /** Choice options, already shuffled on the server. */
  options?: ChoiceOption[];
  /** Diagram for circuit cases (built on the server). */
  scene?: Scene;
};

async function postJson<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = (await res.json().catch(() => null)) as T | ApiError | null;
  if (!res.ok || !data) {
    throw new Error((data as ApiError | null)?.error ?? 'No pudimos revisar tu respuesta.');
  }
  return data as T;
}

export function CaseView({
  caseData,
  initialProgress,
  initialSolution,
  nextCaseId,
  wokwiUrl,
  options,
  scene,
}: CaseViewProps) {
  const router = useRouter();
  const [stored, setStored] = useState(initialProgress);
  const [solution, setSolution] = useState(initialSolution);
  const step = currentStep(stored);

  const [selected, setSelected] = useState<string | null>(null);
  const [wrongTargets, setWrongTargets] = useState<string[]>([]);
  const [found, setFound] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [note, setNote] = useState<string | undefined>();
  const [pending, setPending] = useState(false);
  const [wrongOptions, setWrongOptions] = useState<string[]>([]);
  const fix = caseData.fix;
  const [lineText, setLineText] = useState(() =>
    fix.type === 'editLine' && fix.mode === 'replace'
      ? (caseData.code?.split('\n')[fix.line - 1] ?? '')
      : '  ',
  );
  const fixInput = useRef<HTMLInputElement>(null);

  // Start the timer when the case is first opened.
  useEffect(() => {
    if (initialProgress.status !== 'not_started') return;
    postJson<CaseProgress>(`/api/cases/${caseData.id}/open`)
      .then(setStored)
      .catch(() => {});
  }, [caseData.id, initialProgress.status]);

  useEffect(() => {
    if (step === 'fix') fixInput.current?.focus();
  }, [step]);

  function applyResult(result: CheckResponse) {
    if (result.progress) setStored(result.progress);
    if (result.solution) setSolution(result.solution);
    // Refresh server components (points in the top bar).
    if (result.progress && isFinished(result.progress)) router.refresh();
  }

  async function submit(stepName: CaseStep, answer: string) {
    setPending(true);
    setFeedback(null);
    try {
      const result = await postJson<CheckResponse>(`/api/cases/${caseData.id}/check`, {
        step: stepName,
        answer,
      });
      applyResult(result);
      setFeedback({ tone: result.correct ? 'ok' : 'bad', text: result.feedback });
      setNote(result.note);
      return result.correct;
    } catch (error) {
      setFeedback({ tone: 'bad', text: (error as Error).message });
      return false;
    } finally {
      setPending(false);
    }
  }

  async function onLocate() {
    if (!selected) return;
    const correct = await submit('locate', selected);
    if (correct) setFound(selected);
    else setWrongTargets((t) => [...t, selected]);
  }

  async function onFix(answer: string) {
    const correct = await submit('fix', answer);
    if (!correct && fix.type === 'choice') setWrongOptions((o) => [...o, answer]);
  }

  async function onHint() {
    try {
      setStored(await postJson<CaseProgress>(`/api/cases/${caseData.id}/hint`));
    } catch (error) {
      setFeedback({ tone: 'bad', text: (error as Error).message });
    }
  }

  async function onGiveUp() {
    setPending(true);
    try {
      applyResult(await postJson<CheckResponse>(`/api/cases/${caseData.id}/solution`));
      setFeedback(null);
    } catch (error) {
      setFeedback({ tone: 'bad', text: (error as Error).message });
    } finally {
      setPending(false);
    }
  }

  // Visual state of code lines / circuit elements.
  const targetStates: Record<string, LineState> = {};
  if (step === 'locate') {
    for (const t of wrongTargets) targetStates[t] = 'wrong';
    if (selected) targetStates[selected] = 'selected';
  } else if (step === 'fix' && found) {
    targetStates[found] = 'correct';
  }
  const lineStates: Record<number, LineState> = {};
  for (const [target, state] of Object.entries(targetStates)) {
    if (target.startsWith('line:')) lineStates[Number(target.slice(5))] = state;
  }
  if (fix.type === 'editLine' && step === 'fix') {
    lineStates[fix.line] = 'correct';
  }

  const codeClickable = caseData.kind === 'code' || caseData.codeClickable;
  const onSelectLine =
    step === 'locate' && codeClickable && !pending
      ? (line: number) => setSelected(lineTarget(line))
      : undefined;

  const editing = step === 'fix' && fix.type === 'editLine';
  const lineInput = editing ? (
    <form
      className="inline"
      onSubmit={(e) => {
        e.preventDefault();
        void onFix(lineText);
      }}
    >
      <label htmlFor="fix-line" className="sr-only">
        Escribe la línea corregida
      </label>
      <input
        id="fix-line"
        ref={fixInput}
        value={lineText}
        onChange={(e) => setLineText(e.target.value)}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        maxLength={200}
        className="text-syn-text ring-syn-keyword w-full min-w-72 rounded bg-white/10 px-1 font-mono ring-2 outline-none"
      />
    </form>
  ) : null;

  const finished = isFinished(stored);

  return (
    <div className="flex flex-col gap-6">
      <SituationCards
        expected={caseData.expected}
        actual={caseData.actual}
        hints={caseData.hints}
        hintsUsed={stored.hintsUsed}
        canAskHint={!finished}
        onHint={onHint}
      />

      {!finished && (
        <StepHeader
          step={step ?? 'locate'}
          caseData={caseData}
          hintsUsed={stored.hintsUsed}
          wrong={stored.wrongAttempts}
        />
      )}

      <div
        className={caseData.kind === 'circuit' && caseData.code ? 'grid gap-4 lg:grid-cols-2' : ''}
      >
        {caseData.kind === 'circuit' && scene && (
          <CircuitDiagram
            scene={scene}
            label={`Circuito del caso ${caseData.id}`}
            states={targetStates}
            labels={Object.fromEntries(caseData.targets.map((t) => [t.id, t.label]))}
            onSelect={step === 'locate' && !pending ? setSelected : undefined}
          />
        )}
        {caseData.code && (
          <div className="flex flex-col gap-3">
            {caseData.kind === 'circuit' && <h2 className="text-base">Código</h2>}
            <CodeBlock
              code={caseData.code}
              onLineClick={onSelectLine}
              lineStates={lineStates}
              replaceLine={
                editing && fix.mode === 'replace' ? { line: fix.line, node: lineInput } : undefined
              }
              insertAfter={
                editing && fix.mode === 'insertAfter'
                  ? { line: fix.line, node: lineInput }
                  : undefined
              }
            />
            {caseData.kind === 'code' && caseData.compilerOutput && (
              <CompilerOutput output={caseData.compilerOutput} />
            )}
          </div>
        )}
      </div>

      {!finished && (
        <div className="flex flex-col gap-4">
          {step === 'locate' && (
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={onLocate} disabled={!selected || pending}>
                Revisar
              </Button>
              {!selected && (
                <span className="text-sm text-slate-600">
                  {caseData.kind === 'code'
                    ? 'Primero elige una línea.'
                    : 'Primero elige una parte.'}
                </span>
              )}
            </div>
          )}

          {editing && (
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => onFix(lineText)} disabled={pending}>
                Comprobar
              </Button>
              <span className="text-sm text-slate-600">
                {fix.mode === 'insertAfter'
                  ? `Escribe la línea que falta después de la línea ${fix.line}.`
                  : `Corrige la línea ${fix.line} directamente en el código.`}
              </span>
            </div>
          )}

          {step === 'fix' && fix.type === 'choice' && (
            <ChoiceList
              options={options ?? fix.options}
              wrong={wrongOptions}
              disabled={pending}
              onPick={(id) => onFix(id)}
            />
          )}

          <FeedbackMessage feedback={feedback} />

          {canGiveUp(stored.wrongAttempts) && (
            <Card tone="neutral" className="flex flex-wrap items-center gap-3">
              <p className="flex-1">
                Ya llevas {stored.wrongAttempts} intentos. Puedes seguir intentando o ver la
                solución (el caso queda con 0 puntos).
              </p>
              <Button variant="secondary" onClick={onGiveUp} disabled={pending}>
                Ver la solución
              </Button>
            </Card>
          )}
        </div>
      )}

      {solution && (
        <SolutionCard
          solution={solution}
          status={!finished ? 'preview' : stored.status === 'solved' ? 'solved' : 'gave_up'}
          points={stored.points}
          note={note}
          hasWokwi={caseData.hasWokwi}
          wokwiUrl={wokwiUrl}
          nextCaseId={nextCaseId}
          fixedDiagram={
            solution.fixedScene && (
              <CircuitDiagram
                scene={solution.fixedScene}
                label={`Circuito corregido del caso ${caseData.id}`}
              />
            )
          }
        />
      )}
    </div>
  );
}

function StepHeader({
  step,
  caseData,
  hintsUsed,
  wrong,
}: {
  step: CaseStep;
  caseData: Case;
  hintsUsed: number;
  wrong: number;
}) {
  const prompt =
    step === 'locate'
      ? caseData.kind === 'code'
        ? (caseData.locatePrompt ?? '¿En qué línea está el error?') +
          ' Haz clic en la línea y presiona “Revisar”.'
        : '¿Dónde está el error? Haz clic en la parte del circuito' +
          (caseData.codeClickable ? ' o en la línea del código' : '') +
          ' y presiona “Revisar”.'
      : caseData.fix.type === 'choice'
        ? '¿Cómo lo corriges? Elige una opción.'
        : 'Escribe la línea corregida y presiona “Comprobar”.';

  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <p className="text-accent-strong text-sm font-semibold tracking-wide uppercase">
          Paso {step === 'locate' ? 1 : 2} de 2 ·{' '}
          {step === 'locate' ? 'Encontrar el error' : 'Corregirlo'}
        </p>
        <p className="text-ink mt-1 text-lg font-semibold">{prompt}</p>
      </div>
      <p className="text-sm text-slate-600">
        Vale {CASE_MAX_POINTS} pts · pistas usadas: {hintsUsed} · intentos fallidos: {wrong}
      </p>
    </div>
  );
}

function ChoiceList({
  options,
  wrong,
  disabled,
  onPick,
}: {
  options: ChoiceOption[];
  wrong: string[];
  disabled: boolean;
  onPick: (id: string) => void;
}) {
  return (
    <ul className="grid gap-3 md:grid-cols-2" aria-label="Opciones">
      {options.map((o) => {
        const isWrong = wrong.includes(o.id);
        return (
          <li key={o.id}>
            <button
              type="button"
              disabled={disabled || isWrong}
              onClick={() => onPick(o.id)}
              className={`flex h-full w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
                isWrong
                  ? 'border-bad/50 bg-bad/5 cursor-not-allowed text-slate-600'
                  : 'hover:border-accent hover:bg-card border-slate-200 bg-white'
              }`}
            >
              {isWrong && (
                <span role="img" aria-label="Incorrecta">
                  ❌
                </span>
              )}
              <span>
                <RichText text={o.text} />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function FeedbackMessage({ feedback }: { feedback: Feedback | null }) {
  return (
    <div aria-live="polite" role="status">
      {feedback && (
        <p
          className={`animate-pop flex items-center gap-2 rounded-xl px-4 py-3 font-semibold ${
            feedback.tone === 'ok' ? 'bg-ok/10 text-ok-ink' : 'bg-bad/10 text-bad-ink'
          }`}
        >
          <span aria-hidden>{feedback.tone === 'ok' ? '✅' : '❌'}</span>
          {feedback.text}
        </p>
      )}
    </div>
  );
}
