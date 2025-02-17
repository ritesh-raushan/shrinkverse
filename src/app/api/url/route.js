import dbConnect from '@/lib/dbConnect';
import Url from '@/models/Url';
import { verifyAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { longUrl, alias } = await req.json();
        const token = req.headers.get('authorization')?.split(' ')[1];

        await dbConnect();

        if (alias) {
            const existingUrl = await Url.findOne({ alias });
            if (existingUrl) {
                return NextResponse.json(
                    { error: 'Alias already taken' },
                    { status: 400 }
                );
            }
        }

        let userId = null;
        let expiresAt = null;

        // Check if user is authenticated
        if (token) {
            try {
                userId = await verifyAuth(token);
            } catch (error) {
                // Token invalid, treat as guest user
                expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days from now
            }
        } else {
            // Guest user
            expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days from now
        }

        const url = await Url.create({
            longUrl,
            alias: alias || Math.random().toString(36).substring(2, 8),
            userId,
            expiresAt
        });

        return NextResponse.json({
            url,
            isGuest: !userId,
            expiresAt: url.expiresAt
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const token = req.headers.get('authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = await verifyAuth(token);
        await dbConnect();

        const urls = await Url.find({ userId });
        return NextResponse.json({ urls });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}