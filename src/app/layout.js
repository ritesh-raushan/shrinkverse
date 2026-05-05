import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import Providers from "@/components/Providers";
import { Toaster } from "react-hot-toast";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const SITE_NAME = "ShrinkVerse";
const SITE_DESCRIPTION =
    "ShrinkVerse turns long URLs into short, custom links you can share, track, and manage. Free, fast, and developer friendly.";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} - Short Links, Big Reach`,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    keywords: [
        "url shortener",
        "link shortener",
        "short links",
        "custom alias",
        "free url shortener",
        "shrinkverse",
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        url: SITE_URL,
        siteName: SITE_NAME,
        title: `${SITE_NAME} - Short Links, Big Reach`,
        description: SITE_DESCRIPTION,
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: `${SITE_NAME} - Short Links, Big Reach`,
        description: SITE_DESCRIPTION,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: "/favicon.ico",
    },
    formatDetection: {
        telephone: false,
        email: false,
        address: false,
    },
};

export const viewport = {
    themeColor: "#000000",
    colorScheme: "dark",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="dark">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Providers>
                    <div className="relative w-full flex items-center justify-center">
                        <Navbar />
                    </div>
                    <div className="flex min-h-screen flex-col">
                        <div className="flex-1">{children}</div>
                        <Footer />
                    </div>
                    <Toaster position="top-right" />
                    <CookieConsent />
                </Providers>
                <Analytics />
            </body>
        </html>
    );
}
