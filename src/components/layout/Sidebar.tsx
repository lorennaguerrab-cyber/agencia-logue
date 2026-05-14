'use client'

import { useState, useEffect } from 'react'
import { useLorennStore } from '@/lib/store'
import { ENERGY_CONFIGS } from '@/lib/energy'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Zap, Archive, CheckSquare, FileText,
  BookMarked, Users, Sparkles, CalendarDays, DollarSign,
  Settings, ChevronLeft, ChevronRight, User, BarChart2, Menu, X,
} from 'lucide-react'
import type { EnergyMode } from '@/lib/types'

const navItems = [
  { href: '/',               icon: LayoutDashboard, label: 'Dashboard'          },
  { href: '/captura',        icon: Zap,             label: 'Baú de Ideias'      },
  { href: '/ideias',         icon: Archive,         label: 'Acervo de Conteúdo' },
  { href: '/tarefas',        icon: CheckSquare,     label: 'Tarefas'            },
  { href: '/conteudo',       icon: FileText,        label: 'Conteúdo'           },
  { href: '/prompts',        icon: BookMarked,      label: 'Prompts'            },
  { href: '/clientes',       icon: Users,           label: 'Clientes'           },
  { href: '/crm',            icon: Sparkles,        label: 'CRM Criativo'       },
  { href: '/calendario',     icon: CalendarDays,    label: 'Agenda'             },
  { href: '/monetizacao',    icon: DollarSign,      label: 'Monetização'        },
  { href: '/financeiro',     icon: BarChart2,       label: 'Financeiro'         },
  { href: '/sobre',          icon: User,            label: 'Sobre'              },
  { href: '/como-por-no-ar', icon: Settings,        label: 'Como pôr no ar'     },
]

const ENERGY_ORDER: EnergyMode[] = ['cansada', 'criativa', 'operacional', 'foco', 'social', 'maternidade', 'gravacao']

function SidebarContent({
  collapsed,
  onCollapse,
  onClose,
  isMobileDrawer = false,
}: {
  collapsed: boolean
  onCollapse: () => void
  onClose?: () => void
  isMobileDrawer?: boolean
}) {
  const { energyMode, setEnergyMode } = useLorennStore()
  const pathname = usePathname()
  const energy = ENERGY_CONFIGS[energyMode]

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className={cn(
        'flex items-center h-[68px] px-5 border-b border-[var(--border)] flex-shrink-0',
        collapsed && !isMobileDrawer ? 'justify-center px-0' : 'gap-3'
      )}>
        <div className="w-[42px] h-[42px] rounded-[15px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--pink)' }}>
          <span className="text-white text-lg font-bold" style={{ fontFamily: 'var(--font-syne)' }}>L</span>
        </div>
        {(!collapsed || isMobileDrawer) && (
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[17px] leading-tight text-[var(--text-primary)] truncate" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.02em' }}>Lorenna OS</p>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Agência Logue · Papel da Lola</p>
          </div>
        )}
        {isMobileDrawer && (
          <button onClick={onClose} className="ml-auto p-1.5 rounded-[10px] hover:bg-[var(--offwhite)] text-[var(--text-muted)]">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Energy chip */}
      <div
        className={cn('mx-3 mt-3 rounded-[15px] px-3 py-2.5 border flex-shrink-0', collapsed && !isMobileDrawer ? 'flex justify-center px-0' : '')}
        style={{ backgroundColor: `${energy.accent}12`, borderColor: `${energy.accent}30` }}
      >
        {collapsed && !isMobileDrawer ? (
          <span className="text-xl">{energy.emoji}</span>
        ) : (
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-medium mb-0.5">Modo atual</p>
            <p className="text-sm font-semibold" style={{ color: energy.accent, fontFamily: 'var(--font-syne)' }}>
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
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-[15px] px-3 py-[11px] text-[13.5px] font-medium transition-all duration-150',
                collapsed && !isMobileDrawer ? 'justify-center' : '',
                active
                  ? 'border border-transparent'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--offwhite)] hover:text-[var(--text-primary)] border border-transparent'
              )}
              style={active ? { background: 'var(--pink-tint)', color: 'var(--pink-deep)' } : undefined}
              title={collapsed && !isMobileDrawer ? item.label : undefined}
            >
              <item.icon size={17} className="flex-shrink-0" style={active ? { color: 'var(--pink-deep)' } : { color: 'var(--gray)' }} />
              {(!collapsed || isMobileDrawer) && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Energy quick-switch */}
      {(!collapsed || isMobileDrawer) && (
        <div className="px-4 pb-3 flex-shrink-0">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-medium mb-2">Trocar energia</p>
          <div className="grid grid-cols-4 gap-1">
            {ENERGY_ORDER.map((id) => {
              const e = ENERGY_CONFIGS[id]
              return (
                <button
                  key={id}
                  onClick={() => setEnergyMode(id)}
                  title={e.label}
                  className={cn('h-9 rounded-[12px] text-base border transition-all', energyMode === id ? 'border-[var(--pink-soft)]' : 'bg-[var(--offwhite)] border-transparent hover:bg-[var(--gray-light)]')}
                  style={energyMode === id ? { background: 'var(--pink-tint)', borderColor: 'var(--pink-soft)' } : undefined}
                >
                  {e.emoji}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Collapse toggle — desktop only */}
      {!isMobileDrawer && (
        <div className={cn('p-3 border-t border-[var(--border)] flex flex-shrink-0', collapsed ? 'justify-center' : 'justify-end')}>
          <button onClick={onCollapse} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-[10px] hover:bg-[var(--offwhite)]">
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useLorennStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // close drawer on navigation
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // prevent body scroll when drawer open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen z-40 bg-white border-r border-[var(--border)] transition-all duration-300 ease-in-out',
          'hidden md:flex flex-col',
          sidebarCollapsed ? 'w-[70px]' : 'w-[220px]',
        )}
      >
        <SidebarContent collapsed={sidebarCollapsed} onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </aside>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden w-10 h-10 flex items-center justify-center rounded-[12px] bg-white border border-[var(--border)] shadow-sm text-[var(--text-primary)]"
      >
        <Menu size={18} />
      </button>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setMobileOpen(false)}
          style={{ background: 'rgba(43,43,43,0.4)', backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen z-50 bg-white border-r border-[var(--border)] flex flex-col md:hidden',
          'w-[280px] transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent
          collapsed={false}
          onCollapse={() => {}}
          onClose={() => setMobileOpen(false)}
          isMobileDrawer
        />
      </aside>
    </>
  )
}
