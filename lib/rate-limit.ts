import type { NextRequest } from "next/server"

// In-memory sliding-window rate limiter. Good enough for a single-process
// deployment; counters reset on restart.

const buckets = new Map<string, number[]>()
const MAX_KEYS = 10_000

// Returns true when the call is allowed, false when the limit is exceeded.
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now()
    const cutoff = now - windowMs

    let timestamps = buckets.get(key)
    if (!timestamps) {
        // Evict everything if the map grows unbounded (e.g. IP spoofing floods)
        if (buckets.size >= MAX_KEYS) buckets.clear()
        timestamps = []
        buckets.set(key, timestamps)
    }

    while (timestamps.length > 0 && timestamps[0] <= cutoff) {
        timestamps.shift()
    }

    if (timestamps.length >= limit) return false
    timestamps.push(now)
    return true
}

export function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for")
    if (forwarded) return forwarded.split(",")[0].trim()
    return request.headers.get("x-real-ip") ?? "unknown"
}
