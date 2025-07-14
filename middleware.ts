/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard')

  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL('/', req.url)) // Not logged in
  }

  try {
    jwt.verify(token!, JWT_SECRET) // Verify token
    return NextResponse.next() // Allow access
  } catch (err) {
    return NextResponse.redirect(new URL('/', req.url)) // Invalid token
  }
}

export const config = {
  matcher: ['/dashboard/:path*'], // Protect all /dashboard routes
}
