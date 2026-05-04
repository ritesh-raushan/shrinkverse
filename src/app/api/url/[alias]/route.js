import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import Url from "@/models/Url";
import { authOptions } from "@/lib/authOptions";
import { logger } from "@/lib/logger";

export async function GET(_request, { params }) {
    try {
        const { alias } = await Promise.resolve(params);
        await dbConnect();

        const url = await Url.findOne({
            alias,
            $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }],
        }).lean();

        if (!url) {
            return NextResponse.json({ error: "URL not found or expired" }, { status: 404 });
        }

        return NextResponse.json({ longUrl: url.longUrl });
    } catch (error) {
        logger.error(error, { route: "GET /api/url/[alias]" });
        return NextResponse.json({ error: "Failed to fetch URL" }, { status: 500 });
    }
}

export async function DELETE(_request, { params }) {
    try {
        const { alias } = await Promise.resolve(params);
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const url = await Url.findOne({ alias, userId: session.user.id });

        if (!url) {
            return NextResponse.json({ error: "URL not found or unauthorized" }, { status: 404 });
        }

        await url.deleteOne();
        return NextResponse.json({ message: "URL deleted successfully" });
    } catch (error) {
        logger.error(error, { route: "DELETE /api/url/[alias]" });
        return NextResponse.json({ error: "Failed to delete URL" }, { status: 500 });
    }
}
