import { type Metadata } from "next"

import Sidebar from "@/components/Sidebar"

export const metadata: Metadata = { robots: "noindex,nofollow" }

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="template-admin">
      <Sidebar />
      {children}
    </div>
  )
}
