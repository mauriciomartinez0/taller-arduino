/**
 * Local test data: a demo teacher and the classroom DEMO-01.
 *   npm run db:seed
 */
import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { classrooms, teachers } from '../db/schema';
import { connect } from './script-db';

const DEMO_EMAIL = 'demo@taller.local';
const DEMO_PASSWORD = 'demo-taller-123';

async function main() {
  const { db, close, isLocal } = connect();
  if (!isLocal && !process.argv.includes('--force')) {
    console.error('DATABASE_URL no es local. Para sembrar datos de prueba igual, usa --force.');
    process.exit(1);
  }

  let [teacher] = await db.select().from(teachers).where(eq(teachers.email, DEMO_EMAIL));
  if (!teacher) {
    [teacher] = await db
      .insert(teachers)
      .values({ email: DEMO_EMAIL, passwordHash: await hash(DEMO_PASSWORD) })
      .returning();
  }

  await db
    .insert(classrooms)
    .values({ teacherId: teacher.id, name: 'Clase de prueba', joinCode: 'DEMO-01' })
    .onConflictDoNothing({ target: classrooms.joinCode });

  console.log('Datos de prueba listos:');
  console.log(`  Profe: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  console.log('  Código de clase: DEMO-01');
  await close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
