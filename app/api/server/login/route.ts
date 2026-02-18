import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Decode the payload if it exists (obfuscation support)
        let data = body;
        if (body.payload) {
            try {
                // Use Buffer for reliable server-side decoding
                const decoded = Buffer.from(body.payload, 'base64').toString('utf-8');

                data = JSON.parse(decoded);
            } catch (e) {
                console.error("Failed to decode payload", e);
                return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
            }
        }

        if (!data) {
            console.error("No data found in body");
            return NextResponse.json({ error: "Missing login data" }, { status: 400 });
        }

        const { host, username, password, port } = data;

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
