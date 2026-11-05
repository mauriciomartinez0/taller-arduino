import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WireDot } from '@/components/projects/WireDot';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormattedText } from '@/components/ui/RichText';
import { getProject, projects } from '@/content/projects';
import { requireStudentPage } from '@/server/student-session';

export async function generateMetadata({
  params,
}: PageProps<'/proyectos/[slug]'>): Promise<Metadata> {
  return { title: getProject((await params).slug)?.title ?? 'Proyectos' };
}

export default async function ProjectPage({ params }: PageProps<'/proyectos/[slug]'>) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  await requireStudentPage();

  const next = projects[projects.indexOf(project) + 1];

  return (
    <article className="flex flex-col gap-6">
      <header>
        <p className="text-accent-strong text-sm font-semibold tracking-wide uppercase">
          Proyecto {project.number}
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl">
          <span aria-hidden>{project.emoji}</span> {project.title}
        </h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Card tone="accent">
            <p className="text-lg">{project.story}</p>
          </Card>

          <Card tone="accent" className="border-accent-strong">
            <h2 className="text-accent-strong text-lg">
              <span aria-hidden>✅</span> Versión básica: tu proyecto debe…
            </h2>
            <ul className="mt-2 flex flex-col gap-1.5">
              {project.basic.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden className="text-slate-500">
                    ☐
                  </span>
                  <span>
                    <FormattedText text={item} />
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card tone="warn">
            <p>
              <span className="text-warn-ink font-bold">
                <span aria-hidden>⭐</span> Extra:
              </span>{' '}
              <FormattedText text={project.extra} />
            </p>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <section aria-labelledby="materiales">
            <h2 id="materiales" className="text-lg">
              <span aria-hidden>🧰</span> Materiales
            </h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {project.materials.map((m) => (
                <li
                  key={m}
                  className="bg-card text-ink rounded-lg border border-slate-200 px-2.5 py-1 text-sm"
                >
                  {m}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="conexiones">
            <h2 id="conexiones" className="text-lg">
              <span aria-hidden>🔌</span> Conexiones
            </h2>
            <ul className="mt-2 flex flex-col gap-1.5">
              {project.connections.map((c) => (
                <li
                  key={c.pin}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <WireDot color={c.color} />
                  <span className="text-ink w-20 shrink-0 font-bold">{c.pin}</span>
                  <span>{c.to}</span>
                </li>
              ))}
            </ul>
          </section>

          <Card tone="warn">
            <h2 className="text-warn-ink text-lg">
              <span aria-hidden>💡</span> Pistas
            </h2>
            <ul className="mt-2 ml-5 flex list-disc flex-col gap-1">
              {project.hints.map((hint) => (
                <li key={hint}>
                  <FormattedText text={hint} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <nav className="flex flex-wrap gap-3">
        <ButtonLink href="/proyectos" variant="secondary">
          Volver a los proyectos
        </ButtonLink>
        <ButtonLink href="/proyectos/diagrama-de-flujo" variant="secondary">
          Cómo hacer el diagrama de flujo
        </ButtonLink>
        {next && (
          <ButtonLink href={`/proyectos/${next.slug}`}>Siguiente: {next.title} →</ButtonLink>
        )}
      </nav>
    </article>
  );
}
