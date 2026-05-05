import Link from "next/link";

export const metadata = {
    title: "About",
    description:
        "ShrinkVerse is a fast, free URL shortener built for creators, marketers, and developers. Learn what we do, why we built it, and what's next.",
    alternates: { canonical: "/about" },
};

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-24 pb-16 px-4">
            <article className="prose prose-invert prose-cyan mx-auto max-w-3xl">
                <h1>
                    About <span className="text-[#00ffee]">Shrink</span>Verse
                </h1>

                <p className="lead text-white/80">
                    ShrinkVerse turns long URLs into short, custom links that are easier to share,
                    easier to remember, and easier to track. We built it for creators, marketers,
                    and developers who want a simple, fast, no-nonsense link shortener that respects
                    their privacy.
                </p>

                <h2>Why we built it</h2>
                <p>
                    Most URL shorteners either bury you in upsells or use your data in ways you
                    can&apos;t opt out of. ShrinkVerse is different: the free tier is genuinely
                    useful, the paid tier (coming soon) is only for power users, and we never sell
                    click data.
                </p>

                <h2>What you can do today</h2>
                <ul>
                    <li>Shorten any link in one click - guests get 15-day links.</li>
                    <li>Sign up for permanent links, custom aliases, and a searchable history.</li>
                    <li>
                        Use Google sign-in, copy/share with a click, and delete anything you no
                        longer need.
                    </li>
                </ul>

                <h2>What&apos;s coming next</h2>
                <ul>
                    <li>Click analytics (country, device, referrer, over time).</li>
                    <li>QR code generation for every short link.</li>
                    <li>A bulk-shorten API for businesses and integrators.</li>
                    <li>Custom domains so your brand is on every link.</li>
                    <li>Editable destinations and password-protected links.</li>
                </ul>

                <h2>Get in touch</h2>
                <p>
                    Bug reports, feature ideas, or just hello? Drop us a line on the{" "}
                    <Link href="/contact">contact page</Link>. To report abuse of a short link, use{" "}
                    <Link href="/abuse">/abuse</Link>.
                </p>
            </article>
        </main>
    );
}
