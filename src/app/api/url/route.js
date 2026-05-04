import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import Url from "@/models/Url";
import { authOptions } from "@/lib/authOptions";

const GUEST_TTL_MS = 15 * 24 * 60 * 60 * 1000;

export async function POST(req) {
    try {
        const body = await req.json().catch(() => null);
        const longUrl = typeof body?.longUrl === "string" ? body.longUrl.trim() : "";
        const alias = typeof body?.alias === "string" ? body.alias.trim() : "";

        if (!longUrl) {
            return NextResponse.json({ error: "longUrl is required" }, { status: 400 });
        }

        await dbConnect();

        if (alias) {
            const existing = await Url.findOne({ alias }).lean();
            if (existing) {
                return NextResponse.json({ error: "Alias already taken" }, { status: 409 });
            }
        }

        const session = await getServerSession(authOptions);
        const userId = session?.user?.id ?? null;
        const expiresAt = userId ? null : new Date(Date.now() + GUEST_TTL_MS);

        const url = await Url.create({
            longUrl,
            alias: alias || Math.random().toString(36).substring(2, 8),
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
        return NextResponse.json({ error: "Failed to shorten URL" }, { status: 500 });
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
