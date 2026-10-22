import { expect, type Page } from '@playwright/test';

/** Joins DEMO-01 with a unique name and returns it (letters only, as the form requires). */
export async function joinClass(page: Page): Promise<string> {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`
    .slice(-8)
    .replace(/\d/g, (d) => 'abcdefghij'[Number(d)]);
  const name = `Eva ${suffix}`;
  await page.goto('/');
  await page.getByLabel('Tu nombre').fill(name);
  await page.getByLabel('Tu pareja').fill('Juan R.');
  await page.getByLabel('Código de la clase').fill('demo-01');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByText('Anota tu PIN')).toBeVisible();
  await page.getByRole('link', { name: 'Ya lo anoté, continuar' }).click();
  await expect(page.getByRole('heading', { name: 'Casos de errores' })).toBeVisible();
  // Display names are stored with each word capitalized.
  return name.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}
