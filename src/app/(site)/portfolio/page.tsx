import Link from 'next/link'
import { CASES } from '@/lib/site-content'
import { ArrowRight } from 'lucide-react'

export const metadata = { title: 'Portfólio · Agência Logue' }

export default function PortfolioPage() {
  return (
    <div className="os-view-in">
      <section className="site-section" style={{ paddingTop: 'clamp(56px, 8vw, 96px)', paddingBottom: 48 }}>
        <span className="site-eyebrow">Portfólio & Cases</span>
        <h1 className="site-h1" style={{ marginTop: 20, maxWidth: 760 }}>Trabalho que vira resultado.</h1>
        <p className="site-lead" style={{ maxWidth: 600, marginTop: 24 }}>
          Marcas reais, problemas reais, soluções com método. Sem prometer milagre — entregando consistência.
        </p>
      </section>

      <section className="site-section">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {CASES.map((c) => (
            <div key={c.slug} id={c.slug} className="card-soft" style={{ scrollMarginTop: 90 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>{c.segmento}</span>
                <span className="os-eyebrow">{c.cliente}</span>
              </div>
              <h2 className="os-title" style={{ fontSize: 24, color: 'var(--fg-1)', marginBottom: 12, maxWidth: 640 }}>{c.titulo}</h2>
              <p style={{ fontSize: 15, color: 'var(--fg-2)', lineHeight: 1.7, maxWidth: 680, marginBottom: 18 }}>{c.resumo}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
                {c.servicos.map((s) => (
                  <span key={s} style={{ fontSize: 12, color: 'var(--fg-2)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-pill)', padding: '5px 13px' }}>{s}</span>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', gap: 10, alignItems: 'baseline' }}>
                <span className="os-eyebrow" style={{ color: 'var(--accent)' }}>Resultado</span>
                <p style={{ fontSize: 14, color: 'var(--fg-1)', lineHeight: 1.6 }}>{c.resultado}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="site-section" style={{ paddingTop: 64, textAlign: 'center' }}>
        <Link href="/contato" className="btn-accent">Quero um trabalho assim <ArrowRight size={17} /></Link>
      </section>
    </div>
  )
}
