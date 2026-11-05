import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ButtonLink } from '@/components/ui/Button';
import { classDecks, getClassDeck, SLIDE_SIZE } from '@/content/classes';
import { requireStudentPage } from '@/server/student-session';

export async function generateMetadata({ params }: PageProps<'/clases/[slug]'>): Promise<Metadata> {
  return { title: getClassDeck((await params).slug)?.title ?? 'Clases' };
}

const slideNumber = (n: number) => String(n).padStart(2, '0');

export default async function ClassDeckPage({ params }: PageProps<'/clases/[slug]'>) {
  const deck = getClassDeck((await params).slug);
  if (!deck) notFound();
  await requireStudentPage();

  const next = classDecks[classDecks.indexOf(deck) + 1];

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <div>
          <p className="text-accent-strong text-sm font-semibold tracking-wide uppercase">
            {deck.lesson}
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl">{deck.title}</h1>
          <p className="mt-2 max-w-prose text-slate-600">{deck.summary}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/clases" variant="secondary">
            Todas las clases
          </ButtonLink>
          <a
            href={deck.pdf}
            download
            className="text-accent-strong self-center px-2 font-semibold underline-offset-2 hover:underline"
          >
            Descargar en PDF
          </a>
        </div>
      </header>

      <details className="rounded-2xl border-2 border-slate-200 bg-white p-4 lg:max-w-3xl">
        <summary className="text-ink cursor-pointer font-semibold">
          Índice ({deck.slides.length} diapositivas)
        </summary>
        <ol className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
          {deck.slides.map((slide, i) => (
            <li key={i}>
              <a
                href={`#d-${i + 1}`}
                className="hover:text-ink flex gap-2 text-slate-700 underline-offset-2 hover:underline"
              >
                <span className="w-6 shrink-0 text-right text-slate-500 tabular-nums">{i + 1}</span>
                {slide.title}
              </a>
            </li>
          ))}
        </ol>
      </details>

      <ol className="flex flex-col gap-6">
        {deck.slides.map((slide, i) => (
          <li key={i} id={`d-${i + 1}`} className="scroll-mt-4">
            <figure className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
              <Image
                src={`/clases/${deck.slug}/${slideNumber(i + 1)}.webp`}
                width={SLIDE_SIZE.width}
                height={SLIDE_SIZE.height}
                alt={slide.text}
                unoptimized
                priority={i === 0}
                className="h-auto w-full"
              />
              <figcaption className="border-t border-slate-200 px-4 py-2 text-sm text-slate-600">
                <span className="font-semibold tabular-nums">
                  {i + 1} / {deck.slides.length}
                </span>{' '}
                · {slide.title}
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>

      <nav className="flex flex-wrap gap-3">
        <ButtonLink href="/clases" variant="secondary">
          Todas las clases
        </ButtonLink>
        <ButtonLink href={`#d-1`} variant="secondary">
          Volver arriba ↑
        </ButtonLink>
        {next && <ButtonLink href={`/clases/${next.slug}`}>Siguiente: {next.title} →</ButtonLink>}
      </nav>
    </article>
  );
}
