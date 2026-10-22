'use client';

import { useEffect, useRef, useState } from 'react';
import { StatusIcon, statusLabel } from '@/components/cases/StatusIcon';
import { CASE_IDS } from '@/content/cases';
import { caseDuration } from '@/lib/csv';
import type { AttemptView, ClassroomOverview, PanelStudent } from '@/server/panel';
import { StudentActions } from './StudentActions';

const REFRESH_MS = 15_000;

type ProgressTableProps = { classroomId: string; initial: ClassroomOverview };

export function ProgressTable({ classroomId, initial }: ProgressTableProps) {
  const [data, setData] = useState(initial);
  const [error, setError] = useState(false);
  const [cell, setCell] = useState<{ student: PanelStudent; caseId: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      if (document.visibilityState !== 'visible') return;
      try {
        const res = await fetch(`/api/profe/clase/${classroomId}/overview`, { cache: 'no-store' });
        if (!res.ok) throw new Error();
        const next = (await res.json()) as ClassroomOverview;
        if (!cancelled) {
          setData(next);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }
    const timer = setInterval(refresh, REFRESH_MS);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [classroomId]);

  const updated = new Date(data.generatedAt).toLocaleTimeString('es-CO', {
    timeZone: 'America/Bogota',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-slate-600" aria-live="polite">
        Se actualiza cada 15 s · última vez {updated}
        {error && (
          <span className="text-bad-ink ml-2 font-semibold">(sin conexión, reintentando)</span>
        )}
      </p>

      {data.students.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-slate-300 p-6 text-slate-600">
          Todavía no ha entrado nadie. Comparte la dirección de la página y el código de la clase.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border-2 border-slate-200">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">Progreso por estudiante y caso</caption>
            <thead className="bg-card">
              <tr>
                <th scope="col" className="bg-card sticky left-0 px-3 py-2 text-left">
                  Estudiante
                </th>
                <th scope="col" className="px-2 py-2 text-right">
                  Pts
                </th>
                {CASE_IDS.map((id) => (
                  <th key={id} scope="col" className="px-1 py-2 text-center font-mono">
                    {id}
                  </th>
                ))}
                <th scope="col" className="px-2 py-2">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.students.map((s) => (
                <tr key={s.id} className="border-t border-slate-200">
                  <th
                    scope="row"
                    className="sticky left-0 bg-white px-3 py-2 text-left font-semibold"
                  >
                    {s.displayName}
                    {s.partnerName && (
                      <span className="block text-xs font-normal text-slate-600">
                        con {s.partnerName}
                      </span>
                    )}
                  </th>
                  <td className="text-accent-strong px-2 py-2 text-right font-bold">
                    {s.totalPoints}
                  </td>
                  {CASE_IDS.map((caseId) => {
                    const p = s.items[caseId];
                    const status = p?.status ?? 'not_started';
                    return (
                      <td key={caseId} className="p-0.5 text-center">
                        <button
                          type="button"
                          onClick={() => setCell({ student: s, caseId })}
                          className="hover:bg-card flex min-h-11 w-full min-w-11 flex-col items-center justify-center rounded-lg"
                        >
                          <span className="sr-only">
                            {s.displayName}, caso {caseId}:{' '}
                          </span>
                          <StatusIcon status={status} />
                          {p && status !== 'not_started' && (
                            <span className="text-[10px] leading-tight text-slate-600" aria-hidden>
                              {p.hintsUsed > 0 && `💡${p.hintsUsed} `}
                              {caseDuration(p)}
                            </span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                  <td className="px-2 py-1">
                    <StudentActions student={s} />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-card border-t-2 border-slate-300 text-xs">
              <tr>
                <th scope="row" className="bg-card sticky left-0 px-3 py-2 text-left">
                  Resolvieron
                </th>
                <td />
                {CASE_IDS.map((id) => (
                  <td key={id} className="px-1 py-2 text-center font-bold">
                    {data.totals[id].solvedPct}%
                  </td>
                ))}
                <td />
              </tr>
              <tr>
                <th scope="row" className="bg-card sticky left-0 px-3 py-2 text-left">
                  Pistas (promedio)
                </th>
                <td />
                {CASE_IDS.map((id) => (
                  <td key={id} className="px-1 py-2 text-center">
                    {data.totals[id].started ? data.totals[id].avgHints : '–'}
                  </td>
                ))}
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <p className="text-xs text-slate-600">
        ✅ resuelto · 🟡 en progreso · ⛔ vio la solución · 💡 pistas usadas. Haz clic en una celda
        para ver los intentos.
      </p>

      {cell && (
        <AttemptsDialog
          classroomId={classroomId}
          student={cell.student}
          caseId={cell.caseId}
          onClose={() => setCell(null)}
        />
      )}
    </div>
  );
}

const STEP_LABELS: Record<string, string> = {
  locate: 'Paso 1 · eligió',
  fix: 'Paso 2 · respondió',
  hint: 'Pidió pista',
  give_up: 'Vio la solución',
  quiz: 'Quiz',
  done: 'Marcó “Ya lo hice”',
};

function formatAnswer(answer: unknown): string {
  if (answer && typeof answer === 'object') {
    const a = answer as Record<string, unknown>;
    if (typeof a.value === 'string') {
      return a.value.startsWith('line:') ? `línea ${a.value.slice(5)}` : a.value;
    }
    if (typeof a.hint === 'number') return `pista ${a.hint}`;
  }
  return '';
}

function AttemptsDialog({
  classroomId,
  student,
  caseId,
  onClose,
}: {
  classroomId: string;
  student: PanelStudent;
  caseId: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [attempts, setAttempts] = useState<AttemptView[] | null>(null);

  useEffect(() => {
    ref.current?.showModal();
    const params = new URLSearchParams({ student: student.id, item: caseId });
    fetch(`/api/profe/clase/${classroomId}/attempts?${params}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : []))
      .then(setAttempts)
      .catch(() => setAttempts([]));
  }, [classroomId, student.id, caseId]);

  const p = student.items[caseId];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto w-[min(36rem,calc(100vw-2rem))] rounded-2xl p-0 backdrop:bg-black/40"
    >
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg">
            {student.displayName} · caso {caseId}
          </h2>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className="hover:bg-card rounded-lg px-2 py-1 text-slate-600"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        {p && (
          <p className="text-sm text-slate-600">
            {statusLabel(p.status)} · {p.hintsUsed} pistas · {p.wrongAttempts} intentos fallidos ·{' '}
            {p.points} pts {caseDuration(p) && `· ${caseDuration(p)}`}
          </p>
        )}
        {attempts === null ? (
          <p className="text-slate-600">Cargando…</p>
        ) : attempts.length === 0 ? (
          <p className="text-slate-600">Sin intentos todavía.</p>
        ) : (
          <ol className="flex max-h-[60vh] flex-col gap-1 overflow-y-auto text-sm">
            {attempts.map((a) => (
              <li key={a.id} className="odd:bg-card flex items-baseline gap-2 rounded-lg px-2 py-1">
                <span role="img" aria-label={a.isCorrect ? 'Correcto' : 'Incorrecto'}>
                  {a.step === 'hint'
                    ? '💡'
                    : a.step === 'give_up'
                      ? '⛔'
                      : a.isCorrect
                        ? '✅'
                        : '❌'}
                </span>
                <span className="text-slate-600 tabular-nums">
                  {new Date(a.createdAt).toLocaleTimeString('es-CO', {
                    timeZone: 'America/Bogota',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span>{STEP_LABELS[a.step] ?? a.step}</span>
                <code className="text-ink font-mono break-all">{formatAnswer(a.answer)}</code>
              </li>
            ))}
          </ol>
        )}
      </div>
    </dialog>
  );
}
