import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"

export default async function Home() {
  const t = await getTranslations("Labels")
  return (
    <main id="main" className="main main--auth">
      <div className="max-width">
        <Link href="/auth/signin">{t("signin")}!</Link>
      </div>
    </main>
  )
}
