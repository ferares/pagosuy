import { redirect } from "next/navigation"

import { getSessionFromCookie } from "@/helpers/session"

import SignupForm from "@/components/SignupForm"

export default async function Signup() {
  const session = await getSessionFromCookie()
  if (session) redirect("/admin")
  return (
    <div className="auth">
      <h1 className="title">Signup</h1>
      <SignupForm />
    </div>
  )
}