import { NextResponse, type NextRequest } from "next/server"

import { deleteSessionCookie, getSessionFromCookie } from "./helpers/session"

const { APP_URL } = process.env

export default async function Middleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes("/admin")) {
    const session = await getSessionFromCookie()
    const response = await fetch(`${APP_URL}/api/auth/verify?key=${session?.key}`).then((response) => response.json()) as { validSession: boolean }
    if (!response.validSession) {
      const redirectResponse = NextResponse.redirect(`${APP_URL}/auth/signin?redirect=${request.nextUrl.pathname}`, { status: 302 })
      deleteSessionCookie(redirectResponse)
      return redirectResponse
    }
  }
  return NextResponse.next()
}