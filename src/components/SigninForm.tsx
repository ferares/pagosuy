"use client"

import { useSearchParams } from "next/navigation"

import { type FormEvent, startTransition, useCallback, useRef, useState } from "react"

import { type Href } from "@/i18n/request"
import { Link, useRouter } from "@/i18n/navigation"

import { emailPattern } from "@/helpers/strings"

import { useLoaderContext } from "@/contexts/Loader"
import { useAlertsContext } from "@/contexts/Alerts"

export default function SigninForm() {
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
      pushScreenReaderAlert("assertive", "Form submission failed. Review the required fields")
      return
    }
    const body = JSON.stringify({ email, password })
    setLoading(true, "verifying credentials, please wait")
    try {
      const response = await fetch("/api/auth/signin", { method: "POST", body })
      if (response.ok) {
        return startTransition(() => {
          const redirect = searchParams.get("redirect")
          if (redirect) {
            router.push(redirect as Href)
          } else {
            router.push("/admin")
          }
          router.refresh() // Cache busting
          setLoading(false)
        })
      } else {
        if (response.status === 404) {
          pushAlert("danger", "There is no user with the provided email address", 3000)
        } else if (response.status === 401) {
          pushAlert("danger", "Wrong password. Try again or choose \"Forgot your password?\".", 3000)
        } else {
          pushAlert("danger", "An error occurred, please try again later", 3000)
        }
      }
    } catch {
      pushAlert("danger", "An error occurred, please try again later", 3000)
    }
    setLoading(false)
  }, [email, password, pushAlert, pushScreenReaderAlert, router, searchParams, setLoading])

  return (
    <form method="POST" noValidate className={`form ${wasValidated ? "was-validated" : ""}`} onSubmit={handleSubmit}>
      <div className="form__row">
        <label className="form__label" htmlFor="email">Email (required)</label>
        <input className="form__control" ref={emailRef} type="email" name="email" id="email" value={email} required pattern={emailPattern} onChange={(event) => setEmail(event.target.value)} />
        <div className="invalid-feedback">Input a valid email</div>
      </div>
      <div className="form__row">
        <label className="form__label" htmlFor="password">Password (required)</label>
        <input className="form__control" ref={passwordRef} type="password" name="password" id="password" value={password} required onChange={(event) => setPassword(event.target.value)} />
        <div className="invalid-feedback">Input a password</div>
      </div>
      <button type="submit" className="btn">
        Signin
      </button>
      {/* <Link href="/recover-password">Forgot your password?</Link> */}
      <Link href="/auth/signup">Don&apos;t have an account yet?</Link>
    </form>
  )
}