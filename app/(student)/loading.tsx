/** Shown while a student page loads (slow school connections). */
export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="flex animate-pulse flex-col gap-4">
      <span className="sr-only">Cargando…</span>
      <div className="h-8 w-2/3 rounded-lg bg-slate-200" />
      <div className="grid gap-3 md:grid-cols-3">
        <div className="h-28 rounded-2xl bg-slate-100" />
        <div className="h-28 rounded-2xl bg-slate-100" />
        <div className="h-28 rounded-2xl bg-slate-100" />
      </div>
      <div className="h-64 rounded-2xl bg-slate-100" />
    </div>
  );
}
