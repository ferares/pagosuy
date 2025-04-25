import { getTranslations } from "next-intl/server"

export default async function Admin() {
  const t = await getTranslations()
  return (
    <header className="page-header">
      <h2 className="title">{t("Labels.dashboard")}</h2>
    </header>
  )
}