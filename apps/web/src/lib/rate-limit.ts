/**
 * Simple in-memory rate limiter for Next.js API routes.
 * Uses a sliding window counter per IP address.
 * Suitable for self-hosted (Railway/Docker) deployments.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Prune expired entries every 5 minutes to prevent memory leaks
setInterval(
  () => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) store.delete(key)
    }
  },
  5 * 60 * 1000
)

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

/**
 * Check whether a given identifier (IP address) is within the rate limit.
 * @param identifier - typically the client IP address
 * @param limit - max requests per window (default 10)
 * @param windowMs - window size in ms (default 15 minutes)
 */
export function rateLimit(
  identifier: string,
  limit = 10,
  windowMs = 15 * 60 * 1000
): RateLimitResult {
  const now = Date.now()
  const existing = store.get(identifier)

  if (!existing || existing.resetAt < now) {
    const entry: RateLimitEntry = { count: 1, resetAt: now + windowMs }
    store.set(identifier, entry)
    return { allowed: true, remaining: limit - 1, resetAt: entry.resetAt }
  }

  existing.count += 1
  const allowed = existing.count <= limit
  return { allowed, remaining: Math.max(0, limit - existing.count), resetAt: existing.resetAt }
}

/**
 * Extract the real client IP from a Next.js request.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}
