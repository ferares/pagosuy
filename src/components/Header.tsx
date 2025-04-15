import Link from "next/link"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoneyBillWave } from "@fortawesome/free-solid-svg-icons"

export default function Header() {
  return (
    <header className="header">
      <div className="header__content">
        <Link className="header__link" href="/">
          <FontAwesomeIcon className="header__icon" icon={faMoneyBillWave} />
          PagosUY
        </Link>
      </div>
    </header>
  )
}