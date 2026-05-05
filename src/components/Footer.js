import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                        <span className="font-bold">
                            <span className="text-[#00ffee]">Shrink</span>
                            <span className="text-white">Verse</span>
                        </span>
                        <span aria-hidden>-</span>
                        <span>Short links, big reach.</span>
                    </div>

                    <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                        <Link href="/about" className="hover:text-[#00ffee] transition-colors">
                            About
                        </Link>
                        <Link href="/contact" className="hover:text-[#00ffee] transition-colors">
                            Contact
                        </Link>
                        <Link href="/privacy" className="hover:text-[#00ffee] transition-colors">
                            Privacy
                        </Link>
                        <Link href="/terms" className="hover:text-[#00ffee] transition-colors">
                            Terms
                        </Link>
                        <Link href="/abuse" className="hover:text-[#00ffee] transition-colors">
                            Report abuse
                        </Link>
                    </nav>
                </div>

                <div className="mt-6 text-center text-xs text-white/40">
                    &copy; {new Date().getFullYear()} ShrinkVerse. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
