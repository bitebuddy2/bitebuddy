/**
 * Simple in-memory rate limiter for authentication endpoints
 * Tracks attempts by IP + email combination
 */

interface RateLimitEntry {
  attempts: number;
  resetAt: number;
}

// In-memory store for rate limiting (use Redis in production for multi-instance deployments)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

export const authRateLimitConfig: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
};

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., "ip:email")
 * @param config - Rate limit configuration
 * @returns Object with isLimited flag and remaining attempts
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = authRateLimitConfig
): { isLimited: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No entry or expired entry - allow and create new entry
  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowMs;
    rateLimitStore.set(identifier, {
      attempts: 1,
      resetAt,
    });

    return {
      isLimited: false,
      remaining: config.maxAttempts - 1,
      resetAt,
    };
  }

  // Entry exists and is still valid
  if (entry.attempts >= config.maxAttempts) {
    return {
      isLimited: true,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment attempts
  entry.attempts += 1;
  rateLimitStore.set(identifier, entry);

  return {
    isLimited: false,
    remaining: Math.max(0, config.maxAttempts - entry.attempts),
    resetAt: entry.resetAt,
  };
}

/**
 * Reset rate limit for a specific identifier (e.g., on successful auth)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Get client IP from request headers (works with Vercel and most proxies)
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0] ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    'unknown'
  );
}
