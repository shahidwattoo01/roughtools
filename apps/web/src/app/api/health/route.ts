export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, { status: string; latency?: number; error?: string }> = {};

  // Database health check
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    checks.database = {
      status: 'healthy',
      latency: Date.now() - dbStart,
    };
  } catch (error) {
    checks.database = {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Redis health check (if available)
  if (process.env.REDIS_URL) {
    try {
      const redisStart = Date.now();
      const Redis = (await import('ioredis')).default;
      const redis = new Redis(process.env.REDIS_URL, { lazyConnect: true, connectTimeout: 3000 });
      await redis.connect();
      await redis.ping();
      redis.disconnect();
      checks.redis = {
        status: 'healthy',
        latency: Date.now() - redisStart,
      };
    } catch (error) {
      checks.redis = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Overall status
  const allHealthy = Object.values(checks).every((check) => check.status === 'healthy');
  const status = allHealthy ? 'healthy' : 'degraded';
  const statusCode = allHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
      checks,
      totalLatency: Date.now() - startTime,
    },
    { status: statusCode }
  );
}