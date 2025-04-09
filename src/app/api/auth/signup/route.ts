import { NextResponse, type NextRequest } from "next/server"

import { PrismaClient } from "@/generated/prisma"

import { logError } from "@/helpers/logger"
import { createSession, setSessionCookie } from "@/helpers/session"
import { hashPassword } from "@/helpers/security"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json() as { email: string, password: string }
  if ((!email) || (!password)) return NextResponse.error()
  try {
    const prisma = new PrismaClient()
    let user = await prisma.user.findFirst({ where: { email } })
    if (user) {
      return NextResponse.json({}, { status: 409 })
    }
    const hashedPassword = await hashPassword(password)
    if (!hashedPassword) throw new Error("error hashing password")
    user = await prisma.user.create({ data: { email, password: hashedPassword } })
    const session = await createSession(user)
    if (!session) throw new Error("error creating session")
    const secure = (new URL(req.url)).protocol === "https:"
    const response = NextResponse.json({})
    setSessionCookie(response, secure, session)
    return response
  } catch (error) {
    logError(error as Error)
    return NextResponse.error()
  }
}