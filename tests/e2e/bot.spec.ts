import { test, expect } from '@playwright/test';

test.describe('Flor, asistente virtual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#asistente-btn').click();
    await expect(page.locator('#asistente-panel')).toBeVisible();
    await expect(page.locator('#asistente-msgs')).toContainText(/Flor/);
  });

  test('responde búsqueda con ficha (gratis → ver perfil, sin WA)', async ({ page }) => {
    await page.locator('#asistente-input').fill('gratis');
    await page.locator('#asistente-form button[type="submit"]').click();
    await expect(page.locator('#asistente-msgs')).toContainText(/Tu Comercio Acá/);
    await expect(page.locator('#asistente-msgs').getByRole('link', { name: 'Ver perfil' })).toBeVisible();
  });

  test('explica planes con precios y CTA', async ({ page }) => {
    await page.locator('#asistente-input').fill('cuánto cuesta publicar');
    await page.locator('#asistente-form button[type="submit"]').click();
    const msgs = page.locator('#asistente-msgs');
    await expect(msgs).toContainText(/\$5\.000/);
    await expect(msgs.getByRole('link', { name: /Publicar ahora/ })).toBeVisible();
  });

  test('respuestas rápidas y cierre con Escape', async ({ page }) => {
    await page.locator('[data-rapido="oro"]').click();
    await expect(page.locator('#asistente-msgs')).toContainText(/Tu Comercio Acá/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#asistente-panel')).toBeHidden();
  });
});
