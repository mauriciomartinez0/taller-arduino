import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { quizItemId, reviewTopics } from '@/content/review';
import { getProgressMap } from '@/server/progress';
import { requireStudentPage } from '@/server/student-session';

export const metadata: Metadata = { title: 'Repaso' };

export default async function ReviewPage() {
  const { student } = await requireStudentPage();
  const progress = await getProgressMap(student.id);

  return (
    <>
      <PageHeader title="Repaso">
        Lo que vimos en las clases, en páginas cortas y con un mini-quiz al final.
      </PageHeader>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {reviewTopics.map((topic, i) => {
          const solved = topic.quiz.filter(
            (q) => progress[quizItemId(q.id)]?.status === 'solved',
          ).length;
          return (
            <li key={topic.slug}>
              <Link
                href={`/repaso/${topic.slug}`}
                className="hover:border-accent hover:bg-card flex h-full flex-col gap-1 rounded-2xl border-2 border-slate-200 bg-white p-4 transition-colors"
              >
                <span className="text-sm font-semibold text-slate-500">
                  {i + 1} · Clase {topic.lesson}
                </span>
                <span className="text-ink font-semibold">{topic.title}</span>
                <span className="text-sm text-slate-600">{topic.summary.replace(/`/g, '')}</span>
                <span className="text-accent-strong mt-auto pt-2 text-sm font-semibold">
                  Quiz: {solved} de {topic.quiz.length} {solved === topic.quiz.length && '✅'}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
