import dbConnect from '@/lib/dbConnect';
import Url from '@/models/Url';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    try {
        const { alias } = await params;
        await dbConnect();

        const url = await Url.findOne({
            alias,
            $or: [
                { expiresAt: { $gt: new Date() } }, // Not expired
                { expiresAt: null } // Never expires (logged in users)
            ]
        });

        if (!url) {
            return NextResponse.json({ error: 'URL not found or expired' }, { status: 404 });
        }

        return NextResponse.json({ longUrl: url.longUrl });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}