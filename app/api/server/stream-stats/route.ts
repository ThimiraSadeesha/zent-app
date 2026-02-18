import { NextRequest, NextResponse } from 'next/server';
import { createConnection } from '@/lib/ssh';
import { cookies } from 'next/headers';
import { Client } from 'ssh2';

export async function GET(req: NextRequest) {
    const encoder = new TextEncoder();
    const cookieStore = await cookies();
    const sessionToParse = cookieStore.get('zent_session')?.value;
    const session = sessionToParse ? JSON.parse(sessionToParse) : undefined;

    let conn: Client | null = null;
    let interval: NodeJS.Timeout | null = null;
    let isClosed = false;

    // Create a streaming response
    const stream = new ReadableStream({
        async start(controller) {
            try {
                conn = await createConnection(session);

                // Helper to send events
                const sendEvent = (data: any) => {
                    if (isClosed) return;
                    const text = `data: ${JSON.stringify(data)}\n\n`;
                    controller.enqueue(encoder.encode(text));
                };

                // Helper to execute command on the *existing* connection
                const fetchStats = () => {
                    if (!conn || isClosed) return;

                    const cmd = `
                      free -m | grep Mem | awk '{print $2,$3}';
                      df -h / | tail -1 | awk '{print $2,$3,$5}';
                      uptime -p;
                      whoami;
                      top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4}' || echo "0";
                    `;

                    conn.exec(cmd, (err, stream) => {
                        if (err) {
                            console.error('Exec error:', err);
                            conn?.end();
                            return;
                        }
                        let output = '';
                        stream
                            .on('data', (chunk: any) => output += chunk)
                            .on('close', () => {
                                // Parse output (same logic as before)
                                const lines = output.split('\n').filter(line => line.trim() !== '');
                                let stats: any = { cpu: { usage: 0 }, memory: { total: 0, used: 0, usage: 0 }, disk: { total: '0G', used: '0G', percent: '0%' }, uptime: 'Unknown', user: 'Unknown' };

                                // ... Parsing logic ...
                                if (lines.length >= 1) {
                                    const [tMem, uMem] = lines[0].trim().split(' ');
                                    const totalMem = parseInt(tMem) || 0;
                                    const usedMem = parseInt(uMem) || 0;
                                    stats.memory = { total: totalMem, used: usedMem, usage: totalMem > 0 ? (usedMem / totalMem) * 100 : 0 };
                                }
                                if (lines.length >= 2) {
                                    const [tDisk, uDisk, pDisk] = lines[1].trim().split(' ');
                                    stats.disk = { total: tDisk, used: uDisk, percent: pDisk };
                                }
                                if (lines.length >= 3) stats.uptime = lines[2].replace('up ', '');
                                if (lines.length >= 4) stats.user = lines[3].trim();
                                if (lines.length >= 5) stats.cpu.usage = parseFloat(lines[4]) || 0;

                                sendEvent(stats);
                            });
                    });
                };

                // Initial fetch
                fetchStats();

                // Poll every 2 seconds over the SAME connection
                interval = setInterval(fetchStats, 2000);

            } catch (error) {
                console.error('SSE Connection failed:', error);
                controller.close();
            }
        },
        cancel() {
            isClosed = true;
            if (interval) clearInterval(interval);
            if (conn) conn.end();
            console.log('SSE Stream closed');
        },
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
