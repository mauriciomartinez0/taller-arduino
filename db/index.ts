import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * One postgres.js client per server instance (reused across requests and hot reloads).
 *
 * - `max: 3`: Vercel runs many instances in parallel; a small pool per instance keeps
 *   the total well under Railway's connection limit.
 * - `idle_timeout: 20`: close idle connections so suspended instances don't hold them.
 * - `ssl: 'require'` for Railway's public proxy; local Docker (localhost) has no SSL.
 */

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('Falta la variable de entorno DATABASE_URL.');
  const isLocal = /@(localhost|127\.0\.0\.1|db)(:|\/)/.test(url);

  return postgres(url, {
    max: 3,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: isLocal ? false : 'require',
  });
}

// Kept on globalThis so every route bundle and every hot reload shares the same pool.
const globalForDb = globalThis as unknown as { pgClient?: ReturnType<typeof postgres> };
const client = (globalForDb.pgClient ??= createClient());

export const db = drizzle(client, { schema });
export { schema };
