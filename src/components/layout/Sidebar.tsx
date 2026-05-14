'use client'

import { useLorennStore } from '@/lib/store'
import { ENERGY_CONFIGS } from '@/lib/energy'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Zap, Lightbulb, Users, FileText,
  Sparkles, BookMarked, ChevronLeft, ChevronRight, Network,
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
        'fixed left-0 top-0 h-screen z-40 flex flex-col bg-white',
        'border-r border-[var(--border)]',
        'shadow-[1px_0_0_rgba(0,0,0,0.03)]',
        'transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'w-16' : 'w-56',
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-[var(--border)]',
        sidebarCollapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-[0_2px_6px_rgba(99,102,241,0.35)]">
          <span className="text-white text-sm font-bold">L</span>
        </div>
        {!sidebarCollapsed && (
          <div>
            <p className="text-[var(--text-primary)] font-semibold text-sm leading-tight">Lorenna OS</p>
            <p className="text-[var(--text-muted)] text-[10px]">Sistema Cognitivo</p>
          </div>
        )}
      </div>

      {/* Energy indicator */}
      <div
        className={cn('mx-3 mt-3 rounded-xl px-3 py-2.5 border transition-all', sidebarCollapsed ? 'flex justify-center px-0' : '')}
        style={{ backgroundColor: `${energy.accent}10`, borderColor: `${energy.accent}22` }}
      >
        {sidebarCollapsed ? (
          <span className="text-lg">{energy.emoji}</span>
        ) : (
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Modo atual</p>
            <p className="text-sm font-semibold" style={{ color: energy.accent }}>
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
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                sidebarCollapsed ? 'justify-center' : '',
                active
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] border border-transparent'
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon size={17} className="flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Energy quick-switch */}
      {!sidebarCollapsed && (
        <div className="px-3 pb-3">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 px-1 font-medium">Trocar energia</p>
          <div className="grid grid-cols-4 gap-1">
            {Object.values(ENERGY_CONFIGS).map((e) => (
              <button
                key={e.id}
                onClick={() => setEnergyMode(e.id)}
                title={e.label}
                className={cn(
                  'h-8 rounded-lg text-base flex items-center justify-center transition-all',
                  energyMode === e.id
                    ? 'bg-indigo-50 border border-indigo-200 scale-110'
                    : 'bg-[var(--bg-base)] hover:bg-[var(--bg-hover)] border border-transparent'
                )}
              >
                {e.emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Collapse */}
      <div className={cn('p-3 border-t border-[var(--border)] flex', sidebarCollapsed ? 'justify-center' : 'justify-end')}>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-lg hover:bg-[var(--bg-hover)]"
        >
          {sidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>
    </aside>
  )
}
