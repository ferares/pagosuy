import { Link } from "@/i18n/navigation"

export default function Home() {
  return (
    <main id="main" className="main main--auth">
      <div className="max-width">
        <Link href="/auth/signin">Signin!</Link>
      </div>
    </main>
  )
}
