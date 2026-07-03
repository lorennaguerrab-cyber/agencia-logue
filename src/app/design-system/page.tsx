import { Raleway, Syne as SyneBrand, Questrial } from 'next/font/google'

const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway', weight: ['400', '600', '800', '900'] })
const syneBrand = SyneBrand({ subsets: ['latin'], variable: '--font-syne-brand', weight: ['700', '800'] })
const questrial = Questrial({ subsets: ['latin'], variable: '--font-questrial', weight: '400' })

interface Swatch {
  hex: string
  label: string
  text: string
  border?: boolean
}

function Swatches({ swatches }: { swatches: Swatch[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
      {swatches.map((s) => (
        <div
          key={s.hex + s.label}
          style={{
            borderRadius: 14, height: 76, display: 'flex', alignItems: 'flex-end', padding: 10,
            fontFamily: 'var(--font-syne-brand)', background: s.hex,
            border: s.border ? '1px solid rgba(23,20,23,0.08)' : undefined,
          }}
        >
          <span style={{ fontSize: 11.5, color: s.text }}>{s.hex} · {s.label}</span>
        </div>
      ))}
    </div>
  )
}

const BRAND_MAP = [
  { label: 'MARCA-MÃE', title: 'Lorenna Guerra', desc: 'Todas as cores. Missão, visão e valores nascem aqui.', bg: '#201e1f', labelColor: 'rgba(255,255,255,0.5)', titleColor: '#fff', descColor: 'rgba(255,255,255,0.6)' },
  { label: 'FRENTE 1 · AUTORIDADE', title: 'Agência Logue', desc: 'Rosa pink, branco, preto, rosa claro, lilás em degradê.', bg: '#fe78b0', labelColor: 'rgba(32,30,31,0.55)', titleColor: '#201e1f', descColor: 'rgba(32,30,31,0.7)' },
  { label: 'FRENTE 2 · INFOPRODUTO', title: 'Método do Prompt ao Post', desc: 'Vermelho, rosa claro, branco de fundo, amarelos.', bg: '#c32428', labelColor: 'rgba(255,255,255,0.6)', titleColor: '#fff', descColor: 'rgba(255,255,255,0.75)' },
  { label: 'FRENTE 3 · AFILIADOS', title: 'Papel da Lola', desc: 'Branco e as cores mais claras da paleta — sem marrom, vermelho ou preto.', bg: '#a9d8f0', labelColor: 'rgba(32,30,31,0.55)', titleColor: '#201e1f', descColor: 'rgba(32,30,31,0.7)' },
]

const MISSION_CARDS = [
  { emoji: '🎨', title: 'Agência', desc: 'Lorenna como diretora criativa, mais colaboradores, Espaço Logue com estúdio e coworking.', bg: '#f7c2d8' },
  { emoji: '📈', title: 'Infoprodutos', desc: 'Principal fonte de renda — Método do Prompt ao Post e o que vier depois.', bg: '#fdf6d8' },
  { emoji: '🧭', title: 'Regra de ouro', desc: 'Se faz alguém se sentir mais criativo e capaz, é da marca. Se faz sentir inadequado, não é — em nenhuma frente.', bg: '#fdf3f6' },
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
]

const PALETTE_METODO_2: Swatch[] = [
  { hex: '#fdf6d8', label: 'Amarelo claro', text: '#201e1f', border: true },
  { hex: '#fdf3f6', label: 'Rosa claro fundo', text: '#201e1f', border: true },
]

const PALETTE_LOLA: Swatch[] = [
  { hex: '#ffffff', label: 'Branco', text: '#201e1f', border: true },
  { hex: '#f7c2d8', label: 'Rosa claro', text: '#201e1f' },
  { hex: '#fdf3f6', label: 'Rosa claro fundo', text: '#201e1f', border: true },
  { hex: '#a9d8f0', label: 'Azul claro', text: '#201e1f' },
]

const PALETTE_LOLA_2: Swatch[] = [
  { hex: '#cbb8e8', label: 'Lilás', text: '#201e1f' },
  { hex: '#fdf6d8', label: 'Amarelo claro', text: '#201e1f', border: true },
]

export default function DesignSystemPage() {
  return (
    <div
      className={`${raleway.variable} ${syneBrand.variable} ${questrial.variable}`}
      style={{ fontFamily: 'var(--font-questrial), sans-serif', color: '#201e1f', background: '#fff', paddingBottom: 100 }}
    >
      {/* TOPO */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 6vw',
        position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(23,20,23,0.07)',
      }}>
        <div style={{ fontFamily: 'var(--font-syne-brand)', fontWeight: 700, fontSize: 14, letterSpacing: '0.04em' }}>Lorenna Guerra</div>
        <div style={{ fontFamily: 'var(--font-questrial)', fontSize: 13, color: 'rgba(23,20,23,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Design System — marca-mãe</div>
      </div>

      {/* HERO */}
      <div style={{ background: '#fdf3f6', padding: '80px 6vw 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-questrial)', color: '#c94e83', textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: 13, marginBottom: 16 }}>◆ sistema de design consolidado</div>
          <h1 style={{ fontFamily: 'var(--font-raleway)', fontWeight: 900, fontSize: 'clamp(30px,4vw,50px)', lineHeight: 1.05, letterSpacing: '-0.02em', margin: '0 0 18px', maxWidth: 820 }}>Uma marca, duas frentes de monetização.</h1>
          <p style={{ fontSize: 16.5, lineHeight: 1.6, color: 'rgba(23,20,23,0.65)', maxWidth: 680, margin: 0 }}>Lorenna Guerra é a marca guarda-chuva. Missão, valores, voz e tipografia são os mesmos em qualquer frente — só a paleta de cor muda para diferenciar Agência Logue de Método do Prompt ao Post.</p>
        </div>
      </div>

      {/* MAPA */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 6vw 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {BRAND_MAP.map((b) => (
            <div key={b.title} style={{ background: b.bg, borderRadius: 20, padding: 26 }}>
              <div style={{ fontFamily: 'var(--font-syne-brand)', fontWeight: 700, fontSize: 13, color: b.labelColor, marginBottom: 6 }}>{b.label}</div>
              <div style={{ fontFamily: 'var(--font-raleway)', fontWeight: 800, fontSize: 19, color: b.titleColor }}>{b.title}</div>
              <p style={{ fontSize: 12.5, color: b.descColor, lineHeight: 1.5, margin: '8px 0 0' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MISSÃO */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 6vw 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-syne-brand)', fontWeight: 800, fontSize: 13, color: '#c94e83' }}>01</div>
          <h2 style={{ fontFamily: 'var(--font-raleway)', fontWeight: 900, fontSize: 'clamp(24px,2.8vw,32px)', letterSpacing: '-0.02em', margin: 0 }}>Missão, visão e valores — compartilhados por tudo</h2>
        </div>
        <div style={{ background: '#201e1f', borderRadius: 24, padding: 40, marginBottom: 16 }}>
          <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(19px,2.2vw,24px)', lineHeight: 1.45, color: '#fff', margin: 0 }}>
            &ldquo;Ajudar pessoas e marcas a desenvolverem criatividade aplicada à vida e aos negócios, transformando ideias em projetos mais profissionais, humanos e memoráveis.&rdquo;
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 16 }}>
          {MISSION_CARDS.map((m) => (
            <div key={m.title} style={{ background: m.bg, borderRadius: 18, padding: 22 }}>
              <div style={{ fontFamily: 'var(--font-syne-brand)', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{m.emoji} {m.title}</div>
              <p style={{ fontSize: 13, lineHeight: 1.5, color: 'rgba(23,20,23,0.7)', margin: 0 }}>{m.desc}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13.5, color: 'rgba(23,20,23,0.5)', margin: 0 }}>
          Documento completo: <em>Marca Lorenna Guerra — Missão, Visão e Valores</em>. Valores, tom de voz e frases proibidas valem igual para Agência Logue e Método do Prompt ao Post.
        </p>
      </div>

      {/* TIPOGRAFIA */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 6vw 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-syne-brand)', fontWeight: 800, fontSize: 13, color: '#c94e83' }}>02</div>
          <h2 style={{ fontFamily: 'var(--font-raleway)', fontWeight: 900, fontSize: 'clamp(24px,2.8vw,32px)', letterSpacing: '-0.02em', margin: 0 }}>Tipografia — mesma para as duas frentes</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 16 }}>
          <div style={{ background: '#fdf3f6', borderRadius: 20, padding: 26 }}>
            <div style={{ fontFamily: 'var(--font-raleway)', fontWeight: 900, fontSize: 36, letterSpacing: '-0.02em', marginBottom: 8 }}>Raleway</div>
            <div style={{ fontFamily: 'var(--font-syne-brand)', fontWeight: 700, fontSize: 12.5, color: 'rgba(23,20,23,0.5)' }}>TÍTULOS — peso 900</div>
          </div>
          <div style={{ background: '#fdf3f6', borderRadius: 20, padding: 26 }}>
            <div style={{ fontFamily: 'var(--font-syne-brand)', fontWeight: 700, fontSize: 32, letterSpacing: '-0.01em', marginBottom: 8 }}>Syne</div>
            <div style={{ fontFamily: 'var(--font-syne-brand)', fontWeight: 700, fontSize: 12.5, color: 'rgba(23,20,23,0.5)' }}>DESTAQUES, LABELS — peso 700/800</div>
          </div>
          <div style={{ background: '#fdf3f6', borderRadius: 20, padding: 26 }}>
            <div style={{ fontFamily: 'var(--font-questrial)', fontSize: 32, marginBottom: 8 }}>Questrial</div>
            <div style={{ fontFamily: 'var(--font-syne-brand)', fontWeight: 700, fontSize: 12.5, color: 'rgba(23,20,23,0.5)' }}>TEXTO CORRIDO — peso 400</div>
          </div>
        </div>
        <p style={{ fontSize: 13.5, color: 'rgba(23,20,23,0.5)', margin: '0 0 14px' }}>Fontes de destaque para títulos e legendas de vídeo — uso pontual, qualquer frente:</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ background: '#c94e83', borderRadius: 18, padding: 22 }}>
            <div style={{ fontFamily: 'Georgia, serif', fontWeight: 800, fontSize: 32, color: '#fff' }}>Awesome Serif</div>
          </div>
          <div style={{ background: '#201e1f', borderRadius: 18, padding: 22, display: 'flex', alignItems: 'center' }}>
            <div style={{ fontFamily: 'cursive', fontSize: 30, color: '#fff' }}>Bootzy TM</div>
          </div>
        </div>
      </div>

      {/* PALETA LORENNA GUERRA */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 6vw 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 8 }}>
          <div style={{ fontFamily: 'var(--font-syne-brand)', fontWeight: 800, fontSize: 13, color: '#c94e83' }}>03</div>
          <h2 style={{ fontFamily: 'var(--font-raleway)', fontWeight: 900, fontSize: 'clamp(24px,2.8vw,32px)', letterSpacing: '-0.02em', margin: 0 }}>Paleta completa — Lorenna Guerra</h2>
        </div>
        <p style={{ fontSize: 14, color: 'rgba(23,20,23,0.6)', lineHeight: 1.6, margin: '0 0 24px', maxWidth: 640 }}>A marca-mãe usa todas as cores do sistema — ponto de partida de onde cada frente recorta seu subconjunto.</p>
        <Swatches swatches={PALETTE_LORENNA} />
      </div>

      {/* PALETA AGÊNCIA LOGUE */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 6vw 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fe78b0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>🎨</div>
          <h2 style={{ fontFamily: 'var(--font-raleway)', fontWeight: 900, fontSize: 'clamp(22px,2.4vw,28px)', letterSpacing: '-0.02em', margin: 0 }}>Paleta — Agência Logue</h2>
        </div>
        <p style={{ fontSize: 14, color: 'rgba(23,20,23,0.6)', lineHeight: 1.6, margin: '0 0 24px', maxWidth: 640 }}>Rosa pink, branco, preto e rosa claro como bases; lilás aparece só como degradê partindo do rosa pink — nunca sólido isolado.</p>
        <Swatches swatches={PALETTE_LOGUE} />
        <div style={{ marginTop: 12 }}>
          <div style={{ borderRadius: 14, height: 76, background: 'linear-gradient(120deg, #fe78b0, #cbb8e8)', display: 'flex', alignItems: 'flex-end', padding: 10 }}>
            <span style={{ fontFamily: 'var(--font-syne-brand)', fontSize: 11.5, color: '#201e1f' }}>degradê rosa pink → lilás #cbb8e8</span>
          </div>
        </div>
      </div>

      {/* PALETA MÉTODO */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 6vw 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#c32428', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>📈</div>
          <h2 style={{ fontFamily: 'var(--font-raleway)', fontWeight: 900, fontSize: 'clamp(22px,2.4vw,28px)', letterSpacing: '-0.02em', margin: 0 }}>Paleta — Método do Prompt ao Post</h2>
        </div>
        <p style={{ fontSize: 14, color: 'rgba(23,20,23,0.6)', lineHeight: 1.6, margin: '0 0 24px', maxWidth: 640 }}>Vermelho como cor de ação, rosa claro para fundos suaves, branco como base e dois amarelos para destaque e energia.</p>
        <Swatches swatches={PALETTE_METODO} />
        <div style={{ marginTop: 12 }}>
          <Swatches swatches={PALETTE_METODO_2} />
        </div>
      </div>

      {/* PALETA PAPEL DA LOLA */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 6vw 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#a9d8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>🛍️</div>
          <h2 style={{ fontFamily: 'var(--font-raleway)', fontWeight: 900, fontSize: 'clamp(22px,2.4vw,28px)', letterSpacing: '-0.02em', margin: 0 }}>Paleta — Papel da Lola (blog + afiliados)</h2>
        </div>
        <p style={{ fontSize: 14, color: 'rgba(23,20,23,0.6)', lineHeight: 1.6, margin: '0 0 24px', maxWidth: 640 }}>Branco e as cores mais claras do sistema — leve e editorial para curadoria e produtos de afiliado. Sem marrom, vermelho ou preto.</p>
        <Swatches swatches={PALETTE_LOLA} />
        <div style={{ marginTop: 12 }}>
          <Swatches swatches={PALETTE_LOLA_2} />
        </div>
      </div>
    </div>
  )
}
