'use client';

import { useState, useTransition } from 'react';
import {
  deleteStudent,
  regeneratePin,
  resetStudentProgress,
  revealPin,
} from '@/server/actions/teacher';
import type { PanelStudent } from '@/server/panel';

export function StudentActions({ student }: { student: Pick<PanelStudent, 'id' | 'displayName'> }) {
  const [pin, setPin] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<void>) => startTransition(fn);

  return (
    <details className="relative">
      <summary className="hover:bg-card flex min-h-11 cursor-pointer list-none items-center rounded-lg px-2 text-slate-600">
        <span aria-hidden>⋯</span>
        <span className="sr-only">Acciones para {student.displayName}</span>
      </summary>
      <div className="absolute right-0 z-10 mt-1 flex w-56 flex-col gap-1 rounded-xl border-2 border-slate-200 bg-white p-2 text-left shadow-lg">
        <p className="px-2 py-1 text-xs text-slate-600">
          PIN: <span className="text-ink font-mono text-base font-bold">{pin ?? '••••'}</span>
        </p>
        <button
          type="button"
          disabled={pending}
          className="hover:bg-card rounded-lg px-2 py-2 text-left"
          onClick={() => run(async () => setPin(await revealPin(student.id)))}
        >
          Ver PIN
        </button>
        <button
          type="button"
          disabled={pending}
          className="hover:bg-card rounded-lg px-2 py-2 text-left"
          onClick={() => {
            if (
              confirm(
                `¿Generar un PIN nuevo para ${student.displayName}? El anterior deja de servir.`,
              )
            ) {
              run(async () => setPin(await regeneratePin(student.id)));
            }
          }}
        >
          Generar PIN nuevo
        </button>
        <button
          type="button"
          disabled={pending}
          className="hover:bg-card rounded-lg px-2 py-2 text-left"
          onClick={() => {
            if (
              confirm(`¿Borrar todo el progreso de ${student.displayName}? No se puede deshacer.`)
            ) {
              run(() => resetStudentProgress(student.id));
            }
          }}
        >
          Reiniciar progreso
        </button>
        <button
          type="button"
          disabled={pending}
          className="text-bad-ink hover:bg-bad/10 rounded-lg px-2 py-2 text-left"
          onClick={() => {
            if (
              confirm(`¿Borrar a ${student.displayName} y todo su progreso? No se puede deshacer.`)
            ) {
              run(() => deleteStudent(student.id));
            }
          }}
        >
          Borrar estudiante
        </button>
      </div>
    </details>
  );
}
