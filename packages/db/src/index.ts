// ============================================================
// @platform/db — Prisma client singleton
// ============================================================
// IMPORTANT: In development, Next.js hot reloads modules constantly.
// Without this singleton pattern, you will create dozens of Prisma
// client connections and exhaust your database connection pool.
// ============================================================

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Get the Prisma client instance (singleton pattern)
 */
export function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });

  globalForPrisma.prisma = prisma;

  return prisma;
}

/**
 * Default Prisma client instance
 */
export const prisma = getPrismaClient();

/**
 * Gracefully disconnect from the database
 */
export async function disconnectDatabase(): Promise<void> {
  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect();
    globalForPrisma.prisma = undefined;
  }
}

/**
 * Check if the database connection is healthy
 */
export async function isDatabaseHealthy(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

// Re-export Prisma types for convenience
export type { PrismaClient };

export const db = prisma;
export type { Prisma } from '@prisma/client';
