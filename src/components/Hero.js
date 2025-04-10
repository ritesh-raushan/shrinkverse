"use client";

import ParticleCanvas from "../components/ParticleCanvas";
import { ArrowRight, History } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Home() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    const handleViewLinks = () => {
        if (!isLoggedIn) {
            toast.error('Please login to view your links');
            return;
        }
        router.push('/links');
    };

    return (
        <main className="min-h-screen relative">
            {/* Canvas Layer as Background */}
            <div className="absolute inset-0 z-0">
                <ParticleCanvas />
            </div>

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center">
                {/* Content */}
                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 pb-5">
                        <span className="text-[#00ffee]">Shrink</span>
                        <span className="text-white">Verse</span>
                    </h1>
                    <p className="text-xl sm:text-2xl md:text-6xl font-semibold mb-6 pt-5 bg-gradient-to-r from-orange-500 to-cyan-500 bg-clip-text text-transparent">
                        Your Links, Your World
                    </p>
                    <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                        ShrinkVerse turns long URLs into short, customizable links that are easy to share and track. Simplify your sharing experience today! Make every link memorable and efficient. Create, share, and track with ease.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/shorten"
                            className="inline-flex items-center px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-opacity-90 transition-all hover:scale-105 transform hover:bg-[#00ffee]"
                        >
                            Shorten Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>

                        {isLoggedIn && (
                            <button
                                onClick={handleViewLinks}
                                className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition-all hover:scale-105 transform"
                            >
                                <History className="mr-2 h-5 w-5" />
                                View My Links
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}