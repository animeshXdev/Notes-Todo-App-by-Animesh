import { connectToDB } from '@/lib/db'
import User from '@/models/user'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  await connectToDB()
  const { email, password } = await req.json()

  const userExists = await User.findOne({ email })
  if (userExists) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = new User({ email, password: hashedPassword })
  await newUser.save()

  return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
}
