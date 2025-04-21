import { PrismaClient } from "@/generated/prisma"

import { getSessionFromCookie } from "@/helpers/session"

import CreateAccountForm from "@/components/createAccountForm"

export default async function Accounts() {
  const session = (await getSessionFromCookie())!
  const prisma = new PrismaClient()
  const accounts = await prisma.account.findMany({ where: { userAccounts: { every: { userId: session.userId } } } })
  return (
    <div>
      <ul>
        {accounts.map((account, index) => (
          <li key={index}>
            {account.name}: {account.amount.toFixed(2)}
          </li>
        ))}
      </ul>
      <CreateAccountForm />
    </div>
  )
}