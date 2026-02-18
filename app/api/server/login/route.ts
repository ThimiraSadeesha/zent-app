import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        let data = body;
        if (body.payload) {
            try {
                const decoded = Buffer.from(body.payload, 'base64').toString('utf-8');
                data = JSON.parse(decoded);
            } catch (e) {
                return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
            }
        }

        if (!data) {
            return NextResponse.json({ error: "Missing login data" }, { status: 400 });
        }

        const { host, username, password, port } = data;
        const sessionData = JSON.stringify({ host, username, password, port });

        const cookieStore = await cookies();
        cookieStore.set('zent_session', sessionData, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24,
        });

        return NextResponse.json({ message: "Login successful" });
    } catch (error) {
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}
