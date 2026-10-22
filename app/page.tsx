import { JoinForm } from '@/components/home/JoinForm';
import { Card } from '@/components/ui/Card';
import { getStudentSession } from '@/server/student-session';

export default async function HomePage() {
  // Not a redirect: setting the cookie in the join action re-renders this page,
  // and the form must stay mounted to show the new PIN.
  const session = await getStudentSession();

  return (
    <main className="mx-auto flex min-h-dvh max-w-5xl flex-col justify-center gap-8 px-4 py-10 md:flex-row md:items-center md:gap-12">
      <section className="md:flex-1">
        <p className="text-accent-strong font-semibold tracking-wide uppercase">
          Taller de Arduino
        </p>
        <h1 className="mt-2 text-3xl leading-tight sm:text-4xl">
          Encuentra el error, corrígelo y pruébalo.
        </h1>
        <p className="mt-4 max-w-prose text-lg text-slate-600">
          15 casos de circuitos y código, repaso de las clases y los retos. Trabaja con tu pareja.
        </p>
      </section>

      <Card tone="accent" className="md:w-96">
        <JoinForm currentStudent={session?.student.displayName} />
      </Card>
    </main>
  );
}
