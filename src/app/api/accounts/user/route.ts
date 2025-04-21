import { NextResponse } from "next/server"

import { PrismaClient } from "@/generated/prisma"

import { logError } from "@/helpers/logger"
import { getSessionFromCookie } from "@/helpers/session"

export async function GET() {
  const session = await getSessionFromCookie()
  if (!session) return NextResponse.json({}, { status: 403 })
  try {
    const prisma = new PrismaClient()
    const accounts = await prisma.account.findMany({ where: { userAccounts: { some: { userId: session.userId } } } })
    return NextResponse.json(accounts)
  } catch (error) {
    logError(error as Error)
    return NextResponse.error()
  }
}