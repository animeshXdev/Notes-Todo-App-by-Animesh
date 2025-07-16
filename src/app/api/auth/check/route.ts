/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  if (!token) {
    return NextResponse.json({ error: 'No token' }, { status: 401 })
  }

  try {
    jwt.verify(token, JWT_SECRET)
    return NextResponse.json({ message: 'Logged in' }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
