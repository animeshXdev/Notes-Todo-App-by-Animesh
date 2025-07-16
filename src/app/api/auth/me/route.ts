/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/auth/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ user: decoded }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }
}
