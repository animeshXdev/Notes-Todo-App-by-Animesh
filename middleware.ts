import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const url = req.nextUrl;

  const isDashboardRoute = url.pathname.startsWith('/dashboard');

  // 🔒 If accessing protected route and no token found
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 🔐 If token exists, try verifying
  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (err) {
      console.error('❌ Invalid token:', err);
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // ✅ For all other routes, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // Protect all /dashboard routes
};
