import { notFound, redirect, permanentRedirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Url from "@/models/Url";
import { isReservedAlias } from "@/lib/alias";

export const metadata = {
    robots: { index: false, follow: false },
    title: "Redirecting...",
};

export const dynamic = "force-dynamic";

export default async function AliasRedirectPage({ params }) {
    const { alias } = await Promise.resolve(params);

    if (!alias || isReservedAlias(alias)) {
        notFound();
    }

    await dbConnect();

    const link = await Url.findOne({
        alias,
        $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }],
    })
        .select("longUrl userId")
        .lean();

    if (!link) {
        notFound();
    }

    if (link.userId) {
        permanentRedirect(link.longUrl);
    }
    redirect(link.longUrl);
}
