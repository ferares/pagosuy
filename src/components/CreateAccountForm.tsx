"use client"

import { useCallback, useRef, useState } from "react"

import { useLocale, useTranslations } from "next-intl"

import { getAllCurrencies } from "@/helpers/currency"


import ModalForm from "./ModalForm"

export default function CreateAccountForm() {
  const t = useTranslations()
  const locale = useLocale()
  const currencies = getAllCurrencies(locale)
  const [name, setName] = useState("")
  const [balance, setBalance] = useState(0)
  const [currency, setCurrency] = useState("")
  const nameRef = useRef<HTMLInputElement>(null)
  const balanceRef = useRef<HTMLInputElement>(null)
  const currencyRef = useRef<HTMLSelectElement>(null)

  const reset = useCallback(() => {
    setName("")
    setBalance(0)
    setCurrency("")
  }, [])

  const validate = useCallback(() => {
    if ((!nameRef.current?.validity.valid) || (!balanceRef.current?.validity.valid) || ((!currencyRef.current?.validity.valid))) {
      if (!nameRef.current?.validity.valid) nameRef.current?.focus()
      else if (!balanceRef.current?.validity.valid) balanceRef.current?.focus()
      else if (!currencyRef.current?.validity.valid) currencyRef.current?.focus()
      return false
    }
    return true
  }, [])

  const getData = useCallback(() => JSON.stringify({ name, balance, currency }), [name, balance, currency])

  return (
    <ModalForm action={t("Labels.create-account")} title={t("Labels.create-account")} id="create-account" reset={reset} validate={validate} getData={getData} url="/api/accounts">
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
    </ModalForm>
  )
}