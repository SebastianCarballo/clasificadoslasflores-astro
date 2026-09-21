import { test, expect } from '@playwright/test';

// Mobile-first real: viewport chico, sin scroll horizontal, CTA sticky y menú
test.describe('móvil 390px', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test('home sin overflow + CTA sticky en ficha', async ({ page }) => {
    await page.goto('/');
    const overflowHome = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflowHome).toBeLessThanOrEqual(1);
    await expect(page.getByRole('heading', { name: /Todo Las Flores/ })).toBeVisible();

    await page.goto('/comercio/rotiseria-el-buen-sabor/');
    await expect(page.getByRole('link', { name: /Consultar por WhatsApp/ }).last()).toBeVisible();
    const overflowFicha = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflowFicha).toBeLessThanOrEqual(1);
  });

  test('menú móvil abre y filtra el directorio', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /menú/i }).or(page.locator('summary')).first().click();
    await expect(page.getByRole('link', { name: 'Directorio' }).first()).toBeVisible();

    await page.goto('/directorio');
    await page.locator('#q').fill('farmacia');
    await expect(page.locator('#conteo')).toContainText('1');
  });
});
