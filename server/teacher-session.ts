import 'server-only';

import { and, eq, gt } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { cache } from 'react';
import { db } from '@/db';
import { classrooms, teacherSessions, teachers, type Classroom, type Teacher } from '@/db/schema';
import { hashToken, randomToken } from './crypto';

const SESSION_DAYS = 7;

function cookieName() {
  return process.env.SESSION_COOKIE_NAME || 'taller_session';
}

export async function createTeacherSession(teacherId: string) {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.insert(teacherSessions).values({ teacherId, tokenHash: hashToken(token), expiresAt });
  (await cookies()).set(cookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export async function destroyTeacherSession() {
  const store = await cookies();
  const token = store.get(cookieName())?.value;
  if (token)
    await db.delete(teacherSessions).where(eq(teacherSessions.tokenHash, hashToken(token)));
  store.delete(cookieName());
}

/** The logged-in teacher of this request, or null. Cached per request. */
export const getTeacher = cache(async (): Promise<Teacher | null> => {
  const token = (await cookies()).get(cookieName())?.value;
  if (!token) return null;
  const [row] = await db
    .select({ teacher: teachers })
    .from(teacherSessions)
    .innerJoin(teachers, eq(teachers.id, teacherSessions.teacherId))
    .where(
      and(
        eq(teacherSessions.tokenHash, hashToken(token)),
        gt(teacherSessions.expiresAt, new Date()),
      ),
    )
    .limit(1);
  return row?.teacher ?? null;
});

export async function requireTeacherPage(): Promise<Teacher> {
  const teacher = await getTeacher();
  if (!teacher) redirect('/profe/login');
  return teacher;
}

/** A classroom of the current teacher; 404 when it belongs to someone else. */
export async function getOwnedClassroom(
  teacherId: string,
  classroomId: string,
): Promise<Classroom | null> {
  if (!/^[0-9a-f-]{36}$/i.test(classroomId)) return null;
  const [classroom] = await db
    .select()
    .from(classrooms)
    .where(and(eq(classrooms.id, classroomId), eq(classrooms.teacherId, teacherId)))
    .limit(1);
  return classroom ?? null;
}

export async function requireOwnedClassroomPage(classroomId: string) {
  const teacher = await requireTeacherPage();
  const classroom = await getOwnedClassroom(teacher.id, classroomId);
  if (!classroom) notFound();
  return { teacher, classroom };
}
