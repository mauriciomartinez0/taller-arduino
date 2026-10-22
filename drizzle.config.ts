import { existsSync } from 'node:fs';
import { defineConfig } from 'drizzle-kit';

// Local development reads .env.local; in production DATABASE_URL comes from the shell.
if (!process.env.DATABASE_URL && existsSync('.env.local')) process.loadEnvFile('.env.local');

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.ts',
  out: './drizzle',
  dbCredentials: { url: process.env.DATABASE_URL! },
  strict: true,
  verbose: true,
});
