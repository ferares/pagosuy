import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { Roboto } from "next/font/google"

import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"

import { config } from "@fortawesome/fontawesome-svg-core"

import { locales, type Locale } from "@/i18n/routing"

import { LoaderProvider } from "@/contexts/Loader"
import { AlertsProvider } from "@/contexts/Alerts"

import Header from "@/components/Header"
import Footer from "@/components/Footer"

import "../../styles/app.css"

// We load FA's styles on app.css to prevent FOUC
config.autoAddCss = false

const { APP_URL } = process.env

const roboto = Roboto({ variable: "--font-roboto", display: "swap", subsets: ["latin"] })

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: "Metadata" })
  const title = "PagosUY"
  const description = t("description")
  return {
    title,
    metadataBase: new URL(APP_URL ?? ""),
    authors: [{ name: "Ares Software", url: "https://ares.uy" }],
    description,
    robots: "index,follow",
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

interface RootLayoutProps { params: Promise<{ locale: Locale }>, children: React.ReactNode }

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params
  if (!locales.includes(locale)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()
  return (
    <html lang={locale}>
      <body className={`${roboto.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <LoaderProvider>
            <AlertsProvider>
              <Header />
              {children}
              <Footer />
            </AlertsProvider>
          </LoaderProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
