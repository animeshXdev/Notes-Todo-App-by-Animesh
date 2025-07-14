import { connectToDB } from '@/lib/db'
import Todo from '@/models/todo.model'
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

// 📥 Create Todo
export async function POST(req: Request) {
  await connectToDB()
  const userId = await getUserIdFromToken()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { text } = await req.json()
  const newTodo = await Todo.create({ userId, text })
  return NextResponse.json(newTodo, { status: 201 })
}

// 📤 Get all Todos
export async function GET() {
  await connectToDB()
  const userId = await getUserIdFromToken()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const todos = await Todo.find({ userId }).sort({ createdAt: -1 })
  return NextResponse.json(todos)
}
