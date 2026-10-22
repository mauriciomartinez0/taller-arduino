import type { ProgressStatus } from '@/lib/case-progress';

const statusInfo: Record<ProgressStatus, { icon: string; label: string }> = {
  not_started: { icon: '', label: 'Sin empezar' },
  in_progress: { icon: '🟡', label: 'En progreso' },
  solved: { icon: '✅', label: 'Resuelto' },
  gave_up: { icon: '⛔', label: 'Viste la solución' },
};

export function statusLabel(status: ProgressStatus) {
  return statusInfo[status].label;
}

export function StatusIcon({ status }: { status: ProgressStatus }) {
  const { icon, label } = statusInfo[status];
  if (!icon) return <span className="sr-only">{label}</span>;
  return (
    <span role="img" aria-label={label} title={label}>
      {icon}
    </span>
  );
}
