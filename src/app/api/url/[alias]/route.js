import dbConnect from '@/lib/dbConnect';
import Url from '@/models/Url';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request, { params }) {
    try {
        const { alias } = await Promise.resolve(params);
        await dbConnect();

        const url = await Url.findOne({
            alias,
            $or: [
                { expiresAt: { $gt: new Date() } },
                { expiresAt: null }
            ]
        });

        if (!url) {
            return NextResponse.json({ error: 'URL not found or expired' }, { status: 404 });
        }

        return NextResponse.json({ longUrl: url.longUrl });
    } catch (error) {
        console.error('Error fetching URL:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { alias } = await Promise.resolve(params); 
        await dbConnect();

        const session = await getServerSession(authOptions);
        let userId;

        if (session?.user?.id) {
            userId = session.user.id;
        } else {
            const token = request.headers.get('authorization')?.split(' ')[1];
            if (!token) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            userId = await verifyAuth(token);
        }

        const url = await Url.findOne({ alias, userId });

        if (!url) {
            return NextResponse.json({ error: 'URL not found or unauthorized' }, { status: 404 });
        }

        await url.deleteOne();
        return NextResponse.json({ message: 'URL deleted successfully' });
    } catch (error) {
        console.error('Error deleting URL:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}