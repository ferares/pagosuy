import { hasLocale, type Messages } from "next-intl"
import { getRequestConfig } from "next-intl/server"

import { routing } from "./routing"
import { type getPathname } from "./navigation"

type DotPrefix<T extends string, U extends string> = `${T}.${U}`

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string)]: ObjectType[Key] extends object ? DotPrefix<Key & string, NestedKeyOf<ObjectType[Key]>> : Key
}[keyof ObjectType & (string)]

export type TranslationKey = NestedKeyOf<Messages>

export type Href = Parameters<typeof getPathname>[0]["href"]

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale
  const messages = (await import(`../../langs/${locale}.json`)) as { default: Messages }
  return { locale, messages: messages.default }
})