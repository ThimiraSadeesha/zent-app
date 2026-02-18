import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { host, username, password, port } = body;

        // In a real app, you might validate connection here by trying to connect
        // For now, we'll just set them in a cookie (NOT SECURE for production, but functional for this demo)

        // Simple encryption/encoding could go here
        const sessionData = JSON.stringify({ host, username, password, port });

        const cookieStore = await cookies();
        cookieStore.set('zent_session', sessionData, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return NextResponse.json({ message: "Login successful" });
    } catch (error) {
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}
