import { test, expect } from '@playwright/test';

test.describe('ficha de negocio', () => {
  test('demo gratis: MUESTRA, CTA empezar, sin extras pagos', async ({ page }) => {
    await page.goto('/comercio/ficha-gratis-muestra/');
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toContainText('Tu Comercio Acá');

    // Orden DOM: h1 antes que la primera imagen (decisión UX).
    // DOCUMENT_POSITION_FOLLOWING = 4 (literal: el global Node no existe en este contexto)
    const hSigueImg = await page.evaluate(() => {
      const h = document.querySelector('article h1');
      const img = document.querySelector('article img');
      if (!h || !img) return false;
      // eslint-disable-next-line no-bitwise
      return (h.compareDocumentPosition(img) & 4) !== 0;
    });
    expect(hSigueImg).toBe(true);

    await expect(page.getByText('MUESTRA').first()).toBeVisible();
    await expect(page.getByText('Catálogo', { exact: true })).toHaveCount(0);
    await expect(page.locator('#mapa-negocio')).toHaveCount(0);
    const cta = page.getByRole('link', { name: /Empezar gratis con la mía/ }).first();
    await expect(cta).toHaveAttribute('href', '/publicar');
    await expect(page.getByRole('link', { name: /Compartir|compartir/i }).or(page.locator('#btn-compartir'))).toBeVisible();
  });

  test('sin relacionados muestra slot publicitario (modo gran apertura)', async ({ page }) => {
    await page.goto('/comercio/ficha-gratis-muestra/');
    await expect(page.locator('[data-slot-publicitario]')).toBeVisible();
    await expect(page.locator('[data-slot-publicitario]')).toContainText(/Publicar gratis/);
  });

  test('volver al directorio navega', async ({ page }) => {
    await page.goto('/comercio/ficha-gratis-muestra/');
    await page.getByRole('link', { name: /Volver al directorio/ }).click();
    await expect(page).toHaveURL('/directorio');
  });

  test('slug inexistente da 404', async ({ page }) => {
    const res = await page.goto('/comercio/no-existe-xyz/');
    expect(res?.status()).toBe(404);
  });
});
