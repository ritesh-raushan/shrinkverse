/** @type {import('next').NextConfig} */

const securityHeaders = [
    {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
    },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    },
    { key: "X-DNS-Prefetch-Control", value: "on" },
    {
        // CSP starts in report-only mode so we can ship without breaking
        // anything if a third-party widget surprises us. Switch to
        // "Content-Security-Policy" once we've watched logs for a week.
        key: "Content-Security-Policy-Report-Only",
        value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://va.vercel-scripts.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: https: blob:",
            "font-src 'self' https://fonts.gstatic.com data:",
            "frame-src https://challenges.cloudflare.com https://accounts.google.com",
            "connect-src 'self' https://challenges.cloudflare.com https://*.upstash.io https://safebrowsing.googleapis.com https://va.vercel-scripts.com",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "object-src 'none'",
            "upgrade-insecure-requests",
        ].join("; "),
    },
];

const apiCorsHeaders = [
    { key: "Access-Control-Allow-Origin", value: "same-origin" },
    { key: "Vary", value: "Origin" },
];

const nextConfig = {
    poweredByHeader: false,
    compress: true,
    async headers() {
        return [
            { source: "/(.*)", headers: securityHeaders },
            { source: "/api/(.*)", headers: apiCorsHeaders },
        ];
    },
};

export default nextConfig;
