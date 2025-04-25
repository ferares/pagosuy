import { NextResponse, type NextRequest } from "next/server"

import { PrismaClient } from "@/generated/prisma"

import { logError } from "@/helpers/logger"
import { getSessionFromCookie } from "@/helpers/session"

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookie()
  if (!session) return NextResponse.json({}, { status: 403 })
  const { description, senderId, receiverId, amountIn, amountOut } = await req.json() as { description: string, senderId?: number, receiverId?: number, amountIn?: number, amountOut?: number }
  if ((!senderId) || (!receiverId) || (!amountOut)) return NextResponse.error()
  try {
    const prisma = new PrismaClient()
    const sendingAccount = await prisma.account.findFirst({ where: { id: senderId, userAccounts: { some: { userId: session.userId } } } })
    if (!sendingAccount) {
      return NextResponse.json({}, { status: 404 })
    }
    const receiverAccount = await prisma.account.findFirst({ where: { id: receiverId } })
    if (!receiverAccount) {
      return NextResponse.json({}, { status: 404 })
    }
    const transfer = await prisma.$transaction(async (tx) => {
      const transfer = await tx.transfer.create({ data: { description, amountOut, amountIn: amountIn ?? amountOut, senderId, receiverId } })
      // Update the realted accounts' balance
      await tx.account.update({ where: { id: senderId }, data: { amount: { decrement: amountOut } } })
      await tx.account.update({ where: { id: receiverId }, data: { amount: { increment: amountIn ?? amountOut } } })
      return transfer
    })
    return NextResponse.json(transfer)
  } catch (error) {
    logError(error as Error)
    return NextResponse.error()
  }
}