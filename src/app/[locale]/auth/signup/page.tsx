import { redirect } from "next/navigation"

import { getTranslations } from "next-intl/server"

import { getSessionFromCookie } from "@/helpers/session"

import SignupForm from "@/components/SignupForm"

export default async function Signup() {
  const session = await getSessionFromCookie()
  if (session) redirect("/admin")
  const t = await getTranslations("Labels")
  return (
    <div className="auth">
      <h1 className="title">{t("signup")}</h1>
      <SignupForm />
    </div>
  )
}