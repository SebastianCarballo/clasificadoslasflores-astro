import { defineConfig, devices } from '@playwright/test';

// E2E contra el BUILD de producción (dist/), no contra el dev server.
// Flujo: pnpm test:e2e  →  build + serve :4333 + suite.
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://127.0.0.1:4333',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'pnpm preview --port 4333 --host 127.0.0.1',
    url: 'http://127.0.0.1:4333/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
