"use client"

import { type FormEvent, startTransition, useCallback, useEffect, useRef, useState } from "react"

import { useTranslations } from "next-intl"

import { type Category, type Account } from "@/generated/prisma"

import { logError } from "@/helpers/logger"

import { useRouter } from "@/i18n/navigation"

import { useAlertsContext } from "@/contexts/Alerts"

import PlusBtn from "./PlusBtn"
import Modal from "./Modal"

export default function CreateTransactionForm() {
  const t = useTranslations()
  const [wasValidated, setWasValidated] = useState(false)
  const [amount, setAmount] = useState<number>(0)
  const [accounts, setAccounts] = useState<Account[]>()
  const [accountId, setAccountId] = useState<number>(0)
  const [categories, setCategories] = useState<Category[]>()
  const [categoryId, setCategoryId] = useState<number>(0)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<string>()
  const { pushAlert, pushScreenReaderAlert } = useAlertsContext()
  const amountRef = useRef<HTMLInputElement>(null)
  const accountRef = useRef<HTMLSelectElement>(null)
  const router = useRouter()

  const getUserAccounts = useCallback(async () => (await (await fetch("/api/accounts/user")).json()) as Account[], [])
  const getCategories = useCallback(async () => (await (await fetch("/api/categories")).json()) as Category[], [])

  useEffect(() => {
    getUserAccounts().then(setAccounts).catch(logError)
    getCategories().then(setCategories).catch(logError)
  }, [getUserAccounts, getCategories])

  const resetForm = useCallback(() => {
    setWasValidated(false)
    setAmount(0)
    setAccountId(0)
    setCategoryId(0)
  }, [])

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if ((!amountRef.current?.validity.valid) || (!accountRef.current?.validity.valid)) {
      setWasValidated(true)
      if (!amountRef.current?.validity.valid) amountRef.current?.focus()
      else if (!accountRef.current?.validity.valid) accountRef.current?.focus()
      pushScreenReaderAlert("assertive", t("Messages.invalid-form"))
      return
    }
    const body = JSON.stringify({ accountId, amount, categoryId })
    setLoading(t("Messages.submitting"))
    try {
      const response = await fetch("/api/transactions", { method: "POST", body })
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
  }, [amount, categoryId, accountId, pushAlert, pushScreenReaderAlert, router, setLoading, resetForm, t])
  return (
    <>
      <PlusBtn label={t("Labels.create-transaction")} onClick={() => setOpen(true)} />
      <Modal id="create-transaction-modal" labelledBy="create-transaction-modal-title" open={open} onClose={() => setOpen(false)} loading={loading}>
        <h2 className="modal-title" id="create-transaction-modal-title">{t("Labels.create-transaction")}</h2>
        <form method="POST" noValidate className={`form ${wasValidated ? "was-validated" : ""}`} onSubmit={handleSubmit}>
          <div className="form__row">
            <label className="form__label" htmlFor="category">{t("Labels.category")}</label>
            <select className="form__control" name="category" id="category" value={categoryId} onChange={(event) => setCategoryId(Number(event.target.value))}>
              <option value=""></option>
              {categories?.map((category, index) => (
                <option key={index} value={category.id}>{category.name}</option>
              ))}
            </select>
            <div className="invalid-feedback">{t("Messages.select-a-category")}</div>
          </div>
          <div className="form__row">
            <label className="form__label" htmlFor="amount">{t("Labels.amount")} ({t("Labels.required")})</label>
            <input className="form__control" ref={amountRef} type="number" name="amount" id="amount" value={amount} required onChange={(event) => setAmount(Number(event.target.value))} />
            <div className="invalid-feedback">{t("Messages.input-an-amount")}</div>
          </div>
          <div className="form__row">
            <label className="form__label" htmlFor="account">{t("Labels.account")} ({t("Labels.required")})</label>
            <select ref={accountRef} className="form__control" name="account" id="account" value={accountId} required onChange={(event) => setAccountId(Number(event.target.value))}>
              <option value="" hidden></option>
              {accounts?.map((account, index) => (
                <option key={index} value={account.id}>{account.name}</option>
              ))}
            </select>
            <div className="invalid-feedback">{t("Messages.select-an-account")}</div>
          </div>
          <button type="submit" className="btn">
            {t("Labels.create-transaction")}
          </button>
        </form>
      </Modal>
    </>
  )
}