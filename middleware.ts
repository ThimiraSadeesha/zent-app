import { NextResponse } from 'next/server';
// Middleware to protect routes
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const session = request.cookies.get('zent_session');
    const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

    // Protect dashboard route
    if (isDashboard && !session) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Prevent back navigation to login if already logged in (optional but good UX)
    // const isLogin = request.nextUrl.pathname === '/login';
    // if (isLogin && session) {
    //   return NextResponse.redirect(new URL('/dashboard', request.url));
    // }

    const response = NextResponse.next();

    // Prevent caching of protected pages to ensure back button forces a check
    if (isDashboard) {
        response.headers.set('Cache-Control', 'no-store, max-age=0');
        response.headers.set('Pragma', 'no-cache');
    }

    return response;
}

export const config = {
    matcher: ['/dashboard/:path*', '/pages/dashboard/:path*', '/login'],
};
