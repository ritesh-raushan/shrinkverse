import dbConnect from '@/lib/dbConnect';
import Url from '@/models/Url';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET(req, context) {
    try {
        const { alias } = await context.params; // Await params
        await dbConnect();

        const url = await Url.findOne({
            alias,
            $or: [
                { expiresAt: { $gt: new Date() } }, // Not expired
                { expiresAt: null } // Never expires (logged-in users)
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

export async function DELETE(req, context) {
    try {
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = await verifyAuth(token);
        await dbConnect();

        const { alias } = await context.params; // Await params
        const url = await Url.findOne({ alias, userId });

        if (!url) {
            return NextResponse.json({ error: 'URL not found' }, { status: 404 });
        }

        await url.deleteOne();
        return NextResponse.json({ message: 'URL deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}