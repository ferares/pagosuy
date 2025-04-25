"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useTranslations } from "next-intl"

import { type Category, type Account } from "@/generated/prisma"

import { logError } from "@/helpers/logger"

import ModalForm from "./ModalForm"

export default function CreateTransactionForm() {
  const t = useTranslations()
  const [amount, setAmount] = useState<number>()
  const [accounts, setAccounts] = useState<Account[]>()
  const [accountId, setAccountId] = useState<number>()
  const [categories, setCategories] = useState<Category[]>()
  const [categoryId, setCategoryId] = useState<number>()
  const [description, setDescription] = useState("")
  const amountRef = useRef<HTMLInputElement>(null)
  const accountRef = useRef<HTMLSelectElement>(null)
  const descriptionRef = useRef<HTMLInputElement>(null)

  const getUserAccounts = useCallback(async () => (await (await fetch("/api/accounts/user")).json()) as Account[], [])
  const getCategories = useCallback(async () => (await (await fetch("/api/categories")).json()) as Category[], [])

  useEffect(() => {
    getUserAccounts().then(setAccounts).catch(logError)
    getCategories().then(setCategories).catch(logError)
  }, [getUserAccounts, getCategories])

  const reset = useCallback(() => {
    setAmount(undefined)
    setAccountId(undefined)
    setCategoryId(undefined)
    setDescription("")
  }, [])

  const validate = useCallback(() => {
    if ((!amountRef.current?.validity.valid) || (!accountRef.current?.validity.valid) || (!descriptionRef.current?.validity.valid)) {
      if (!amountRef.current?.validity.valid) amountRef.current?.focus()
      else if (!accountRef.current?.validity.valid) accountRef.current?.focus()
      else if (!descriptionRef.current?.validity.valid) descriptionRef.current?.focus()
      return false
    }
    return true
  }, [])

  const getData = useCallback(() => JSON.stringify({ description, accountId, amount, categoryId }), [description, accountId, amount, categoryId])

  return (
    <ModalForm action={t("Labels.create-transaction")} getData={getData} id="create-transaction" reset={reset} title={t("Labels.create-transaction")} url="/api/transactions" validate={validate}>
      <div className="form__row">
        <label className="form__label" htmlFor="category">{t("Labels.description")} ({t("Labels.required")})</label>
        <input className="form__control" ref={descriptionRef} type="text" name="description" id="description" value={description} required onChange={(event) => setDescription(event.target.value)} />
        <div className="invalid-feedback">{t("Messages.input-a-description")}</div>
      </div>
      <div className="form__row">
        <label className="form__label" htmlFor="category">{t("Labels.category")}</label>
        <select className="form__control" name="category" id="category" value={categoryId ?? ""} onChange={(event) => setCategoryId(Number(event.target.value))}>
          <option value=""></option>
          {categories?.map((category, index) => (
            <option key={index} value={category.id}>{category.name}</option>
          ))}
        </select>
        <div className="invalid-feedback">{t("Messages.select-a-category")}</div>
      </div>
      <div className="form__row">
        <label className="form__label" htmlFor="amount">{t("Labels.amount")} ({t("Labels.required")})</label>
        <input className="form__control" ref={amountRef} type="number" name="amount" id="amount" value={amount ?? ""} required onChange={(event) => setAmount(Number(event.target.value))} />
        <div className="invalid-feedback">{t("Messages.input-an-amount")}</div>
      </div>
      <div className="form__row">
        <label className="form__label" htmlFor="account">{t("Labels.account")} ({t("Labels.required")})</label>
        <select ref={accountRef} className="form__control" name="account" id="account" value={accountId ?? ""} required onChange={(event) => setAccountId(Number(event.target.value))}>
          <option value="" hidden></option>
          {accounts?.map((account, index) => (
            <option key={index} value={account.id}>{account.name}</option>
          ))}
        </select>
        <div className="invalid-feedback">{t("Messages.select-an-account")}</div>
      </div>
    </ModalForm>
  )
}