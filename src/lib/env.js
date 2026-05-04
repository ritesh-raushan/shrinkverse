/**
 * Centralised access to environment variables.
 *
 * - Required vars throw at boot if missing in production. In dev we warn so
 *   the app keeps running while you fill in `.env.local`.
 * - Optional vars return `undefined` when not set; callers must handle that.
 */

const isProd = process.env.NODE_ENV === "production";

function readRequired(key) {
    const value = process.env[key];
    if (!value) {
        const message = `Missing required environment variable: ${key}`;
        if (isProd) {
            throw new Error(message);
        }
        console.warn(`[env] ${message}`);
    }
    return value;
}

export const env = {
    MONGODB_URI: readRequired("MONGODB_URI"),
    NEXTAUTH_SECRET: readRequired("NEXTAUTH_SECRET"),
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    GOOGLE_SAFE_BROWSING_API_KEY: process.env.GOOGLE_SAFE_BROWSING_API_KEY,

    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    IP_HASH_SALT: process.env.IP_HASH_SALT,

    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,

    SENTRY_DSN: process.env.SENTRY_DSN,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,

    ABUSE_REPORT_EMAIL: process.env.ABUSE_REPORT_EMAIL,

    isProd,
};
