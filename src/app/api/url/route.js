import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import Url from "@/models/Url";
import { authOptions } from "@/lib/authOptions";
import { validateLongUrl, checkSafeBrowsing } from "@/lib/urlSafety";
import { generateUniqueAlias, isReservedAlias, isValidAliasFormat } from "@/lib/alias";
import { env } from "@/lib/env";

const GUEST_TTL_MS = 15 * 24 * 60 * 60 * 1000;

function getSelfHost() {
    try {
        return new URL(env.NEXT_PUBLIC_BASE_URL).hostname;
    } catch {
        return undefined;
    }
}

export async function POST(req) {
    try {
        const body = await req.json().catch(() => null);
        const longUrl = typeof body?.longUrl === "string" ? body.longUrl.trim() : "";
        const customAlias = typeof body?.alias === "string" ? body.alias.trim() : "";

        const validation = validateLongUrl(longUrl, { selfHost: getSelfHost() });
        if (!validation.ok) {
            return NextResponse.json({ error: validation.reason }, { status: 400 });
        }

        if (customAlias) {
            if (!isValidAliasFormat(customAlias)) {
                return NextResponse.json(
                    {
                        error: "Alias must be 3-32 characters using letters, numbers, _, or -",
                    },
                    { status: 400 }
                );
            }
            if (isReservedAlias(customAlias)) {
                return NextResponse.json(
                    { error: "That alias is reserved, please choose another" },
                    { status: 400 }
                );
            }
        }

        const safety = await checkSafeBrowsing(validation.url);
        if (!safety.safe) {
            return NextResponse.json(
                { error: "This URL was flagged as unsafe and cannot be shortened" },
                { status: 400 }
            );
        }

        await dbConnect();

        if (customAlias) {
            const existing = await Url.findOne({ alias: customAlias }).lean();
            if (existing) {
                return NextResponse.json({ error: "Alias already taken" }, { status: 409 });
            }
        }

        const session = await getServerSession(authOptions);
        const userId = session?.user?.id ?? null;
        const expiresAt = userId ? null : new Date(Date.now() + GUEST_TTL_MS);

        const alias =
            customAlias ||
            (await generateUniqueAlias(async (candidate) => {
                const hit = await Url.findOne({ alias: candidate }).select("_id").lean();
                return Boolean(hit);
            }));

        const url = await Url.create({
            longUrl: validation.url,
            alias,
            userId,
            expiresAt,
            createdAt: new Date(),
        });

        return NextResponse.json({
            url,
            isGuest: !userId,
            expiresAt: url.expiresAt,
        });
    } catch (error) {
        console.error("create url error", error);
        const message = error?.message?.includes("alias") ? error.message : "Failed to shorten URL";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const urls = await Url.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ urls });
    } catch (error) {
        console.error("list urls error", error);
        return NextResponse.json({ error: "Failed to load links" }, { status: 500 });
    }
}
