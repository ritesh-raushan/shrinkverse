import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ShrinkVerse",
  description: "Your Links, Your World",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* <SessionProvider> */}
          <AuthProvider>
            <div className="relative w-full flex items-center justify-center">
              <Navbar />
            </div>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}
