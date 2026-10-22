import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ActionForm } from '@/components/profe/forms';
import { inputClass } from '@/components/profe/styles';
import { TeacherHeader } from '@/components/profe/TeacherHeader';
import { Card } from '@/components/ui/Card';
import { login } from '@/server/actions/teacher';
import { getTeacher } from '@/server/teacher-session';

export const metadata: Metadata = { title: 'Entrar como profe' };

export default async function TeacherLoginPage() {
  if (await getTeacher()) redirect('/profe');

  return (
    <>
      <TeacherHeader />
      <main className="mx-auto flex max-w-md flex-col px-4 py-12">
        <Card tone="accent">
          <h1 className="mb-4 text-2xl">Entrar como profe</h1>
          <ActionForm action={login} submitLabel="Entrar" pendingLabel="Entrando…">
            <label className="block">
              <span className="font-semibold">Correo</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="username"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="font-semibold">Contraseña</span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className={inputClass}
              />
            </label>
          </ActionForm>
        </Card>
      </main>
    </>
  );
}
