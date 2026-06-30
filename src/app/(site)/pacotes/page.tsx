import Link from 'next/link'
import { byCategoria } from '@/lib/kb'
import { ArrowRight, Check } from 'lucide-react'

export const metadata = { title: 'Pacotes · Agência Logue' }

const POPULAR = 'pac-estrategico'

export default function PacotesPage() {
  const pacotes = byCategoria('pacote')

  return (
    <div className="os-view-in">
      <section className="site-section" style={{ paddingTop: 'clamp(56px, 8vw, 96px)', paddingBottom: 48 }}>
        <span className="site-eyebrow">Pacotes</span>
        <h1 className="site-h1" style={{ marginTop: 20, maxWidth: 760 }}>Planos para cada momento da sua marca.</h1>
        <p className="site-lead" style={{ maxWidth: 600, marginTop: 24 }}>
          Escolha um ponto de partida. O escopo final é desenhado para o seu objetivo — sem pacote genérico.
        </p>
      </section>

      <section className="site-section">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, alignItems: 'start' }}>
          {pacotes.map((p) => {
            const popular = p.id === POPULAR
            const items = p.conteudo.split(/[;.]\s+/).filter((x) => x.trim().length > 6).slice(0, 6)
            return (
              <div key={p.id} className="card-soft" style={{ borderColor: popular ? 'var(--accent)' : undefined, position: 'relative' }}>
                {popular && (
                  <span style={{ position: 'absolute', top: -11, left: 24, background: 'var(--accent)', color: '#0a0a0a', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 'var(--r-pill)', letterSpacing: '0.04em' }}>
                    MAIS ESCOLHIDO
                  </span>
                )}
                <h2 className="os-title" style={{ fontSize: 20, color: 'var(--fg-1)', marginBottom: 14 }}>{p.titulo}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                  {items.map((it, i) => (
                    <div key={i} style={{ display: 'flex', gap: 9, fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>
                      <Check size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
                      <span>{it.trim()}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contato" className={popular ? 'btn-accent' : 'btn-ghost'} style={{ width: '100%', justifyContent: 'center' }}>
                  Pedir proposta
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      <section className="site-section" style={{ paddingTop: 56 }}>
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--fg-3)' }}>
          Precisa de algo sob medida? <Link href="/contato" style={{ color: 'var(--accent)' }}>Vamos desenhar juntos <ArrowRight size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /></Link>
        </p>
      </section>
    </div>
  )
}
