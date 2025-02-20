"use client";

import { Menu, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const { isLoggedIn, userEmail, logout } = useAuth();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully!");
        window.location.href = "/";
    };

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
                                    className={`px-4 py-2 text-base text-white hover:bg-white/20 hover:text-[#00ffee] rounded-full transition-all ${pathname === item.href ? "bg-white/20 text-[#00ffee]" : ""
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Separator */}
                        <div className="h-6 w-px bg-white/20 mx-4" />

                        {/* Auth Buttons */}
                        {isLoggedIn ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="p-2 rounded-full bg-white/10 backdrop-blur-[12px] border border-white/20 text-white hover:bg-white/20 transition-all"
                                >
                                    <User className="h-6 w-6" />
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white/10 backdrop-blur-[12px] border border-white/20 shadow-lg">
                                        <div className="p-4">
                                            <p className="text-sm text-white/80 truncate">{userEmail}</p>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full mt-2 px-4 py-2 text-sm bg-white text-black rounded-full hover:bg-white/90 transition-all font-medium"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-base text-white hover:bg-white/20 hover:text-[#00ffee] rounded-full transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 text-base bg-white text-black rounded-full hover:bg-[#00ffee] transition-all font-medium hover:scale-105 transform"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden flex items-center justify-between w-full">
                        {/* Logo for Mobile */}
                        <Link href="/" className="flex items-center">
                            <span className="text-2xl font-bold hover:scale-105 transform">
                                <span className="text-[#00ffee]">Shrink</span>
                                <span className="text-white">Verse</span>
                            </span>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-full bg-white/10 backdrop-blur-[12px] border border-white/20 text-white hover:bg-white/20 transition-all"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isOpen && (
                    <div className="md:hidden absolute right-4 top-full rounded-2xl bg-white/10 backdrop-blur-[12px] border border-white/20 shadow-lg 
        w-max max-w-xs">
                        <div className="py-2 px-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block px-4 py-2 text-sm text-white hover:bg-white/20 text-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="px-4 py-2 flex flex-col space-y-2 border-t border-white/20 mt-2">
                                {isLoggedIn ? (
                                    <>
                                        <p className="px-4 py-2 text-sm text-white/80 truncate">{userEmail}</p>
                                        <button
                                            onClick={handleLogout}
                                            className="py-2 text-sm bg-white text-black rounded-full hover:bg-white/90 transition-all font-medium"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="py-2 text-sm text-white hover:bg-white/20 rounded-full transition-all text-center"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className="py-2 text-sm text-white rounded-full hover:bg-white/90 transition-all font-medium text-center"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}