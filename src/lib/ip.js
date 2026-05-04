import crypto from "crypto";
import { env } from "@/lib/env";

/**
 * Best-effort client IP extraction from request headers. Returns "unknown"
 * if nothing usable is found.
 *
 * Order of preference:
 *   1. Vercel: x-real-ip
 *   2. Standard: x-forwarded-for (first hop)
 *   3. Cloudflare: cf-connecting-ip
 */
export function getClientIp(request) {
    const headers = request?.headers;
    if (!headers) return "unknown";

    const realIp = headers.get("x-real-ip");
    if (realIp) return realIp.trim();

    const xff = headers.get("x-forwarded-for");
    if (xff) {
        const first = xff.split(",")[0]?.trim();
        if (first) return first;
    }

    const cf = headers.get("cf-connecting-ip");
    if (cf) return cf.trim();

    return "unknown";
}

/**
 * Hash an IP using a server-side salt. Used everywhere we'd otherwise log
 * or store an IP, so we get cardinality for rate limiting and abuse triage
 * without retaining the actual IP.
 */
export function hashIp(ip) {
    if (!ip || ip === "unknown") return "unknown";

    const salt = env.IP_HASH_SALT;
    if (!salt) {
        // Without a salt, hashing is pointless. Fall back to a coarse mask.
        return ip.split(".").slice(0, 2).join(".") + ".x.x";
    }

    return crypto.createHmac("sha256", salt).update(ip).digest("hex").slice(0, 16);
}
