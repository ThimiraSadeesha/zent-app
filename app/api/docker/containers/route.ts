import { NextRequest, NextResponse } from 'next/server';
import { executeCommand } from '@/lib/ssh';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionToParse = cookieStore.get('zent_session')?.value;
        const session = sessionToParse ? JSON.parse(sessionToParse) : undefined;

        const output = await executeCommand('docker ps -a --format "{{json .}}"', session);
        const containers = output.split('\n').filter(Boolean).map((line) => JSON.parse(line));
        return NextResponse.json(containers);
    } catch (error: any) {
        console.error('Error fetching containers:', error);
        return NextResponse.json({ error: 'Failed to fetch containers', details: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const sessionToParse = cookieStore.get('zent_session')?.value;
        const session = sessionToParse ? JSON.parse(sessionToParse) : undefined;

        const body = await req.json();
        const { action, containerId } = body;

        if (!action || !containerId) {
            return NextResponse.json({ error: 'Missing action or containerId' }, { status: 400 });
        }

        let command = '';
        switch (action) {
            case 'start':
                command = `docker start ${containerId}`;
                break;
            case 'stop':
                command = `docker stop ${containerId}`;
                break;
            case 'restart':
                command = `docker restart ${containerId}`;
                break;
            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        const output = await executeCommand(command, session);
        return NextResponse.json({ message: `Container ${action}ed successfully`, output });
    } catch (error: any) {
        console.error('Error managing container:', error);
        return NextResponse.json({ error: 'Failed to manage container', details: error.message }, { status: 500 });
    }
}
