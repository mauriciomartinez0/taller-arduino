'use client';

import './globals.css';

/** Last-resort boundary when the root layout itself fails. */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es-CO">
      <body className="min-h-dvh">
        <main className="mx-auto flex max-w-xl flex-col items-start gap-4 px-4 py-16">
          <h1 className="text-3xl">Algo salió mal</h1>
          <p className="text-slate-600">
            Recarga la página en un momento. Si sigue pasando, avísale al profe.
          </p>
          <button
            type="button"
            onClick={reset}
            className="bg-accent-strong rounded-xl px-5 py-2.5 font-semibold text-white"
          >
            Intentar otra vez
          </button>
        </main>
      </body>
    </html>
  );
}
