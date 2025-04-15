import { redirect } from "next/navigation"

import { getSessionFromCookie } from "@/helpers/session"

import SigninForm from "@/components/SigninForm"

export default async function Signin() {
  const session = await getSessionFromCookie()
  if (session) redirect("/admin")
  return (
    <div className="auth">
      <h1 className="title">Signin</h1>
      <SigninForm />
    </div>
  )
}