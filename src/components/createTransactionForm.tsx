"use client"

import { type FormEvent, startTransition, useCallback, useRef, useState } from "react"

import { useLocale, useTranslations } from "next-intl"

import { getAllCurrencies } from "@/helpers/currency"

import { useRouter } from "@/i18n/navigation"

import { useAlertsContext } from "@/contexts/Alerts"
import { useLoaderContext } from "@/contexts/Loader"

export default function CreateTransactionForm() {
  const t = useTranslations()
  const locale = useLocale()
  const currencies = getAllCurrencies(locale)
  const [wasValidated, setWasValidated] = useState(false)
  const [name, setName] = useState("")
  const [balance, setBalance] = useState(0)
  const [currency, setCurrency] = useState("")
  const { setLoading } = useLoaderContext()
  const { pushAlert, pushScreenReaderAlert } = useAlertsContext()
  const nameRef = useRef<HTMLInputElement>(null)
  const balanceRef = useRef<HTMLInputElement>(null)
  const currencyRef = useRef<HTMLSelectElement>(null)
  const router = useRouter()

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if ((!nameRef.current?.validity.valid) || (!balanceRef.current?.validity.valid) || (!currencyRef.current?.validity.valid)) {
      setWasValidated(true)
      if (!nameRef.current?.validity.valid) nameRef.current?.focus()
      else if (!balanceRef.current?.validity.valid) balanceRef.current?.focus()
      else if (!currencyRef.current?.validity.valid) currencyRef.current?.focus()
      pushScreenReaderAlert("assertive", t("Messages.invalid-form"))
      return
    }
    const body = JSON.stringify({ name, balance, currency })
    setLoading(true, t("Messages.submitting"))
    try {
      const response = await fetch("/api/accounts", { method: "POST", body })
      if (response.ok) {
        return startTransition(() => {
          router.refresh() // Cache busting
          setLoading(false)
        })
      } else {
        pushAlert("danger", t("Messages.error"), 3000)
      }
    } catch {
      pushAlert("danger", t("Messages.error"), 3000)
    }
    setLoading(false)
  }, [name, balance, currency, pushAlert, pushScreenReaderAlert, router, setLoading, t])
  return (
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
        <select ref={currencyRef} className="form__control" name="currency" id="currency" value={currency} required onChange={(event) => setCurrency(event.target.value)}>
          <option value="" hidden></option>
          {Object.keys(currencies).map((key) => {
            const currecny = currencies[key]
            return <option key={key} value={currecny.code}>{currecny.name}</option>
          })}
        </select>
        <div className="invalid-feedback">{t("Messages.input-a-balance")}</div>
      </div>
      <button type="submit" className="btn">
        {t("Labels.create-transaction")}
      </button>
    </form>
  )
}