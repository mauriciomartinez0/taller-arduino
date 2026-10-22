import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'warn' | 'ghost';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent-strong text-white hover:bg-ink',
  secondary: 'border-2 border-accent-strong bg-white text-accent-strong hover:bg-card',
  warn: 'bg-warn text-slate-900 hover:brightness-95',
  ghost: 'text-accent-strong hover:bg-card',
};

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export function buttonClasses(variant: ButtonVariant = 'primary', className = '') {
  return `${base} ${variantClasses[variant]} ${className}`;
}

type ButtonProps = ComponentPropsWithoutRef<'button'> & { variant?: ButtonVariant };

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...props} />;
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & { variant?: ButtonVariant };

export function ButtonLink({ variant = 'primary', className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}
