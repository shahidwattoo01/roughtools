import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'packages/*/src/__tests__/**/*.test.ts',
      'apps/*/src/__tests__/**/*.test.ts',
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'packages/calculators-core/src/**/*.ts',
        'apps/api/src/**/*.ts',
      ],
      exclude: [
        '**/__tests__/**',
        '**/dist/**',
        '**/node_modules/**',
      ],
    },
  },
});