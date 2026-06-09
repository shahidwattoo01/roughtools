"use strict";
// ============================================================
// @platform/db — Prisma client singleton
// ============================================================
// IMPORTANT: In development, Next.js hot reloads modules constantly.
// Without this singleton pattern, you will create dozens of Prisma
// client connections and exhaust your database connection pool.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.prisma = void 0;
exports.getPrismaClient = getPrismaClient;
exports.disconnectDatabase = disconnectDatabase;
exports.isDatabaseHealthy = isDatabaseHealthy;
const client_1 = require("@prisma/client");
const globalForPrisma = globalThis;
/**
 * Get the Prisma client instance (singleton pattern)
 */
function getPrismaClient() {
    if (globalForPrisma.prisma) {
        return globalForPrisma.prisma;
    }
    const prisma = new client_1.PrismaClient({
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
exports.prisma = getPrismaClient();
/**
 * Gracefully disconnect from the database
 */
async function disconnectDatabase() {
    if (globalForPrisma.prisma) {
        await globalForPrisma.prisma.$disconnect();
        globalForPrisma.prisma = undefined;
    }
}
/**
 * Check if the database connection is healthy
 */
async function isDatabaseHealthy() {
    try {
        await exports.prisma.$queryRaw `SELECT 1`;
        return true;
    }
    catch {
        return false;
    }
}
exports.db = exports.prisma;
//# sourceMappingURL=index.js.map