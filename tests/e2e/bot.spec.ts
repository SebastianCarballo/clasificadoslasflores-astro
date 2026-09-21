import { test, expect } from '@playwright/test';

test.describe('Flor, asistente virtual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#asistente-btn').click();
    await expect(page.locator('#asistente-panel')).toBeVisible();
    await expect(page.locator('#asistente-msgs')).toContainText(/Flor/);
  });

  test('responde búsqueda con ficha + WhatsApp', async ({ page }) => {
    await page.locator('#asistente-input').fill('plomero');
    await page.locator('#asistente-form button[type="submit"]').click();
    await expect(page.locator('#asistente-msgs')).toContainText(/Plomería Juan Pérez/);
    const wa = page.locator('#asistente-msgs a[href^="https://wa.me/"]').first();
    await expect(wa).toBeVisible();
  });

  test('explica planes con precios y CTA', async ({ page }) => {
    await page.locator('#asistente-input').fill('cuánto cuesta publicar');
    await page.locator('#asistente-form button[type="submit"]').click();
    const msgs = page.locator('#asistente-msgs');
    await expect(msgs).toContainText(/\$5\.000/);
    await expect(msgs.getByRole('link', { name: /Publicar ahora/ })).toBeVisible();
  });

  test('respuestas rápidas y cierre con Escape', async ({ page }) => {
    await page.locator('[data-rapido="comida"]').click();
    await expect(page.locator('#asistente-msgs')).toContainText(/Café Central|Rotisería|Panadería/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#asistente-panel')).toBeHidden();
  });
});
