import { NextResponse } from 'next/server';
import { executeCommand } from '@/lib/ssh';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionToParse = cookieStore.get('zent_session')?.value;
        const session = sessionToParse ? JSON.parse(sessionToParse) : undefined;

        const output = await executeCommand('docker stats --no-stream --format "{{json .}}"', session);
        const stats = output.split('\n').filter(Boolean).map((line) => JSON.parse(line));
        return NextResponse.json(stats);
    } catch (error: any) {
        console.error('Error fetching docker stats:', error);
        return NextResponse.json({ error: 'Failed to fetch docker stats', details: error.message }, { status: 500 });
    }
}
