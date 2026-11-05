import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { classDecks, SLIDE_SIZE } from '@/content/classes';
import { requireStudentPage } from '@/server/student-session';

export const metadata: Metadata = { title: 'Clases' };

export default async function ClassesPage() {
  await requireStudentPage();

  return (
    <>
      <PageHeader title="Clases">
        Las presentaciones de cada clase, para repasarlas cuando quieras. También las puedes
        descargar en PDF.
      </PageHeader>
      <ul className="grid gap-4 sm:grid-cols-2">
        {classDecks.map((deck, i) => (
          <li key={deck.slug}>
            <Link
              href={`/clases/${deck.slug}`}
              className="hover:border-accent flex h-full flex-col overflow-hidden rounded-2xl border-2 border-slate-200 bg-white transition-colors"
            >
              <Image
                src={`/clases/${deck.slug}/01.webp`}
                width={SLIDE_SIZE.width}
                height={SLIDE_SIZE.height}
                alt=""
                unoptimized
                priority={i < 2}
                className="h-auto w-full border-b border-slate-200"
              />
              <span className="flex flex-1 flex-col gap-1 p-4">
                <span className="text-accent-strong text-sm font-semibold">
                  {deck.lesson} · {deck.slides.length} diapositivas
                </span>
                <span className="text-ink text-lg font-semibold">{deck.title}</span>
                <span className="text-sm text-slate-600">{deck.summary}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
