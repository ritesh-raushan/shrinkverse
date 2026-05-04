import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { env } from "@/lib/env";
import { isPasswordStrong } from "@/lib/password";

const providers = [
    CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
                throw new Error("Missing email or password");
            }

            await dbConnect();
            const user = await User.findOne({
                email: credentials.email.toLowerCase().trim(),
            });

            if (!user) {
                throw new Error("Invalid email or password");
            }

            // User signed up via Google but is now trying credentials login.
            if (user.provider === "google" && !user.password) {
                throw new Error("This account uses Google sign-in. Please continue with Google.");
            }

            const isMatch = await bcrypt.compare(credentials.password, user.password);
            if (!isMatch) {
                throw new Error("Invalid email or password");
            }

            return {
                id: user._id.toString(),
                email: user.email,
                name: user.name || null,
            };
        },
    }),
];

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.unshift(
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        })
    );
}

export const authOptions = {
    providers,
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== "google") return true;

            try {
                await dbConnect();

                let dbUser = await User.findOne({ email: user.email });

                if (dbUser) {
                    if (!dbUser.provider) {
                        dbUser.provider = "google";
                        await dbUser.save();
                    }
                    user.id = dbUser._id.toString();
                } else {
                    dbUser = await User.create({
                        email: user.email,
                        name: user.name,
                        provider: "google",
                        password: await bcrypt.hash(crypto.randomUUID() + Date.now(), 10),
                        emailVerified: new Date(),
                    });
                    user.id = dbUser._id.toString();
                }

                return true;
            } catch (error) {
                console.error("Google sign-in error:", error);
                return false;
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    secret: env.NEXTAUTH_SECRET,
};

export { isPasswordStrong };
