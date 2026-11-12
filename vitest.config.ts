import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    // server-only 는 react-server 조건 밖에서 import 하면 던진다. 테스트에서는 빈 모듈로 바꾼다
    alias: {
      'server-only': fileURLToPath(new URL('./node_modules/server-only/empty.js', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/__test__/**/*.test.{ts,tsx}'],
    css: false,
  },
});
