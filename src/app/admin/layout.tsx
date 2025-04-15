import Sidebar from "@/components/Sidebar"

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main id="main" className="main main--admin">
      <Sidebar />
      <div className="max-width">
        {children}
      </div>
    </main>
  )
}
