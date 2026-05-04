"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import ParticleAnimation from "@/components/ParticleCanvas";
import GoogleLogo from "@/components/GoogleLogo";
import TurnstileWidget from "@/components/TurnstileWidget";
import { isPasswordStrong, PASSWORD_RULE_MESSAGE } from "@/lib/password";

const TURNSTILE_ENABLED = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [turnstileToken, setTurnstileToken] = useState("");
    const router = useRouter();
    const { status } = useSession();
    const handleToken = useCallback((token) => setTurnstileToken(token), []);

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/shorten");
        }
    }, [status, router]);

    const validateForm = () => {
        let valid = true;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Please enter a valid email.");
            valid = false;
        } else {
            setEmailError("");
        }

        if (!isPasswordStrong(password)) {
            setPasswordError(PASSWORD_RULE_MESSAGE);
            valid = false;
        } else {
            setPasswordError("");
        }

        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (TURNSTILE_ENABLED && !turnstileToken) {
            toast.error("Please complete the CAPTCHA to continue");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password,
                    turnstileToken,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            toast.success("Account created. Logging you in...");

            const signInRes = await signIn("credentials", {
                email: email.trim().toLowerCase(),
                password,
                redirect: false,
            });

            if (!signInRes || signInRes.error) {
                router.push("/login");
                return;
            }

            router.push("/shorten");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signIn("google", { callbackUrl: "/shorten" });
        } catch (error) {
            toast.error(error.message || "Failed to sign in with Google");
        }
    };

    if (status === "authenticated") return null;

    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <ParticleAnimation />

            <div className="relative z-10 w-full max-w-md mx-auto p-8">
                <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 shadow-[0_0_50px_-12px_rgba(0,255,255,0.25)] border border-cyan-500/30 animate-pulse-slow">
                    <h1 className="text-2xl font-bold text-white mb-8 text-center">
                        Create Account
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                        <div className="space-y-2">
                            <label className="block text-white/80 text-sm font-medium">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-cyan-500/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                            />
                            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-white/80 text-sm font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-cyan-500/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                            />
                            <p className="text-white/50 text-xs">{PASSWORD_RULE_MESSAGE}</p>
                            {passwordError && (
                                <p className="text-red-500 text-sm">{passwordError}</p>
                            )}
                        </div>

                        {TURNSTILE_ENABLED && <TurnstileWidget onToken={handleToken} />}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="mt-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-black/40 text-white/60">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        className="mt-6 w-full flex items-center justify-center gap-3 py-3 px-6 bg-white text-gray-800 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                        <GoogleLogo className="w-5 h-5" />
                        <span className="font-medium">Sign up with Google</span>
                    </button>

                    <p className="mt-6 text-center text-white/60">
                        Already have an account?{" "}
                        <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
