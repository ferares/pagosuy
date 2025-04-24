import { getTranslations } from "next-intl/server"

import { PrismaClient } from "@/generated/prisma"

import { getSessionFromCookie } from "@/helpers/session"

import CreateAccountForm from "@/components/CreateAccountForm"

export default async function Accounts() {
  const t = await getTranslations()
  const session = (await getSessionFromCookie())!
  const prisma = new PrismaClient()
  const accounts = await prisma.account.findMany({ where: { userAccounts: { every: { userId: session.userId } } } })
  return (
    <div>
      <header className="page-header">
        <h2 className="title">{t("Labels.accounts")}</h2>
        <CreateAccountForm />
      </header>
      <ul>
        {accounts.map((account, index) => (
          <li key={index}>
            {account.name}: {account.amount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  )
}