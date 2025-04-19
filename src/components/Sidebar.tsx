import NextLink from "next/link"

import { Link } from "@/i18n/navigation"

import { getTranslations } from "next-intl/server"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChartLine, faCommentsDollar, faMoneyBillTransfer, faMoneyCheckDollar, faPiggyBank, faTag, faUser, type IconDefinition } from "@fortawesome/free-solid-svg-icons"

import { type TranslationKey, type Href } from "@/i18n/request"

const links: { icon: IconDefinition, label: TranslationKey, href: Href }[] = [
  {
    icon: faChartLine,
    label: "Labels.dashboard",
    href: "/admin",
  },
  {
    icon: faUser,
    label: "Labels.profile",
    href: "/admin/profile",
  },
  {
    icon: faPiggyBank,
    label: "Labels.accounts",
    href: "/admin/accounts",
  },
  {
    icon: faMoneyCheckDollar,
    label: "Labels.transactions",
    href: "/admin/transactions",
  },
  {
    icon: faMoneyBillTransfer,
    label: "Labels.transfers",
    href: "/admin/transfers",
  },
  {
    icon: faCommentsDollar,
    label: "Labels.balances",
    href: "/admin/balances",
  },
  {
    icon: faTag,
    label: "Labels.categories",
    href: "/admin/categories",
  },
]

export default async function Sidebar() {
  const t = await getTranslations()
  return (
    <nav className="sidebar">
      <ul className="sidebar__list">
        {links.map((link, index) => (
          <li className="sidebar__item" key={index}>
            <Link className="sidebar__link" href={link.href}>
              <FontAwesomeIcon className="sidebar__icon" icon={link.icon} />
              {t(link.label)}
            </Link>
          </li>
        ))}
      </ul>
      <NextLink prefetch={false} href="/api/auth/signout">
        {t("Labels.signout")}
      </NextLink>
    </nav>
  )
}