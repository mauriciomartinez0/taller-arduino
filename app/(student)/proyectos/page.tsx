import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { FormattedText } from '@/components/ui/RichText';
import { PRESENTATION_STEPS, PROJECTS_PDF, projects, RUBRIC } from '@/content/projects';
import { requireStudentPage } from '@/server/student-session';

export const metadata: Metadata = { title: 'Proyectos' };

export default async function ProjectsPage() {
  await requireStudentPage();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <PageHeader title="Proyecto final del periodo">
          Elige un proyecto con tu pareja. Cada ficha dice qué debe hacer la versión básica, el
          extra, los materiales, las conexiones y unas pistas.
        </PageHeader>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/proyectos/diagrama-de-flujo" variant="secondary">
            Cómo hacer el diagrama de flujo
          </ButtonLink>
          <a
            href={PROJECTS_PDF}
            download
            className="text-accent-strong self-center px-2 font-semibold underline-offset-2 hover:underline"
          >
            Descargar las fichas (PDF)
          </a>
        </div>
      </div>

      <section aria-labelledby="elige">
        <h2 id="elige" className="mb-3 text-xl">
          Elige tu proyecto
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/proyectos/${p.slug}`}
                className="hover:border-accent hover:bg-card flex h-full items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-4 transition-colors"
              >
                <span aria-hidden className="text-4xl">
                  {p.emoji}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-ink font-semibold">
                    {p.number}. {p.title}
                  </span>
                  <span className="text-sm text-slate-600">{p.kit}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="evaluacion" className="flex max-w-4xl flex-col gap-4">
        <h2 id="evaluacion" className="text-xl">
          Cómo se va a evaluar
        </h2>
        <div className="border-accent overflow-x-auto rounded-2xl border-2">
          <table className="w-full text-left">
            <thead className="bg-card">
              <tr>
                <th scope="col" className="text-ink px-3 py-2">
                  Criterio
                </th>
                <th scope="col" className="text-ink px-3 py-2">
                  Valor
                </th>
                <th scope="col" className="text-ink px-3 py-2">
                  Lo logras si…
                </th>
              </tr>
            </thead>
            <tbody>
              {RUBRIC.map((r) => (
                <tr key={r.criterion} className="border-t border-slate-200">
                  <th scope="row" className="px-3 py-2 font-semibold whitespace-nowrap">
                    <span aria-hidden>{r.emoji}</span> {r.criterion}
                  </th>
                  <td className="px-3 py-2 font-semibold">{r.value}</td>
                  <td className="px-3 py-2">
                    <FormattedText text={r.goal} />
                  </td>
                </tr>
              ))}
              <tr className="bg-card border-t border-slate-200">
                <th scope="row" className="px-3 py-2 text-right font-bold">
                  Total
                </th>
                <td className="px-3 py-2 font-bold">5,0</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
        <Card tone="warn">
          <p className="font-semibold">
            <span aria-hidden>🎤</span> Para la presentación
          </p>
          <ol className="mt-1 ml-5 list-decimal">
            {PRESENTATION_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </Card>
      </section>
    </div>
  );
}
