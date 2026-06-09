// Re-export the shared singleton Prisma client.
// Previously this file had its own singleton using global.__prisma (a different key
// than lib/prisma.ts which uses globalThis.prisma), risking two PrismaClient instances.
// Now both use the same singleton via the shared lib.
export { prisma } from '@/lib/prisma'
