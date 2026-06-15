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

// Re-export Prisma types — consumers should import from @platform/db, not @prisma/client directly
export type { PrismaClient };
export const db = prisma;
export type { Prisma, IqSession } from '@prisma/client';
// Re-export all generated model types so consumers don't need @prisma/client as a direct dep
export type {
  User,
  Session,
  Category,
  Tag,
  Tool,
  ToolTag,
  Comment,
  Favorite,
  BlogPost,
  ApiUsageLog,
  ToolUsage,
  WebVital,
  ToolRequest,
  NewsletterSubscriber,
  ContactMessage,
  Subscription,
  AffiliateClick,
  AffiliateConversion,
  Referral,
  ApiKey,
  ReferralCode,
  ShortLink,
  IqQuestionBank,
  IqResponse,
  IqNormingSnapshot,
  IqQuestionAnalytics,
} from '@prisma/client';
