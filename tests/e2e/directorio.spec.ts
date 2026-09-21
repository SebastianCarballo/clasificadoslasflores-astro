import { test, expect } from '@playwright/test';

test.describe('directorio', () => {
  test('filtra en vivo, sincroniza URL y cuenta resultados', async ({ page }) => {
    await page.goto('/directorio');
    await expect(page.locator('#resultados [data-business-card]')).toHaveCount(17);

    await page.locator('#q').fill('plomero');
    await expect(page).toHaveURL(/q=plomero/);
    await expect(page.locator('#conteo')).toContainText('1');
    await expect(page.locator('#resultados')).toContainText(/Plomería Juan Pérez/);

    // Limpiar restaura todo (re-inserción, no display:none)
    await page.locator('#q').fill('');
    await expect(page.locator('#resultados [data-business-card]')).toHaveCount(17);
  });

  test('filtros rápidos por categoría con aria-current', async ({ page }) => {
    await page.goto('/directorio');
    await page.locator('[data-cat-link="salud"]').click();
    await expect(page).toHaveURL(/cat=salud/);
    await expect(page.locator('[data-cat-link="salud"]')).toHaveAttribute('aria-current', 'true');
    const cards = page.locator('#resultados [data-business-card]');
    await expect(cards).toHaveCount(3);
    await expect(page.locator('#resultados')).toContainText(/Farmacia San Roque/);
  });

  test('tolerancia a acentos y estado vacío útil', async ({ page }) => {
    await page.goto('/directorio');
    await page.locator('#q').fill('cafe');
    await expect(page.locator('#resultados')).toContainText(/Café Central/);

    await page.locator('#q').fill('xyzsinresultados');
    await expect(page.locator('#sin-resultados')).toBeVisible();
    await expect(page.locator('#sin-resultados')).toContainText(/Publicalo gratis/);
  });

  test('respeta ?q= y ?cat= directos (links compartidos)', async ({ page }) => {
    await page.goto('/directorio?cat=servicios&q=plomero');
    await expect(page.locator('#conteo')).toContainText('1');
    await page.locator('#resultados [data-business-card] a').first().click();
    await expect(page).toHaveURL(/\/comercio\/plomero-juan-perez/);
  });
});
