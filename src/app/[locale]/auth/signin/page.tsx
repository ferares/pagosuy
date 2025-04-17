import { getLocale, getTranslations } from "next-intl/server"

import { redirect } from "@/i18n/navigation"

import { getSessionFromCookie } from "@/helpers/session"

import SigninForm from "@/components/SigninForm"

export default async function Signin() {
  const locale = await getLocale()
  const session = await getSessionFromCookie()
  if (session) redirect({ href: "/admin", locale })
  const t = await getTranslations("Labels")
  return (
    <div className="auth">
      <h1 className="title">{t("signin")}</h1>
      <SigninForm />
    </div>
  )
}