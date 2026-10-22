import { expect, test } from '@playwright/test';
import { joinClass } from './helpers';

test('the teacher sees a student’s progress, the attempt history and the CSV', async ({
  browser,
}) => {
  // Student (own browser context) solves C4 with a different speed.
  const student = await browser.newPage();
  const name = await joinClass(student);
  await student.goto('/casos/C4');
  await student.getByRole('button', { name: /Línea 2:/ }).click();
  await student.getByRole('button', { name: 'Revisar' }).click();
  await student.getByLabel('Escribe la línea corregida').fill('  Serial.begin(115200);');
  await student.getByRole('button', { name: 'Comprobar' }).click();
  await expect(student.getByText(/En clase usamos 9600/)).toBeVisible();

  // Teacher.
  const teacher = await browser.newPage();
  await teacher.goto('/profe');
  await expect(teacher).toHaveURL('/profe/login');
  await teacher.getByLabel('Correo').fill('demo@taller.local');
  await teacher.getByLabel('Contraseña').fill('demo-taller-123');
  await teacher.getByRole('button', { name: 'Entrar' }).click();
  await expect(teacher.getByRole('heading', { name: 'Mis clases' })).toBeVisible();

  await teacher.getByRole('link', { name: 'Ver progreso y configurar casos →' }).first().click();
  const row = teacher.getByRole('row', { name: new RegExp(name) });
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: new RegExp(`${name}, caso C4`) }).click();

  const dialog = teacher.getByRole('dialog');
  await expect(dialog.getByText('Serial.begin(115200);')).toBeVisible();
  await expect(dialog.getByText('línea 2')).toBeVisible();
  await dialog.getByRole('button', { name: 'Cerrar' }).click();

  const download = teacher.waitForEvent('download');
  await teacher.getByRole('link', { name: 'Exportar a CSV' }).click();
  const csv = await (await download).createReadStream();
  const text = (await csv.toArray()).join('');
  expect(text).toContain(`${name};Juan R.;C4;resuelto`);
});
