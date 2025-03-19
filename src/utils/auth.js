"use client";

import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

export const handleAuthLogout = async (customLogout) => {
    try {
        // Handle NextAuth logout
        await signOut({ redirect: false });
        
        // Handle custom auth logout
        if (customLogout) {
            customLogout();
        }
        
        toast.success("Logged out successfully!");
        window.location.href = "/";
    } catch (error) {
        console.error('Logout error:', error);
        toast.error("Error logging out");
    }
};

export const getAuthUser = (session, userEmail) => {
    return {
        isLoggedIn: !!session || !!userEmail,
        email: session?.user?.email || userEmail
    };
};