import { type Metadata } from "next"
import { Roboto } from "next/font/google"

import { config } from "@fortawesome/fontawesome-svg-core"

import { LoaderProvider } from "@/contexts/Loader"
import { AlertsProvider } from "@/contexts/Alerts"

import Header from "@/components/Header"
import Footer from "@/components/Footer"

import "../styles/app.css"

// We load FA's styles on app.css to prevent FOUC
config.autoAddCss = false

const roboto = Roboto({ variable: "--font-roboto", display: "swap", subsets: ["latin"] })

export const metadata: Metadata = { robots: "noindex,nofollow" }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <LoaderProvider>
          <AlertsProvider>
            <Header />
            {children}
            <Footer />
          </AlertsProvider>
        </LoaderProvider>
      </body>
    </html>
  )
}
