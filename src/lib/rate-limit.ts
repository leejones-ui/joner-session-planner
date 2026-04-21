// Simple in-memory rate limiter. Good enough for v1, resets on server cold-start.
// For Vercel serverless this is per-instance. Swap to Redis if we start getting real traffic.

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 10;
const buckets = new Map<string, number[]>();

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const prev = buckets.get(ip) ?? [];
  const live = prev.filter((t) => now - t < WINDOW_MS);
  if (live.length >= MAX_PER_WINDOW) {
    buckets.set(ip, live);
    const oldest = live[0];
    const retry = Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000));
    return { ok: false, retryAfterSeconds: retry };
  }
  live.push(now);
  buckets.set(ip, live);
  return { ok: true };
}
