import { Link } from "@/i18n/navigation"

import { getTranslations } from "next-intl/server"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChartLine, faClipboardList, type IconDefinition } from "@fortawesome/free-solid-svg-icons"

import { type TranslationKey, type Href } from "@/i18n/request"

const links: { icon: IconDefinition, label: TranslationKey, href: Href }[] = [
  {
    icon: faChartLine,
    label: "Labels.dashboard",
    href: "/admin",
  },
  {
    icon: faClipboardList,
    label: "Labels.transactions",
    href: "/admin/transactions",
  },
]

export default async function Sidebar() {
  const t = await getTranslations()
  return (
    <nav className="sidebar">
      <ul className="sidebar__list">
        {links.map((link, index) => (
          <li key={index}>
            <Link href={link.href}>
              <FontAwesomeIcon icon={link.icon} />
              {t(link.label)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}