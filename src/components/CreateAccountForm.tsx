"use client"

import { type FormEvent, startTransition, useCallback, useRef, useState } from "react"

import { useLocale, useTranslations } from "next-intl"

import { getAllCurrencies } from "@/helpers/currency"

import { useRouter } from "@/i18n/navigation"

import { useAlertsContext } from "@/contexts/Alerts"

import PlusBtn from "./PlusBtn"
import Modal from "./Modal"

export default function CreateAccountForm() {
  const t = useTranslations()
  const locale = useLocale()
  const currencies = getAllCurrencies(locale)
  const [wasValidated, setWasValidated] = useState(false)
  const [name, setName] = useState("")
  const [balance, setBalance] = useState(0)
  const [currency, setCurrency] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<string>()
  const { pushAlert, pushScreenReaderAlert } = useAlertsContext()
  const nameRef = useRef<HTMLInputElement>(null)
  const balanceRef = useRef<HTMLInputElement>(null)
  const currencyRef = useRef<HTMLSelectElement>(null)
  const router = useRouter()

  const resetForm = useCallback(() => {
    setWasValidated(false)
    setName("")
    setBalance(0)
    setCurrency("")
  }, [])

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if ((!nameRef.current?.validity.valid) || (!balanceRef.current?.validity.valid) || ((!currencyRef.current?.validity.valid))) {
      setWasValidated(true)
      if (!nameRef.current?.validity.valid) nameRef.current?.focus()
      else if (!balanceRef.current?.validity.valid) balanceRef.current?.focus()
      else if (!currencyRef.current?.validity.valid) currencyRef.current?.focus()
      pushScreenReaderAlert("assertive", t("Messages.invalid-form"))
      return
    }
    const body = JSON.stringify({ name, balance, currency })
    setLoading(t("Messages.submitting"))
    try {
      const response = await fetch("/api/accounts", { method: "POST", body })
      if (response.ok) {
        return startTransition(() => {
          router.refresh() // Cache busting
          setLoading(undefined)
          setOpen(false)
          resetForm()
        })
      } else {
        pushAlert("danger", t("Messages.error"), 3000)
      }
    } catch {
      pushAlert("danger", t("Messages.error"), 3000)
    }
    setLoading(undefined)
  }, [name, balance, currency, pushAlert, pushScreenReaderAlert, router, setLoading, resetForm, t])
  return (
    <>
      <PlusBtn label={t("Labels.create-account")} onClick={() => setOpen(true)} />
      <Modal id="create-account-modal" labelledBy="create-account-modal-title" open={open} onClose={() => setOpen(false)} loading={loading}>
        <h2 className="modal-title" id="create-account-modal-title">{t("Labels.create-account")}</h2>
        <form method="POST" noValidate className={`form ${wasValidated ? "was-validated" : ""}`} onSubmit={handleSubmit}>
          <div className="form__row">
            <label className="form__label" htmlFor="name">{t("Labels.name")} ({t("Labels.required")})</label>
            <input className="form__control" ref={nameRef} type="text" name="name" id="name" value={name} required onChange={(event) => setName(event.target.value)} />
            <div className="invalid-feedback">{t("Messages.input-a-name")}</div>
          </div>
          <div className="form__row">
            <label className="form__label" htmlFor="balance">{t("Labels.balance")} ({t("Labels.required")})</label>
            <input className="form__control" ref={balanceRef} type="number" name="balance" id="balance" value={balance} required onChange={(event) => setBalance(Number(event.target.value))} />
            <div className="invalid-feedback">{t("Messages.input-a-balance")}</div>
          </div>
          <div className="form__row">
            <label className="form__label" htmlFor="currency">{t("Labels.currency")} ({t("Labels.required")})</label>
            <select className="form__control" ref={currencyRef} name="currency" id="currency" value={currency} onChange={(event) => setCurrency(event.target.value)}>
              <option value="" hidden></option>
              {Object.keys(currencies).map((key) => {
                const currecny = currencies[key]
                return <option key={key} value={currecny.code}>{currecny.name}</option>
              })}
            </select>
            <div className="invalid-feedback">{t("Messages.input-a-balance")}</div>
          </div>
          <button type="submit" className="btn">
            {t("Labels.create-account")}
          </button>
        </form>
      </Modal>
    </>
  )
}