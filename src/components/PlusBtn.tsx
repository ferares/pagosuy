import { type MouseEvent, type EventHandler } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

interface PlusBtnProps { label: string, onClick: EventHandler<MouseEvent> }

export default function PlusBtn({ label, onClick }: PlusBtnProps) {
  return (
    <button type="button" className="btn btn--plus" aria-label={label} onClick={onClick}>
      <FontAwesomeIcon icon={faPlus} />
    </button>
  )
}