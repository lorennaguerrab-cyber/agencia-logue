import Link from 'next/link'
import { getKnowledgeBase } from '@/lib/kb'
import { ArrowRight } from 'lucide-react'

export const metadata = { title: 'Sobre · Agência Logue' }

export default function SobrePage() {
  const kb = getKnowledgeBase()
  const manifesto = kb.find((d) => d.id === 'inst-manifesto')
  const tom = kb.find((d) => d.id === 'tom-principios')

  return (
    <div className="os-view-in">
      <section className="site-section" style={{ paddingTop: 'clamp(56px, 8vw, 96px)', paddingBottom: 48 }}>
        <span className="site-eyebrow">Sobre a Agência Logue</span>
        <h1 className="site-h1" style={{ marginTop: 20, maxWidth: 880 }}>
          Estratégia com alma.<br />Estética com método.
        </h1>
        <p className="site-lead" style={{ maxWidth: 640, marginTop: 26 }}>
          {manifesto?.conteudo}
        </p>
      </section>

      <section className="site-section" style={{ paddingTop: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {[
            ['Estratégia', 'Cada escolha tem um porquê. Conteúdo nasce de objetivo, não de ansiedade.'],
            ['Estética', 'Beleza a serviço da clareza. Sistemas visuais consistentes e cuidados.'],
            ['Storytelling', 'História a serviço de uma decisão do público — não história pela história.'],
            ['IA aplicada', 'Tecnologia que acelera a execução, com curadoria humana sempre no comando.'],
          ].map(([t, d]) => (
            <div key={t} className="card-soft">
              <h3 className="os-title" style={{ fontSize: 18, color: 'var(--fg-1)', marginBottom: 10 }}>{t}</h3>
              <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="site-section" style={{ paddingTop: 96 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, maxWidth: 760 }}>
          <span className="site-eyebrow">Nosso tom</span>
          <h2 className="site-h2">Como a Logue se comunica</h2>
          <p className="site-lead">{tom?.conteudo}</p>
        </div>
      </section>

      <section className="site-section" style={{ paddingTop: 72 }}>
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'clamp(32px, 5vw, 56px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <h2 className="site-h2" style={{ maxWidth: 460 }}>Quer trabalhar com a gente?</h2>
          <Link href="/contato" className="btn-accent">Falar com a Logue <ArrowRight size={17} /></Link>
        </div>
      </section>
    </div>
  )
}
