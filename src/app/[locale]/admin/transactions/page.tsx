import { PrismaClient } from "@/generated/prisma"

import { getSessionFromCookie } from "@/helpers/session"

import CreateTransactionForm from "@/components/createTransactionForm"

export default async function Transactions() {
  const session = (await getSessionFromCookie())!
  const prisma = new PrismaClient()
  const transactions = await prisma.transaction.findMany({ where: { userTransactions: { every: { userId: session.userId } } } })
  return (
    <div>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            {transaction.amount.toFixed(2)}
          </li>
        ))}
      </ul>
      <CreateTransactionForm />
    </div>
  )
}