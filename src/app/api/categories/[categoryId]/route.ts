import { NextResponse, type NextRequest } from "next/server"

import { PrismaClient } from "@/generated/prisma"

import { logError } from "@/helpers/logger"
import { getSessionFromCookie } from "@/helpers/session"

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ categoryId: string }> }) {
  const session = await getSessionFromCookie()
  if (!session) return NextResponse.json({}, { status: 403 })
    const { categoryId } = await params
    try {
      const prisma = new PrismaClient()
      await prisma.category.delete({ where: { id: Number(categoryId) } })
      return NextResponse.json({ success: true })
    } catch (error) {
      logError(error as Error)
      return NextResponse.error()
    }
}