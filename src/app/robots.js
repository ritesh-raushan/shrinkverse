const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/"],
                disallow: ["/api/", "/links", "/link-not-found", "/_next/"],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
