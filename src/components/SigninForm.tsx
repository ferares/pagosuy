"use client"

import { type FormEvent, startTransition, useCallback, useRef, useState } from "react"

import { useRouter, useSearchParams } from "next/navigation"

import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"

import { emailPattern } from "@/helpers/strings"

import { useLoaderContext } from "@/contexts/Loader"
import { useAlertsContext } from "@/contexts/Alerts"

export default function SigninForm() {
  const t = useTranslations()
  const [wasValidated, setWasValidated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setLoading } = useLoaderContext()
  const { pushAlert, pushScreenReaderAlert } = useAlertsContext()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if ((!emailRef.current?.validity.valid) || (!passwordRef.current?.validity.valid)) {
      setWasValidated(true)
      if (!emailRef.current?.validity.valid) emailRef.current?.focus()
      else if (!passwordRef.current?.validity.valid) passwordRef.current?.focus()
      pushScreenReaderAlert("assertive", t("Messages.invalid-form"))
      return
    }
    const body = JSON.stringify({ email, password })
    setLoading(true, t("Messages.signin-submitting"))
    try {
      const response = await fetch("/api/auth/signin", { method: "POST", body })
      if (response.ok) {
        return startTransition(() => {
          const redirect = searchParams.get("redirect")
          if (redirect) {
            router.push(redirect)
          } else {
            router.push("/admin")
          }
          router.refresh() // Cache busting
          setLoading(false)
        })
      } else {
        if (response.status === 404) {
          pushAlert("danger", t("Messages.signin-bad-email"), 3000)
        } else if (response.status === 401) {
          pushAlert("danger", t("Messages.signin-bad-password"), 3000)
        } else {
          pushAlert("danger", t("Messages.error"), 3000)
        }
      }
    } catch {
      pushAlert("danger", t("Messages.error"), 3000)
    }
    setLoading(false)
  }, [email, password, pushAlert, pushScreenReaderAlert, router, searchParams, setLoading, t])

  return (
    <form method="POST" noValidate className={`form ${wasValidated ? "was-validated" : ""}`} onSubmit={handleSubmit}>
      <div className="form__row">
        <label className="form__label" htmlFor="email">{t("Labels.email")} ({t("Labels.required")})</label>
        <input className="form__control" ref={emailRef} type="email" name="email" id="email" value={email} required pattern={emailPattern} onChange={(event) => setEmail(event.target.value)} />
        <div className="invalid-feedback">{t("Messages.input-an-email")}</div>
      </div>
      <div className="form__row">
        <label className="form__label" htmlFor="password">{t("Labels.password")} ({t("Labels.required")})</label>
        <input className="form__control" ref={passwordRef} type="password" name="password" id="password" value={password} required onChange={(event) => setPassword(event.target.value)} />
        <div className="invalid-feedback">{t("Messages.input-a-password")}</div>
      </div>
      <button type="submit" className="btn">
        {t("Labels.signin")}
      </button>
      {/* <Link href="/recover-password">{t("Messages.forgot-password")}</Link> */}
      <Link href="/auth/signup">{t("Messages.dont-have-account")}</Link>
    </form>
  )
}