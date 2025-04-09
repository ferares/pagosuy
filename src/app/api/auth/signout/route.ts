import { NextResponse } from "next/server"

import { PrismaClient } from "@/generated/prisma"

import { logError } from "@/helpers/logger"
import { deleteSessionCookie, getSessionFromCookie } from "@/helpers/session"

const { PORT, APP_URL } = process.env

const port = PORT ?? 3000
const host = APP_URL ? `${APP_URL}` : `http://localhost:${port}`

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const session = await getSessionFromCookie()
    if (!session) return NextResponse.error()
    const prisma = new PrismaClient()
    await prisma.session.delete({ where: { key: session.key } })
    const redirectResponse = NextResponse.redirect(host, { status: 302 })
    deleteSessionCookie(redirectResponse)
    return redirectResponse
  } catch (error) {
    logError(error as Error)
    return NextResponse.error()
  }
}