import Link from "next/link"

export default function Header() {
  return (
    <header className="header">
      <div className="header__content">
        <Link href="/">
          PagosUY
        </Link>
      </div>
    </header>
  )
}