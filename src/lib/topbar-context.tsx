'use client'

import { createContext, useContext, useState } from 'react'

export interface TopbarConfig {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

const TopbarContext = createContext<{
  config: TopbarConfig
  setConfig: (c: TopbarConfig) => void
}>({
  config: { title: 'Logue OS' },
  setConfig: () => {},
})

export function useTopbar() {
  return useContext(TopbarContext)
}

export function TopbarProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<TopbarConfig>({ title: 'Logue OS' })
  return (
    <TopbarContext.Provider value={{ config, setConfig }}>
      {children}
    </TopbarContext.Provider>
  )
}
