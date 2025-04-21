"use client"

import { type FormEvent, startTransition, useCallback, useEffect, useRef, useState } from "react"

import { useTranslations } from "next-intl"

import type { Account } from "@/generated/prisma"

import { logError } from "@/helpers/logger"

import { useRouter } from "@/i18n/navigation"

import { useAlertsContext } from "@/contexts/Alerts"
import { useLoaderContext } from "@/contexts/Loader"

export default function CreateTransactionForm() {
  const t = useTranslations()
  const [wasValidated, setWasValidated] = useState(false)
  const [amountIn, setAmountIn] = useState<number>(0)
  const [amountOut, setAmountOut] = useState<number>(0)
  const [accounts, setAccounts] = useState<Account[]>()
  const [senderId, setSenderId] = useState<number>()
  const [receiverId, setReceiverId] = useState<number>()
  const { setLoading } = useLoaderContext()
  const { pushAlert, pushScreenReaderAlert } = useAlertsContext()
  const amountOutRef = useRef<HTMLInputElement>(null)
  const amountInRef = useRef<HTMLInputElement>(null)
  const senderRef = useRef<HTMLSelectElement>(null)
  const receiverRef = useRef<HTMLSelectElement>(null)
  const router = useRouter()

  const getAccounts = useCallback(async () => (await (await fetch("/api/accounts")).json()) as Account[], [])

  const getAccount = useCallback((id: number) => {
    return accounts?.find((account) => account.id === id)
  }, [accounts])

  const differentCurrencies = useCallback(() => {
    if ((!senderId) || (!receiverId)) return false
    const senderAccount = getAccount(senderId)
    const receiverAccount = getAccount(receiverId)
    return senderAccount?.currency !== receiverAccount?.currency
  }, [senderId, receiverId, getAccount])

  useEffect(() => {
    getAccounts().then(setAccounts).catch(logError)
  }, [getAccounts])

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if ((!senderRef.current?.validity.valid) || (!receiverRef.current?.validity.valid) || (!amountOutRef.current?.validity.valid) || (differentCurrencies() && !amountInRef.current?.validity.valid)) {
      setWasValidated(true)
      if (!senderRef.current?.validity.valid) senderRef.current?.focus()
      else if (!receiverRef.current?.validity.valid) receiverRef.current?.focus()
      else if (!amountOutRef.current?.validity.valid) amountOutRef.current?.focus()
      else if (!amountInRef.current?.validity.valid) amountInRef.current?.focus()
      pushScreenReaderAlert("assertive", t("Messages.invalid-form"))
      return
    }
    const body = JSON.stringify({ senderId, receiverId, amountOut, amountIn })
    setLoading(true, t("Messages.submitting"))
    try {
      const response = await fetch("/api/transfers", { method: "POST", body })
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
  }, [senderId, receiverId, amountOut, amountIn, differentCurrencies, pushAlert, pushScreenReaderAlert, router, setLoading, t])
  return (
    <form method="POST" noValidate className={`form ${wasValidated ? "was-validated" : ""}`} onSubmit={handleSubmit}>
      <div className="form__row">
        <label className="form__label" htmlFor="sender">{t("Labels.sending-account")} ({t("Labels.required")})</label>
        <select ref={senderRef} className="form__control" name="sender" id="sender" value={senderId} required onChange={(event) => setSenderId(Number(event.target.value))}>
          <option value="" hidden></option>
          {accounts?.filter((account) => account.id !== receiverId).map((account, index) => (
            <option key={index} value={account.id}>{account.name}</option>
          ))}
        </select>
        <div className="invalid-feedback">{t("Messages.select-an-account")}</div>
      </div>
      <div className="form__row">
        <label className="form__label" htmlFor="receiver">{t("Labels.receiving-account")} ({t("Labels.required")})</label>
        <select ref={receiverRef} className="form__control" name="receiver" id="receiver" value={receiverId} required onChange={(event) => setReceiverId(Number(event.target.value))}>
          <option value="" hidden></option>
          {accounts?.filter((account) => account.id !== senderId).map((account, index) => (
            <option key={index} value={account.id}>{account.name}</option>
          ))}
        </select>
        <div className="invalid-feedback">{t("Messages.select-an-account")}</div>
      </div>
      <div className="form__row">
        <label className="form__label" htmlFor="amountOut">
          {differentCurrencies() ? t("Labels.amount-out") : t("Labels.amount")} ({t("Labels.required")})
        </label>
        <input className="form__control" ref={amountOutRef} type="number" name="amountOut" id="amountOut" value={amountOut} required onChange={(event) => setAmountOut(Number(event.target.value))} />
        <div className="invalid-feedback">{t("Messages.input-an-amount")}</div>
      </div>
      {differentCurrencies() && (
        <div className="form__row">
          <label className="form__label" htmlFor="amountIn">{t("Labels.amount-in")} ({t("Labels.required")})</label>
          <input className="form__control" ref={amountInRef} type="number" name="amountIn" id="amountIn" value={amountIn} required onChange={(event) => setAmountIn(Number(event.target.value))} />
          <div className="invalid-feedback">{t("Messages.input-an-amount")}</div>
        </div>
      )}
      <button type="submit" className="btn">
        {t("Labels.create-transfer")}
      </button>
    </form>
  )
}