import { getTranslations } from "next-intl/server"

export default async function Balances() {
  const t = await getTranslations()
  return (
    <header className="page-header">
      <h2 className="title">{t("Labels.balances")}</h2>
    </header>
  )
}