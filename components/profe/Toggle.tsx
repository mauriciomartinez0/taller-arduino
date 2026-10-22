'use client';

import { useOptimistic, useTransition } from 'react';

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => Promise<unknown>;
  /** Visually hide the label (it stays for screen readers). */
  hideLabel?: boolean;
};

/** Switch that saves through a server action, with optimistic state. */
export function Toggle({ label, checked, onChange, hideLabel }: ToggleProps) {
  const [optimistic, setOptimistic] = useOptimistic(checked);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimistic}
      aria-label={hideLabel ? label : undefined}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          setOptimistic(!optimistic);
          await onChange(!optimistic);
        })
      }
      className="inline-flex min-h-11 items-center gap-3 text-left disabled:opacity-70"
    >
      <span
        aria-hidden
        className={`relative inline-block h-7 w-12 shrink-0 rounded-full transition-colors ${
          optimistic ? 'bg-ok' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            optimistic ? 'translate-x-5' : ''
          }`}
        />
      </span>
      {!hideLabel && <span className="font-medium">{label}</span>}
    </button>
  );
}
