import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createClient(): Redis {
  const url = process.env.REDIS_URL ?? "redis://localhost:6379";

  const client = new Redis(url, {
    maxRetriesPerRequest: 3,
    retryStrategy(times: number) {
      return Math.min(times * 200, 5000);
    },
    lazyConnect: true,
    enableReadyCheck: true,
  });

  client.on("error", (err) => {
    console.error("[Redis] Connection error:", err.message);
  });

  client.on("connect", () => {
    console.log("[Redis] Connected");
  });

  return client;
}

export const redis = globalForRedis.redis ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

// ─── Typed cache helpers ─────────────────────────────────

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const raw = await redis.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async delPattern(pattern: string): Promise<void> {
    const stream = redis.scanStream({ match: pattern, count: 100 });
    const keys: string[] = [];
    stream.on("data", (result: string[]) => keys.push(...result));
    stream.on("end", async () => {
      if (keys.length > 0) await redis.del(...keys);
    });
  },

  async flush(): Promise<void> {
    await redis.flushdb();
  },
};

/**
 * Read-through cache pattern.
 * Checks cache first, falls back to `fn`, stores result with TTL.
 */
export async function cached<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds: number,
): Promise<T> {
  const existing = await cache.get<T>(key);
  if (existing !== null) return existing;

  const result = await fn();
  await cache.set(key, result, ttlSeconds);
  return result;
}

// ─── Common key patterns ─────────────────────────────────

export const CacheKeys = {
  userById: (id: string) => `user:${id}`,
  userByEmail: (email: string) => `user:email:${email}`,
  toolById: (id: string) => `tool:${id}`,
  toolBySlug: (slug: string) => `tool:slug:${slug}`,
  toolsList: (page: number, perPage: number) => `tools:list:${page}:${perPage}`,
  toolsFeatured: () => "tools:featured",
  categoriesTree: () => "categories:tree",
  blogBySlug: (slug: string) => `blog:slug:${slug}`,
  blogList: (page: number, perPage: number) => `blog:list:${page}:${perPage}`,
  rateLimit: (ip: string) => `rate:${ip}`,
} as const;

// ─── Default TTLs (seconds) ──────────────────────────────

export const CacheTTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 900, // 15 minutes
  DAY: 86400, // 24 hours
} as const;
