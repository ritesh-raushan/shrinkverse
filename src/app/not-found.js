import Link from "next/link";

export const metadata = {
    title: "Page not found",
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <p className="text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4">
                    404
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Page not found</h1>
                <p className="text-white/60 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 rounded-full bg-[#00ffee] text-black font-medium hover:bg-opacity-90 transition-all"
                    >
                        Go home
                    </Link>
                    <Link
                        href="/shorten"
                        className="px-6 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 transition-all"
                    >
                        Shorten a link
                    </Link>
                </div>
            </div>
        </main>
    );
}
