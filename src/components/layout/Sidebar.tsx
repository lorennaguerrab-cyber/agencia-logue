'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useOsStore } from '@/lib/os-store'
import {
  LayoutDashboard, Users, KanbanSquare, Sparkles, Film,
  Calculator, FileText, Wallet, Target, Network, Building2,
  Palette, CalendarClock, ChevronDown,
} from 'lucide-react'

const NAV = [
  {
    group: 'Principal',
    items: [
      { id: 'dashboard', href: '/',          icon: LayoutDashboard, name: 'Dashboard' },
      { id: 'clientes',  href: '/clientes',  icon: Users,           name: 'Clientes' },
      { id: 'entregas',  href: '/entregas',  icon: KanbanSquare,    name: 'Entregas' },
    ],
  },
  {
    group: 'Criar',
    items: [
      { id: 'rotinas',       href: '/rotinas',       icon: CalendarClock, name: 'Rotina Diária' },
      { id: 'ia',            href: '/ia',            icon: Sparkles,    name: 'IA de Conteúdo' },
      { id: 'roteiros',      href: '/roteiros',      icon: Film,        name: 'Roteiros' },
      { id: 'precificacao',  href: '/precificacao',  icon: Calculator,  name: 'Precificação' },
      { id: 'contratos',     href: '/contratos',     icon: FileText,    name: 'Contratos' },
    ],
  },
  {
    group: 'Negócio',
    items: [
      { id: 'financeiro', href: '/financeiro', icon: Wallet,    name: 'Financeiro' },
      { id: 'radar',      href: '/radar',      icon: Target,    name: 'Ticket Radar' },
      { id: 'rede',       href: '/rede',       icon: Network,   name: 'Rede Estratégica' },
      { id: 'agencia',    href: '/agencia',    icon: Building2, name: 'Agência' },
      { id: 'design-system', href: '/design-system', icon: Palette, name: 'Design System' },
    ],
  },
]

const COLLAB_ALLOWED = ['/entregas', '/roteiros']

export function Sidebar() {
  const pathname = usePathname()
  const { user, logOut } = useOsStore()
  if (!user) return null

  const isCollab = user.access === 'collab'

  return (
    <aside style={{
      background: 'var(--surface-1)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 14px',
      overflowY: 'auto',
      height: '100vh',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 1, padding: '8px 10px 24px' }}>
        <span className="os-title" style={{ fontSize: 22, letterSpacing: '-0.04em', color: 'var(--fg-1)' }}>logue</span>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', alignSelf: 'flex-end', marginBottom: 5 }} />
        <span className="os-title" style={{ fontSize: 12, letterSpacing: '0.1em', color: 'var(--accent)', marginLeft: 8 }}>OS</span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1 }}>
        {NAV.map(group => {
          const items = group.items.filter(item => !isCollab || COLLAB_ALLOWED.includes(item.href))
          if (items.length === 0) return null
          return (
            <div key={group.group} style={{ marginBottom: 18 }}>
              <div style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--fg-4)', padding: '0 10px 8px',
              }}>
                {group.group}
              </div>
              {items.map(item => {
                const active = item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 11,
                      padding: '9px 10px', borderRadius: 'var(--r-sm)',
                      color: active ? 'var(--accent)' : 'var(--fg-2)',
                      fontSize: 13, fontWeight: active ? 500 : 400,
                      background: active ? 'var(--accent-ghost)' : 'transparent',
                      transition: 'background var(--dur), color var(--dur)',
                      marginBottom: 2,
                      textDecoration: 'none',
                    }}
                  >
                    <Icon size={18} color={active ? 'var(--accent)' : 'var(--fg-3)'} style={{ flexShrink: 0 }} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* User chip */}
      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        <button
          onClick={logOut}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)', padding: '8px 10px',
            transition: 'border-color var(--dur), background var(--dur)',
            cursor: 'pointer',
          }}
          title="Clique para sair"
        >
          <span style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: 'var(--accent)', color: '#0a0a0a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
          }}>
            {user.initials}
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name}
            </span>
            <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>{user.role}</span>
          </span>
          <ChevronDown size={16} color="var(--fg-3)" />
        </button>
      </div>
    </aside>
  )
}
