import { NextRequest, NextResponse } from 'next/server';
import { executeCommand } from '@/lib/ssh';
import { cookies } from 'next/headers';

const VALID_CONTAINER_ID = /^[a-zA-Z0-9][a-zA-Z0-9_.\-/]+$/;
const VALID_ACTIONS = ['start', 'stop', 'restart'] as const;

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

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const output = await executeCommand('docker ps -a --format "{{json .}}"', session);
        const containers = output.split('\n').filter(Boolean).map((line) => JSON.parse(line));
        return NextResponse.json(containers);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch containers' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { action, containerId } = body;

        if (!action || !containerId) {
            return NextResponse.json({ error: 'Missing action or containerId' }, { status: 400 });
        }

        if (!VALID_ACTIONS.includes(action)) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        if (!VALID_CONTAINER_ID.test(containerId)) {
            return NextResponse.json({ error: 'Invalid container ID format' }, { status: 400 });
        }

        const command = `docker ${action} ${containerId}`;
        await executeCommand(command, session);

        return NextResponse.json({ message: `Container ${action}ed successfully` });
    } catch {
        return NextResponse.json({ error: 'Failed to manage container' }, { status: 500 });
    }
}
