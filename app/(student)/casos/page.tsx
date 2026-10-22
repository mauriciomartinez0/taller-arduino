import type { Metadata } from 'next';
import { CaseList } from '@/components/cases/CaseList';
import { PageHeader } from '@/components/ui/PageHeader';
import { getCaseSettings, getProgressMap } from '@/server/progress';
import { requireStudentPage } from '@/server/student-session';

export const metadata: Metadata = { title: 'Casos' };

export default async function CasesPage() {
  const { student, classroom } = await requireStudentPage();
  const [progress, settings] = await Promise.all([
    getProgressMap(student.id),
    getCaseSettings(classroom.id),
  ]);
  const openCases = Object.fromEntries(Object.entries(settings).map(([id, s]) => [id, s.isOpen]));

  return (
    <>
      <PageHeader title="Casos de errores">
        Cada caso tiene dos pasos: encontrar dónde está el error y corregirlo. Vale 10 puntos: cada
        pista resta 2 y cada intento fallido resta 1.
      </PageHeader>
      <CaseList progress={progress} openCases={openCases} />
    </>
  );
}
