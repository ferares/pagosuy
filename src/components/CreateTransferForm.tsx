"use client"

import { useCallback, useRef, useState } from "react"

import { useTranslations } from "next-intl"

import type { Account } from "@/generated/prisma"

import ModalForm from "./ModalForm"

interface CreateTransactionFormProps { accounts: Pick<Account, "id" | "name" | "currency">[] }

export default function CreateTransactionForm({ accounts }: CreateTransactionFormProps) {
  const t = useTranslations()
  const [amountIn, setAmountIn] = useState<number>()
  const [amountOut, setAmountOut] = useState<number>()
  const [senderId, setSenderId] = useState<number>()
  const [receiverId, setReceiverId] = useState<number>()
  const [description, setDescription] = useState("")
  const amountOutRef = useRef<HTMLInputElement>(null)
  const amountInRef = useRef<HTMLInputElement>(null)
  const senderRef = useRef<HTMLSelectElement>(null)
  const receiverRef = useRef<HTMLSelectElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)

  const getAccount = useCallback((id: number) => {
    return accounts?.find((account) => account.id === id)
  }, [accounts])

  const differentCurrencies = useCallback(() => {
    if ((!senderId) || (!receiverId)) return false
    const senderAccount = getAccount(senderId)
    const receiverAccount = getAccount(receiverId)
    return senderAccount?.currency !== receiverAccount?.currency
  }, [senderId, receiverId, getAccount])

  const reset = useCallback(() => {
    setAmountIn(undefined)
    setAmountOut(undefined)
    setSenderId(undefined)
    setReceiverId(undefined)
    setDescription("")
  }, [])

  const validate = useCallback(() => {
    if (
      (!descriptionRef.current?.validity.valid) ||
      (!senderRef.current?.validity.valid) ||
      (!receiverRef.current?.validity.valid) ||
      (!amountOutRef.current?.validity.valid) ||
      (differentCurrencies() && !amountInRef.current?.validity.valid)
    ) {
      if (!senderRef.current?.validity.valid) senderRef.current?.focus()
      else if (!receiverRef.current?.validity.valid) receiverRef.current?.focus()
      else if (!amountOutRef.current?.validity.valid) amountOutRef.current?.focus()
      else if (!amountInRef.current?.validity.valid) amountInRef.current?.focus()
      else if (!descriptionRef.current?.validity.valid) descriptionRef.current?.focus()
      return false
    }
    return true
  }, [differentCurrencies])

  const getData = useCallback(() => JSON.stringify({ description, senderId, receiverId, amountOut, amountIn }), [description, senderId, receiverId, amountOut, amountIn])

  return (
    <ModalForm action={t("Labels.create-transfer")} getData={getData} id="create-transfer" reset={reset} title={t("Labels.create-transfer")} url="/api/transfers" validate={validate}>
      <div className="form__row">
        <label className="form__label" htmlFor="category">{t("Labels.description")}</label>
        <input className="form__control" ref={descriptionRef} type="text" name="description" id="description" value={description} onChange={(event) => setDescription(event.target.value)} />
      </div>
      <div className="form__row">
        <label className="form__label" htmlFor="sender">{t("Labels.sending-account")} ({t("Labels.required")})</label>
        <select ref={senderRef} className="form__control" name="sender" id="sender" value={senderId ?? ""} required onChange={(event) => setSenderId(Number(event.target.value))}>
          <option value="" hidden></option>
          {accounts?.filter((account) => account.id !== receiverId).map((account, index) => (
            <option key={index} value={account.id}>{account.name}</option>
          ))}
        </select>
        <div className="invalid-feedback">{t("Messages.select-an-account")}</div>
      </div>
      <div className="form__row">
        <label className="form__label" htmlFor="receiver">{t("Labels.receiving-account")} ({t("Labels.required")})</label>
        <select ref={receiverRef} className="form__control" name="receiver" id="receiver" value={receiverId ?? ""} required onChange={(event) => setReceiverId(Number(event.target.value))}>
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
        <input className="form__control" ref={amountOutRef} type="number" name="amountOut" id="amountOut" value={amountOut ?? ""} required onChange={(event) => setAmountOut(Number(event.target.value))} />
        <div className="invalid-feedback">{t("Messages.input-an-amount")}</div>
      </div>
      {differentCurrencies() && (
        <div className="form__row">
          <label className="form__label" htmlFor="amountIn">{t("Labels.amount-in")} ({t("Labels.required")})</label>
          <input className="form__control" ref={amountInRef} type="number" name="amountIn" id="amountIn" value={amountIn ?? ""} required onChange={(event) => setAmountIn(Number(event.target.value))} />
          <div className="invalid-feedback">{t("Messages.input-an-amount")}</div>
        </div>
      )}
    </ModalForm>
  )
}