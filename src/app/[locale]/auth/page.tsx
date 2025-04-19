import { getLocale } from "next-intl/server"

import { redirect } from "@/i18n/navigation"

export default async function Auth() {
  const locale = await getLocale()
  return redirect({ href: "/auth/signin", locale })
}