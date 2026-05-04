import { env } from "@/lib/env";
import { getClientIp } from "@/lib/ip";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Verify a Turnstile token from the client.
 *
 * Returns:
 *   { ok: true }                  - token is valid (or check skipped because
 *                                   no secret is configured)
 *   { ok: false, reason }         - token rejected
 *
 * If TURNSTILE_SECRET_KEY isn't set we skip the check so dev still works.
 */
export async function verifyTurnstile(token, request) {
    const secret = env.TURNSTILE_SECRET_KEY;
    if (!secret) {
        return { ok: true, skipped: true };
    }

    if (!token || typeof token !== "string") {
        return { ok: false, reason: "Missing CAPTCHA token" };
    }

    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);
    const ip = getClientIp(request);
    if (ip && ip !== "unknown") {
        params.append("remoteip", ip);
    }

    try {
        const res = await fetch(VERIFY_URL, {
            method: "POST",
            body: params,
            signal: AbortSignal.timeout(5000),
        });
        const data = await res.json();
        if (data.success) return { ok: true };
        return { ok: false, reason: "CAPTCHA verification failed" };
    } catch (error) {
        console.warn("Turnstile verification error", error);
        return { ok: false, reason: "CAPTCHA service unavailable" };
    }
}

export function turnstileEnabled() {
    return Boolean(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}
