import { NextRequest, NextResponse } from 'next/server';

// Helper to decode JWT payload without verification (for frontend routing only)
function decodeJwtPayload(token?: string) {
	if (!token) return null;
	try {
		const parts = token.split('.');
		if (parts.length < 2) return null;
		const payload = parts[1];
		const decoded = Buffer.from(payload, 'base64').toString('utf8');
		return JSON.parse(decoded);
	} catch (e) {
		return null;
	}
}

export function middleware(req: NextRequest) {
	const pathname = req.nextUrl.pathname;

	// protect /admin routes
	if (pathname.startsWith('/admin')) {
		const token = req.cookies.get('bopi_token')?.value;
		const payload = decodeJwtPayload(token);
		const role = payload?.role?.toLowerCase();

		if (!token) {
			const loginUrl = new URL('/auth/login', req.url);
			return NextResponse.redirect(loginUrl);
		}

		if (role !== 'admin') {
			const home = new URL('/', req.url);
			return NextResponse.redirect(home);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/admin/:path*'],
};
