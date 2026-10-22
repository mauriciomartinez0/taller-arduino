'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { buttonClasses } from '@/components/ui/Button';
import { joinClass, leaveClass, type JoinState } from '@/server/actions/student';

const inputClass =
  'mt-1 block w-full rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 text-base focus:border-accent-strong focus:outline-none aria-invalid:border-bad';

export function JoinForm({ currentStudent }: { currentStudent?: string }) {
  const [state, action, pending] = useActionState<JoinState, FormData>(joinClass, {
    status: 'idle',
  });

  if (state.status === 'created') {
    return (
      <div className="flex flex-col gap-4" role="status">
        <h2 className="text-xl">¡Listo, {state.displayName}!</h2>
        <p>
          Anota tu PIN. Lo necesitas si entras desde otro computador con el mismo nombre y código.
        </p>
        <p
          className="border-warn bg-warn/10 text-ink rounded-2xl border-2 border-dashed py-4 text-center font-mono text-4xl font-bold tracking-[0.3em]"
          aria-label={`Tu PIN es ${state.pin.split('').join(' ')}`}
        >
          {state.pin}
        </p>
        <Link href="/casos" className={buttonClasses('primary')}>
          Ya lo anoté, continuar
        </Link>
      </div>
    );
  }

  if (currentStudent) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl">Hola, {currentStudent}</h2>
        <p>Ya entraste en este navegador.</p>
        <Link href="/casos" className={buttonClasses('primary')}>
          Continuar
        </Link>
        <form action={leaveClass}>
          <button type="submit" className={buttonClasses('ghost', 'w-full')}>
            No soy {currentStudent}
          </button>
        </form>
      </div>
    );
  }

  const error = state.status === 'error' ? state : null;
  const askPin = state.status === 'needsPin' || error?.field === 'pin';

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <h2 className="text-xl">Entrar a la clase</h2>
      <label className="block">
        <span className="font-semibold">Tu nombre</span>
        <span className="block text-sm text-slate-500">
          Nombre e inicial del apellido: “Sara M.”
        </span>
        <input
          name="displayName"
          required
          maxLength={30}
          autoComplete="off"
          aria-invalid={error?.field === 'displayName' || undefined}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="font-semibold">Tu pareja</span>{' '}
        <span className="text-sm text-slate-500">(opcional)</span>
        <input name="partnerName" maxLength={30} autoComplete="off" className={inputClass} />
      </label>
      <label className="block">
        <span className="font-semibold">Código de la clase</span>
        <input
          name="joinCode"
          required
          maxLength={20}
          autoComplete="off"
          autoCapitalize="characters"
          placeholder="ARD-7B"
          aria-invalid={error?.field === 'joinCode' || undefined}
          className={`${inputClass} font-mono uppercase`}
        />
      </label>
      {askPin && (
        <label className="block">
          <span className="font-semibold">PIN</span>
          <span className="block text-sm text-slate-500">Los 4 números que anotaste.</span>
          <input
            name="pin"
            inputMode="numeric"
            pattern="\d{4}"
            maxLength={4}
            autoComplete="off"
            aria-invalid={error?.field === 'pin' || undefined}
            className={`${inputClass} font-mono tracking-[0.3em]`}
          />
        </label>
      )}

      <div aria-live="polite">
        {(error || state.status === 'needsPin') && (
          <p
            className={`rounded-xl px-3 py-2 text-sm font-semibold ${
              error ? 'bg-bad/10 text-bad-ink' : 'bg-warn/15 text-warn-ink'
            }`}
          >
            {state.status === 'needsPin' ? state.message : error?.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={pending} className={buttonClasses('primary')}>
        {pending ? 'Entrando…' : 'Entrar'}
      </button>
      <p className="text-sm text-slate-600">
        Solo guardamos tu nombre corto y tus respuestas para que el profe vea el avance de la clase.
      </p>
    </form>
  );
}
