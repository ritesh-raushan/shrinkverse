import Hero from "@/components/Hero";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ShrinkVerse",
    url: SITE_URL,
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    description:
        "ShrinkVerse turns long URLs into short, custom links you can share, track, and manage.",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
    },
};

export default function Home() {
    return (
        <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
            <script
                type="application/ld+json"
                // JSON-LD content is static and trusted; using dangerouslySetInnerHTML
                // is the standard pattern for embedding it.
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Hero />
        </main>
    );
}
