import { PrismaClient } from "@/generated/prisma"

import { getSessionFromCookie } from "@/helpers/session"

import CreateTransferForm from "@/components/createTransferForm"

export default async function Transfers() {
  const session = (await getSessionFromCookie())!
  const prisma = new PrismaClient()
  const transfers = await prisma.transfer.findMany({ where: { OR: [{ sender: { userAccounts: { some: { userId: session.userId } } } }, { receiver: { userAccounts: { some: { userId: session.userId } } } }] } })
  return (
    <div>
      <ul>
        {transfers.map((transfer, index) => (
          <li key={index}>
            {transfer.amountIn.toFixed(2)}<br />
            {transfer.amountOut.toFixed(2)}
          </li>
        ))}
      </ul>
      <CreateTransferForm />
    </div>
  )
}