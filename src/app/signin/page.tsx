import { redirect } from "next/navigation"

import { getSessionFromCookie } from "@/helpers/session"

import SigninForm from "@/components/SigninForm"

export default async function Signin() {
  const session = await getSessionFromCookie()
  if (session) redirect("/admin")
  return (
    <section className="content-page contact-page admin-page-login">
      <div className="content">
        <h1 className="page-title">Signin</h1>
        <div className="page-text">
          <SigninForm />
        </div>
      </div>
    </section>
  )
}