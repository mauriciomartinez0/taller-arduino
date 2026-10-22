import type { ReactNode } from 'react';

export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl sm:text-3xl">{title}</h1>
      {children && <div className="mt-2 max-w-prose text-slate-600">{children}</div>}
    </header>
  );
}
