'use client';

import { useState, useTransition } from 'react';
import { cases } from '@/content/cases';
import { setCaseSetting } from '@/server/actions/teacher';
import { Toggle } from './Toggle';

type Settings = Record<string, { isOpen: boolean; wokwiUrl: string | null }>;

export function CaseSettingsEditor({
  classroomId,
  settings,
}: {
  classroomId: string;
  settings: Settings;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border-2 border-slate-200">
      <table className="w-full text-sm">
        <caption className="sr-only">Configuración de los casos</caption>
        <thead className="bg-card text-left">
          <tr>
            <th scope="col" className="px-3 py-2">
              Caso
            </th>
            <th scope="col" className="px-3 py-2">
              Abierto hoy
            </th>
            <th scope="col" className="px-3 py-2">
              Enlace de Wokwi
            </th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => {
            const s = settings[c.id] ?? { isOpen: true, wokwiUrl: null };
            return (
              <tr key={c.id} className="border-t border-slate-200 align-middle">
                <th scope="row" className="px-3 py-1 text-left font-normal">
                  <span className="font-mono font-bold">{c.id}</span> {c.title}
                </th>
                <td className="px-3 py-1">
                  <Toggle
                    label={`Caso ${c.id} abierto hoy`}
                    hideLabel
                    checked={s.isOpen}
                    onChange={(isOpen) => setCaseSetting(classroomId, c.id, { isOpen })}
                  />
                </td>
                <td className="px-3 py-1">
                  {c.hasWokwi ? (
                    <WokwiField
                      classroomId={classroomId}
                      caseId={c.id}
                      initial={s.wokwiUrl ?? ''}
                    />
                  ) : (
                    <span className="text-slate-600">No aplica: no se puede simular.</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function WokwiField({
  classroomId,
  caseId,
  initial,
}: {
  classroomId: string;
  caseId: string;
  initial: string;
}) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const save = () => {
    if (value.trim() === saved) return;
    startTransition(async () => {
      const result = await setCaseSetting(classroomId, caseId, { wokwiUrl: value });
      const ok = result.status === 'ok';
      if (ok) setSaved(value.trim());
      setMessage({ ok, text: result.message ?? '' });
    });
  };

  return (
    <div className="flex min-w-72 items-center gap-2">
      <input
        type="url"
        inputMode="url"
        value={value}
        placeholder="https://wokwi.com/projects/…"
        aria-label={`Enlace de Wokwi del caso ${caseId}`}
        onChange={(e) => {
          setValue(e.target.value);
          setMessage(null);
        }}
        onBlur={save}
        onKeyDown={(e) => e.key === 'Enter' && save()}
        className="focus:border-accent-strong w-full rounded-lg border-2 border-slate-300 px-2 py-1.5 font-mono text-xs focus:outline-none"
      />
      <span aria-live="polite" className="w-20 shrink-0 text-xs font-semibold">
        {pending
          ? 'Guardando…'
          : message && (
              <span className={message.ok ? 'text-ok-ink' : 'text-bad-ink'} title={message.text}>
                {message.ok ? '✅ Guardado' : `❌ ${message.text}`}
              </span>
            )}
      </span>
    </div>
  );
}
