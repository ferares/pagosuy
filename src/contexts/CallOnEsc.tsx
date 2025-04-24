"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

declare type CallOnEscContextProps = {
  pushCallOnEsc: (cb: () => void) => void,
  removeCallOnEsc: (cb: () => void) => void,
}

const CallOnEscContext = createContext<CallOnEscContextProps>({
  pushCallOnEsc: (_: () => void) => null,
  removeCallOnEsc: (_: () => void) => null,
})

export function CallOnEscProvider({ children }: { children: React.ReactNode }) {
  const [callOnEsc, setCallOnEsc] = useState<(() => void)[]>([])

  const removeCallOnEsc = useCallback((cb: () => void) => {
    setCallOnEsc((currentCallOnEsc) => {
      const index = currentCallOnEsc.indexOf(cb)
      if (index === -1) return currentCallOnEsc
      const callOnEsc = [...currentCallOnEsc]
      callOnEsc.splice(index, 1)
      return callOnEsc
    })
  }, [setCallOnEsc])

  const popCallOnEsc = useCallback((event: KeyboardEvent): void => {
    if (!callOnEsc.length) return
    event.preventDefault()
    callOnEsc[0]()
    setCallOnEsc((currentCallOnEsc) => {
      const callOnEsc = [...currentCallOnEsc]
      callOnEsc.shift()
      return callOnEsc
    })
  }, [setCallOnEsc, callOnEsc])

  const pushCallOnEsc = useCallback((cb: () => void): void => setCallOnEsc((current) => [cb, ...current]), [setCallOnEsc])
  const handleKeyDown = useCallback((event: KeyboardEvent) => { if (event.key === "Escape") popCallOnEsc(event) }, [popCallOnEsc])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const value = { pushCallOnEsc, removeCallOnEsc }

  return (
    <CallOnEscContext.Provider value={value}>
      {children}
    </CallOnEscContext.Provider>
  )
}

export const useCallOnEscContext = () => useContext(CallOnEscContext)
