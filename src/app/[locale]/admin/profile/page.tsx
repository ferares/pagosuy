import { getTranslations } from "next-intl/server"

export default async function Profile() {
  const t = await getTranslations()
  return (
    <header className="page-header">
      <h2 className="title">{t("Labels.profile")}</h2>
    </header>
  )
}