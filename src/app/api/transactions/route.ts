import { NextResponse, type NextRequest } from "next/server"

import { PrismaClient } from "@/generated/prisma"

import { logError } from "@/helpers/logger"
import { getSessionFromCookie } from "@/helpers/session"

export async function POST(req: NextRequest) {
  // TODO: Receive a list of userIds and amounts if the transaction is shared
  const session = await getSessionFromCookie()
  if (!session) return NextResponse.json({}, { status: 403 })
  const { accountId, categoryId, amount } = await req.json() as { accountId?: number, categoryId?: number, amount?: number }
  if ((!accountId) || (!amount)) return NextResponse.error()
  try {
    const prisma = new PrismaClient()
    if (categoryId) {
      const category = await prisma.category.findFirst({ where: { id: categoryId } })
      if (!category) {
        return NextResponse.json({}, { status: 404 })
      }
    }
    const account = await prisma.account.findFirst({ where: { id: accountId } })
    if (!account) {
      return NextResponse.json({}, { status: 404 })
    }
    const transaction = await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({ data: { amount, accountId, categoryId } })
      // Update the realted account's balance
      await tx.account.update({ where: { id: accountId }, data: { amount: { decrement: amount } } })
      return transaction
    })
    return NextResponse.json(transaction)
  } catch (error) {
    logError(error as Error)
    return NextResponse.error()
  }
}