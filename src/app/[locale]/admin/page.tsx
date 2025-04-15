import Link from "next/link"

export default function Admin() {
  return (
    <div>
      <h1>Admin</h1>
      <Link prefetch={false} href="/api/auth/signout">
        Signout
      </Link>
    </div>
  )
}