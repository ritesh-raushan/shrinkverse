import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Missing email or password');
                }

                try {
                    await dbConnect();
                    const user = await User.findOne({ email: credentials.email });

                    if (!user) {
                        throw new Error('User not found');
                    }

                    const isMatch = await bcrypt.compare(credentials.password, user.password);
                    if (!isMatch) {
                        throw new Error('Invalid password');
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    throw new Error('Authentication failed');
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === 'google') {
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

                        // await dbUser.save();
                    }

                    return true;
                } catch (error) {
                    console.error('Google sign-in error:', error);
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
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
        error: '/auth/error',
    },
    secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };