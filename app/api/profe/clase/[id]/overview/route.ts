import { NextResponse } from 'next/server';
import { getClassroomOverview, type ClassroomOverview } from '@/server/panel';
import { resolveTeacherClassroom } from '@/server/teacher-api';

/** Polled every 15 s by the progress table. */
export async function GET(_request: Request, ctx: RouteContext<'/api/profe/clase/[id]/overview'>) {
  const resolved = await resolveTeacherClassroom((await ctx.params).id);
  if (!resolved.ok) return resolved.response;
  return NextResponse.json<ClassroomOverview>(await getClassroomOverview(resolved.classroom.id), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
