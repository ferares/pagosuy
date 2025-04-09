import { Roboto } from "next/font/google"

import "../styles/app.css"
import { LoaderProvider } from "@/contexts/Loader"
import { AlertsProvider } from "@/contexts/Alerts"

const roboto = Roboto({ variable: "--font-roboto", display: "swap", subsets: ["latin"] })

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}`}>
        <LoaderProvider>
          <AlertsProvider>
            {children}
          </AlertsProvider>
        </LoaderProvider>
      </body>
    </html>
  )
}
