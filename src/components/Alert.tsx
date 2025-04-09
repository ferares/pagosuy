"use client"

import { type PropsWithChildren, useEffect, useRef, useState } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose } from "@fortawesome/free-solid-svg-icons"

import { type AlertType } from "@/contexts/Alerts"

interface AlertComponentProps extends PropsWithChildren {
  type: AlertType
  timeout?: number
  removeAlert: () => void
}

export default function AlertComponent({ type, timeout, children, removeAlert }: AlertComponentProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    if (!timeout) return
    timeoutRef.current = setTimeout(() => setHiding(true), timeout)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [timeout])

  return (
    <div className={`alert alert-${type} ${hiding ? "hide" : ""}`} role="alert" onAnimationEnd={() => (hiding) && removeAlert()}>
      <button type="button" className="close btn-close" title={"Close"} onClick={() => setHiding(true)}>
        <FontAwesomeIcon icon={faClose} />
      </button>
      <div>
        {children}
      </div>
    </div>
  )
}