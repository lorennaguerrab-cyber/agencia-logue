import Link from 'next/link'
import { POSTS } from '@/lib/site-content'
import { ArrowUpRight, Clock } from 'lucide-react'

export const metadata = { title: 'Conteúdos · Agência Logue' }

function fmtDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function BlogPage() {
  return (
    <div className="os-view-in">
      <section className="site-section" style={{ paddingTop: 'clamp(56px, 8vw, 96px)', paddingBottom: 48 }}>
        <span className="site-eyebrow">Conteúdos</span>
        <h1 className="site-h1" style={{ marginTop: 20, maxWidth: 760 }}>O que pensamos sobre marca, conteúdo e IA.</h1>
        <p className="site-lead" style={{ maxWidth: 600, marginTop: 24 }}>
          Ideias práticas, sem hype. Estratégia que você pode aplicar hoje.
        </p>
      </section>

      <section className="site-section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {POSTS.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card-soft" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent)' }}>{p.categoria}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--fg-3)' }}><Clock size={12} /> {p.tempo}</span>
              </div>
              <h2 className="os-title" style={{ fontSize: 20, color: 'var(--fg-1)', marginBottom: 12, lineHeight: 1.25 }}>{p.titulo}</h2>
              <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6, flex: 1, marginBottom: 18 }}>{p.resumo}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12.5, color: 'var(--fg-4)' }}>{fmtDate(p.data)}</span>
                <ArrowUpRight size={18} style={{ color: 'var(--accent)' }} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
