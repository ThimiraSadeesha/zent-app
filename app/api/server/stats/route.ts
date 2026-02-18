import { NextResponse } from 'next/server';
import { executeCommand } from '@/lib/ssh';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const sessionToParse = cookieStore.get('zent_session')?.value;
        const session = sessionToParse ? JSON.parse(sessionToParse) : undefined;

        const cmd = `
      free -m | grep Mem | awk '{print $2,$3}';
      df -h / | tail -1 | awk '{print $2,$3,$5}';
      uptime -p;
      whoami;
      top -bn1 | grep "Cpu(s)" | awk '{print $2 + $4}' || echo "0";
    `;

        const output = await executeCommand(cmd, session);
        const lines = output.split('\n').filter(line => line.trim() !== '');

        let totalMem = 0, usedMem = 0;
        let totalDisk = '0G', usedDisk = '0G', diskPercent = '0%';
        let uptime = 'Unknown';
        let user = 'Unknown';
        let cpu = 0;

        if (lines.length >= 1) {
            const [tMem, uMem] = lines[0].trim().split(' ');
            totalMem = parseInt(tMem) || 0;
            usedMem = parseInt(uMem) || 0;
        }

        if (lines.length >= 2) {
            const [tDisk, uDisk, pDisk] = lines[1].trim().split(' ');
            totalDisk = tDisk;
            usedDisk = uDisk;
            diskPercent = pDisk;
        }

        if (lines.length >= 3) uptime = lines[2].replace('up ', '');
        if (lines.length >= 4) user = lines[3].trim();
        if (lines.length >= 5) cpu = parseFloat(lines[4]) || 0;

        return NextResponse.json({
            cpu: { usage: cpu },
            memory: { total: totalMem, used: usedMem, usage: totalMem > 0 ? (usedMem / totalMem) * 100 : 0 },
            disk: { total: totalDisk, used: usedDisk, percent: diskPercent },
            uptime,
            user,
        });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch stats', details: error.message }, { status: 500 });
    }
}
