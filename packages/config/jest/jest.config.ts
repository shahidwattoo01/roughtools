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
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '\\.spec\\.ts$'],
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/index.ts',
    '!src/middleware.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

export default createJestConfig(config);