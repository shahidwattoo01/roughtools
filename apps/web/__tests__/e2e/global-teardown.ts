import { PrismaClient } from '@prisma/client';

async function globalTeardown() {
  const databaseUrl = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!databaseUrl) return;

  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
  });

  try {
    // Truncate every table in a single statement; CASCADE handles FK order automatically
    await prisma.$executeRawUnsafe(`
      TRUNCATE TABLE
        sessions,
        tool_tags,
        comments,
        favorites,
        api_keys,
        referrals,
        referral_codes,
        subscriptions,
        affiliate_clicks,
        affiliate_conversions,
        short_links,
        blog_posts,
        tools,
        categories,
        tags,
        api_usage_logs,
        tool_usage,
        web_vitals,
        tool_requests,
        newsletter_subscribers,
        contact_messages,
        users
      RESTART IDENTITY CASCADE
    `);
  } finally {
    await prisma.$disconnect();
  }
}

export default globalTeardown;
