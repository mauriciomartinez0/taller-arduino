import Link from 'next/link';
import { CASE_GROUPS, cases, type CaseGroup } from '@/content/cases';
import { initialProgress, type CaseProgress } from '@/lib/case-progress';
import { StatusIcon } from './StatusIcon';

const groupOrder: CaseGroup[] = ['A', 'B', 'C'];

type CaseListProps = {
  progress: Record<string, CaseProgress>;
  openCases: Record<string, boolean>;
};

export function CaseList({ progress, openCases }: CaseListProps) {
  return (
    <div className="flex flex-col gap-8">
      {groupOrder.map((group) => (
        <section key={group} aria-labelledby={`group-${group}`}>
          <h2 id={`group-${group}`} className="text-xl">
            {group} · {CASE_GROUPS[group].title}
          </h2>
          <p className="mt-1 text-slate-600">{CASE_GROUPS[group].description}</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cases
              .filter((c) => c.group === group)
              .map((c) => {
                const p = progress[c.id] ?? initialProgress;
                const open = openCases[c.id] ?? true;
                const content = (
                  <>
                    <span
                      className={`rounded-lg px-2 py-1 font-mono text-sm font-bold text-white ${open ? 'bg-ink' : 'bg-slate-400'}`}
                    >
                      {c.id}
                    </span>
                    <span className="flex-1">
                      <span className="text-ink block font-semibold">{c.title}</span>
                      <span className="text-sm text-slate-600">
                        {open ? c.typeLabel : 'Todavía no está abierto'}
                      </span>
                    </span>
                    <span className="flex flex-col items-end gap-1 text-sm">
                      {open ? (
                        <StatusIcon status={p.status} />
                      ) : (
                        <span role="img" aria-label="Cerrado">
                          🔒
                        </span>
                      )}
                      {p.status === 'solved' && (
                        <span className="text-ok-ink font-semibold">{p.points} pts</span>
                      )}
                    </span>
                  </>
                );
                return (
                  <li key={c.id}>
                    {open ? (
                      <Link
                        href={`/casos/${c.id}`}
                        className="hover:border-accent hover:bg-card flex h-full items-start gap-3 rounded-2xl border-2 border-slate-200 bg-white p-4 transition-colors"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div className="flex h-full items-start gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 opacity-80">
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </div>
  );
}
