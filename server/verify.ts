import 'server-only';

import type { CaseId } from '@/content/cases';
import { normalizeLine } from '@/lib/normalize';
import { answers, type AcceptedLine } from './answers';

export const MESSAGES = {
  located: '¡Bien! Ahí está el problema.',
  fixed: '¡Lo corregiste!',
  wrongLine: 'Esta línea está bien. Sigue buscando.',
  wrongPart: 'Esta parte está bien. Sigue buscando.',
  generic: 'Todavía no. Revisa la pista.',
  emptyLine: 'Escribe la línea corregida.',
  missingSemicolon: 'Te falta algo al final de la línea.',
  caseMismatch: 'Revisa mayúsculas y minúsculas.',
  assignInIf: 'Un solo = guarda un valor. ¿Cómo se compara?',
} as const;

export type CheckResult = {
  correct: boolean;
  feedback: string;
  /** Extra message shown with a correct answer (e.g. "usa 1000"). */
  note?: string;
};

export function checkLocate(caseId: CaseId, target: string): CheckResult {
  const { locate } = answers[caseId];
  if (locate.correct.includes(target)) {
    return { correct: true, feedback: MESSAGES.located };
  }
  const feedback =
    locate.feedback?.[target] ??
    locate.fallback ??
    (target.startsWith('line:') ? MESSAGES.wrongLine : MESSAGES.wrongPart);
  return { correct: false, feedback };
}

export function checkFix(caseId: CaseId, answer: string): CheckResult {
  const { fix } = answers[caseId];
  if (fix.type === 'choice') {
    return answer === fix.correct
      ? { correct: true, feedback: MESSAGES.fixed }
      : { correct: false, feedback: MESSAGES.generic };
  }
  return checkLine(answer, fix.accept);
}

export function checkLine(answer: string, accept: AcceptedLine[]): CheckResult {
  const normalized = normalizeLine(answer);
  if (normalized === '') return { correct: false, feedback: MESSAGES.emptyLine };

  for (const rule of accept) {
    if ('exact' in rule && rule.exact === normalized) {
      return { correct: true, feedback: MESSAGES.fixed };
    }
  }
  for (const rule of accept) {
    if ('pattern' in rule && rule.pattern.test(normalized)) {
      return { correct: true, feedback: MESSAGES.fixed, note: rule.note };
    }
  }

  return { correct: false, feedback: diagnose(normalized, accept) };
}

/** Picks a specific message for typical mistakes, or the generic one. */
function diagnose(normalized: string, accept: AcceptedLine[]): string {
  const matches = (s: string, ignoreCase: boolean) =>
    accept.some((rule) =>
      'exact' in rule
        ? ignoreCase
          ? rule.exact.toLowerCase() === s.toLowerCase()
          : rule.exact === s
        : new RegExp(rule.pattern.source, ignoreCase ? 'i' : '').test(s),
    );
  const withSemicolon = normalized.endsWith(';') ? normalized : `${normalized};`;

  if (withSemicolon !== normalized && matches(withSemicolon, false)) {
    return MESSAGES.missingSemicolon;
  }
  if (matches(normalized, true) || matches(withSemicolon, true)) {
    return MESSAGES.caseMismatch;
  }
  // A single `=` (not part of ==, !=, <=, >=) inside an if condition.
  if (/^(}?else)?if\(.*[^=!<>]=(?!=)/.test(normalized)) {
    return MESSAGES.assignInIf;
  }
  return MESSAGES.generic;
}
