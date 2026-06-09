import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function globalSetup() {
  const databaseUrl = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('TEST_DATABASE_URL or DATABASE_URL must be set for E2E tests');
  }

  // Apply any pending migrations so the schema is current before the app server starts
  execSync('pnpm --filter @platform/db db:migrate:prod', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });

  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });

  try {
    const passwordHash = await bcrypt.hash('TestPassword123!', 10);

    // Seed the user that auth.spec.ts logs in with
    await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: { passwordHash, emailVerified: true, isActive: true },
      create: {
        email: 'test@example.com',
        username: 'testuser',
        passwordHash,
        name: 'Test User',
        emailVerified: true,
        isActive: true,
      },
    });

    // Seed a category so tool-creation flows have a valid FK target
    await prisma.category.upsert({
      where: { slug: 'test-category' },
      update: {},
      create: {
        slug: 'test-category',
        name: 'Test Category',
        sortOrder: 0,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

export default globalSetup;
