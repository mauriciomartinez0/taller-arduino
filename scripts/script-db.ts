import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';

/** Standalone DB client for CLI scripts (outside Next.js). */
export function connect() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('Falta DATABASE_URL. Ponla en .env.local o en la terminal.');
    process.exit(1);
  }
  const isLocal = /@(localhost|127\.0\.0\.1|db)(:|\/)/.test(url);
  const client = postgres(url, { max: 1, ssl: isLocal ? false : 'require' });
  return { db: drizzle(client, { schema }), close: () => client.end(), isLocal };
}
