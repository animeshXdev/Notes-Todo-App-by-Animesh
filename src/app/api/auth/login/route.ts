import { connectToDB } from '@/lib/db'
import User from '@/models/user'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET!

export async function POST(req: Request) {
  await connectToDB()
  const { email, password } = await req.json()

  const user = await User.findOne({ email })
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 })
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 })
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' })

  const serialized = serialize('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })

  const res = NextResponse.json({ message: 'Login successful' }, { status: 200 })
  res.headers.set('Set-Cookie', serialized)
  return res
}
