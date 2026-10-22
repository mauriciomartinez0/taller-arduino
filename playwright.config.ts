import { defineConfig } from '@playwright/test';

/**
 * End-to-end tests. They need the local database with the seed data:
 *   docker compose up -d && npm run db:migrate && npm run db:seed
 * Uses the Chrome installed on the computer (no browser download).
 */
const PORT = 3200;

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: 'chrome',
    locale: 'es-CO',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 300_000,
  },
});
