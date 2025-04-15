import { redirect } from "next/navigation"

import { getTranslations } from "next-intl/server"

import { getSessionFromCookie } from "@/helpers/session"

import SigninForm from "@/components/SigninForm"

export default async function Signin() {
  const session = await getSessionFromCookie()
  if (session) redirect("/admin")
  const t = await getTranslations("Labels")
  return (
    <div className="auth">
      <h1 className="title">{t("signin")}</h1>
      <SigninForm />
    </div>
  )
}