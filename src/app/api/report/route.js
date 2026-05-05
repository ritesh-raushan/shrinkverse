import { NextResponse } from "next/server";
import { checkRequestRateLimit } from "@/lib/rateLimit";
import { logger } from "@/lib/logger";
import { getClientIp, hashIp } from "@/lib/ip";
import { env } from "@/lib/env";

const REASONS = new Set([
    "phishing",
    "malware",
    "scam",
    "copyright",
    "harassment",
    "csam",
    "other",
]);

const URL_REGEX = /^https?:\/\/.+/i;

export async function POST(req) {
    try {
        const rl = await checkRequestRateLimit("abuseReport", req);
        if (!rl.success) {
            return NextResponse.json(
                { error: "Too many reports. Please try again later." },
                {
                    status: 429,
                    headers: { "Retry-After": String(rl.retryAfterSeconds) },
                }
            );
        }

        const body = await req.json().catch(() => null);
        const shortUrl = typeof body?.shortUrl === "string" ? body.shortUrl.trim() : "";
        const reason =
            typeof body?.reason === "string" && REASONS.has(body.reason) ? body.reason : "other";
        const details = typeof body?.details === "string" ? body.details.trim().slice(0, 2000) : "";
        const reporterEmail =
            typeof body?.reporterEmail === "string" ? body.reporterEmail.trim().slice(0, 120) : "";

        if (!URL_REGEX.test(shortUrl)) {
            return NextResponse.json(
                { error: "Please provide a valid short URL" },
                { status: 400 }
            );
        }

        // We don't have an email service wired in yet, so log the report.
        // Once the moderation queue is in place this becomes an insert into
        // an `AbuseReport` collection plus a transactional email.
        logger.info("abuse report received", {
            shortUrl,
            reason,
            details,
            reporterEmail: reporterEmail || null,
            destination: env.ABUSE_REPORT_EMAIL || "(not configured)",
            reporterIpHash: hashIp(getClientIp(req)),
        });

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (error) {
        logger.error(error, { route: "POST /api/report" });
        return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
    }
}
