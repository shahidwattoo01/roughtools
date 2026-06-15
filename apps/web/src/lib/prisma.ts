import { prisma as dbPrisma } from '@platform/db';
import type { PrismaClient } from '@platform/db';

export type { PrismaClient };
export const prisma = dbPrisma;