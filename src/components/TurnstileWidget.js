"use client";

import Script from "next/script";
import { useEffect, useId, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

/**
 * Cloudflare Turnstile widget. Calls `onToken(token)` when the user solves
 * the challenge. If `NEXT_PUBLIC_TURNSTILE_SITE_KEY` isn't set, renders
 * nothing and immediately calls `onToken("")` so callers can branch on it.
 */
export default function TurnstileWidget({ onToken }) {
    const containerId = useId();
    const widgetRef = useRef(null);

    useEffect(() => {
        if (!SITE_KEY) {
            onToken?.("");
            return;
        }

        let mounted = true;

        const render = () => {
            if (!mounted) return;
            const turnstile = window.turnstile;
            if (!turnstile) return;
            widgetRef.current = turnstile.render(`#${CSS.escape(containerId)}`, {
                sitekey: SITE_KEY,
                callback: (token) => onToken?.(token),
                "error-callback": () => onToken?.(""),
                "expired-callback": () => onToken?.(""),
                theme: "dark",
            });
        };

        if (window.turnstile) {
            render();
        } else {
            const interval = setInterval(() => {
                if (window.turnstile) {
                    clearInterval(interval);
                    render();
                }
            }, 200);
            return () => {
                mounted = false;
                clearInterval(interval);
                if (widgetRef.current && window.turnstile) {
                    window.turnstile.remove(widgetRef.current);
                }
            };
        }

        return () => {
            mounted = false;
            if (widgetRef.current && window.turnstile) {
                window.turnstile.remove(widgetRef.current);
            }
        };
    }, [containerId, onToken]);

    if (!SITE_KEY) return null;

    return (
        <>
            <Script src={SCRIPT_SRC} strategy="afterInteractive" async defer />
            <div id={containerId} className="flex justify-center" />
        </>
    );
}

export const isTurnstileEnabled = Boolean(SITE_KEY);
