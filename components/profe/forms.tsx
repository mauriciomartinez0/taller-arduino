'use client';

import { useActionState, type ReactNode } from 'react';
import { buttonClasses } from '@/components/ui/Button';
import type { FormState } from '@/server/actions/teacher';

type ActionFormProps = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  pendingLabel?: string;
  children: ReactNode;
  className?: string;
};

/** Form wired to a server action that returns a FormState message. */
export function ActionForm({
  action,
  submitLabel,
  pendingLabel = 'Guardando…',
  children,
  className = 'flex flex-col gap-3',
}: ActionFormProps) {
  const [state, formAction, pending] = useActionState(action, { status: 'idle' });
  return (
    <form action={formAction} className={className}>
      {children}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={buttonClasses('primary')}>
          {pending ? pendingLabel : submitLabel}
        </button>
        <p aria-live="polite" className="text-sm font-semibold">
          {state.message && (
            <span className={state.status === 'error' ? 'text-bad-ink' : 'text-ok-ink'}>
              {state.status === 'error' ? '❌ ' : '✅ '}
              {state.message}
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
