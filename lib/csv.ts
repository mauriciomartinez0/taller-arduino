import { CASE_IDS } from '@/content/cases';
import type { CaseProgress, ProgressStatus } from './case-progress';
import { formatDuration } from './format';

const STATUS_LABELS: Record<ProgressStatus, string> = {
  not_started: 'sin empezar',
  in_progress: 'en progreso',
  solved: 'resuelto',
  gave_up: 'vio la solución',
};

type CsvStudent = {
  displayName: string;
  partnerName: string | null;
  items: Record<string, CaseProgress>;
};

/** Duration of a finished case, or "" when it isn't finished. */
export function caseDuration(p: CaseProgress): string {
  if (!p.startedAt || !p.solvedAt) return '';
  return formatDuration(new Date(p.solvedAt).getTime() - new Date(p.startedAt).getTime());
}

function cell(value: string | number): string {
  const s = String(value);
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * One row per student and case. Uses `;` and a BOM so Excel in Spanish opens it in columns.
 */
export function progressCsv(list: CsvStudent[]): string {
  const header = [
    'estudiante',
    'pareja',
    'caso',
    'estado',
    'pistas',
    'intentos',
    'puntos',
    'tiempo',
  ];
  const rows = list.flatMap((s) =>
    CASE_IDS.map((caseId) => {
      const p = s.items[caseId];
      return [
        s.displayName,
        s.partnerName ?? '',
        caseId,
        STATUS_LABELS[p?.status ?? 'not_started'],
        p?.hintsUsed ?? 0,
        p?.wrongAttempts ?? 0,
        p?.points ?? 0,
        p ? caseDuration(p) : '',
      ];
    }),
  );
  return '﻿' + [header, ...rows].map((r) => r.map(cell).join(';')).join('\r\n') + '\r\n';
}
