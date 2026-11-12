import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env['PORT'] ?? 3000);

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: Boolean(process.env['CI']),
    retries: process.env['CI'] ? 2 : 0,
    reporter: 'list',
    use: {
        baseURL: `http://localhost:${PORT}`,
        trace: 'on-first-retry',
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        {
            name: 'reduced-motion',
            use: { ...devices['Desktop Chrome'], contextOptions: { reducedMotion: 'reduce' } },
        },
        { name: 'mobile', use: { ...devices['Pixel 7'] } },
    ],
    webServer: {
        command: 'pnpm build && pnpm start',
        port: PORT,
        reuseExistingServer: !process.env['CI'],
        timeout: 180_000,
    },
});
