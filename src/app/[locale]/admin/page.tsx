import { getTranslations } from "next-intl/server"

export default async function Admin() {
  const t = await getTranslations("Labels")
  return (
    <div>
      <h1>{t("admin")}</h1>
    </div>
  )
}