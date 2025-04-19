import { PrismaClient } from "@/generated/prisma"

import CreateCategoryForm from "@/components/createCategoryForm"

export default async function Categories() {
  const prisma = new PrismaClient()
  const categories = await prisma.category.findMany({ where: { parentCategory: null }, include: { subCategories: true } })
  return (
    <div>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            {category.name}
          </li>
        ))}
      </ul>
      <CreateCategoryForm />
    </div>
  )
}