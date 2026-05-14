'use client'

import { useLorennStore } from '@/lib/store'
import { ENERGY_CONFIGS } from '@/lib/energy'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Zap,
  Lightbulb,
  Users,
  FileText,
  Sparkles,
  BookMarked,
  ChevronLeft,
  ChevronRight,
  Settings,
  Network,
} from 'lucide-react'

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/captura', icon: Zap, label: 'Captura' },
  { href: '/ideias', icon: Lightbulb, label: 'Banco de Ideias' },
  { href: '/conteudo', icon: FileText, label: 'Conteúdo' },
  { href: '/prompts', icon: BookMarked, label: 'Prompts' },
  { href: '/clientes', icon: Users, label: 'Clientes' },
  { href: '/crm', icon: Sparkles, label: 'CRM Criativo' },
  { href: '/mapa', icon: Network, label: 'Mapa Mental' },
]

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, energyMode, setEnergyMode } = useLorennStore()
  const pathname = usePathname()
  const energy = ENERGY_CONFIGS[energyMode]

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen z-40 flex flex-col',
        'transition-all duration-300 ease-in-out',
        'border-r border-[var(--border)]',
        sidebarCollapsed ? 'w-16' : 'w-56',
        'bg-[var(--bg-surface)]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-[var(--border)]',
        sidebarCollapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">L</span>
        </div>
        {!sidebarCollapsed && (
          <div>
            <p className="text-[var(--text-primary)] font-semibold text-sm leading-tight">Lorenna OS</p>
            <p className="text-[var(--text-muted)] text-[10px]">Sistema Cognitivo</p>
          </div>
        )}
      </div>

      {/* Energy mode indicator */}
      <div className={cn(
        'mx-3 mt-3 rounded-xl p-2.5 border',
        'transition-all duration-400',
        sidebarCollapsed ? 'flex justify-center' : ''
      )}
        style={{
          backgroundColor: `${energy.color}66`,
          borderColor: `${energy.accent}33`,
        }}
      >
        {sidebarCollapsed ? (
          <span className="text-base leading-none">{energy.emoji}</span>
        ) : (
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Modo atual</p>
            <p className="text-sm font-medium" style={{ color: energy.accent }}>
              {energy.emoji} {energy.label}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-150',
                sidebarCollapsed ? 'justify-center' : '',
                active
                  ? 'bg-[var(--accent-soft)] text-[var(--text-accent)] border border-[var(--border-accent)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon size={17} className="flex-shrink-0" />
              {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Energy quick-switch */}
      {!sidebarCollapsed && (
        <div className="px-3 pb-3">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 px-1">Trocar energia</p>
          <div className="grid grid-cols-4 gap-1">
            {Object.values(ENERGY_CONFIGS).map((e) => (
              <button
                key={e.id}
                onClick={() => setEnergyMode(e.id)}
                title={e.label}
                className={cn(
                  'h-8 rounded-lg text-base flex items-center justify-center transition-all duration-150',
                  energyMode === e.id
                    ? 'bg-[var(--accent-soft)] border border-[var(--border-accent)] scale-110'
                    : 'bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] border border-transparent'
                )}
              >
                {e.emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom */}
      <div className={cn(
        'p-3 border-t border-[var(--border)] flex items-center',
        sidebarCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {!sidebarCollapsed && (
          <Link href="/config" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <Settings size={15} />
          </Link>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-lg hover:bg-[var(--bg-hover)]"
        >
          {sidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>
    </aside>
  )
}
