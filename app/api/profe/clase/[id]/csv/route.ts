import { progressCsv } from '@/lib/csv';
import { getClassroomOverview } from '@/server/panel';
import { resolveTeacherClassroom } from '@/server/teacher-api';

export async function GET(_request: Request, ctx: RouteContext<'/api/profe/clase/[id]/csv'>) {
  const resolved = await resolveTeacherClassroom((await ctx.params).id);
  if (!resolved.ok) return resolved.response;

  const { students } = await getClassroomOverview(resolved.classroom.id);
  const date = new Date().toISOString().slice(0, 10);
  const filename = `progreso-${resolved.classroom.joinCode}-${date}.csv`;
  return new Response(progressCsv(students), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
