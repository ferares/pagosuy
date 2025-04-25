import { getTranslations } from "next-intl/server"

import { PrismaClient, type Prisma } from "@/generated/prisma"

import CreateCategoryForm from "@/components/CreateCategoryForm"
import CategoryList from "@/components/CategoryList"

type CategoryWithSubCategories = Prisma.CategoryGetPayload<{ include: { subCategories: true } }>

function sortCategories(categories: CategoryWithSubCategories[]) {
  const categoryMap = new Map<number, CategoryWithSubCategories>()
  categories.forEach(category => categoryMap.set(category.id, category))
  const rootCategories: CategoryWithSubCategories[] = []
  categories.forEach(category => {
    if (category.parentId === null) {
      rootCategories.push(category)
    } else {
      const parent = categoryMap.get(category.parentId)
      if (parent) {
        parent.subCategories.push(category)
      }
    }
  })
  return rootCategories
}

export default async function Categories() {
  const t = await getTranslations()
  const prisma = new PrismaClient()
  const allCategories = await prisma.category.findMany()
  const categoriesTree = sortCategories(allCategories.map((category) => ({ ...category, subCategories: [] })))
  return (
    <div>
      <header className="page-header">
        <h2 className="title">{t("Labels.categories")}</h2>
        <CreateCategoryForm categories={allCategories} />
      </header>
      <ul>
        <CategoryList categories={categoriesTree} />
      </ul>
    </div>
  )
}