import { NextResponse, type NextRequest } from "next/server"

import { PrismaClient } from "@/generated/prisma"

import { logError } from "@/helpers/logger"
import { getSessionFromCookie } from "@/helpers/session"

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookie()
  if (!session) return NextResponse.json({}, { status: 403 })
  const { name, type } = await req.json() as { name?: string, type?: string }
  if ((!name) || (!type)) return NextResponse.error()
  try {
    const prisma = new PrismaClient()
    let category = await prisma.category.findFirst({ where: { name } })
    if (category) {
      return NextResponse.json({}, { status: 409 })
    }
    category = await prisma.category.create({ data: { name, type: type === "income" ? "IN" : "OUT" } })
    return NextResponse.json(category)
  } catch (error) {
    logError(error as Error)
    return NextResponse.error()
  }
}