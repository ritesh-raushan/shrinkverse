import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Url from "@/models/Url";
import { isReservedAlias } from "@/lib/alias";
import { logger } from "@/lib/logger";

/**
 * Pure route handler for short-link redirects. Returns a raw HTTP response
 * (307/308) with no React rendering, no layout, and no loading state.
 *
 * For missing or expired aliases we redirect to /link-not-found which
 * shows a friendly error page.
 */
function notFoundRedirect(request) {
    return NextResponse.redirect(new URL("/link-not-found", request.url), {
        status: 307,
    });
}

export async function GET(request, { params }) {
    try {
        const { alias } = await Promise.resolve(params);

        if (!alias || isReservedAlias(alias)) {
            return notFoundRedirect(request);
        }

        await dbConnect();

        const link = await Url.findOne({
            alias,
            $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }],
        })
            .select("longUrl userId")
            .lean();

        if (!link) {
            return notFoundRedirect(request);
        }

        // Authed users' permanent links use 308 so browsers and search
        // engines pass SEO juice to the destination. Guest links use 307
        // since they expire.
        const status = link.userId ? 308 : 307;
        return NextResponse.redirect(link.longUrl, { status });
    } catch (error) {
        logger.error(error, { route: "GET /[alias]" });
        return notFoundRedirect(request);
    }
}
