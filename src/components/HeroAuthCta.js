"use client";

import { History } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function HeroAuthCta() {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    if (!isLoggedIn) return null;

    const handleClick = () => {
        try {
            router.push("/links");
        } catch {
            toast.error("Could not open your links right now");
        }
    };

    return (
        <button
            onClick={handleClick}
            className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition-all hover:scale-105 transform"
        >
            <History className="mr-2 h-5 w-5" />
            View My Links
        </button>
    );
}
