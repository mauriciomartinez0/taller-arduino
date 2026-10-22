import { sql } from 'drizzle-orm';
import {
  bigserial,
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

export const teachers = pgTable('teachers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: createdAt(),
});

export const teacherSessions = pgTable(
  'teacher_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    teacherId: uuid('teacher_id')
      .notNull()
      .references(() => teachers.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('teacher_sessions_teacher_idx').on(t.teacherId)],
);

export const classrooms = pgTable(
  'classrooms',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    teacherId: uuid('teacher_id')
      .notNull()
      .references(() => teachers.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    /** Upper case, no spaces, e.g. "ARD-7B". */
    joinCode: text('join_code').notNull().unique(),
    isActive: boolean('is_active').notNull().default(true),
    solutionsVisible: boolean('solutions_visible').notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [index('classrooms_teacher_idx').on(t.teacherId)],
);

export const students = pgTable(
  'students',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    classroomId: uuid('classroom_id')
      .notNull()
      .references(() => classrooms.id, { onDelete: 'cascade' }),
    displayName: text('display_name').notNull(),
    partnerName: text('partner_name'),
    /** SHA-256 (with pepper) of the session token sent in the student cookie. */
    tokenHash: text('token_hash').notNull().unique(),
    /** Recovery PIN, AES-256-GCM encrypted so the teacher can read it in the panel. */
    pinEncrypted: text('pin_encrypted').notNull(),
    createdAt: createdAt(),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('students_classroom_name_unique').on(t.classroomId, sql`lower(${t.displayName})`),
  ],
);

export const caseSettings = pgTable(
  'case_settings',
  {
    classroomId: uuid('classroom_id')
      .notNull()
      .references(() => classrooms.id, { onDelete: 'cascade' }),
    caseId: text('case_id').notNull(),
    isOpen: boolean('is_open').notNull().default(true),
    wokwiUrl: text('wokwi_url'),
  },
  (t) => [primaryKey({ columns: [t.classroomId, t.caseId] })],
);

export const progressStatus = ['not_started', 'in_progress', 'solved', 'gave_up'] as const;

export const progress = pgTable(
  'progress',
  {
    studentId: uuid('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    /** "A1"…, "quiz-pines-1"…, "reto-ola"… */
    itemId: text('item_id').notNull(),
    status: text('status', { enum: progressStatus }).notNull().default('not_started'),
    located: boolean('located').notNull().default(false),
    hintsUsed: integer('hints_used').notNull().default(0),
    wrongAttempts: integer('wrong_attempts').notNull().default(0),
    points: integer('points').notNull().default(0),
    startedAt: timestamp('started_at', { withTimezone: true }),
    solvedAt: timestamp('solved_at', { withTimezone: true }),
  },
  // The primary key (student_id, item_id) also serves lookups by student_id.
  (t) => [primaryKey({ columns: [t.studentId, t.itemId] })],
);

export const attemptSteps = ['locate', 'fix', 'quiz', 'hint', 'give_up', 'done'] as const;

export const attempts = pgTable(
  'attempts',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    studentId: uuid('student_id')
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    itemId: text('item_id').notNull(),
    step: text('step', { enum: attemptSteps }).notNull(),
    answer: jsonb('answer'),
    isCorrect: boolean('is_correct').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    index('attempts_student_item_idx').on(t.studentId, t.itemId),
    // Rate limit: answers per student in the last minute.
    index('attempts_student_created_idx').on(t.studentId, t.createdAt),
  ],
);

/** Failed logins and PIN recoveries, to rate-limit them across serverless instances. */
export const loginAttempts = pgTable(
  'login_attempts',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    /** e.g. "teacher:ana@colegio.edu.co" or "pin:<classroom id>:sara m." */
    key: text('key').notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('login_attempts_key_created_idx').on(t.key, t.createdAt)],
);

export type Teacher = typeof teachers.$inferSelect;
export type Classroom = typeof classrooms.$inferSelect;
export type Student = typeof students.$inferSelect;
export type ProgressRow = typeof progress.$inferSelect;
export type AttemptRow = typeof attempts.$inferSelect;
