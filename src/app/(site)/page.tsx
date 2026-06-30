import Link from 'next/link'
import { byCategoria } from '@/lib/kb'
import { CASES } from '@/lib/site-content'
import {
  ArrowRight, Sparkles, PenTool, Megaphone, Camera, Palette, Bot, Quote,
} from 'lucide-react'

const SERVICE_ICONS: Record<string, React.ElementType> = {
  'serv-branding': Palette,
  'serv-social': Megaphone,
  'serv-conteudo': PenTool,
  'serv-design': Sparkles,
  'serv-producao': Camera,
  'serv-ia': Bot,
}

export default function HomePage() {
  const servicos = byCategoria('servico')

  return (
    <div className="os-view-in">
      {/* ===== HERO ===== */}
      <section className="site-section" style={{ paddingTop: 'clamp(64px, 10vw, 120px)', paddingBottom: 'clamp(56px, 8vw, 96px)' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '-10%', top: '-30%', width: 420, height: 420, borderRadius: '50%', background: 'var(--accent-ghost)', filter: 'blur(80px)', pointerEvents: 'none' }} />
          <span className="site-eyebrow" style={{ position: 'relative' }}>Branding · Conteúdo · IA aplicada</span>
          <h1 className="site-h1" style={{ marginTop: 20, marginBottom: 28, maxWidth: 900, position: 'relative' }}>
            Marcas que são lembradas<br />pelo que <span style={{ color: 'var(--accent)' }}>realmente são</span>.
          </h1>
          <p className="site-lead" style={{ maxWidth: 600, position: 'relative' }}>
            A Agência Logue une estratégia, estética, storytelling e inteligência artificial para construir presença com clareza e consistência — sem promessas milagrosas.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap', position: 'relative' }}>
            <Link href="/contato" className="btn-accent">Pedir um orçamento <ArrowRight size={17} /></Link>
            <Link href="/portfolio" className="btn-ghost">Ver cases</Link>
          </div>
        </div>

        {/* stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 1, marginTop: 80, border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--border)' }}>
          {[
            ['6', 'frentes criativas'],
            ['100%', 'conteúdo com propósito'],
            ['IA', 'treinada pela sua marca'],
            ['0', 'promessas milagrosas'],
          ].map(([v, l]) => (
            <div key={l} style={{ background: 'var(--surface-1)', padding: '28px 24px' }}>
              <div className="os-title" style={{ fontSize: 32, color: 'var(--fg-1)' }}>{v}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SERVIÇOS ===== */}
      <section className="site-section" style={{ paddingTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="site-eyebrow">O que fazemos</span>
            <h2 className="site-h2" style={{ marginTop: 14 }}>Estratégia e execução, juntas.</h2>
          </div>
          <Link href="/servicos" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 14.5 }}>
            Todos os serviços <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {servicos.map((s) => {
            const Icon = SERVICE_ICONS[s.id] ?? Sparkles
            return (
              <div key={s.id} className="card-soft">
                <span style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--accent-ghost)', color: 'var(--accent)', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={21} />
                </span>
                <h3 className="os-title" style={{ fontSize: 18, color: 'var(--fg-1)', marginBottom: 10 }}>{s.titulo}</h3>
                <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6 }}>{s.conteudo.split('. ').slice(0, 2).join('. ')}.</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ===== MÉTODO ===== */}
      <section className="site-section" style={{ paddingTop: 96 }}>
        <span className="site-eyebrow">Como trabalhamos</span>
        <h2 className="site-h2" style={{ marginTop: 14, marginBottom: 40, maxWidth: 720 }}>
          Um método claro — do briefing ao conteúdo no ar.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {[
            ['01', 'Imersão', 'Entendemos marca, público e objetivo. Tudo vira base de conhecimento.'],
            ['02', 'Estratégia', 'Definimos pilares, linha editorial e o que cada conteúdo precisa provocar.'],
            ['03', 'Criação', 'Roteiro, design e produção — com IA acelerando e curadoria humana decidindo.'],
            ['04', 'Aprovação & no ar', 'Você aprova pela área do cliente. Publicamos e medimos.'],
          ].map(([n, t, d]) => (
            <div key={n} style={{ padding: '24px 0', borderTop: '2px solid var(--accent)' }}>
              <div className="os-title" style={{ fontSize: 14, color: 'var(--accent)', marginBottom: 14 }}>{n}</div>
              <h3 className="os-title" style={{ fontSize: 18, color: 'var(--fg-1)', marginBottom: 8 }}>{t}</h3>
              <p style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.6 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CASES ===== */}
      <section className="site-section" style={{ paddingTop: 96 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="site-eyebrow">Resultados</span>
            <h2 className="site-h2" style={{ marginTop: 14 }}>Marcas que confiaram.</h2>
          </div>
          <Link href="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 14.5 }}>
            Ver portfólio <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {CASES.map((c) => (
            <Link key={c.slug} href={`/portfolio#${c.slug}`} className="card-soft" style={{ display: 'block' }}>
              <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{c.segmento}</span>
              <h3 className="os-title" style={{ fontSize: 19, color: 'var(--fg-1)', margin: '10px 0' }}>{c.titulo}</h3>
              <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 16 }}>{c.resumo}</p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--accent)' }}>
                {c.cliente} <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="site-section" style={{ paddingTop: 96 }}>
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 'clamp(36px, 6vw, 72px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10%', bottom: '-60%', width: 380, height: 380, borderRadius: '50%', background: 'var(--accent-ghost)', filter: 'blur(70px)' }} />
          <Quote size={28} style={{ color: 'var(--accent)', position: 'relative' }} />
          <h2 className="site-h2" style={{ margin: '20px auto 16px', maxWidth: 640, position: 'relative' }}>
            Vamos construir uma marca para ser lembrada?
          </h2>
          <p className="site-lead" style={{ maxWidth: 520, margin: '0 auto 32px', position: 'relative' }}>
            Conte o que você precisa. A gente devolve um caminho — com estratégia, estética e execução.
          </p>
          <Link href="/contato" className="btn-accent" style={{ position: 'relative' }}>
            Começar uma conversa <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  )
}
