"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import ParticleAnimation from "@/components/ParticleCanvas";
import toast from 'react-hot-toast';
import { Copy, Info } from 'lucide-react';
import Link from 'next/link';

export default function ShortenPage() {
    const [longUrl, setLongUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");
    const [isGuest, setIsGuest] = useState(true);
    const [expiresAt, setExpiresAt] = useState(null);
    const [origin, setOrigin] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsGuest(false);
        }
        setOrigin(window.location.origin);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                body: JSON.stringify({ longUrl, alias }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to shorten URL');
            }

            const shortUrl = `${origin}/${data.url.alias}`;
            setShortenedUrl(shortUrl);
            setExpiresAt(data.url.expiresAt);
            setIsGuest(data.isGuest);
            toast.success('URL shortened successfully!');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shortenedUrl);
            toast.success('Copied to clipboard!');
        } catch (error) {
            toast.error('Failed to copy to clipboard');
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <ParticleAnimation />

            <div className="relative z-10 w-full max-w-md mx-auto p-8">
                <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 shadow-[0_0_50px_-12px_rgba(0,255,255,0.25)] border border-cyan-500/30 animate-pulse-slow">
                    <h1 className="text-2xl font-bold text-white mb-8 text-center">
                        <span className="text-[#00ffee]">Shrink</span>
                        <span className="text-white">Verse</span>
                    </h1>

                    {/* Guest User Notice */}
                    <div className="mb-6 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                        <div className="flex items-start space-x-2">
                            <Info className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-white/80">
                                {isGuest ? (
                                    <>
                                        Guest links expire in 15 days.{' '}
                                        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 underline">
                                            Login
                                        </Link>{' '}
                                        for permanent links!
                                    </>
                                ) : (
                                    'Your links will never expire!'
                                )}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Long URL Input */}
                        <div className="space-y-2">
                            <label className="block text-[#00ffee] text-sm font-medium">
                                Enter Long URL
                            </label>
                            <input
                                type="url"
                                value={longUrl}
                                onChange={(e) => setLongUrl(e.target.value)}
                                placeholder="https://example.com/very-long-url"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-cyan-500/20 text-white placeholder-white/50 focus:outline-none focus:border-[#00ffee] focus:ring-1 focus:ring-[#00ffee] transition-all"
                            />
                        </div>

                        {/* Custom Alias Input */}
                        <div className="space-y-2">
                            <label className="block text-[#00ffee] text-sm font-medium">
                                Enter Custom Alias
                            </label>
                            <div className="flex items-stretch space-x-2">
                                <div className="bg-white/5 border border-cyan-500/20 rounded-l-lg px-4 py-3 text-white/80 flex items-center">
                                    {origin ? `${new URL(origin).host}/` : 'loading...'}
                                </div>
                                <input
                                    type="text"
                                    value={alias}
                                    onChange={(e) => setAlias(e.target.value)}
                                    placeholder="custom-alias"
                                    className="w-full flex-1 px-4 py-3 rounded-r-lg bg-white/5 border border-cyan-500/20 text-white placeholder-white/50 focus:outline-none focus:border-[#00ffee] focus:ring-1 focus:ring-[#00ffee] transition-all"
                                />
                            </div>
                        </div>

                        {/* Shorten Button */}
                        <button
                            type="submit"
                            className="w-full inline-flex text-center justify-center px-6 py-3 rounded-full bg-[#00ffee] text-black font-medium hover:bg-opacity-90 transition-all hover:scale-105 transform hover:bg-[#00ffee]"
                        >
                            Shorten Now
                        </button>
                    </form>

                    {shortenedUrl && (
                        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-cyan-500/20">
                            <div className="flex items-center justify-between">
                                <p className="text-white/90 truncate">{shortenedUrl}</p>
                                <button
                                    onClick={copyToClipboard}
                                    className="ml-2 p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                    <Copy size={20} />
                                </button>
                            </div>
                            {isGuest && expiresAt && (
                                <p className="mt-2 text-sm text-white/60">
                                    Expires: {new Date(expiresAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );

}