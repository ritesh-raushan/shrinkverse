"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

/**
 * Thin context wrapper around NextAuth's useSession so existing components
 * keep their `isLoggedIn` / `userEmail` / `logout` ergonomics.
 *
 * No localStorage tokens. The NextAuth cookie is the single source of truth.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    const isLoggedIn = status === "authenticated";
    const userEmail = session?.user?.email ?? "";

    const logout = useCallback(async () => {
        try {
            await signOut({ redirect: false });
            toast.success("Logged out successfully!");
            router.push("/");
        } catch (error) {
            console.error("logout error", error);
            toast.error("Error logging out");
        }
    }, [router]);

    const value = useMemo(
        () => ({ isLoggedIn, userEmail, status, logout }),
        [isLoggedIn, userEmail, status, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
