import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Blocks } from '@/components/review/Blocks';
import { Quiz } from '@/components/review/Quiz';
import { ButtonLink } from '@/components/ui/Button';
import { getReviewTopic, quizItemId, reviewTopics } from '@/content/review';
import { shuffle } from '@/lib/shuffle';
import { getProgressMap } from '@/server/progress';
import { requireStudentPage } from '@/server/student-session';

export async function generateMetadata({ params }: PageProps<'/repaso/[tema]'>): Promise<Metadata> {
  return { title: getReviewTopic((await params).tema)?.title ?? 'Repaso' };
}

export default async function ReviewTopicPage({ params }: PageProps<'/repaso/[tema]'>) {
  const topic = getReviewTopic((await params).tema);
  if (!topic) notFound();

  const { student } = await requireStudentPage();
  const progress = await getProgressMap(student.id);
  const index = reviewTopics.indexOf(topic);
  const next = reviewTopics[index + 1];

  return (
    <article className="flex flex-col gap-8">
      <header>
        <p className="text-sm font-semibold text-slate-600">
          Repaso {index + 1} de {reviewTopics.length} · Clase {topic.lesson}
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl">{topic.title}</h1>
      </header>
      <Blocks blocks={topic.blocks} />
      <div className="max-w-3xl">
        <Quiz
          questions={topic.quiz.map((q) => ({ ...q, options: shuffle(q.options) }))}
          initial={Object.fromEntries(topic.quiz.map((q) => [q.id, progress[quizItemId(q.id)]]))}
        />
      </div>
      <nav className="flex flex-wrap gap-3">
        <ButtonLink href="/repaso" variant="secondary">
          Volver al repaso
        </ButtonLink>
        {next && <ButtonLink href={`/repaso/${next.slug}`}>Siguiente: {next.title} →</ButtonLink>}
      </nav>
    </article>
  );
}
