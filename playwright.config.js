import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  timeout: 90_000,
  use: {
    baseURL: 'http://localhost:3100',
    viewport: { width: 1440, height: 810 },
    launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {}
  },
  webServer: { command: 'MIN_RUN_SEC=5 PORT=3100 node scripts/dev.mjs', url: 'http://localhost:3100', reuseExistingServer: false }
});
