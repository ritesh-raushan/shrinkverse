import { env } from "@/lib/env";

const MAX_URL_LENGTH = 2048;

const PRIVATE_HOSTS = new Set([
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
    "169.254.169.254", // AWS / GCP metadata endpoint
]);

const PRIVATE_IPV4_RANGES = [
    /^10\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^127\./,
    /^0\./,
    /^169\.254\./,
];

/**
 * Validate a long URL before we let it into the database.
 * Returns `{ ok: true, url }` on success or `{ ok: false, reason }` on failure.
 */
export function validateLongUrl(input, { selfHost } = {}) {
    if (typeof input !== "string") {
        return { ok: false, reason: "URL is required" };
    }

    const trimmed = input.trim();
    if (!trimmed) {
        return { ok: false, reason: "URL is required" };
    }
    if (trimmed.length > MAX_URL_LENGTH) {
        return { ok: false, reason: `URL must be ${MAX_URL_LENGTH} characters or fewer` };
    }

    let parsed;
    try {
        parsed = new URL(trimmed);
    } catch {
        return { ok: false, reason: "Please enter a valid URL" };
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { ok: false, reason: "Only http:// and https:// URLs are allowed" };
    }

    const host = parsed.hostname.toLowerCase();

    if (PRIVATE_HOSTS.has(host)) {
        return { ok: false, reason: "Private and local addresses are not allowed" };
    }

    if (PRIVATE_IPV4_RANGES.some((re) => re.test(host))) {
        return { ok: false, reason: "Private and local addresses are not allowed" };
    }

    if (selfHost && host === selfHost.toLowerCase()) {
        return { ok: false, reason: "Cannot shorten links to ShrinkVerse itself" };
    }

    return { ok: true, url: parsed.toString() };
}

/**
 * Check a URL against the Google Safe Browsing API. Returns:
 *   { safe: true }                - URL is clean (or check skipped because no API key)
 *   { safe: false, threat }       - URL is flagged
 *   { safe: true, skipped: true } - API key absent, treat as safe
 */
export async function checkSafeBrowsing(url) {
    const apiKey = env.GOOGLE_SAFE_BROWSING_API_KEY;
    if (!apiKey) {
        return { safe: true, skipped: true };
    }

    try {
        const res = await fetch(
            `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client: { clientId: "shrinkverse", clientVersion: "1.0.0" },
                    threatInfo: {
                        threatTypes: [
                            "MALWARE",
                            "SOCIAL_ENGINEERING",
                            "UNWANTED_SOFTWARE",
                            "POTENTIALLY_HARMFUL_APPLICATION",
                        ],
                        platformTypes: ["ANY_PLATFORM"],
                        threatEntryTypes: ["URL"],
                        threatEntries: [{ url }],
                    },
                }),
                signal: AbortSignal.timeout(5000),
            }
        );

        if (!res.ok) {
            console.warn("Safe Browsing check failed", res.status);
            return { safe: true, skipped: true };
        }

        const data = await res.json();
        if (Array.isArray(data?.matches) && data.matches.length > 0) {
            return { safe: false, threat: data.matches[0]?.threatType ?? "UNSAFE" };
        }

        return { safe: true };
    } catch (error) {
        console.warn("Safe Browsing check error", error);
        return { safe: true, skipped: true };
    }
}
