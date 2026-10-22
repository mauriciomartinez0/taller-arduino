import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-start gap-4 px-4 py-16">
      <h1 className="text-3xl">No encontramos esta página</h1>
      <p className="text-slate-600">Revisa la dirección o vuelve al inicio.</p>
      <ButtonLink href="/">Ir al inicio</ButtonLink>
    </main>
  );
}
