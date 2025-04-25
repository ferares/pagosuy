import { getTranslations } from "next-intl/server"

import { PrismaClient } from "@/generated/prisma"

import { getSessionFromCookie } from "@/helpers/session"

import CreateTransferForm from "@/components/CreateTransferForm"

export default async function Transfers() {
  const t = await getTranslations()
  const session = (await getSessionFromCookie())!
  const prisma = new PrismaClient()
  const transfers = await prisma.transfer.findMany({ where: { OR: [{ sender: { userAccounts: { some: { userId: session.userId } } } }, { receiver: { userAccounts: { some: { userId: session.userId } } } }] } })
  const accounts = await prisma.account.findMany()
  return (
    <div>
      <header className="page-header">
        <h2 className="title">{t("Labels.transfers")}</h2>
        <CreateTransferForm accounts={accounts.map((account) => ({ id: account.id, currency: account.currency, name: account.name }))} />
      </header>
      <ul>
        {transfers.map((transfer, index) => (
          <li key={index}>
            {transfer.amountIn.toFixed(2)}<br />
            {transfer.amountOut.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  )
}