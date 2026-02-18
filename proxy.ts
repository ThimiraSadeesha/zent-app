import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const session = request.cookies.get('zent_session');
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

    if (isDashboard && !session) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    const response = NextResponse.next();

    if (isDashboard) {
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        response.headers.set('Pragma', 'no-cache');
    }

    return response;
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
