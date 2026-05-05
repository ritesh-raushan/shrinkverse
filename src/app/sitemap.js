const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const STATIC_ROUTES = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/shorten", priority: 0.9, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
    { path: "/login", priority: 0.4, changeFrequency: "yearly" },
    { path: "/signup", priority: 0.5, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap() {
    const lastModified = new Date();
    return STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
        url: `${SITE_URL}${path}`,
        lastModified,
        changeFrequency,
        priority,
    }));
}
