import { expect, test } from '@playwright/test';
import { joinClass } from './helpers';

test('a student solves B1 with the mouse and A1 with the keyboard', async ({ page }) => {
  await joinClass(page);

  // B1: find the line, then fix it (first with a typical mistake).
  await page.goto('/casos/B1');
  await page.getByRole('button', { name: /Línea 3:/ }).click();
  await page.getByRole('button', { name: 'Revisar' }).click();
  await expect(
    page.getByText('El IDE marca esta línea, pero el error está justo antes.'),
  ).toBeVisible();

  await page.getByRole('button', { name: /Línea 2:/ }).click();
  await page.getByRole('button', { name: 'Revisar' }).click();
  await expect(page.getByText('¡Bien! Ahí está el problema.')).toBeVisible();

  const line = page.getByLabel('Escribe la línea corregida');
  await expect(line).toHaveValue('  pinMode(8, OUTPUT)');
  await page.getByRole('button', { name: 'Comprobar' }).click();
  await expect(page.getByText('Te falta algo al final de la línea.')).toBeVisible();

  await line.fill('  pinMode(8, OUTPUT);');
  await page.getByRole('button', { name: 'Comprobar' }).click();
  await expect(page.getByRole('heading', { name: /¡Lo resolviste!/ })).toBeVisible();
  await expect(page.getByText('+8 puntos')).toBeVisible(); // 10 − 1 − 1 wrong attempts
  await expect(page.getByText('Versión corregida')).toBeVisible();
  await expect(page.getByText('8 pts', { exact: true })).toBeVisible(); // top bar

  // A1 only with the keyboard: Tab to the LED, Enter, then Revisar.
  await page.goto('/casos/A1');
  const led = page.getByRole('button', { name: 'LED', exact: true });
  await led.focus();
  await page.keyboard.press('Enter');
  await expect(led).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Revisar' }).click();
  await expect(page.getByText('¡Bien! Ahí está el problema.')).toBeVisible();
  await page.getByRole('button', { name: /Girar el LED/ }).click();
  await expect(page.getByRole('heading', { name: /¡Lo resolviste!/ })).toBeVisible();
  await expect(page.getByText('Circuito corregido')).toBeVisible();
});

test('pages without a session send the student to the home page', async ({ page }) => {
  await page.goto('/casos/C1');
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'Entrar a la clase' })).toBeVisible();
});

test('the same name in another browser asks for the PIN and keeps what was typed', async ({
  browser,
}) => {
  const first = await browser.newPage();
  const name = await joinClass(first);
  await first.getByRole('button', { name: 'Salir / No soy yo' }).click();
  await expect(first).toHaveURL('/');

  const other = await (await browser.newContext()).newPage();
  await other.goto('/');
  await other.getByLabel('Tu nombre').fill(name);
  await other.getByLabel('Código de la clase').fill('DEMO-01');
  await other.getByRole('button', { name: 'Entrar' }).click();
  await expect(other.getByText(/Ese nombre ya está en uso/)).toBeVisible();
  await expect(other.getByLabel('Tu nombre')).toHaveValue(name);
  await expect(other.getByLabel('Código de la clase')).toHaveValue('DEMO-01');

  await other.getByLabel('PIN').fill('0000');
  await other.getByRole('button', { name: 'Entrar' }).click();
  // Either the PIN is wrong (almost always) or, by chance, it is right.
  await expect(
    other
      .getByText('Ese PIN no coincide.')
      .or(other.getByRole('heading', { name: 'Casos de errores' })),
  ).toBeVisible();
});
