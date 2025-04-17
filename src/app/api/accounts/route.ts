import { NextResponse, type NextRequest } from "next/server"

import { PrismaClient } from "@/generated/prisma"

import { logError } from "@/helpers/logger"
import { getSessionFromCookie } from "@/helpers/session"

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookie()
  if (!session) return NextResponse.json({}, { status: 403 })
  const { name, balance, currency } = await req.json() as { name?: string, balance?: string, currency?: string }
  if ((!name) || (!balance) || (!currency)) return NextResponse.error()
  try {
    const prisma = new PrismaClient()
    let account = await prisma.account.findFirst({ where: { name } })
    if (account) {
      return NextResponse.json({}, { status: 409 })
    }
    account = await prisma.account.create({ data: { name, amount: balance, currency } })
    await prisma.userAccount.create({ data: { userId: session.userId, accountId: account.id } })
    return NextResponse.json(account)
  } catch (error) {
    logError(error as Error)
    return NextResponse.error()
  }
}