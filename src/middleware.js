import { NextResponse } from 'next/server';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Skip API routes and static files
    if (pathname.startsWith('/api/') || pathname.includes('.')) {
        return NextResponse.next();
    }

    // Handle URL redirects
    if (pathname !== '/' && !pathname.startsWith('/login') && !pathname.startsWith('/signup') && !pathname.startsWith('/shorten')) {
        try {
            const alias = pathname.slice(1);
            const res = await fetch(`${request.nextUrl.origin}/api/url/${alias}`);
            const data = await res.json();

            if (res.ok && data.longUrl) {
                return NextResponse.redirect(data.longUrl);
            }
        } catch (error) {
            console.error('Error in middleware:', error);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};