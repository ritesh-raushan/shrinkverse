"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Copy, Trash, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import ParticleAnimation from "@/components/ParticleCanvas";

export default function LinksPage() {
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [origin, setOrigin] = useState("");
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        if (status === "loading") return;
        if (status === "unauthenticated") {
            router.replace("/login");
            return;
        }

        setOrigin(
            process.env.NEXT_PUBLIC_BASE_URL ||
                (typeof window !== "undefined" ? window.location.origin : "")
        );
        fetchLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    const fetchLinks = async () => {
        try {
            const res = await fetch("/api/url");
            if (!res.ok) {
                throw new Error("Failed to fetch links");
            }
            const data = await res.json();
            setLinks(data.urls || []);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async (shortUrl) => {
        try {
            await navigator.clipboard.writeText(shortUrl);
            toast.success("Copied to clipboard!");
        } catch {
            toast.error("Failed to copy to clipboard");
        }
    };

    const deleteLink = async (alias) => {
        try {
            const res = await fetch(`/api/url/${alias}`, { method: "DELETE" });
            if (!res.ok) {
                throw new Error("Failed to delete link");
            }
            toast.success("Link deleted successfully");
            fetchLinks();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const visitLink = (longUrl) => {
        window.open(longUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <main className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
            <ParticleAnimation />

            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 shadow-[0_0_50px_-12px_rgba(0,255,255,0.25)] border border-cyan-500/30">
                    <h1 className="text-2xl font-bold text-white mb-8 text-center">
                        <span className="text-[#00ffee]">My</span>
                        <span className="text-white"> Links</span>
                    </h1>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00ffee]"></div>
                        </div>
                    ) : links.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-white/60 mb-4">
                                You haven&apos;t created any links yet.
                            </p>
                            <button
                                onClick={() => router.push("/shorten")}
                                className="px-6 py-3 bg-[#00ffee] text-black rounded-full font-medium hover:bg-opacity-90 transition-all"
                            >
                                Create Your First Link
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {links.map((link) => (
                                <div
                                    key={link._id}
                                    className="bg-white/5 rounded-lg p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white/60 text-sm mb-1 truncate">
                                                {link.longUrl}
                                            </p>
                                            <p className="text-[#00ffee] font-medium truncate">
                                                {`${origin}/${link.alias}`}
                                            </p>
                                            {link.expiresAt && (
                                                <p className="text-white/40 text-xs mt-1">
                                                    Expires:{" "}
                                                    {new Date(link.expiresAt).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <button
                                                onClick={() =>
                                                    copyToClipboard(`${origin}/${link.alias}`)
                                                }
                                                className="p-2 text-white/60 hover:text-[#00ffee] transition-colors"
                                                title="Copy to clipboard"
                                            >
                                                <Copy size={18} />
                                            </button>
                                            <button
                                                onClick={() => visitLink(link.longUrl)}
                                                className="p-2 text-white/60 hover:text-[#00ffee] transition-colors"
                                                title="Visit link"
                                            >
                                                <ExternalLink size={18} />
                                            </button>
                                            <button
                                                onClick={() => deleteLink(link.alias)}
                                                className="p-2 text-white/60 hover:text-red-400 transition-colors"
                                                title="Delete link"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => router.push("/shorten")}
                            className="px-6 py-3 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-all"
                        >
                            Create New Link
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
