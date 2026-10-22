import type { ComponentPropsWithoutRef } from 'react';

export type CardTone = 'neutral' | 'accent' | 'ok' | 'bad' | 'warn';

const toneClasses: Record<CardTone, string> = {
  neutral: 'border-slate-200 bg-white',
  accent: 'border-accent bg-card',
  ok: 'border-ok bg-ok/5',
  bad: 'border-bad bg-bad/5',
  warn: 'border-warn bg-warn/10',
};

type CardProps = ComponentPropsWithoutRef<'div'> & { tone?: CardTone };

export function Card({ tone = 'neutral', className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border-2 p-4 sm:p-5 ${toneClasses[tone]} ${className}`}
      {...props}
    />
  );
}
