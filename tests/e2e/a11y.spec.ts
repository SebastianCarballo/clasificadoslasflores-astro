import { test, expect } from '@playwright/test';

// Accesibilidad estructural en las 3 páginas clave
for (const ruta of ['/', '/directorio', '/comercio/ficha-gratis-muestra/']) {
  test(`a11y base en ${ruta}: h1 único, alts, lang y skip-link`, async ({ page }) => {
    await page.goto(ruta);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es-AR');
    const sinAlt = await page.locator('img:not([alt])').count();
    expect(sinAlt).toBe(0);
    await expect(page.getByRole('link', { name: /Saltar al contenido/ })).toBeAttached();
    const main = page.locator('main#contenido');
    await expect(main).toBeVisible();
  });
}

test('formularios con labels asociados', async ({ page }) => {
  await page.goto('/publicar');
  for (const id of ['nombre', 'categoria', 'whatsapp', 'plan', 'desc']) {
    await expect(page.locator(`label[for="${id}"]`)).toHaveCount(1);
  }
});
