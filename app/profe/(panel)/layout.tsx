import Link from 'next/link';
import { TeacherHeader } from '@/components/profe/TeacherHeader';
import { logout } from '@/server/actions/teacher';
import { requireTeacherPage } from '@/server/teacher-session';

export default async function PanelLayout({ children }: LayoutProps<'/profe'>) {
  const teacher = await requireTeacherPage();

  return (
    <>
      <TeacherHeader>
        <span className="hidden opacity-80 sm:inline">{teacher.email}</span>
        <Link href="/profe/cuenta" className="underline-offset-2 hover:underline">
          Cambiar mi contraseña
        </Link>
        <form action={logout}>
          <button type="submit" className="rounded-lg bg-white/15 px-3 py-1.5 hover:bg-white/25">
            Salir
          </button>
        </form>
      </TeacherHeader>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">{children}</main>
    </>
  );
}
