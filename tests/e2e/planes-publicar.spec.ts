import { test, expect } from '@playwright/test';

test.describe('planes y alta', () => {
  test('planes muestra los 4 tiers con FAQ estructurada', async ({ page }) => {
    await page.goto('/planes');
    for (const nombre of ['Gratis', 'Bronce', 'Plata', 'Oro']) {
      await expect(page.getByRole('heading', { name: nombre, exact: true })).toBeVisible();
    }
    await expect(page.getByText('$25.000 / mes')).toBeVisible();
    await page.getByText('¿Cuánto cuesta publicar?').click();
  });

  test('elegir plan preselecciona en publicar (funnel)', async ({ page }) => {
    await page.goto('/planes');
    await page.getByRole('link', { name: 'Quiero ser Oro' }).click();
    await expect(page).toHaveURL(/\/publicar\?plan=oro/);
    await expect(page.locator('#plan')).toHaveValue(/Oro/);
  });

  test('publicar valida, enfoca el error y confirma al enviar', async ({ page }) => {
    await page.goto('/publicar');
    // Popup de WhatsApp: no dejar que abra pestañas en el test
    await page.route('https://wa.me/**', (r) => r.abort());
    await page.getByRole('button', { name: /Enviar por WhatsApp/ }).click();
    const error = page.locator('#form-error');
    await expect(error).toBeVisible();
    await expect(error).toBeFocused();

    await page.locator('#nombre').fill('Test E2E Rotisería');
    await page.locator('#categoria').selectOption('Gastronomía');
    await page.locator('#whatsapp').fill('2224000000');
    await page.locator('#desc').fill('Menú del día y empanadas todos los mediodías.');
    await expect(page.locator('#desc-count')).toContainText('✓');
    await page.getByRole('button', { name: /Enviar por WhatsApp/ }).click();
    await expect(page.locator('#form-exito')).toBeVisible();
  });
});
