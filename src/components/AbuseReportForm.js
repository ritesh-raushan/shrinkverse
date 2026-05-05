"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AbuseReportForm() {
    const [shortUrl, setShortUrl] = useState("");
    const [reason, setReason] = useState("phishing");
    const [details, setDetails] = useState("");
    const [reporterEmail, setReporterEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!shortUrl) {
            toast.error("Please paste the short URL you're reporting");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shortUrl: shortUrl.trim(),
                    reason,
                    details: details.trim(),
                    reporterEmail: reporterEmail.trim(),
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data.error || "Failed to submit report");
            }

            toast.success("Thanks - we'll review your report shortly.");
            setIsDone(true);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isDone) {
        return (
            <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-cyan-500/30 text-center">
                <h2 className="text-xl font-semibold text-white mb-2">Report received</h2>
                <p className="text-white/70">
                    Thanks for helping keep ShrinkVerse safe. We&apos;ll review your report shortly.
                </p>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-cyan-500/30 space-y-5"
        >
            <div className="space-y-2">
                <label htmlFor="shortUrl" className="block text-[#00ffee] text-sm font-medium">
                    Short URL <span className="text-red-400">*</span>
                </label>
                <input
                    id="shortUrl"
                    type="url"
                    value={shortUrl}
                    onChange={(e) => setShortUrl(e.target.value)}
                    placeholder="https://shrinkverse.com/abc123"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-cyan-500/20 text-white placeholder-white/50 focus:outline-none focus:border-[#00ffee] focus:ring-1 focus:ring-[#00ffee] transition-all"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="reason" className="block text-[#00ffee] text-sm font-medium">
                    Reason
                </label>
                <select
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-cyan-500/20 text-white focus:outline-none focus:border-[#00ffee] focus:ring-1 focus:ring-[#00ffee] transition-all"
                >
                    <option value="phishing">Phishing</option>
                    <option value="malware">Malware</option>
                    <option value="scam">Scam / fraud</option>
                    <option value="copyright">Copyright infringement</option>
                    <option value="harassment">Harassment</option>
                    <option value="csam">Sexually explicit content involving minors</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div className="space-y-2">
                <label htmlFor="details" className="block text-[#00ffee] text-sm font-medium">
                    Details (optional)
                </label>
                <textarea
                    id="details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={4}
                    maxLength={2000}
                    placeholder="Anything that helps us investigate (screenshots, additional URLs, etc.)"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-cyan-500/20 text-white placeholder-white/50 focus:outline-none focus:border-[#00ffee] focus:ring-1 focus:ring-[#00ffee] transition-all"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="reporterEmail" className="block text-[#00ffee] text-sm font-medium">
                    Your email (optional)
                </label>
                <input
                    id="reporterEmail"
                    type="email"
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    placeholder="So we can follow up"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-cyan-500/20 text-white placeholder-white/50 focus:outline-none focus:border-[#00ffee] focus:ring-1 focus:ring-[#00ffee] transition-all"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Submitting..." : "Submit report"}
            </button>
        </form>
    );
}
