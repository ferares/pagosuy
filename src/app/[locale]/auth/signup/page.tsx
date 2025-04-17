import { getLocale, getTranslations } from "next-intl/server"

import { redirect } from "@/i18n/navigation"

import { getSessionFromCookie } from "@/helpers/session"

import SignupForm from "@/components/SignupForm"

export default async function Signup() {
  const locale = await getLocale()
  const session = await getSessionFromCookie()
  if (session) redirect({ href: "/admin", locale })
  const t = await getTranslations("Labels")
  return (
    <div className="auth">
      <h1 className="title">{t("signup")}</h1>
      <SignupForm />
    </div>
  )
}