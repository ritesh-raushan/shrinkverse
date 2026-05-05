"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "shrinkverse-cookie-consent-v1";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (!stored) setIsVisible(true);
        } catch {
            // localStorage may be unavailable in private mode; show the banner.
            setIsVisible(true);
        }
    }, []);

    const accept = () => {
        try {
            window.localStorage.setItem(STORAGE_KEY, "accepted");
        } catch {
            // ignore
        }
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div
            role="dialog"
            aria-live="polite"
            aria-label="Cookie consent"
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 bg-black/80 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-5 shadow-lg"
        >
            <p className="text-sm text-white/80">
                We use a small number of essential cookies to keep you signed in and to prevent
                abuse. We don&apos;t use ad-tracking cookies. See our{" "}
                <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline">
                    Privacy Policy
                </Link>
                .
            </p>
            <button
                onClick={accept}
                className="mt-4 w-full px-4 py-2 rounded-full bg-[#00ffee] text-black font-medium hover:bg-opacity-90 transition-all"
            >
                Got it
            </button>
        </div>
    );
}
