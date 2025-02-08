"use client";

import { useState } from "react";
import ParticleAnimation from "@/components/ParticleCanvas";

export default function ShortenPage() {
    const [longUrl, setLongUrl] = useState("");
    const [alias, setAlias] = useState("");

    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Canvas Animation Background */}
            <ParticleAnimation />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-md mx-auto p-8">
                <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 shadow-[0_0_50px_-12px_rgba(0,255,255,0.25)] border border-cyan-500/30 animate-pulse-slow">
                    <h1 className="text-2xl font-bold text-white mb-8 text-center">
                        <span className="text-[#00ffee]">Shrink</span>
                        <span className="text-white">Verse</span>
                    </h1>

                    <div className="space-y-6">
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
                                    shrinkverse.xyz/
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
                            className="w-full inline-flex text-center justify-center px-6 py-3 rounded-full bg-[#00ffee] text-black font-medium hover:bg-opacity-90 transition-all hover:scale-105 transform hover:bg-[#00ffee]"
                        >
                            Shorten Now
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}