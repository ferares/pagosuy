import Link from "next/link"

import { getTranslations } from "next-intl/server"

export default async function Admin() {
  const t = await getTranslations("Labels")
  return (
    <div>
      <h1>{t("admin")}</h1>
      <Link prefetch={false} href="/api/auth/signout">
        {t("signout")}
      </Link>
    </div>
  )
}