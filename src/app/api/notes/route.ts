import { connectToDB } from '@/lib/db'
import Note from '@/models/note.model'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!

async function getUserIdFromToken(): Promise<string | null> {
  const token = (await cookies()).get('token')?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch {
    return null
  }
}

export async function GET() {
  await connectToDB()

  const userId = await getUserIdFromToken() // ✅ add await
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const notes = await Note.find({ userId }).sort({ createdAt: -1 })
  return NextResponse.json(notes)
}

export async function POST(req: Request) {
  await connectToDB()

  const userId = await getUserIdFromToken() // ✅ add await
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, content } = await req.json()
  const newNote = await Note.create({ userId, title, content })

  return NextResponse.json(newNote, { status: 201 })
}
