'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/servicos', label: 'Serviços' },
  { href: '/pacotes', label: 'Pacotes' },
  { href: '/portfolio', label: 'Portfólio' },
  { href: '/blog', label: 'Conteúdos' },
  { href: '/contato', label: 'Contato' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,10,10,.72)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span className="os-title" style={{ fontSize: 24, letterSpacing: '-0.04em', color: 'var(--fg-1)' }}>logue</span>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', alignSelf: 'flex-end', marginBottom: 6 }} />
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="site-nav-desktop">
          {LINKS.map((l) => {
            const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href)
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  padding: '8px 12px', fontSize: 13.5, borderRadius: 'var(--r-sm)',
                  color: active ? 'var(--fg-1)' : 'var(--fg-2)',
                  fontWeight: active ? 500 : 400,
                }}
              >
                {l.label}
              </Link>
            )
          })}
          <Link
            href="/login"
            style={{
              marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 'var(--r-pill)',
              background: 'var(--accent)', color: '#0a0a0a', fontSize: 13.5, fontWeight: 600,
            }}
          >
            Entrar <ArrowRight size={15} />
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="site-nav-toggle"
          style={{ display: 'none', background: 'transparent', border: 'none', color: 'var(--fg-1)' }}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="site-nav-mobile" style={{ borderTop: '1px solid var(--border)', padding: '12px 24px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ padding: '10px 4px', fontSize: 15, color: 'var(--fg-2)' }}>
              {l.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)} style={{ marginTop: 8, textAlign: 'center', padding: '11px', borderRadius: 'var(--r-pill)', background: 'var(--accent)', color: '#0a0a0a', fontWeight: 600 }}>
            Entrar na área do cliente
          </Link>
        </div>
      )}
    </header>
  )
}
