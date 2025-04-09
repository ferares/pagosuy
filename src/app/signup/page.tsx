import { redirect } from "next/navigation"

import { getSessionFromCookie } from "@/helpers/session"

import SignupForm from "@/components/SignupForm"

export default async function Signup() {
  const session = await getSessionFromCookie()
  if (session) redirect("/admin")
  return (
    <section className="content-page contact-page admin-page-login">
      <div className="content">
        <h1 className="page-title">Signup</h1>
        <div className="page-text">
          <SignupForm />
        </div>
      </div>
    </section>
  )
}