/**
 * Creates a teacher account (or changes the password of an existing one).
 *   npm run create-teacher -- --email tu@correo.com
 */
import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { createInterface } from 'node:readline';
import { parseArgs } from 'node:util';
import { z } from 'zod';
import { teachers } from '../db/schema';
import { connect } from './script-db';

function askHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const output = rl as unknown as { _writeToOutput: (s: string) => void };
    let asking = true;
    output._writeToOutput = (s: string) => {
      if (asking) {
        process.stdout.write(s);
        asking = false;
      }
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
  });
}

async function main() {
  const { values } = parseArgs({ options: { email: { type: 'string' } } });
  const email = z.email().safeParse(values.email?.trim().toLowerCase());
  if (!email.success) {
    console.error('Uso: npm run create-teacher -- --email tu@correo.com');
    process.exit(1);
  }

  const password = await askHidden('Contraseña (mínimo 10 caracteres): ');
  if (password.length < 10) {
    console.error('La contraseña debe tener al menos 10 caracteres.');
    process.exit(1);
  }
  if ((await askHidden('Repite la contraseña: ')) !== password) {
    console.error('Las contraseñas no coinciden.');
    process.exit(1);
  }

  const { db, close } = connect();
  const passwordHash = await hash(password);
  const [existing] = await db.select().from(teachers).where(eq(teachers.email, email.data));
  if (existing) {
    await db.update(teachers).set({ passwordHash }).where(eq(teachers.id, existing.id));
    console.log(`Listo: se cambió la contraseña de ${email.data}.`);
  } else {
    await db.insert(teachers).values({ email: email.data, passwordHash });
    console.log(`Listo: se creó la cuenta de ${email.data}. Entra en /profe/login.`);
  }
  await close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
