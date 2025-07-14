/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectToDB } from '@/lib/db'
import Todo from '@/models/todo.model'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

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

// ✏️ Update ToDo
export async function PATCH(req: NextRequest, context: any) {
  await connectToDB()
  const userId = await getUserIdFromToken()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = context.params
  const { text, completed } = await req.json()

  const updated = await Todo.findOneAndUpdate(
    { _id: id, userId },
    { ...(text && { text }), ...(completed !== undefined && { completed }) },
    { new: true }
  )

  if (!updated) return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
  return NextResponse.json(updated)
}

// 🗑 Delete ToDo
export async function DELETE(_: NextRequest, context: any) {
  await connectToDB()
  const userId = await getUserIdFromToken()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = context.params
  const deleted = await Todo.findOneAndDelete({ _id: id, userId })

  if (!deleted) return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
  return NextResponse.json({ message: 'Deleted successfully' })
}
