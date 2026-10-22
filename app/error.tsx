'use client';

import { Button, ButtonLink } from '@/components/ui/Button';

/** Error boundary for every page: a friendly message and a retry button. */
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-start gap-4 px-4 py-16">
      <h1 className="text-3xl">Algo salió mal</h1>
      <p className="text-slate-600">
        No pudimos cargar esta página. Revisa la conexión a internet e intenta otra vez. Si sigue
        pasando, avísale al profe.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={reset}>Intentar otra vez</Button>
        <ButtonLink href="/" variant="secondary">
          Ir al inicio
        </ButtonLink>
      </div>
    </main>
  );
}
