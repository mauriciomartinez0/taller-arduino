import type { Metadata } from 'next';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { challenges } from '@/content/challenges';
import { challengeSolutions } from '@/server/challenge-solutions';
import { getProgressMap } from '@/server/progress';
import { requireStudentPage } from '@/server/student-session';

export const metadata: Metadata = { title: 'Retos' };

export default async function ChallengesPage() {
  const { student, classroom } = await requireStudentPage();
  const progress = await getProgressMap(student.id);

  const sections = [
    { lesson: 2, title: 'Clase 2 · Digital vs. analógico y PWM' },
    { lesson: 3, title: 'Clase 3 · Sensores' },
  ] as const;

  return (
    <>
      <PageHeader title="Retos">
        Los retos de las clases anteriores. Abre las pistas una por una y marca “Ya lo hice” cuando
        lo logres con tu pareja.
      </PageHeader>
      <div className="flex flex-col gap-10">
        {sections.map((section) => (
          <section key={section.lesson} aria-labelledby={`lesson-${section.lesson}`}>
            <h2 id={`lesson-${section.lesson}`} className="mb-3 text-xl">
              {section.title}
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {challenges
                .filter((c) => c.lesson === section.lesson)
                .map((c) => (
                  <ChallengeCard
                    key={c.id}
                    challenge={c}
                    done={progress[c.id]?.status === 'solved'}
                    solution={
                      classroom.solutionsVisible && c.hasSolution
                        ? challengeSolutions[c.id]
                        : undefined
                    }
                  />
                ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
