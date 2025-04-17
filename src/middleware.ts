import { NextResponse, type NextRequest } from "next/server"

import { getLocale } from "next-intl/server"
import createMiddleware from "next-intl/middleware"

import { routing } from "./i18n/routing"

import { deleteSessionCookie, getSessionFromCookie } from "./helpers/session"

const { APP_URL } = process.env
 
const intlMiddleware = createMiddleware(routing)

export default async function Middleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes("/admin")) {
    const locale = await getLocale()
    const session = await getSessionFromCookie()
    const response = await fetch(`${APP_URL}/api/auth/verify?key=${session?.key}`).then((response) => response.json()) as { validSession: boolean }
    if (!response.validSession) {
      const redirectResponse = NextResponse.redirect(`${APP_URL}/${locale}/auth/signin?redirect=${request.nextUrl.pathname}`, { status: 302 })
      deleteSessionCookie(redirectResponse)
      return redirectResponse
    }
  }
  return intlMiddleware(request)
}

export const config = {
  matcher: ["/", "/(en)/:path*"]
}