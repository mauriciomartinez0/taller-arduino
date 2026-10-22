'use server';

import { and, eq, sql } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/db';
import { classrooms, students } from '@/db/schema';
import { normalizeDisplayName, normalizeJoinCode } from '@/lib/join-code';
import { encryptPin, generatePin, hashToken, pinMatches, randomToken } from '../crypto';
import { clearFailures, isLocked, recordFailure } from '../rate-limit';
import { clearStudentCookie, rotateStudentToken, setStudentCookie } from '../student-session';

/** What the student typed, sent back so the form keeps it after an error. */
export type JoinValues = { displayName: string; partnerName: string; joinCode: string };

export type JoinState =
  | { status: 'idle' }
  | {
      status: 'error';
      message: string;
      field?: 'displayName' | 'joinCode' | 'pin';
      values: JoinValues;
    }
  /** The name exists in this class: ask for the PIN. */
  | { status: 'needsPin'; message: string; values: JoinValues }
  /** New student: show the PIN once before continuing. */
  | { status: 'created'; pin: string; displayName: string };

const NAME_RE = /^[\p{L}][\p{L} .'-]*$/u;

const joinSchema = z.object({
  displayName: z
    .string()
    .transform(normalizeDisplayName)
    .pipe(
      z
        .string()
        .min(2, 'Escribe tu nombre y la inicial del apellido.')
        .max(30, 'Usa solo tu nombre y la inicial del apellido.')
        .regex(NAME_RE, 'Usa solo letras, por ejemplo “Sara M.”.'),
    ),
  partnerName: z
    .string()
    .transform((s) => normalizeDisplayName(s))
    .pipe(z.string().max(30, 'El nombre de tu pareja es muy largo.'))
    .optional(),
  joinCode: z
    .string()
    .transform(normalizeJoinCode)
    .pipe(z.string().min(3, 'Escribe el código de la clase.').max(20, 'Ese código no es válido.')),
  pin: z
    .string()
    .trim()
    .regex(/^\d{4}$/, 'El PIN tiene 4 números.')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

const NAME_TAKEN =
  'Ese nombre ya está en uso. Si eres tú, escribe tu PIN; si no, agrega otra letra (por ejemplo “Sara Mo.”).';

export async function joinClass(_prev: JoinState, formData: FormData): Promise<JoinState> {
  const values: JoinValues = {
    displayName: String(formData.get('displayName') ?? '').slice(0, 60),
    partnerName: String(formData.get('partnerName') ?? '').slice(0, 60),
    joinCode: String(formData.get('joinCode') ?? '').slice(0, 30),
  };
  const parsed = joinSchema.safeParse({
    displayName: formData.get('displayName') ?? '',
    partnerName: formData.get('partnerName') ?? '',
    joinCode: formData.get('joinCode') ?? '',
    pin: formData.get('pin') ?? '',
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue.path[0] as 'displayName' | 'joinCode' | 'pin';
    return { status: 'error', message: issue.message, field, values };
  }
  const { displayName, partnerName, joinCode, pin } = parsed.data;

  const [classroom] = await db
    .select()
    .from(classrooms)
    .where(eq(classrooms.joinCode, joinCode))
    .limit(1);
  if (!classroom) {
    return {
      status: 'error',
      message: 'No encontramos esa clase. Revisa el código.',
      field: 'joinCode',
      values,
    };
  }
  if (!classroom.isActive) {
    return { status: 'error', message: 'La clase está cerrada.', field: 'joinCode', values };
  }

  const [existing] = await db
    .select()
    .from(students)
    .where(
      and(
        eq(students.classroomId, classroom.id),
        sql`lower(${students.displayName}) = lower(${displayName})`,
      ),
    )
    .limit(1);

  if (existing) {
    if (!pin) return { status: 'needsPin', message: NAME_TAKEN, values };

    const lockKey = `pin:${classroom.id}:${displayName.toLowerCase()}`;
    if (await isLocked(lockKey)) {
      return {
        status: 'error',
        message: 'Demasiados intentos. Espera 10 minutos o pídele el PIN al profe.',
        field: 'pin',
        values,
      };
    }
    if (!pinMatches(existing.pinEncrypted, pin)) {
      await recordFailure(lockKey);
      return { status: 'error', message: 'Ese PIN no coincide.', field: 'pin', values };
    }
    await clearFailures(lockKey);
    if (partnerName) {
      await db.update(students).set({ partnerName }).where(eq(students.id, existing.id));
    }
    await setStudentCookie(await rotateStudentToken(existing.id));
    redirect('/casos');
  }

  const token = randomToken();
  const newPin = generatePin();
  try {
    await db.insert(students).values({
      classroomId: classroom.id,
      displayName,
      partnerName: partnerName || null,
      tokenHash: hashToken(token),
      pinEncrypted: encryptPin(newPin),
    });
  } catch {
    // Someone took the name a moment ago (unique index).
    return { status: 'needsPin', message: NAME_TAKEN, values };
  }
  await setStudentCookie(token);
  return { status: 'created', pin: newPin, displayName };
}

export async function leaveClass() {
  await clearStudentCookie();
  redirect('/');
}
