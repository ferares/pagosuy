import currencyList from "@/constants/currency-list.json"

import { type Locale } from "@/i18n/routing"

type Currency = {
  name: string
  symbol_native: string
  symbol: string
  code: string
  name_plural: string
  rounding: number
  decimal_digits: number
}

export function getAllCurrencies(locale: Locale) {
  const list = currencyList as Record<Locale, Record<string, Currency>>
  return list[locale]
}