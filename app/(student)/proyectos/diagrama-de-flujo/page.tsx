import type { Metadata } from 'next';
import Image from 'next/image';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { FormattedText } from '@/components/ui/RichText';
import { FLOWCHART_EXAMPLES } from '@/content/projects';
import { requireStudentPage } from '@/server/student-session';

export const metadata: Metadata = { title: 'Diagrama de flujo' };

const STEPS = [
  'Empieza con el óvalo **Inicio** y el **setup()**.',
  '¿Qué **lee** el Arduino? (un sensor, un botón…) → rectángulo.',
  '¿Qué **pregunta** se hace con ese dato? → rombo. Cada **if** es un rombo.',
  '¿Qué **hace** en cada camino? → rectángulos al final de cada flecha.',
  'Une todo con una **flecha de regreso**: el loop() se repite.',
];

const SYMBOLS = [
  {
    name: 'Inicio / fin',
    description: 'Donde empieza el programa',
    shape: (
      <>
        <ellipse cx={60} cy={24} rx={50} ry={20} fill="#0f8c90" />
        <text x={60} y={29} fill="white" fontSize={13} fontWeight={700} textAnchor="middle">
          Inicio
        </text>
      </>
    ),
  },
  {
    name: 'Acción',
    description: 'Algo que hace el Arduino',
    shape: (
      <>
        <rect
          x={6}
          y={4}
          width={108}
          height={40}
          rx={7}
          fill="#f3f9f9"
          stroke="#0f8c90"
          strokeWidth={2.5}
        />
        <text x={60} y={29} fill="#10494f" fontSize={12} fontWeight={700} textAnchor="middle">
          Encender LED
        </text>
      </>
    ),
  },
  {
    name: 'Decisión (el if)',
    description: 'Una pregunta con dos salidas: Sí / No',
    shape: (
      <>
        <path d="M60 2 L114 24 L60 46 L6 24 Z" fill="#fff6e0" stroke="#e0a21b" strokeWidth={2.5} />
        <text x={60} y={28} fill="#7a5408" fontSize={11} fontWeight={700} textAnchor="middle">
          ¿Presionado?
        </text>
      </>
    ),
  },
  {
    name: 'Flecha',
    description: 'El orden en que pasan las cosas',
    shape: (
      <>
        <line x1={14} x2={100} y1={24} y2={24} stroke="#334155" strokeWidth={2.5} />
        <path d="M100 18 L110 24 L100 30 Z" fill="#334155" />
      </>
    ),
  },
  {
    name: 'Flecha de regreso',
    description: 'El loop(): volver a empezar',
    shape: (
      <>
        <line x1={20} x2={106} y1={24} y2={24} stroke="#0f8c90" strokeWidth={2.5} />
        <path d="M20 18 L10 24 L20 30 Z" fill="#0f8c90" />
      </>
    ),
  },
];

export default async function FlowchartPage() {
  await requireStudentPage();

  return (
    <div className="flex flex-col gap-10">
      <PageHeader title="Cómo hacer el diagrama de flujo de tu proyecto">
        Dibújalo en el cuaderno ANTES de programar. Abajo hay 3 ejemplos con proyectos distintos a
        los de la lista.
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <ul className="flex flex-col gap-4">
          {SYMBOLS.map((s) => (
            <li key={s.name} className="flex items-center gap-4">
              <svg viewBox="0 0 120 48" className="h-12 w-30 shrink-0" aria-hidden>
                {s.shape}
              </svg>
              <span>
                <span className="text-ink block font-semibold">{s.name}</span>
                <span className="text-sm text-slate-600">{s.description}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-4">
          <Card tone="accent">
            <h2 className="text-lg">
              <span aria-hidden>✏️</span> Paso a paso
            </h2>
            <ol className="mt-2 ml-5 flex list-decimal flex-col gap-1">
              {STEPS.map((step) => (
                <li key={step}>
                  <FormattedText text={step} />
                </li>
              ))}
            </ol>
          </Card>
          <Card tone="warn">
            <p>
              <span className="text-warn-ink font-bold">Regla de oro:</span> de cada rombo salen{' '}
              <strong className="text-ink">dos</strong> flechas, una con «Sí» y otra con «No». Si
              tienes 3 opciones, usa 2 rombos seguidos.
            </p>
          </Card>
        </div>
      </div>

      {FLOWCHART_EXAMPLES.map((example, i) => {
        // Wide diagrams (example 2) take the whole width, with the notes below.
        const wide = example.width > 2 * example.height;
        return (
          <section
            key={example.image}
            aria-labelledby={`ejemplo-${i + 1}`}
            className="flex flex-col gap-4"
          >
            <h2 id={`ejemplo-${i + 1}`} className="text-xl">
              <span className="text-accent-strong block text-sm font-semibold tracking-wide uppercase">
                Ejemplo {i + 1}
              </span>
              {example.title}
            </h2>
            <div className={`grid gap-4 lg:items-start ${wide ? '' : 'lg:grid-cols-[3fr_2fr]'}`}>
              <div className="overflow-x-auto rounded-2xl border-2 border-slate-200 bg-white p-3">
                <Image
                  src={example.image}
                  width={example.width}
                  height={example.height}
                  alt={example.alt}
                  className="mx-auto h-auto w-full min-w-[480px]"
                  sizes={
                    wide ? '(min-width: 1152px) 1120px, 100vw' : '(min-width: 1024px) 680px, 100vw'
                  }
                />
              </div>
              <ul className={`grid gap-3 ${wide ? 'lg:grid-cols-3' : ''}`}>
                {example.notes.map((note) => (
                  <li key={note}>
                    <Card tone="accent">
                      <FormattedText text={note} />
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <nav>
        <ButtonLink href="/proyectos" variant="secondary">
          Volver a los proyectos
        </ButtonLink>
      </nav>
    </div>
  );
}
