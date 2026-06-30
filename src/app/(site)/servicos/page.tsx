import Link from 'next/link'
import { byCategoria } from '@/lib/kb'
import { ArrowRight, Check } from 'lucide-react'

export const metadata = { title: 'Serviços · Agência Logue' }

export default function ServicosPage() {
  const servicos = byCategoria('servico')

  return (
    <div className="os-view-in">
      <section className="site-section" style={{ paddingTop: 'clamp(56px, 8vw, 96px)', paddingBottom: 40 }}>
        <span className="site-eyebrow">Serviços</span>
        <h1 className="site-h1" style={{ marginTop: 20, maxWidth: 820 }}>Tudo o que sua marca precisa para comunicar.</h1>
        <p className="site-lead" style={{ maxWidth: 600, marginTop: 24 }}>
          Seis frentes que se conversam — da identidade à produção, da estratégia à publicação.
        </p>
      </section>

      <section className="site-section">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {servicos.map((s, i) => (
            <div key={s.id} className="card-soft" style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 24, alignItems: 'start' }}>
              <span className="os-title" style={{ fontSize: 28, color: 'var(--accent)' }}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="os-title" style={{ fontSize: 22, color: 'var(--fg-1)', marginBottom: 12 }}>{s.titulo}</h2>
                <p style={{ fontSize: 15, color: 'var(--fg-2)', lineHeight: 1.7 }}>{s.conteudo}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                  {s.tags.slice(0, 5).map((t) => (
                    <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--fg-3)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-pill)', padding: '4px 12px' }}>
                      <Check size={11} /> {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="site-section" style={{ paddingTop: 64 }}>
        <div style={{ textAlign: 'center' }}>
          <Link href="/pacotes" className="btn-accent">Ver pacotes e investimento <ArrowRight size={17} /></Link>
        </div>
      </section>
    </div>
  )
}
