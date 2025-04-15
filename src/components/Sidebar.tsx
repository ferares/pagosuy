import { Link } from "@/i18n/navigation"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChartLine, faClipboardList, type IconDefinition } from "@fortawesome/free-solid-svg-icons"

import { type Href } from "@/i18n/request"

const links: { icon: IconDefinition, label: string, href: Href }[] = [
  {
    icon: faChartLine,
    label: "Dashboard",
    href: "/admin",
  },
  {
    icon: faClipboardList,
    label: "Transactions",
    href: "/admin/transactions",
  },
]

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <ul className="sidebar__list">
        {links.map((link, index) => (
          <li key={index}>
            <Link href={link.href}>
              <FontAwesomeIcon icon={link.icon} />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}