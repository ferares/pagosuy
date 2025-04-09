import { NextResponse, type NextRequest } from "next/server"

import { verifySession } from "@/helpers/session"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get("key")
  if (!key) return NextResponse.json({ validSession: false })
  const verified = await verifySession(key)
  if (!verified) return NextResponse.json({ validSession: false })
  return NextResponse.json({ validSession: true })
}