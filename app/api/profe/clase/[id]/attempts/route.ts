import { and, eq } from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/db';
import { students } from '@/db/schema';
import { apiError } from '@/server/case-api';
import { getAttemptHistory, type AttemptView } from '@/server/panel';
import { resolveTeacherClassroom } from '@/server/teacher-api';

export async function GET(
  request: NextRequest,
  ctx: RouteContext<'/api/profe/clase/[id]/attempts'>,
) {
  const resolved = await resolveTeacherClassroom((await ctx.params).id);
  if (!resolved.ok) return resolved.response;

  const studentId = request.nextUrl.searchParams.get('student') ?? '';
  const itemId = request.nextUrl.searchParams.get('item') ?? '';
  if (!/^[0-9a-f-]{36}$/i.test(studentId) || !/^[\w-]{1,40}$/.test(itemId)) {
    return apiError('Parámetros no válidos.', 400);
  }
  const [student] = await db
    .select({ id: students.id })
    .from(students)
    .where(and(eq(students.id, studentId), eq(students.classroomId, resolved.classroom.id)))
    .limit(1);
  if (!student) return apiError('Estudiante no encontrado.', 404);

  return NextResponse.json<AttemptView[]>(await getAttemptHistory(student.id, itemId), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
