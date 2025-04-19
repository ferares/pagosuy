"use client"

import { type FormEvent, startTransition, useCallback, useRef, useState } from "react"

import { useTranslations } from "next-intl"


import { useRouter } from "@/i18n/navigation"

import { useAlertsContext } from "@/contexts/Alerts"
import { useLoaderContext } from "@/contexts/Loader"

export default function CreateCategoryForm() {
  const t = useTranslations()
  const [wasValidated, setWasValidated] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState<"income" | "expense">()
  const { setLoading } = useLoaderContext()
  const { pushAlert, pushScreenReaderAlert } = useAlertsContext()
  const nameRef = useRef<HTMLInputElement>(null)
  const typeRef = useRef<HTMLSelectElement>(null)
  const router = useRouter()

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    console.log("nameRef.current?.validity.valid", nameRef.current?.validity.valid)
    console.log("typeRef.current?.validity.valid", typeRef.current?.validity.valid)
    if ((!nameRef.current?.validity.valid) || (!typeRef.current?.validity.valid)) {
      setWasValidated(true)
      if (!nameRef.current?.validity.valid) nameRef.current?.focus()
      else if (!typeRef.current?.validity.valid) typeRef.current?.focus()
      pushScreenReaderAlert("assertive", t("Messages.invalid-form"))
      return
    }
    const body = JSON.stringify({ name, type })
    setLoading(true, t("Messages.submitting"))
    try {
      const response = await fetch("/api/categories", { method: "POST", body })
      if (response.ok) {
        return startTransition(() => {
          router.refresh() // Cache busting
          setLoading(false)
        })
      } else {
        if (response.status === 409) {
          pushAlert("danger", t("Messages.category-already-exists"), 3000)
        } else {
          pushAlert("danger", t("Messages.error"), 3000)
        }
      }
    } catch {
      pushAlert("danger", t("Messages.error"), 3000)
    }
    setLoading(false)
  }, [name, type, pushAlert, pushScreenReaderAlert, router, setLoading, t])
  return (
    <form method="POST" noValidate className={`form ${wasValidated ? "was-validated" : ""}`} onSubmit={handleSubmit}>
      <div className="form__row">
        <label className="form__label" htmlFor="name">{t("Labels.name")} ({t("Labels.required")})</label>
        <input className="form__control" ref={nameRef} type="text" name="name" id="name" value={name} required onChange={(event) => setName(event.target.value)} />
        <div className="invalid-feedback">{t("Messages.input-a-name")}</div>
      </div>
      <div className="form__row">
        <label className="form__label" htmlFor="type">{t("Labels.type")} ({t("Labels.required")})</label>
        <select ref={typeRef} className="form__control" name="type" id="type" value={type} required onChange={(event) => setType(event.target.value === "income" ? "income" : "expense")}>
          <option value="" hidden></option>
          <option value="income">{t("Labels.income")}</option>
          <option value="expense">{t("Labels.expense")}</option>
        </select>
        <div className="invalid-feedback">{t("Messages.select-a-type")}</div>
      </div>
      <button type="submit" className="btn">
        {t("Labels.create-category")}
      </button>
    </form>
  )
}