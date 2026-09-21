import { test, expect } from '@playwright/test';

test.describe('directorio', () => {
  test('filtra en vivo, sincroniza URL y cuenta resultados', async ({ page }) => {
    await page.goto('/directorio');
    await expect(page.locator('#resultados [data-business-card]')).toHaveCount(1);

    await page.locator('#q').fill('gratis');
    await expect(page).toHaveURL(/q=gratis/);
    await expect(page.locator('#conteo')).toContainText('1');
    await expect(page.locator('#resultados')).toContainText(/Tu Comercio Acá/);

    // Limpiar restaura todo (re-inserción, no display:none)
    await page.locator('#q').fill('');
    await expect(page.locator('#resultados [data-business-card]')).toHaveCount(1);
  });

  test('filtros rápidos por categoría con aria-current', async ({ page }) => {
    await page.goto('/directorio');
    await page.locator('[data-cat-link="comercios"]').click();
    await expect(page).toHaveURL(/cat=comercios/);
    await expect(page.locator('[data-cat-link="comercios"]')).toHaveAttribute('aria-current', 'true');
    const cards = page.locator('#resultados [data-business-card]');
    await expect(cards).toHaveCount(1);
    await expect(page.locator('#resultados')).toContainText(/Tu Comercio Acá/);
  });

  test('tolerancia a acentos y estado vacío útil', async ({ page }) => {
    await page.goto('/directorio');
    await page.locator('#q').fill('muestra');
    await expect(page.locator('#resultados')).toContainText(/Tu Comercio Acá/);

    await page.locator('#q').fill('xyzsinresultados');
    await expect(page.locator('#sin-resultados')).toBeVisible();
    await expect(page.locator('#sin-resultados')).toContainText(/Publicalo gratis/);
  });

  test('respeta ?q= y ?cat= directos (links compartidos)', async ({ page }) => {
    await page.goto('/directorio?cat=comercios&q=gratis');
    await expect(page.locator('#conteo')).toContainText('1');
    await page.locator('#resultados [data-business-card] a').first().click();
    await expect(page).toHaveURL(/\/comercio\/ficha-gratis-muestra/);
  });
});
