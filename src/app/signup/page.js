"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ParticleAnimation from '@/components/ParticleCanvas';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const router = useRouter();
    const { checkAuth } = useAuth();

    useEffect(() => {
        if (checkAuth()) {
            router.push('/shorten');
        }
    }, [checkAuth, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate form
        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            toast.success('Registration successful! Please login.');
            router.push('/login');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signIn('google', { callbackUrl: '/shorten' });
        } catch (error) {
            toast.error(error.message || 'Failed to sign in with Google');
        }
    };

    const validateForm = () => {
        let valid = true;

        // Email validation
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email.');
            valid = false;
        } else {
            setEmailError('');
        }

        // Password validation
        if (!password || password.length < 6) {
            setPasswordError('Password must be at least 6 characters.');
            valid = false;
        } else {
            setPasswordError('');
        }

        return valid;
    };

    return (
        <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <ParticleAnimation />

            <div className="relative z-10 w-full max-w-md mx-auto p-8">
                <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 shadow-[0_0_50px_-12px_rgba(0,255,255,0.25)] border border-cyan-500/30 animate-pulse-slow">
                    <h1 className="text-2xl font-bold text-white mb-8 text-center">Create Account</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-white/80 text-sm font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-cyan-500/20 text-white placeholder-white/50 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                            />
                            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating account...' : 'Sign Up'}
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
                        <FcGoogle className="w-5 h-5" />
                        <span className="font-medium">Sign up with Google</span>
                    </button>

                    <p className="mt-6 text-center text-white/60">
                        Already have an account?{' '}
                        <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}