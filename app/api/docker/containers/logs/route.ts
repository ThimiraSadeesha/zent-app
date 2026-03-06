import { NextRequest, NextResponse } from 'next/server';
import { executeCommand } from '@/lib/ssh';
import { cookies } from 'next/headers';

const VALID_CONTAINER_ID = /^[a-zA-Z0-9][a-zA-Z0-9_.\-/]+$/;

async function getSession() {
    const cookieStore = await cookies();
    const raw = cookieStore.get('zent_session')?.value;
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const containerId = req.nextUrl.searchParams.get('containerId');
        
        if (!containerId) {
            return NextResponse.json({ error: 'Missing containerId parameter' }, { status: 400 });
        }

        if (!VALID_CONTAINER_ID.test(containerId)) {
            return NextResponse.json({ error: 'Invalid container ID format' }, { status: 400 });
        }

        const command = `docker logs --tail 500 ${containerId} 2>&1`;
        const output = await executeCommand(command, session);

        return NextResponse.json({ logs: output });
    } catch (error: any) {
        console.error("Failed to fetch logs:", error);
        return NextResponse.json({ error: 'Failed to fetch logs', details: error.message }, { status: 500 });
    }
}
