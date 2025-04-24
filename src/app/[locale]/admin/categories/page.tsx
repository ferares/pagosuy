import { getTranslations } from "next-intl/server"

import { PrismaClient } from "@/generated/prisma"

import CreateCategoryForm from "@/components/CreateCategoryForm"

export default async function Categories() {
  const t = await getTranslations()
  const prisma = new PrismaClient()
  const categories = await prisma.category.findMany({ where: { parentCategory: null }, include: { subCategories: true } })
  return (
    <div>
      <header className="page-header">
        <h2 className="title">{t("Labels.categories")}</h2>
        <CreateCategoryForm />
      </header>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  )
}