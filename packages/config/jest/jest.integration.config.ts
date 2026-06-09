import type { Config } from 'jest';
import nextJest from 'next/jest';
import path from 'path';

const createJestConfig = nextJest({
  dir: path.resolve(__dirname, '../../../apps/web'),
});

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/packages/config/jest/setup.ts'],
  moduleNameMapper: {
    '^@workspace/ui(.*)$': '<rootDir>/packages/ui/src$1',
    '^@workspace/utils(.*)$': '<rootDir>/packages/utils/src$1',
    '^@workspace/config(.*)$': '<rootDir>/packages/config/src$1',
    '^@workspace/types(.*)$': '<rootDir>/packages/types/src$1',
    '^@/(.*)$': '<rootDir>/apps/web/src/$1',
  },
  testMatch: ['**/__tests__/integration/**/*.test.{ts,tsx}'],
  testTimeout: 15000,
  coverageProvider: 'v8',
};

export default createJestConfig(config);