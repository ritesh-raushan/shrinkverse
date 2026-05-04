"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
    useEffect(() => {
        console.error("Unhandled app error:", error);
    }, [error]);

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <p className="text-red-400 text-sm font-medium tracking-wider uppercase mb-4">
                    Something went wrong
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Unexpected error</h1>
                <p className="text-white/60 mb-8">
                    We&apos;ve been notified and are looking into it. Please try again, or head back
                    home.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 rounded-full bg-[#00ffee] text-black font-medium hover:bg-opacity-90 transition-all"
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-all"
                    >
                        Go home
                    </Link>
                </div>
            </div>
        </main>
    );
}
