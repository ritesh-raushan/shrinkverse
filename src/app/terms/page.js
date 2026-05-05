import Link from "next/link";

export const metadata = {
    title: "Terms of Service",
    description:
        "The terms under which you may use ShrinkVerse: acceptable use, account responsibilities, and our liability.",
    alternates: { canonical: "/terms" },
};

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@shrinkverse.com";

export default function TermsPage() {
    return (
        <main className="min-h-screen pt-24 pb-16 px-4">
            <article className="prose prose-invert prose-cyan mx-auto max-w-3xl">
                <h1>Terms of Service</h1>
                <p>
                    <em>Last updated: May 2026</em>
                </p>

                <p>
                    Welcome to ShrinkVerse. By using the service, you agree to these terms. Read
                    them carefully.
                </p>

                <h2>1. The service</h2>
                <p>
                    ShrinkVerse lets you create short URLs that redirect to longer destination URLs.
                    Some features require an account; some are available to guests with limitations.
                </p>

                <h2>2. Acceptable use</h2>
                <p>You agree not to use ShrinkVerse to:</p>
                <ul>
                    <li>Distribute malware, phishing pages, or scam content.</li>
                    <li>
                        Mask, redirect to, or bypass other URL shorteners or services in ways that
                        violate their terms.
                    </li>
                    <li>Harass, defame, or violate any individual&apos;s privacy or rights.</li>
                    <li>
                        Distribute illegal content, including content that infringes copyright,
                        trademark, or other rights.
                    </li>
                    <li>
                        Distribute sexually explicit content involving minors, violent extremism, or
                        content that promotes self-harm.
                    </li>
                    <li>
                        Attempt to abuse, automate, scrape, or overload the service beyond its
                        intended use or rate limits.
                    </li>
                </ul>

                <p>
                    Violations may result in immediate link removal, account suspension, and reports
                    to relevant authorities. To report a violation, see{" "}
                    <Link href="/abuse">/abuse</Link>.
                </p>

                <h2>3. Your account</h2>
                <p>
                    You&apos;re responsible for keeping your account secure. Use a strong, unique
                    password. Notify us immediately if you suspect unauthorized access.
                </p>

                <h2>4. Content ownership</h2>
                <p>
                    You retain ownership of the destination URLs you submit. You grant us a limited
                    license to store and serve them as part of the service. Short links themselves
                    are owned and operated by ShrinkVerse.
                </p>

                <h2>5. Service availability</h2>
                <p>
                    We do our best to keep the service running, but we don&apos;t guarantee uptime.
                    We may modify, suspend, or discontinue features at any time. We&apos;ll give
                    reasonable notice of material changes.
                </p>

                <h2>6. Disclaimer and limitation of liability</h2>
                <p>
                    The service is provided &quot;as is&quot; without warranties of any kind. To the
                    maximum extent permitted by law, ShrinkVerse is not liable for indirect,
                    incidental, or consequential damages arising from your use of the service.
                </p>

                <h2>7. Termination</h2>
                <p>
                    You may delete your account at any time by contacting{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. We may terminate or
                    suspend access immediately for violations of these terms.
                </p>

                <h2>8. Changes</h2>
                <p>
                    We may update these terms. We&apos;ll update the &quot;Last updated&quot; date
                    and notify you of material changes via email or a banner.
                </p>

                <h2>9. Governing law</h2>
                <p>
                    These terms are governed by the laws of the jurisdiction in which ShrinkVerse is
                    operated. You agree that any disputes will be resolved exclusively in those
                    courts.
                </p>

                <h2>10. Contact</h2>
                <p>
                    Questions about these terms? Email{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
                </p>
            </article>
        </main>
    );
}
