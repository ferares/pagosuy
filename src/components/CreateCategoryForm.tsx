"use client"

import { useCallback, useRef, useState } from "react"

import { useTranslations } from "next-intl"

import ModalForm from "./ModalForm"

export default function CreateCategoryForm() {
  const t = useTranslations()
  const [name, setName] = useState("")
  const [type, setType] = useState<"income" | "expense">()
  const nameRef = useRef<HTMLInputElement>(null)
  const typeRef = useRef<HTMLSelectElement>(null)

  const reset = useCallback(() => {
    setName("")
    setType(undefined)
  }, [])

  const validate = useCallback(() => {
    if ((!nameRef.current?.validity.valid) || (!typeRef.current?.validity.valid)) {
      if (!nameRef.current?.validity.valid) nameRef.current?.focus()
      else if (!typeRef.current?.validity.valid) typeRef.current?.focus()
      return false
    }
    return true
  }, [])

  const getData = useCallback(() => JSON.stringify({ name, type }), [name, type])

  return (
    <ModalForm action={t("Labels.create-category")} getData={getData} id="create-category" reset={reset} title={t("Labels.create-category")} url="/api/categories" validate={validate}>
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
    </ModalForm>
  )
}