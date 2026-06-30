'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useClientStore } from '@/lib/client/store'
import {
  LayoutGrid, ClipboardList, Send, CalendarDays, CheckSquare,
  FolderOpen, BookOpen, LogOut, ArrowLeft,
} from 'lucide-react'

const NAV = [
  { href: '/cliente', label: 'Visão geral', icon: LayoutGrid, exact: true },
  { href: '/cliente/briefings', label: 'Briefings', icon: ClipboardList },
  { href: '/cliente/demandas', label: 'Demandas & Ideias', icon: Send },
  { href: '/cliente/calendario', label: 'Calendário', icon: CalendarDays },
  { href: '/cliente/aprovacoes', label: 'Aprovações', icon: CheckSquare },
  { href: '/cliente/arquivos', label: 'Arquivos', icon: FolderOpen },
  { href: '/cliente/orientacoes', label: 'Como enviar materiais', icon: BookOpen },
]

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { account, logOut } = useClientStore()

  useEffect(() => {
    if (!account) router.replace('/login')
  }, [account, router])

  if (!account) return null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '252px 1fr', minHeight: '100vh' }} className="client-grid">
      <aside style={{ background: 'var(--surface-1)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '22px 14px', position: 'sticky', top: 0, height: '100vh' }} className="client-aside">
        <div style={{ padding: '4px 10px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <span className="os-title" style={{ fontSize: 22, letterSpacing: '-0.04em' }}>logue</span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', alignSelf: 'flex-end', marginBottom: 5 }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--fg-4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Área do cliente</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 11, padding: '9px 10px', borderRadius: 'var(--r-sm)',
                color: active ? 'var(--accent)' : 'var(--fg-2)', fontSize: 13, fontWeight: active ? 500 : 400,
                background: active ? 'var(--accent-ghost)' : 'transparent',
              }}>
                <Icon size={17} color={active ? 'var(--accent)' : 'var(--fg-3)'} style={{ flexShrink: 0 }} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--fg-3)', padding: '6px 10px' }}>
            <ArrowLeft size={14} /> Ver o site
          </Link>
          <button onClick={() => { logOut(); router.replace('/login') }} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '9px 11px', cursor: 'pointer' }}>
            <span style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--accent)', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12 }}>
              {account.marca.slice(0, 2).toUpperCase()}
            </span>
            <span style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{account.marca}</span>
              <span style={{ display: 'block', fontSize: 11, color: 'var(--fg-3)' }}>Sair</span>
            </span>
            <LogOut size={15} color="var(--fg-3)" />
          </button>
        </div>
      </aside>

      <main style={{ padding: 'clamp(20px, 4vw, 36px)', maxWidth: 1080, width: '100%' }} className="os-view-in">
        {children}
      </main>
    </div>
  )
}

export function ClientHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h1 className="os-title" style={{ fontSize: 26, color: 'var(--fg-1)', letterSpacing: '-0.02em' }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 14, color: 'var(--fg-3)', marginTop: 6 }}>{subtitle}</p>}
    </div>
  )
}
