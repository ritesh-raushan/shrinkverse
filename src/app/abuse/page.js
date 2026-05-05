import AbuseReportForm from "@/components/AbuseReportForm";

export const metadata = {
    title: "Report abuse",
    description:
        "Report a ShrinkVerse short link that points to malware, phishing, scams, or other abusive content.",
    alternates: { canonical: "/abuse" },
};

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@shrinkverse.com";

export default function AbusePage() {
    return (
        <main className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-2xl mx-auto">
                <article className="prose prose-invert prose-cyan mb-8">
                    <h1>Report abuse</h1>
                    <p className="lead text-white/80">
                        See a ShrinkVerse short link being used for malware, phishing, scams, or
                        other harmful content? Let us know. We review every report and act quickly.
                    </p>
                    <p>
                        You can also email us directly at{" "}
                        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
                    </p>
                </article>

                <AbuseReportForm />
            </div>
        </main>
    );
}
