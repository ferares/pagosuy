import { defineRouting } from "next-intl/routing"

export const locales = ["en"] as const

export type Locale = typeof locales[number]

export const defaultLocale: Locale = "en"

export const labels: Record<Locale, string> = { "en": "English" }

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: {
    mode: "always",
    prefixes: {
      "en": "/en",
    },
  },
  pathnames: {
    "/": "/",
    "/admin": "/admin",
    "/auth/signin": "/auth/signin",
    "/auth/signup": "/auth/signup",
    "/admin/accounts": "/admin/accounts",
    "/admin/transactions": "/admin/transactions",
    "/admin/transfers": "/admin/transfers",
    "/admin/balances": "/admin/balances",
    "/admin/categories": "/admin/categories",
    "/admin/profile": "/admin/profile",
  }
})