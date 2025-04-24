"use client"

import { type FormEvent, startTransition, useCallback, useState } from "react"

import { useTranslations } from "next-intl"

import { useRouter } from "@/i18n/navigation"

import { useAlertsContext } from "@/contexts/Alerts"

import PlusBtn from "./PlusBtn"
import Modal from "./Modal"

interface ModalFormProps {
  children: React.ReactNode
  id: string
  title: string
  action: string
  validate: () => boolean
  getData: () => string
  reset: () => void
  url: string
}

export default function ModalForm({ id, children, title, action, validate, getData, reset, url }: ModalFormProps) {
  const t = useTranslations()
  const [wasValidated, setWasValidated] = useState(false)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<string>()
  const { pushAlert, pushScreenReaderAlert } = useAlertsContext()
  const router = useRouter()

  const resetForm = useCallback(() => {
    setWasValidated(false)
    reset()
  }, [reset])

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (!validate()) {
      setWasValidated(true)
      pushScreenReaderAlert("assertive", t("Messages.invalid-form"))
      return
    }
    const body = getData()
    setLoading(t("Messages.submitting"))
    try {
      const response = await fetch(url, { method: "POST", body })
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
  }, [pushAlert, pushScreenReaderAlert, router, setLoading, resetForm, validate, getData, url, t])
  return (
    <>
      <PlusBtn label={title} onClick={() => setOpen(true)} />
      <Modal id={id} labelledBy={`${id}-title`} open={open} onClose={() => setOpen(false)} loading={loading}>
        <h2 className="modal-title" id={`${id}-title`}>{title}</h2>
        <form method="POST" noValidate className={`form ${wasValidated ? "was-validated" : ""}`} onSubmit={handleSubmit}>
          {children}
          <button type="submit" className="btn">
            {action}
          </button>
        </form>
      </Modal>
    </>
  )
}