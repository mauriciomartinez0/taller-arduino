import type { Metadata } from 'next';
import { ProjectorView } from '@/components/profe/ProjectorView';
import { getClassroomOverview } from '@/server/panel';
import { requireOwnedClassroomPage } from '@/server/teacher-session';

export const metadata: Metadata = { title: 'Avance de la clase' };

/** For the projector: big numbers, no names and no teacher email. */
export default async function ProjectorPage({ params }: PageProps<'/profe/proyectar/[id]'>) {
  const { classroom } = await requireOwnedClassroomPage((await params).id);
  const overview = await getClassroomOverview(classroom.id);

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <header className="mb-6 flex flex-wrap items-baseline gap-4">
        <h1 className="text-4xl">¿Cómo vamos?</h1>
        <span className="text-xl text-slate-600">
          Clase {classroom.name} · código{' '}
          <span className="text-ink font-mono font-bold">{classroom.joinCode}</span>
        </span>
      </header>
      <ProjectorView classroomId={classroom.id} initial={overview} />
    </main>
  );
}
