'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { leaveClass } from '@/server/actions/student';

const links = [
  { href: '/casos', label: 'Casos' },
  { href: '/repaso', label: 'Repaso' },
  { href: '/retos', label: 'Retos' },
] as const;

type TopBarProps = {
  student: { displayName: string; partnerName: string | null; points: number };
};

export function TopBar({ student }: TopBarProps) {
  const pathname = usePathname();

  return (
    <header className="border-accent border-b-2 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/casos" className="text-ink text-lg font-extrabold">
          Taller de Arduino
        </Link>
        <nav aria-label="Principal" className="flex gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 font-semibold ${
                  active ? 'bg-card text-ink' : 'hover:text-ink text-slate-600'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <span className="text-right leading-tight">
            <span className="text-ink block font-semibold">{student.displayName}</span>
            {student.partnerName && (
              <span className="block text-xs text-slate-500">con {student.partnerName}</span>
            )}
          </span>
          <span className="bg-card text-accent-strong rounded-full px-3 py-1 font-bold">
            {student.points} pts
          </span>
          <form action={leaveClass}>
            <button
              type="submit"
              className="hover:text-ink rounded-lg px-2 py-1.5 text-slate-600 underline-offset-2 hover:underline"
            >
              Salir / No soy yo
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
