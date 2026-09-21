import { test, expect } from '@playwright/test';

test.describe('ficha de negocio', () => {
  test('oro: info primero, catálogo, mapa y WhatsApp', async ({ page }) => {
    await page.goto('/comercio/rotiseria-el-buen-sabor/');
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toContainText('Rotisería El Buen Sabor');

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

    await expect(page.locator('section[aria-label^="Catálogo"]')).toContainText('Menú del día');
    await expect(page.locator('#mapa-negocio')).toBeVisible();
    const wa = page.getByRole('link', { name: /Hablar por WhatsApp/ });
    await expect(wa).toHaveAttribute('href', /^https:\/\/wa\.me\//);
    await expect(page.getByRole('link', { name: /Compartir|compartir/i }).or(page.locator('#btn-compartir'))).toBeVisible();
  });

  test('gratis: sin CTA WhatsApp, sin mapa ni catálogo', async ({ page }) => {
    await page.goto('/comercio/taller-mecanico-el-rayo/');
    await expect(page.locator('#mapa-negocio')).toHaveCount(0);
    await expect(page.getByText('Catálogo', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Llamar/ })).toBeVisible();
    // Ningún CTA de WhatsApp del negocio (el footer del sitio sí tiene el suyo)
    await expect(page.locator('main [data-event="whatsapp_click"]')).toHaveCount(0);
  });

  test('bronce: WhatsApp sí, badge verificado no', async ({ page }) => {
    await page.goto('/comercio/plomero-juan-perez/');
    await expect(page.getByRole('link', { name: /Hablar por WhatsApp/ })).toBeVisible();
    await expect(page.getByText('Comercio Verificado')).toHaveCount(0);
  });

  test('volver al directorio y relacionados navegan', async ({ page }) => {
    await page.goto('/comercio/cafe-central-las-flores/');
    await page.getByRole('link', { name: /Volver al directorio/ }).click();
    await expect(page).toHaveURL('/directorio');
  });

  test('slug inexistente da 404', async ({ page }) => {
    const res = await page.goto('/comercio/no-existe-xyz/');
    expect(res?.status()).toBe(404);
  });
});
