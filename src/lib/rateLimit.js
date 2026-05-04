import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";
import { getClientIp, hashIp } from "@/lib/ip";

/**
 * If Upstash credentials aren't set, we skip rate limiting entirely (returning
 * `success: true` for every check). This keeps local dev working without
 * external services. In production the env helper warns / throws at boot
 * via a separate path; rate limits are an explicit prod-only protection.
 */

let redis = null;
if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
    });
}

function makeLimiter(tokens, window, prefix) {
    if (!redis) return null;
    return new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(tokens, window),
        analytics: false,
        prefix: `shrinkverse:${prefix}`,
    });
}

const limiters = {
    shortenGuest: makeLimiter(5, "60 s", "shorten-guest"),
    shortenAuthed: makeLimiter(30, "60 s", "shorten-authed"),
    register: makeLimiter(3, "1 h", "register"),
    abuseReport: makeLimiter(5, "1 h", "abuse-report"),
};

/**
 * Run a rate-limit check. Returns:
 *   { success: true }                                  - allowed (or skipped)
 *   { success: false, retryAfterSeconds, limit, ... }  - blocked
 */
export async function checkRateLimit(name, identifier) {
    const limiter = limiters[name];
    if (!limiter) {
        return { success: true, skipped: true };
    }

    const result = await limiter.limit(identifier);
    if (result.success) {
        return {
            success: true,
            limit: result.limit,
            remaining: result.remaining,
            reset: result.reset,
        };
    }

    const retryAfterSeconds = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
    return {
        success: false,
        retryAfterSeconds,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
    };
}

/**
 * Convenience: rate-limit a request by hashed IP under a named bucket.
 */
export async function checkRequestRateLimit(name, request, extraKey = "") {
    const ip = getClientIp(request);
    const id = `${hashIp(ip)}${extraKey ? `:${extraKey}` : ""}`;
    return checkRateLimit(name, id);
}
