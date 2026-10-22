'use client';

import { useEffect, useState } from 'react';
import { CASE_GROUPS, cases } from '@/content/cases';
import type { ClassroomOverview } from '@/server/panel';

const REFRESH_MS = 15_000;

/** Class-wide progress per case for the projector: no student names. */
export function ProjectorView({
  classroomId,
  initial,
}: {
  classroomId: string;
  initial: ClassroomOverview;
}) {
  const [data, setData] = useState(initial);

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/profe/clase/${classroomId}/overview`, { cache: 'no-store' });
        if (res.ok) setData((await res.json()) as ClassroomOverview);
      } catch {
        // Keep the last numbers on screen.
      }
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, [classroomId]);

  const total = data.students.length;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xl text-slate-600">
        {total === 1 ? '1 pareja conectada' : `${total} parejas conectadas`}
      </p>
      <div className="grid gap-8 lg:grid-cols-3">
        {(['A', 'B', 'C'] as const).map((group) => (
          <section key={group} aria-labelledby={`p-${group}`}>
            <h2 id={`p-${group}`} className="mb-4 text-2xl">
              {group} · {CASE_GROUPS[group].title}
            </h2>
            <ul className="flex flex-col gap-4">
              {cases
                .filter((c) => c.group === group)
                .map((c) => {
                  const pct = data.totals[c.id].solvedPct;
                  return (
                    <li key={c.id} className="flex items-center gap-4">
                      <span className="text-ink w-12 font-mono text-2xl font-bold">{c.id}</span>
                      <div
                        className="h-9 flex-1 overflow-hidden rounded-full bg-slate-200"
                        role="progressbar"
                        aria-label={`Caso ${c.id}`}
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="bg-ok h-full rounded-full transition-[width] duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-20 text-right text-2xl font-bold tabular-nums">
                        {pct}%
                      </span>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
