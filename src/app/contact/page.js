import Link from "next/link";

export const metadata = {
    title: "Contact",
    description:
        "Get in touch with the ShrinkVerse team. Send feedback, report bugs, or ask about partnerships and bulk-shorten access.",
    alternates: { canonical: "/contact" },
};

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@shrinkverse.com";

export default function ContactPage() {
    return (
        <main className="min-h-screen pt-24 pb-16 px-4">
            <article className="prose prose-invert prose-cyan mx-auto max-w-3xl">
                <h1>Contact</h1>

                <p className="lead text-white/80">
                    We read every message. Pick whichever option fits your needs.
                </p>

                <h2>General</h2>
                <p>
                    Email us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> for
                    feedback, bug reports, partnership inquiries, or anything else.
                </p>

                <h2>Report abuse</h2>
                <p>
                    Found a short link pointing somewhere malicious or unsafe? Please use the
                    dedicated <Link href="/abuse">abuse-report form</Link>. We review every report.
                </p>

                <h2>Privacy and terms</h2>
                <p>
                    Read our <Link href="/privacy">Privacy Policy</Link> and{" "}
                    <Link href="/terms">Terms of Service</Link> for details on what we store, how we
                    use it, and your rights.
                </p>

                <h2>Bulk and API access</h2>
                <p>
                    Need to shorten 10, 100, or 10,000 links from a script? A public API is on the
                    way. Email us if you&apos;d like early access or to discuss a custom plan.
                </p>
            </article>
        </main>
    );
}
