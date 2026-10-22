import { count, desc, eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ClassroomFlags } from '@/components/profe/ClassroomFlags';
import { ActionForm } from '@/components/profe/forms';
import { inputClass } from '@/components/profe/styles';
import { Card } from '@/components/ui/Card';
import { db } from '@/db';
import { classrooms, students } from '@/db/schema';
import { createClassroom } from '@/server/actions/teacher';
import { requireTeacherPage } from '@/server/teacher-session';

export const metadata: Metadata = { title: 'Mis clases' };

export default async function TeacherHomePage() {
  const teacher = await requireTeacherPage();
  const rows = await db
    .select({ classroom: classrooms, students: count(students.id) })
    .from(classrooms)
    .leftJoin(students, eq(students.classroomId, classrooms.id))
    .where(eq(classrooms.teacherId, teacher.id))
    .groupBy(classrooms.id)
    .orderBy(desc(classrooms.createdAt));

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-2xl sm:text-3xl">Mis clases</h1>
        {rows.length === 0 ? (
          <p className="mt-3 text-slate-600">
            Todavía no tienes clases. Crea la primera aquí abajo y comparte el código con tus
            estudiantes.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {rows.map(({ classroom, students: n }) => (
              <li key={classroom.id}>
                <Card
                  tone={classroom.isActive ? 'accent' : 'neutral'}
                  className="flex flex-col gap-3"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-xl">
                      <Link href={`/profe/clase/${classroom.id}`} className="hover:underline">
                        {classroom.name}
                      </Link>
                    </h2>
                    <span className="bg-ink rounded-lg px-2 py-1 font-mono text-sm font-bold text-white">
                      {classroom.joinCode}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {n === 1 ? '1 estudiante' : `${n} estudiantes`}
                    {!classroom.isActive && ' · clase cerrada'}
                  </p>
                  <ClassroomFlags
                    classroomId={classroom.id}
                    isActive={classroom.isActive}
                    solutionsVisible={classroom.solutionsVisible}
                  />
                  <Link
                    href={`/profe/clase/${classroom.id}`}
                    className="text-accent-strong font-semibold hover:underline"
                  >
                    Ver progreso y configurar casos →
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="max-w-xl">
        <h2 className="text-xl">Crear una clase</h2>
        <Card className="mt-3">
          <ActionForm action={createClassroom} submitLabel="Crear clase" pendingLabel="Creando…">
            <label className="block">
              <span className="font-semibold">Nombre</span>
              <input
                name="name"
                required
                maxLength={60}
                placeholder="7°B 2026"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="font-semibold">Código</span>
              <span className="block text-sm text-slate-600">
                Déjalo vacío para generarlo automáticamente. Puedes cambiarlo después.
              </span>
              <input
                name="joinCode"
                maxLength={20}
                placeholder="ARD-7B"
                className={`${inputClass} font-mono uppercase`}
              />
            </label>
            {rows.length > 0 && (
              <p className="text-sm text-slate-600">
                Los enlaces de Wokwi se copian de tu clase más reciente.
              </p>
            )}
          </ActionForm>
        </Card>
      </section>
    </div>
  );
}
