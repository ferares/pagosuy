"use client"

import { type FormEvent, startTransition, useCallback, useRef, useState } from "react"

import { useTranslations } from "next-intl"


import { useRouter } from "@/i18n/navigation"

import { useAlertsContext } from "@/contexts/Alerts"

import Modal from "./Modal"
import PlusBtn from "./PlusBtn"

export default function CreateCategoryForm() {
  const t = useTranslations()
  const [wasValidated, setWasValidated] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState<"income" | "expense">()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<string>()
  const { pushAlert, pushScreenReaderAlert } = useAlertsContext()
  const nameRef = useRef<HTMLInputElement>(null)
  const typeRef = useRef<HTMLSelectElement>(null)
  const router = useRouter()

  const resetForm = useCallback(() => {
    setWasValidated(false)
    setName("")
    setType(undefined)
  }, [])

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if ((!nameRef.current?.validity.valid) || (!typeRef.current?.validity.valid)) {
      setWasValidated(true)
      if (!nameRef.current?.validity.valid) nameRef.current?.focus()
      else if (!typeRef.current?.validity.valid) typeRef.current?.focus()
      pushScreenReaderAlert("assertive", t("Messages.invalid-form"))
      return
    }
    const body = JSON.stringify({ name, type })
    setLoading(t("Messages.submitting"))
    try {
      const response = await fetch("/api/categories", { method: "POST", body })
      if (response.ok) {
        return startTransition(() => {
          router.refresh() // Cache busting
          setLoading(undefined)
          setOpen(false)
          resetForm()
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
    setLoading(undefined)
  }, [name, type, pushAlert, pushScreenReaderAlert, router, setLoading, resetForm, t])
  return (
    <>
      <PlusBtn label={t("Labels.create-category")} onClick={() => setOpen(true)} />
      <Modal id="create-category-modal" labelledBy="create-category-modal-title" open={open} onClose={() => setOpen(false)} loading={loading}>
        <h2 className="modal-title" id="create-category-modal-title">{t("Labels.create-category")}</h2>
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
      </Modal>
    </>
  )
}