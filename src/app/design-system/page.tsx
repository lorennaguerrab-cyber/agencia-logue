'use client'

import { useEffect } from 'react'
import { Raleway, Syne as SyneBrand, Questrial } from 'next/font/google'
import { useTopbar } from '@/lib/topbar-context'

const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway', weight: ['400', '600', '800', '900'] })
const syneBrand = SyneBrand({ subsets: ['latin'], variable: '--font-syne-brand', weight: ['700', '800'] })
const questrial = Questrial({ subsets: ['latin'], variable: '--font-questrial', weight: '400' })

interface Swatch {
  hex: string
  label: string
  text: string
  border?: boolean
}

function SwatchGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {swatches.map((s) => (
        <div
          key={s.hex + s.label}
          className="rounded-2xl h-[76px] flex items-end p-2.5"
          style={{ background: s.hex, border: s.border ? '1px solid rgba(23,20,23,0.08)' : undefined }}
        >
          <span className="font-[var(--font-syne-brand)] text-[11.5px]" style={{ color: s.text }}>
            {s.hex} · {s.label}
          </span>
        </div>
      ))}
    </div>
  )
}

const BRAND_MAP = [
  {
    label: 'MARCA-MÃE', title: 'Lorenna Guerra',
    desc: 'Todas as cores. Missão, visão e valores nascem aqui.',
    bg: '#201e1f', labelColor: 'rgba(255,255,255,0.5)', titleColor: '#fff', descColor: 'rgba(255,255,255,0.6)',
  },
  {
    label: 'FRENTE 1 · AUTORIDADE', title: 'Agência Logue',
    desc: 'Rosa pink, branco, preto, rosa claro, lilás em degradê.',
    bg: '#fe78b0', labelColor: 'rgba(32,30,31,0.55)', titleColor: '#201e1f', descColor: 'rgba(32,30,31,0.7)',
  },
  {
    label: 'FRENTE 2 · INFOPRODUTO', title: 'Método do Prompt ao Post',
    desc: 'Vermelho, rosa claro, branco de fundo, amarelos.',
    bg: '#c32428', labelColor: 'rgba(255,255,255,0.6)', titleColor: '#fff', descColor: 'rgba(255,255,255,0.75)',
  },
  {
    label: 'FRENTE 3 · AFILIADOS', title: 'Papel da Lola',
    desc: 'Branco e as cores mais claras da paleta — sem marrom, vermelho ou preto.',
    bg: '#a9d8f0', labelColor: 'rgba(32,30,31,0.55)', titleColor: '#201e1f', descColor: 'rgba(32,30,31,0.7)',
  },
]

const MISSION_CARDS = [
  { emoji: '🎨', title: 'Agência', desc: 'Lorenna como diretora criativa, mais colaboradores, Espaço Logue com estúdio e coworking.', bg: '#f7c2d8' },
  { emoji: '📈', title: 'Infoprodutos', desc: 'Principal fonte de renda — Método do Prompt ao Post e o que vier depois.', bg: '#fdf6d8' },
  { emoji: '🧭', title: 'Regra de ouro', desc: 'Se faz alguém se sentir mais criativo e capaz, é da marca. Se faz sentir inadequado, não é — em nenhuma frente.', bg: '#fdf3f6' },
]

const TYPE_SAMPLES = [
  { name: 'Raleway', fontFamily: 'var(--font-raleway)', weight: 900, letterSpacing: '-0.02em', label: 'TÍTULOS — peso 900' },
  { name: 'Syne', fontFamily: 'var(--font-syne-brand)', weight: 700, letterSpacing: '-0.01em', label: 'DESTAQUES, LABELS — peso 700/800' },
  { name: 'Questrial', fontFamily: 'var(--font-questrial)', weight: 400, letterSpacing: 'normal', label: 'TEXTO CORRIDO — peso 400' },
]

const PALETTE_LORENNA: Swatch[] = [
  { hex: '#fe78b0', label: 'Rosa marca', text: '#201e1f' },
  { hex: '#c94e83', label: 'Rosa acento', text: '#fff' },
  { hex: '#f7c2d8', label: 'Rosa suave', text: '#201e1f' },
  { hex: '#fdf3f6', label: 'Rosa claro fundo', text: '#201e1f', border: true },
  { hex: '#ffffff', label: 'Branco', text: '#201e1f', border: true },
  { hex: '#201e1f', label: 'Tinta', text: '#fff' },
  { hex: '#c32428', label: 'Vermelho', text: '#fff' },
  { hex: '#f4e04a', label: 'Amarelo', text: '#201e1f' },
  { hex: '#fdf6d8', label: 'Amarelo claro', text: '#201e1f', border: true },
  { hex: '#cbb8e8', label: 'Lilás', text: '#201e1f' },
  { hex: '#a9d8f0', label: 'Azul claro', text: '#201e1f' },
  { hex: '#745341', label: 'Marrom', text: '#fff' },
  { hex: '#dd7350', label: 'Laranja terracota', text: '#fff' },
]

const PALETTE_LOGUE: Swatch[] = [
  { hex: '#fe78b0', label: 'Rosa pink', text: '#201e1f' },
  { hex: '#ffffff', label: 'Branco', text: '#201e1f', border: true },
  { hex: '#201e1f', label: 'Preto', text: '#fff' },
  { hex: '#f7c2d8', label: 'Rosa claro', text: '#201e1f' },
]

const PALETTE_METODO: Swatch[] = [
  { hex: '#c32428', label: 'Vermelho', text: '#fff' },
  { hex: '#f7c2d8', label: 'Rosa claro', text: '#201e1f' },
  { hex: '#ffffff', label: 'Branco (fundo)', text: '#201e1f', border: true },
  { hex: '#f4e04a', label: 'Amarelo', text: '#201e1f' },
  { hex: '#fdf6d8', label: 'Amarelo claro', text: '#201e1f', border: true },
  { hex: '#fdf3f6', label: 'Rosa claro fundo', text: '#201e1f', border: true },
]

const PALETTE_LOLA: Swatch[] = [
  { hex: '#ffffff', label: 'Branco', text: '#201e1f', border: true },
  { hex: '#f7c2d8', label: 'Rosa claro', text: '#201e1f' },
  { hex: '#fdf3f6', label: 'Rosa claro fundo', text: '#201e1f', border: true },
  { hex: '#a9d8f0', label: 'Azul claro', text: '#201e1f' },
  { hex: '#cbb8e8', label: 'Lilás', text: '#201e1f' },
  { hex: '#fdf6d8', label: 'Amarelo claro', text: '#201e1f', border: true },
]

function SectionHeading({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3.5 mb-5">
      <div className="font-[var(--font-syne-brand)] font-extrabold text-[13px]" style={{ color: '#c94e83' }}>{n}</div>
      <h2
        className="font-[var(--font-raleway)] font-black tracking-[-0.02em] m-0"
        style={{ fontSize: 'clamp(24px,2.8vw,32px)', color: '#201e1f' }}
      >
        {children}
      </h2>
    </div>
  )
}

function PaletteSection({ emoji, title, desc, swatches, gradient }: { emoji: string; title: string; desc: string; swatches: Swatch[]; gradient?: { from: string; to: string; label: string } }) {
  return (
    <div className="pt-16">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[15px] flex-shrink-0" style={{ background: swatches[0].hex }}>{emoji}</div>
        <h2 className="font-[var(--font-raleway)] font-black tracking-[-0.02em] m-0" style={{ fontSize: 'clamp(22px,2.4vw,28px)', color: '#201e1f' }}>{title}</h2>
      </div>
      <p className="text-sm leading-relaxed mb-6 max-w-xl" style={{ color: 'rgba(23,20,23,0.6)' }}>{desc}</p>
      <SwatchGrid swatches={swatches} />
      {gradient && (
        <div
          className="rounded-2xl h-[76px] flex items-end p-2.5 mt-3"
          style={{ background: `linear-gradient(120deg, ${gradient.from}, ${gradient.to})` }}
        >
          <span className="font-[var(--font-syne-brand)] text-[11.5px]" style={{ color: '#201e1f' }}>{gradient.label}</span>
        </div>
      )}
    </div>
  )
}

export default function DesignSystemPage() {
  const { setConfig } = useTopbar()
  useEffect(() => {
    setConfig({ title: 'Design System', subtitle: 'Identidade visual — marca-mãe' })
  }, [setConfig])

  return (
    <div className={`${raleway.variable} ${syneBrand.variable} ${questrial.variable} max-w-5xl mx-auto`}>
      <div className="rounded-3xl overflow-hidden" style={{ fontFamily: 'var(--font-questrial)', color: '#201e1f', background: '#fff' }}>

        {/* HERO */}
        <div className="px-8 sm:px-14 pt-16 pb-14" style={{ background: '#fdf3f6' }}>
          <div
            className="font-[var(--font-questrial)] uppercase text-[13px] mb-4"
            style={{ color: '#c94e83', letterSpacing: '0.12em' }}
          >
            ◆ sistema de design consolidado
          </div>
          <h1
            className="font-[var(--font-raleway)] font-black m-0 mb-4 max-w-2xl"
            style={{ fontSize: 'clamp(30px,4vw,50px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
          >
            Uma marca, duas frentes de monetização.
          </h1>
          <p className="text-[16.5px] leading-relaxed max-w-xl m-0" style={{ color: 'rgba(23,20,23,0.65)' }}>
            Lorenna Guerra é a marca guarda-chuva. Missão, valores, voz e tipografia são os mesmos em qualquer frente
            — só a paleta de cor muda para diferenciar Agência Logue de Método do Prompt ao Post.
          </p>
        </div>

        <div className="px-8 sm:px-14">

          {/* MAPA */}
          <div className="pt-14 grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {BRAND_MAP.map((b) => (
              <div key={b.title} className="rounded-2xl p-6" style={{ background: b.bg }}>
                <div className="font-[var(--font-syne-brand)] font-bold text-[13px] mb-1.5" style={{ color: b.labelColor }}>{b.label}</div>
                <div className="font-[var(--font-raleway)] font-extrabold text-[19px]" style={{ color: b.titleColor }}>{b.title}</div>
                <p className="text-[12.5px] leading-relaxed mt-2 mb-0" style={{ color: b.descColor }}>{b.desc}</p>
              </div>
            ))}
          </div>

          {/* MISSÃO */}
          <div className="pt-20">
            <SectionHeading n="01">Missão, visão e valores — compartilhados por tudo</SectionHeading>
            <div className="rounded-3xl p-10 mb-4" style={{ background: '#201e1f' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(19px,2.2vw,24px)', lineHeight: 1.45, color: '#fff', margin: 0 }}>
                &ldquo;Ajudar pessoas e marcas a desenvolverem criatividade aplicada à vida e aos negócios,
                transformando ideias em projetos mais profissionais, humanos e memoráveis.&rdquo;
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
              {MISSION_CARDS.map((m) => (
                <div key={m.title} className="rounded-2xl p-5" style={{ background: m.bg }}>
                  <div className="font-[var(--font-syne-brand)] font-bold text-sm mb-1.5">{m.emoji} {m.title}</div>
                  <p className="text-[13px] leading-relaxed m-0" style={{ color: 'rgba(23,20,23,0.7)' }}>{m.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-[13.5px] m-0" style={{ color: 'rgba(23,20,23,0.5)' }}>
              Documento completo: <em>Marca Lorenna Guerra — Missão, Visão e Valores</em>. Valores, tom de voz e
              frases proibidas valem igual para Agência Logue e Método do Prompt ao Post.
            </p>
          </div>

          {/* TIPOGRAFIA */}
          <div className="pt-20">
            <SectionHeading n="02">Tipografia — mesma para as duas frentes</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {TYPE_SAMPLES.map((t) => (
                <div key={t.name} className="rounded-2xl p-6" style={{ background: '#fdf3f6' }}>
                  <div className="mb-2" style={{ fontFamily: t.fontFamily, fontWeight: t.weight, fontSize: 36, letterSpacing: t.letterSpacing }}>{t.name}</div>
                  <div className="font-[var(--font-syne-brand)] font-bold text-[12.5px]" style={{ color: 'rgba(23,20,23,0.5)' }}>{t.label}</div>
                </div>
              ))}
            </div>
            <p className="text-[13.5px] mb-3.5" style={{ color: 'rgba(23,20,23,0.5)' }}>
              Fontes de destaque para títulos e legendas de vídeo — uso pontual, qualquer frente:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="rounded-2xl p-5" style={{ background: '#c94e83' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontWeight: 800, fontSize: 32, color: '#fff' }}>Awesome Serif</div>
              </div>
              <div className="rounded-2xl p-5 flex items-center" style={{ background: '#201e1f' }}>
                <div style={{ fontFamily: 'cursive', fontSize: 30, color: '#fff' }}>Bootzy TM</div>
              </div>
            </div>
          </div>

          {/* PALETA LORENNA GUERRA */}
          <div className="pt-20">
            <SectionHeading n="03">Paleta completa — Lorenna Guerra</SectionHeading>
            <p className="text-sm leading-relaxed mb-6 max-w-xl" style={{ color: 'rgba(23,20,23,0.6)' }}>
              A marca-mãe usa todas as cores do sistema — ponto de partida de onde cada frente recorta seu subconjunto.
            </p>
            <SwatchGrid swatches={PALETTE_LORENNA} />
          </div>

          <PaletteSection
            emoji="🎨"
            title="Paleta — Agência Logue"
            desc="Rosa pink, branco, preto e rosa claro como bases; lilás aparece só como degradê partindo do rosa pink — nunca sólido isolado."
            swatches={PALETTE_LOGUE}
            gradient={{ from: '#fe78b0', to: '#cbb8e8', label: 'degradê rosa pink → lilás #cbb8e8' }}
          />

          <PaletteSection
            emoji="📈"
            title="Paleta — Método do Prompt ao Post"
            desc="Vermelho como cor de ação, rosa claro para fundos suaves, branco como base e dois amarelos para destaque e energia."
            swatches={PALETTE_METODO}
          />

          <div className="pb-16">
            <PaletteSection
              emoji="🛍️"
              title="Paleta — Papel da Lola (blog + afiliados)"
              desc="Branco e as cores mais claras do sistema — leve e editorial para curadoria e produtos de afiliado. Sem marrom, vermelho ou preto."
              swatches={PALETTE_LOLA}
            />
          </div>

        </div>
      </div>
    </div>
  )
}
