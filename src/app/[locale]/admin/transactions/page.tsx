import { getTranslations } from "next-intl/server"

import { PrismaClient } from "@/generated/prisma"

import { getSessionFromCookie } from "@/helpers/session"

import CreateTransactionForm from "@/components/CreateTransactionForm"

export default async function Transactions() {
  const t = await getTranslations()
  const session = (await getSessionFromCookie())!
  const prisma = new PrismaClient()
  const transactions = await prisma.transaction.findMany({ where: { OR: [{ account: { userAccounts: { some: { userId: session.userId } } } }, { userTransactions: { some: { userId: session.userId } } }] } })
  const userAccounts = await prisma.account.findMany({ where: { userAccounts: { some: { userId: session.userId } } } })
  const categories = await prisma.category.findMany({ where: { parentId: null }, include: { subCategories: true } })
  return (
    <div>
      <header className="page-header">
        <h2 className="title">{t("Labels.transactions")}</h2>
        <CreateTransactionForm accounts={userAccounts.map((account) => ({ id: account.id, name: account.name }))} categories={categories} />
      </header>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            {transaction.amount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  )
}