import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    await dbConnect();

                    const user = await User.findOne({ email: credentials.email });
                    if (!user) return null;

                    const isMatch = await bcrypt.compare(credentials.password, user.password);
                    if (!isMatch) return null;

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                try {
                    await dbConnect();

                    let dbUser = await User.findOne({ email: user.email });
                    if (!dbUser) {
                        dbUser = await User.create({
                            email: user.email,
                            name: user.name,
                            password: await bcrypt.hash(Math.random().toString(36), 10),
                            provider: 'google'
                        });
                    }
                    return true;
                } catch (error) {
                    console.error('Sign in error:', error);
                    return false;
                }
            }
            return true;
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
        }
    },
    pages: {
        signIn: '/login',
        error: '/auth/error',
    },
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key'
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };