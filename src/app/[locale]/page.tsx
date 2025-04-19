import { getLocale } from "next-intl/server"

import { redirect } from "@/i18n/navigation"

import { getSessionFromCookie } from "@/helpers/session"

export default async function Home() {
  const locale = await getLocale()
  const session = await getSessionFromCookie()
  if (session) return redirect({ href: "/admin", locale })
  redirect({ href: "/auth/signin", locale })
}
