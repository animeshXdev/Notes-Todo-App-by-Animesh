import { connectToDB } from '@/lib/db'
import Note from '@/models/note.model'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!

async function getUserIdFromToken(): Promise<string | null> {
  const token = cookies().get('token')?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch {
    return null
  }
}

// ✅ PATCH handler
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectToDB()
  const userId = await getUserIdFromToken()
  const { id } = context.params

  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid Note ID' }, { status: 400 })
  }

  const { title, content } = await req.json()

  const updated = await Note.findOneAndUpdate(
    { _id: id, userId },
    { title, content },
    { new: true }
  )

  if (!updated)
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })

  return NextResponse.json(updated)
}

// ✅ DELETE handler
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  await connectToDB()
  const userId = await getUserIdFromToken()
  const { id } = context.params

  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid Note ID' }, { status: 400 })
  }

  const deleted = await Note.findOneAndDelete({ _id: id, userId })

  if (!deleted)
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })

  return NextResponse.json({ message: 'Note deleted successfully' })
}
