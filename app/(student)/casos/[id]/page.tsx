import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CaseView } from '@/components/cases/CaseView';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CASE_IDS, getCase } from '@/content/cases';
import { isFinished } from '@/lib/case-progress';
import { shuffle } from '@/lib/shuffle';
import { getScene } from '@/server/circuits';
import { DEFAULT_CASE_SETTING, getCaseSettings, getItemProgress } from '@/server/progress';
import { getSolution } from '@/server/solution';
import { requireStudentPage } from '@/server/student-session';

export async function generateMetadata({ params }: PageProps<'/casos/[id]'>): Promise<Metadata> {
  const c = getCase((await params).id);
  return { title: c ? `Caso ${c.id}` : 'Caso' };
}

export default async function CasePage({ params }: PageProps<'/casos/[id]'>) {
  const caseData = getCase((await params).id);
  if (!caseData) notFound();

  const { student, classroom } = await requireStudentPage();
  const [settings, progress] = await Promise.all([
    getCaseSettings(classroom.id),
    getItemProgress(student.id, caseData.id),
  ]);
  const setting = settings[caseData.id] ?? DEFAULT_CASE_SETTING;

  // Next open case, in order.
  const nextCaseId = CASE_IDS.slice(CASE_IDS.indexOf(caseData.id) + 1).find(
    (id) => (settings[id] ?? DEFAULT_CASE_SETTING).isOpen,
  );

  const header = (
    <header className="mb-6">
      <p className="text-sm font-semibold text-slate-600">
        Caso {caseData.id} · {caseData.typeLabel}
      </p>
      <h1 className="mt-1 text-2xl sm:text-3xl">{caseData.title}</h1>
    </header>
  );

  if (!setting.isOpen) {
    return (
      <article>
        {header}
        <Card tone="accent" className="flex flex-wrap items-center gap-4">
          <p className="flex-1">Este caso todavía no está abierto. El profe lo abrirá pronto.</p>
          <ButtonLink href="/casos" variant="secondary">
            Volver a los casos
          </ButtonLink>
        </Card>
      </article>
    );
  }

  const showSolution = isFinished(progress) || classroom.solutionsVisible;

  return (
    <article>
      {header}
      <CaseView
        caseData={caseData}
        initialProgress={progress}
        initialSolution={showSolution ? getSolution(caseData.id) : undefined}
        nextCaseId={nextCaseId}
        wokwiUrl={setting.wokwiUrl}
        options={caseData.fix.type === 'choice' ? shuffle(caseData.fix.options) : undefined}
        scene={caseData.kind === 'circuit' ? getScene(caseData.circuit) : undefined}
      />
    </article>
  );
}
