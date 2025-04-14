"use client"

import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import { type FormEvent, startTransition, useCallback, useRef, useState } from "react"

import { emailPattern } from "@/helpers/strings"

import { useLoaderContext } from "@/contexts/Loader"
import { useAlertsContext } from "@/contexts/Alerts"

export default function SignupForm() {
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
    setLoading(true, "Processing, please wait")
    try {
      const response = await fetch("/api/auth/signup", { method: "POST", body })
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
        if (response.status === 409) {
          pushAlert("danger", "Email address already registered", 3000)
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
        Signup
      </button>
      <Link href="/signin">Already have an account?</Link>
    </form>
  )
}