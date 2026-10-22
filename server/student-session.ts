import 'server-only';

import { and, eq, lt, sql } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { db } from '@/db';
import { classrooms, students, type Classroom, type Student } from '@/db/schema';
import { hashToken, randomToken } from './crypto';

export const STUDENT_COOKIE = 'taller_student';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // a school year
const LAST_SEEN_EVERY_MS = 5 * 60 * 1000;

export type StudentSession = { student: Student; classroom: Classroom };

export async function setStudentCookie(token: string) {
  (await cookies()).set(STUDENT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearStudentCookie() {
  (await cookies()).delete(STUDENT_COOKIE);
}

/** Issues a new token for a student (the previous device gets logged out). */
export async function rotateStudentToken(studentId: string): Promise<string> {
  const token = randomToken();
  await db
    .update(students)
    .set({ tokenHash: hashToken(token), lastSeenAt: new Date() })
    .where(eq(students.id, studentId));
  return token;
}

/** The student of this request, or null. Cached per request. */
export const getStudentSession = cache(async (): Promise<StudentSession | null> => {
  const token = (await cookies()).get(STUDENT_COOKIE)?.value;
  if (!token) return null;

  const [row] = await db
    .select({ student: students, classroom: classrooms })
    .from(students)
    .innerJoin(classrooms, eq(classrooms.id, students.classroomId))
    .where(eq(students.tokenHash, hashToken(token)))
    .limit(1);
  if (!row) return null;

  if (Date.now() - row.student.lastSeenAt.getTime() > LAST_SEEN_EVERY_MS) {
    const cutoff = new Date(Date.now() - LAST_SEEN_EVERY_MS);
    await db
      .update(students)
      .set({ lastSeenAt: sql`now()` })
      .where(and(eq(students.id, row.student.id), lt(students.lastSeenAt, cutoff)));
  }
  return row;
});

/** For student pages: redirects to the home page when there is no session. */
export async function requireStudentPage(): Promise<StudentSession> {
  const session = await getStudentSession();
  if (!session) redirect('/');
  return session;
}
