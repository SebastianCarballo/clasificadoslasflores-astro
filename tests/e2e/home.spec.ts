import { test, expect } from '@playwright/test';

test.describe('home', () => {
  test('carga con h1, buscador y sin errores de consola', async ({ page }) => {
    const errores: string[] = [];
    page.on('pageerror', (e) => errores.push(String(e)));
    await page.goto('/');
    await expect(page).toHaveTitle(/Clasificados Las Flores/);
    await expect(page.getByRole('heading', { name: /Todo Las Flores/ })).toBeVisible();
    await expect(page.getByRole('search')).toBeVisible();
    await expect(page.locator('#conteo, dl').first()).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('el buscador navega al directorio con query', async ({ page }) => {
    await page.goto('/');
    await page.locator('#q').fill('plomero');
    await page.getByRole('button', { name: 'Buscar' }).click();
    await expect(page).toHaveURL(/\/directorio\?q=plomero/);
    await expect(page.locator('#resultados')).toContainText(/Plomería Juan Pérez/);
  });

  test('stats únicas + secciones pobladas al hacer scroll', async ({ page }) => {
    await page.goto('/');
    // Una sola banda de números (no duplicada en hero)
    await expect(page.locator('text=negocios publicados')).toHaveCount(1);
    for (const titulo of ['Buscá por categoría', 'Comercios destacados', 'Últimos agregados']) {
      await expect(page.getByRole('heading', { name: titulo })).toBeVisible();
    }
    // Las cards aparecen al scrollear (reveals) — la queja de "bloques vacíos"
    const cards = page.locator('[data-business-card]');
    await expect(cards.first()).toBeVisible();
    await cards.nth(5).scrollIntoViewIfNeeded();
    await expect(cards.nth(5)).toBeVisible();
    await expect(page.getByText('De la búsqueda al WhatsApp')).toBeVisible();
  });

  test('categorías navegan y footer acredita MembyStudio', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Gastronomía/ }).first().click();
    await expect(page).toHaveURL('/categoria/gastronomia');
    await page.goto('/');
    await expect(page.locator('footer')).toContainText('MembyStudio');
  });
});
