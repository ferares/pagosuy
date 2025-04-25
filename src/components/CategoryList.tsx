"use client"

import { startTransition, useCallback, useState } from "react"

import { useTranslations } from "next-intl"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

import { type Prisma } from "@/generated/prisma"

import { useRouter } from "@/i18n/navigation"

import { useAlertsContext } from "@/contexts/Alerts"
import { useLoaderContext } from "@/contexts/Loader"

import Modal from "./Modal"

type CategoryWithSubCategories = Prisma.CategoryGetPayload<{ include: { subCategories: true } }>

interface CategoryListProps { categories: CategoryWithSubCategories[] }

export default function CategoryList({ categories }: CategoryListProps) {
  const t = useTranslations()
  const router = useRouter()
  const { setLoading } = useLoaderContext()
  const { pushAlert } = useAlertsContext()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [categoryId, setCategoryId] = useState<number>()

  const handleDelete = useCallback(async () => {
    setDeleteModalOpen(false)
    setLoading(true, t("Messages.submitting"))
    try {
      const response = (await (await fetch(`/api/categories/${categoryId}`, { method: "DELETE" })).json()) as { success: boolean }
      if (response.success) {
        return startTransition(() => {
          router.refresh() // Cache busting
          pushAlert("success", t("Messages.category-deleted"))
          setLoading(false)
        })
      } else {
        pushAlert("danger", t("Messages.error"))
      }
    } catch {
      pushAlert("danger", t("Messages.error"), 3000)
    }
    setLoading(false)
  }, [t, setLoading, pushAlert, categoryId, router])

  const handleDeleteClick = useCallback((categoryId: number) => {
    setCategoryId(categoryId)
    setDeleteModalOpen(true)
  }, [])

  const printCategory = useCallback((category: CategoryWithSubCategories, index: string) => {
    return (
      <li key={index}>
        <div>
          {category.name}
          <button type="button" onClick={() => handleDeleteClick(category.id)} aria-label={t("Labels.delete-category")}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
        {(category.subCategories?.length > 0) && (
          <ul>
            {category.subCategories.map((category, subindex) => printCategory(category as CategoryWithSubCategories, `${index}-${subindex}`))}
          </ul>
        )}
      </li>
    )
  }, [t, handleDeleteClick])

  return (
    <>
      {categories.map((category, index) => printCategory(category, index.toString()))}
      <Modal id="delete-category-modal" labelledBy="delete-category-modal-title" open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <h2 className="modal-title" id="delete-category-modal-title">{t("Labels.delete-category")}</h2>
        <div>
          <button type="button" className="btn" onClick={() => setDeleteModalOpen(false)}>{t("Labels.cancel")}</button>
          <button type="button" className="btn" onClick={handleDelete}>{t("Labels.delete-category")}</button>
        </div>
      </Modal>
    </>
  )
}