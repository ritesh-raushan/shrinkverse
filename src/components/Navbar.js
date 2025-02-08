"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Shorten", href: "/shorten" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-center">

                    {/* Combined Logo and Navigation for Desktop */}
                    <div className="hidden md:flex items-center rounded-full backdrop-blur-md border border-[#00ffee]/20 px-6 py-2.5">

                        {/* Logo */}
                        <Link href="/" className="flex items-center mr-8">
                        <span className="text-xl font-bold hover:scale-105 transform">
                            <span className="text-[#00ffee]">Shrink</span>
                            <span className="text-white">Verse</span>
                        </span>
                        </Link>

                        {/* Separator */}
                        <div className="h-6 w-px bg-white/20 mr-8" />

                        {/* Navigation Items */}
                        <div className="flex items-center space-x-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="px-4 py-2 text-base text-white hover:bg-white/20 hover:text-[#00ffee] rounded-full transition-all"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Separator */}
                        <div className="h-6 w-px bg-white/20 mx-4" />

                        {/* Auth Buttons */}
                        <div className="flex items-center space-x-3">
                            <button className="px-4 py-2 text-base text-white hover:bg-white/20 hover:text-[#00ffee] rounded-full transition-all">
                                Sign In
                            </button>
                            <button className="px-4 py-2 text-base bg-white text-black rounded-full hover:bg-[#00ffee] transition-all font-medium hover:scale-105 transform">
                                Get Started
                            </button>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden flex items-center justify-between w-full">
                        {/* Logo for Mobile */}
                        <Link href="/" className="flex items-center">
                            <span className="text-xl font-bold text-white">ShrinkVerse</span>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-full bg-white/10 backdrop-blur-[12px] border border-white/20 text-white hover:bg-white/20 transition-all"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isOpen && (
                    <div className="md:hidden absolute left-4 right-4 mt-2 rounded-2xl bg-white/10 backdrop-blur-[12px] border border-white/20 shadow-lg">
                        <div className="py-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block px-4 py-2 text-sm text-white hover:bg-white/20"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="px-4 py-2 flex flex-col space-y-2 border-t border-white/20 mt-2">
                                <button className="w-full px-4 py-2 text-sm text-white hover:bg-white/20 rounded-full transition-all">
                                    Sign In
                                </button>
                                <button className="w-full px-4 py-2 text-sm bg-white text-black rounded-full hover:bg-white/90 transition-all font-medium">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}