
import { type NextResponse } from "next/server"
import { cookies } from "next/headers"

import { type Session, type User } from "@/generated/prisma"
import { PrismaClient } from "@/generated/prisma"

import { logError } from "./logger"

const { APP_DOMAIN } = process.env
const ONE_MONTH_SECONDS = 2592000

function generateSessionKey(length = 32) {
  const buffer = new Uint8Array(length)
  crypto.getRandomValues(buffer)
  return Array.from(buffer).map(byte => byte.toString(16).padStart(2, "0")).join("").slice(0, length)
}

export async function verifySession(key: string) {
  try {
    const prisma = new PrismaClient()
    const session = await prisma.session.findFirst({ where: { key } })
    if (!session) return false
    if (Date.now() - session.lastSeen.getTime() > ONE_MONTH_SECONDS) {
      await prisma.session.delete({ where: { key } })
      return false
    }
    return true
  } catch (error) {
    logError(error as Error)
  }
}

export async function getSessionFromCookie() {
  const cookie = (await cookies()).get("session")?.value
  if (!cookie) return null
  return JSON.parse(cookie) as Session
}

export function setSessionCookie(response: NextResponse, secure: boolean, session: Session) {
  response.cookies.set({ name: "session", value: JSON.stringify(session), httpOnly: true, sameSite: "strict", secure, maxAge: ONE_MONTH_SECONDS, domain: APP_DOMAIN })
}

export function deleteSessionCookie(response: NextResponse) {
  response.cookies.delete("session")
}

export async function createSession(user: User) {
  try {
    const prisma = new PrismaClient()
    let key = generateSessionKey()
    while (await verifySession(key)) {
      key = generateSessionKey()
    }
    const session = await prisma.session.create({ data: { lastSeen: new Date(), userId: user.id, key } })
    return session
  } catch (error) {
    console.error(error)
  }
}