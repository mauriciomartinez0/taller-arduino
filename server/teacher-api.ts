import 'server-only';

import type { NextResponse } from 'next/server';
import type { Classroom, Teacher } from '@/db/schema';
import { apiError } from './case-api';
import { getOwnedClassroom, getTeacher } from './teacher-session';

/** Teacher session + the classroom must belong to that teacher. */
export async function resolveTeacherClassroom(
  classroomId: string,
): Promise<
  { ok: true; teacher: Teacher; classroom: Classroom } | { ok: false; response: NextResponse }
> {
  const teacher = await getTeacher();
  if (!teacher)
    return { ok: false, response: apiError('Tu sesión terminó. Vuelve a entrar.', 401) };
  const classroom = await getOwnedClassroom(teacher.id, classroomId);
  if (!classroom) return { ok: false, response: apiError('Clase no encontrada.', 404) };
  return { ok: true, teacher, classroom };
}
