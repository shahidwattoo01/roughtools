import { PrismaClient } from '@prisma/client';
/**
 * Get the Prisma client instance (singleton pattern)
 */
export declare function getPrismaClient(): PrismaClient;
/**
 * Default Prisma client instance
 */
export declare const prisma: PrismaClient<import("node_modules/@prisma/client/default").Prisma.PrismaClientOptions, never, import("node_modules/@prisma/client/runtime/library").DefaultArgs>;
/**
 * Gracefully disconnect from the database
 */
export declare function disconnectDatabase(): Promise<void>;
/**
 * Check if the database connection is healthy
 */
export declare function isDatabaseHealthy(): Promise<boolean>;
export type { PrismaClient };
export declare const db: PrismaClient<import("node_modules/@prisma/client/default").Prisma.PrismaClientOptions, never, import("node_modules/@prisma/client/runtime/library").DefaultArgs>;
export type { Prisma } from '@prisma/client';
//# sourceMappingURL=index.d.ts.map