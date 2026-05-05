export const metadata = {
    title: "Privacy Policy",
    description:
        "How ShrinkVerse handles your data: what we collect, why we collect it, and the rights you have over it.",
    alternates: { canonical: "/privacy" },
};

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@shrinkverse.com";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen pt-24 pb-16 px-4">
            <article className="prose prose-invert prose-cyan mx-auto max-w-3xl">
                <h1>Privacy Policy</h1>
                <p>
                    <em>Last updated: May 2026</em>
                </p>

                <p>
                    This Privacy Policy explains what information ShrinkVerse (&quot;we&quot;,
                    &quot;us&quot;) collects when you use our website and services, why we collect
                    it, and what your rights are.
                </p>

                <h2>1. What we collect</h2>
                <ul>
                    <li>
                        <strong>Account information.</strong> If you sign up, we store your email
                        address, hashed password (we never see the plain text), and your sign-in
                        provider (credentials or Google).
                    </li>
                    <li>
                        <strong>Links you create.</strong> The destination URL, the short alias, the
                        timestamp, and your account ID (if signed in) or expiry date (if guest).
                    </li>
                    <li>
                        <strong>Technical data.</strong> Truncated and hashed IP addresses for rate
                        limiting and abuse prevention. We do not store the raw IP.
                    </li>
                    <li>
                        <strong>Cookies.</strong> A NextAuth session cookie (essential, sets when
                        you sign in) and Vercel Analytics (anonymous, no cookies, no
                        fingerprinting).
                    </li>
                </ul>

                <h2>2. Why we collect it</h2>
                <ul>
                    <li>To run the service (you can&apos;t shorten or list links without it).</li>
                    <li>To prevent abuse (spam, malware, phishing).</li>
                    <li>To respond to your support emails.</li>
                </ul>

                <h2>3. What we don&apos;t do</h2>
                <ul>
                    <li>We don&apos;t sell your data.</li>
                    <li>We don&apos;t track you across the web.</li>
                    <li>We don&apos;t use third-party advertising cookies.</li>
                </ul>

                <h2>4. Third-party services</h2>
                <p>We use the following processors:</p>
                <ul>
                    <li>MongoDB Atlas - database hosting.</li>
                    <li>Vercel - app hosting and privacy-friendly analytics.</li>
                    <li>Upstash Redis - rate limiting (stores hashed IPs only).</li>
                    <li>Cloudflare Turnstile - CAPTCHA (privacy-preserving).</li>
                    <li>Google Safe Browsing - URL safety checks.</li>
                    <li>Google OAuth - sign-in (only if you choose it).</li>
                </ul>

                <h2>5. Data retention</h2>
                <ul>
                    <li>Guest links are automatically deleted 15 days after creation.</li>
                    <li>
                        Authenticated users&apos; links are kept until you delete them or close your
                        account.
                    </li>
                    <li>Hashed IPs in rate-limit caches expire within hours.</li>
                </ul>

                <h2>6. Your rights</h2>
                <p>
                    You can request access to, correction of, or deletion of your data at any time.
                    Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> and we&apos;ll
                    respond within 30 days.
                </p>

                <h2>7. Children</h2>
                <p>
                    ShrinkVerse is not directed at children under 13. If you believe a child has
                    registered, contact us and we&apos;ll delete the account.
                </p>

                <h2>8. Changes</h2>
                <p>
                    We may update this Privacy Policy. We&apos;ll update the &quot;Last
                    updated&quot; date and, for material changes, notify you via the email on file.
                </p>

                <h2>9. Contact</h2>
                <p>
                    Questions about this policy? Email{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
                </p>
            </article>
        </main>
    );
}
