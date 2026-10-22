import 'server-only';

import { NextResponse } from 'next/server';
import { isCaseId, type CaseId } from '@/content/cases';
import type { ApiError } from '@/lib/api-types';
import { DEFAULT_CASE_SETTING, getCaseSettings, type CaseSetting } from './progress';
import { getStudentSession, type StudentSession } from './student-session';

export function apiError(message: string, status: number) {
  return NextResponse.json<ApiError>({ error: message }, { status });
}

type CaseContext = StudentSession & { caseId: CaseId; setting: CaseSetting };

/**
 * Common checks for the case endpoints: student session, active classroom,
 * existing case and case open for the classroom.
 */
export async function resolveCaseRequest(
  id: string,
): Promise<{ ok: true; ctx: CaseContext } | { ok: false; response: NextResponse }> {
  const session = await getStudentSession();
  if (!session) {
    return { ok: false, response: apiError('Tu sesión terminó. Vuelve a entrar.', 401) };
  }
  if (!session.classroom.isActive) {
    return { ok: false, response: apiError('La clase está cerrada.', 403) };
  }
  if (!isCaseId(id)) return { ok: false, response: apiError('Ese caso no existe.', 404) };

  const setting = (await getCaseSettings(session.classroom.id))[id] ?? DEFAULT_CASE_SETTING;
  if (!setting.isOpen) {
    return { ok: false, response: apiError('Este caso todavía no está abierto.', 403) };
  }
  return { ok: true, ctx: { ...session, caseId: id, setting } };
}
