import Link from 'next/link';
import type { ReactNode } from 'react';

export function TeacherHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="bg-ink text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/profe" className="text-lg font-extrabold">
          Taller de Arduino
        </Link>
        <span className="rounded-full bg-white/15 px-3 py-0.5 text-sm">Panel del profe</span>
        {children && <div className="ml-auto flex items-center gap-3 text-sm">{children}</div>}
      </div>
    </header>
  );
}
