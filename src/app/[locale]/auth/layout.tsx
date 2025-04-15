export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main id="main" className="main main--auth">
      <div className="max-width">
        {children}
      </div>
    </main>
  )
}
