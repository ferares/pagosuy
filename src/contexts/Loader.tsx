"use client"

import { createContext, useCallback, useContext, useState } from "react"

import Loader from "@/components/Loader"

declare type LoaderContextProps = {
  setLoading: (active: boolean, message?: string) => void,
}

const LoaderContext = createContext<LoaderContextProps>({
  setLoading: () => null,
})

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ active: boolean, message?: string }>({ active: false })

  const setLoading = useCallback((active: boolean, message?: string) => { setState({ active, message }) }, [])
  
  const value = { setLoading }
  return (
    <LoaderContext.Provider value={value}>
      <Loader active={state.active} message={state.message} />
      {children}
    </LoaderContext.Provider>
  )
}

export const useLoaderContext = () => useContext(LoaderContext)
