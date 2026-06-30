'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOsStore } from '@/lib/os-store'
import { TopbarProvider, useTopbar } from '@/lib/topbar-context'
import { Sidebar } from './Sidebar'
import {
  Search, Bell,
} from 'lucide-react'

function Topbar() {
  const { config } = useTopbar()
  return (
    <header style={{
      height: 'var(--topbar-h)',
      flexShrink: 0,
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      gap: 24,
      background: 'rgba(10,10,10,.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexShrink: 0, minWidth: 0 }}>
        <h1 className="os-title" style={{ fontSize: 19, color: 'var(--fg-1)', whiteSpace: 'nowrap' }}>
          {config.title}
        </h1>
        {config.subtitle && (
          <span style={{ fontSize: 12.5, color: 'var(--fg-3)', whiteSpace: 'nowrap' }}>
            {config.subtitle}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-sm)', padding: '8px 12px',
          flex: '0 1 260px', minWidth: 0,
        }}>
          <Search size={16} color="var(--fg-3)" />
          <input
            placeholder="Buscar clientes, entregas…"
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--fg-1)', fontSize: 13, width: '100%',
            }}
          />
        </div>
        <button style={{
          position: 'relative',
          width: 38, height: 38, borderRadius: 'var(--r-sm)',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          color: 'var(--fg-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: 9, right: 10,
            width: 6, height: 6, borderRadius: '50%', background: 'var(--red)',
          }} />
        </button>
        {config.actions}
      </div>
    </header>
  )
}

function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user } = useOsStore()

  useEffect(() => {
    if (!user) {
      router.replace('/login')
    }
  }, [user, router])

  if (!user) return null

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'var(--sidebar-w) 1fr',
      height: '100vh',
      overflow: 'hidden',
    }}>
      <Sidebar />
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Topbar />
        <div className="os-view-in" style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <TopbarProvider>
      <AppShell>{children}</AppShell>
    </TopbarProvider>
  )
}
