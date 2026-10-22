import type { Metadata } from 'next';
import Link from 'next/link';
import { CaseSettingsEditor } from '@/components/profe/CaseSettingsEditor';
import { ClassroomFlags } from '@/components/profe/ClassroomFlags';
import { ActionForm } from '@/components/profe/forms';
import { inputClass } from '@/components/profe/styles';
import { ProgressTable } from '@/components/profe/ProgressTable';
import { buttonClasses } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { updateClassroom } from '@/server/actions/teacher';
import { getClassroomOverview } from '@/server/panel';
import { getCaseSettings } from '@/server/progress';
import { requireOwnedClassroomPage } from '@/server/teacher-session';

export const metadata: Metadata = { title: 'Clase' };

export default async function ClassroomPage({ params }: PageProps<'/profe/clase/[id]'>) {
  const { classroom } = await requireOwnedClassroomPage((await params).id);
  const [overview, settings] = await Promise.all([
    getClassroomOverview(classroom.id),
    getCaseSettings(classroom.id),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <Link href="/profe" className="text-accent-strong text-sm font-semibold hover:underline">
          ← Mis clases
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl">{classroom.name}</h1>
          <span className="bg-ink rounded-lg px-2 py-1 font-mono font-bold text-white">
            {classroom.joinCode}
          </span>
          <a
            href={`/api/profe/clase/${classroom.id}/csv`}
            className={buttonClasses('secondary', 'ml-auto')}
          >
            Exportar a CSV
          </a>
        </div>
        <ClassroomFlags
          classroomId={classroom.id}
          isActive={classroom.isActive}
          solutionsVisible={classroom.solutionsVisible}
        />
      </header>

      <section aria-labelledby="progress-title">
        <h2 id="progress-title" className="mb-2 text-xl">
          Progreso
        </h2>
        <ProgressTable key={overview.generatedAt} classroomId={classroom.id} initial={overview} />
      </section>

      <section aria-labelledby="cases-title">
        <h2 id="cases-title" className="mb-2 text-xl">
          Casos
        </h2>
        <p className="mb-3 text-sm text-slate-600">
          Decide qué casos se ven hoy y pega el enlace de Wokwi de cada uno. Se guarda al salir del
          campo.
        </p>
        <CaseSettingsEditor classroomId={classroom.id} settings={settings} />
      </section>

      <section aria-labelledby="edit-title" className="max-w-xl">
        <h2 id="edit-title" className="mb-2 text-xl">
          Nombre y código
        </h2>
        <Card>
          <ActionForm action={updateClassroom} submitLabel="Guardar cambios">
            <input type="hidden" name="classroomId" value={classroom.id} />
            <label className="block">
              <span className="font-semibold">Nombre</span>
              <input name="name" required defaultValue={classroom.name} className={inputClass} />
            </label>
            <label className="block">
              <span className="font-semibold">Código</span>
              <input
                name="joinCode"
                required
                defaultValue={classroom.joinCode}
                className={`${inputClass} font-mono uppercase`}
              />
            </label>
          </ActionForm>
        </Card>
      </section>
    </div>
  );
}
