'use server';

import { hash, verify } from '@node-rs/argon2';
import { and, desc, eq, isNotNull, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/db';
import {
  attempts,
  caseSettings,
  classrooms,
  progress,
  students,
  teacherSessions,
  teachers,
} from '@/db/schema';
import { isCaseId } from '@/content/cases';
import { normalizeJoinCode, randomJoinCode } from '@/lib/join-code';
import { decryptPin, encryptPin, generatePin, hashToken } from '../crypto';
import { clearFailures, isLocked, recordFailure } from '../rate-limit';
import {
  createTeacherSession,
  destroyTeacherSession,
  getOwnedClassroom,
  getTeacher,
} from '../teacher-session';
import { cookies } from 'next/headers';

export type FormState = { status: 'idle' | 'ok' | 'error'; message?: string };

const GENERIC_LOGIN_ERROR = 'Correo o contraseña incorrectos.';
// Verifying against a real hash when the email doesn't exist keeps the timing similar.
const DUMMY_HASH = hash('not-a-real-password');

// ---------- Session ----------

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { status: 'error', message: GENERIC_LOGIN_ERROR };

  const lockKey = `teacher:${email}`;
  if (await isLocked(lockKey)) {
    return {
      status: 'error',
      message: 'Demasiados intentos fallidos. Espera 10 minutos y vuelve a intentar.',
    };
  }

  const [teacher] = await db.select().from(teachers).where(eq(teachers.email, email)).limit(1);
  const valid = await verify(teacher?.passwordHash ?? (await DUMMY_HASH), password).catch(
    () => false,
  );
  if (!teacher || !valid) {
    await recordFailure(lockKey);
    return { status: 'error', message: GENERIC_LOGIN_ERROR };
  }

  await clearFailures(lockKey);
  await createTeacherSession(teacher.id);
  redirect('/profe');
}

export async function logout() {
  await destroyTeacherSession();
  redirect('/profe/login');
}

async function requireTeacher() {
  const teacher = await getTeacher();
  if (!teacher) redirect('/profe/login');
  return teacher;
}

async function requireClassroom(classroomId: string) {
  const teacher = await requireTeacher();
  const classroom = await getOwnedClassroom(teacher.id, classroomId);
  if (!classroom) throw new Error('Clase no encontrada.');
  return { teacher, classroom };
}

async function requireOwnedStudent(studentId: string) {
  const teacher = await requireTeacher();
  const [row] = await db
    .select({ student: students })
    .from(students)
    .innerJoin(classrooms, eq(classrooms.id, students.classroomId))
    .where(and(eq(students.id, studentId), eq(classrooms.teacherId, teacher.id)))
    .limit(1);
  if (!row) throw new Error('Estudiante no encontrado.');
  return row.student;
}

const passwordSchema = z
  .object({
    current: z.string().min(1, 'Escribe tu contraseña actual.'),
    next: z.string().min(10, 'La nueva contraseña debe tener al menos 10 caracteres.'),
    confirm: z.string(),
  })
  .refine((v) => v.next === v.confirm, { message: 'Las contraseñas nuevas no coinciden.' });

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const teacher = await requireTeacher();
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: 'error', message: parsed.error.issues[0].message };

  if (!(await verify(teacher.passwordHash, parsed.data.current).catch(() => false))) {
    return { status: 'error', message: 'La contraseña actual no es correcta.' };
  }
  await db
    .update(teachers)
    .set({ passwordHash: await hash(parsed.data.next) })
    .where(eq(teachers.id, teacher.id));

  // Close the other sessions; keep this one.
  const token = (await cookies()).get(process.env.SESSION_COOKIE_NAME || 'taller_session')?.value;
  if (token) {
    await db
      .delete(teacherSessions)
      .where(
        and(
          eq(teacherSessions.teacherId, teacher.id),
          ne(teacherSessions.tokenHash, hashToken(token)),
        ),
      );
  }
  return { status: 'ok', message: 'Listo: cambiaste tu contraseña.' };
}

// ---------- Classrooms ----------

const codeSchema = z
  .string()
  .transform(normalizeJoinCode)
  .pipe(
    z
      .string()
      .min(3, 'El código debe tener al menos 3 caracteres.')
      .max(20, 'El código debe tener máximo 20 caracteres.')
      .regex(/^[A-Z0-9-]+$/, 'Usa solo letras, números y guiones.'),
  );

const classroomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Escribe el nombre de la clase.')
    .max(60, 'El nombre es muy largo.'),
  joinCode: z.union([z.literal(''), codeSchema]),
});

async function codeTaken(code: string, exceptId?: string) {
  const [row] = await db
    .select({ id: classrooms.id })
    .from(classrooms)
    .where(
      exceptId
        ? and(eq(classrooms.joinCode, code), ne(classrooms.id, exceptId))
        : eq(classrooms.joinCode, code),
    )
    .limit(1);
  return Boolean(row);
}

export async function createClassroom(_prev: FormState, formData: FormData): Promise<FormState> {
  const teacher = await requireTeacher();
  const parsed = classroomSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: 'error', message: parsed.error.issues[0].message };

  let joinCode = parsed.data.joinCode;
  if (!joinCode) {
    do joinCode = randomJoinCode();
    while (await codeTaken(joinCode));
  } else if (await codeTaken(joinCode)) {
    return { status: 'error', message: 'Ese código ya lo usa otra clase. Elige otro.' };
  }

  // Wokwi links are copied from the teacher's most recent classroom.
  const [latest] = await db
    .select({ id: classrooms.id })
    .from(classrooms)
    .where(eq(classrooms.teacherId, teacher.id))
    .orderBy(desc(classrooms.createdAt))
    .limit(1);

  const [created] = await db
    .insert(classrooms)
    .values({ teacherId: teacher.id, name: parsed.data.name, joinCode })
    .returning();

  if (latest) {
    const links = await db
      .select({ caseId: caseSettings.caseId, wokwiUrl: caseSettings.wokwiUrl })
      .from(caseSettings)
      .where(and(eq(caseSettings.classroomId, latest.id), isNotNull(caseSettings.wokwiUrl)));
    if (links.length > 0) {
      await db
        .insert(caseSettings)
        .values(
          links.map((l) => ({ classroomId: created.id, caseId: l.caseId, wokwiUrl: l.wokwiUrl })),
        );
    }
  }

  revalidatePath('/profe');
  return { status: 'ok', message: `Clase creada con el código ${joinCode}.` };
}

export async function updateClassroom(_prev: FormState, formData: FormData): Promise<FormState> {
  const { classroom } = await requireClassroom(String(formData.get('classroomId')));
  const parsed = classroomSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: 'error', message: parsed.error.issues[0].message };

  const joinCode = parsed.data.joinCode || classroom.joinCode;
  if (await codeTaken(joinCode, classroom.id)) {
    return { status: 'error', message: 'Ese código ya lo usa otra clase. Elige otro.' };
  }
  await db
    .update(classrooms)
    .set({ name: parsed.data.name, joinCode })
    .where(eq(classrooms.id, classroom.id));
  revalidatePath('/profe');
  revalidatePath(`/profe/clase/${classroom.id}`);
  return { status: 'ok', message: 'Cambios guardados.' };
}

export async function setClassroomFlag(
  classroomId: string,
  flag: 'isActive' | 'solutionsVisible',
  value: boolean,
) {
  const { classroom } = await requireClassroom(classroomId);
  await db
    .update(classrooms)
    .set({ [flag]: value })
    .where(eq(classrooms.id, classroom.id));
  revalidatePath('/profe');
  revalidatePath(`/profe/clase/${classroom.id}`);
}

// ---------- Case settings ----------

const wokwiSchema = z.union([
  z.literal(''),
  z.url({ protocol: /^https$/, message: 'Pega un enlace que empiece por https://' }).max(300),
]);

export async function setCaseSetting(
  classroomId: string,
  caseId: string,
  patch: { isOpen?: boolean; wokwiUrl?: string },
): Promise<FormState> {
  const { classroom } = await requireClassroom(classroomId);
  if (!isCaseId(caseId)) return { status: 'error', message: 'Caso no válido.' };

  let wokwiUrl: string | null | undefined;
  if (patch.wokwiUrl !== undefined) {
    const parsed = wokwiSchema.safeParse(patch.wokwiUrl.trim());
    if (!parsed.success) return { status: 'error', message: parsed.error.issues[0].message };
    wokwiUrl = parsed.data || null;
  }
  const set = {
    ...(patch.isOpen !== undefined && { isOpen: patch.isOpen }),
    ...(wokwiUrl !== undefined && { wokwiUrl }),
  };
  await db
    .insert(caseSettings)
    .values({ classroomId: classroom.id, caseId, ...set })
    .onConflictDoUpdate({ target: [caseSettings.classroomId, caseSettings.caseId], set });
  revalidatePath(`/profe/clase/${classroom.id}`);
  return { status: 'ok', message: 'Guardado.' };
}

// ---------- Students ----------

export async function revealPin(studentId: string): Promise<string> {
  const student = await requireOwnedStudent(studentId);
  return decryptPin(student.pinEncrypted);
}

export async function regeneratePin(studentId: string): Promise<string> {
  const student = await requireOwnedStudent(studentId);
  const pin = generatePin();
  await db
    .update(students)
    .set({ pinEncrypted: encryptPin(pin) })
    .where(eq(students.id, student.id));
  return pin;
}

export async function resetStudentProgress(studentId: string) {
  const student = await requireOwnedStudent(studentId);
  await db.delete(progress).where(eq(progress.studentId, student.id));
  await db.delete(attempts).where(eq(attempts.studentId, student.id));
  revalidatePath(`/profe/clase/${student.classroomId}`);
}

export async function deleteStudent(studentId: string) {
  const student = await requireOwnedStudent(studentId);
  // progress and attempts go with it (on delete cascade).
  await db.delete(students).where(eq(students.id, student.id));
  revalidatePath(`/profe/clase/${student.classroomId}`);
}
