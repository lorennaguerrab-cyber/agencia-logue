'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTopbar } from '@/lib/topbar-context'
import { TOOLS } from '@/lib/ai/tools'
import {
  Lightbulb, Type, ClipboardList, Sparkles, Copy, Check, BookOpenCheck,
  Film, CircleDot, CalendarDays, Search, Megaphone, MessagesSquare, Boxes,
} from 'lucide-react'

const ICONS: Record<string, React.ElementType> = {
  Lightbulb, Type, ClipboardList, Film, CircleDot, CalendarDays, Search, Megaphone, MessagesSquare, Boxes,
}

type ToolTab = 'ideias' | 'legendas' | 'briefing'

interface UsedDoc { id: string; titulo: string; categoria: string }

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 'var(--r-sm)',
  background: 'var(--surface-2)', border: '1px solid var(--border)',
  color: 'var(--fg-1)', fontSize: 13, outline: 'none', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
  textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 6,
}

export default function IAPage() {
  const { setConfig } = useTopbar()
  const [tab, setTab] = useState<ToolTab>('ideias')

  useEffect(() => {
    setConfig({ title: 'Ferramentas de IA', subtitle: 'Geração com o contexto real da Agência Logue' })
  }, [setConfig])

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }} className="os-view-in">
      {/* Tool switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {([
          ['ideias', 'Gerador de ideias', Lightbulb],
          ['legendas', 'Gerador de legendas', Type],
          ['briefing', 'Demanda → Briefing', ClipboardList],
        ] as const).map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px',
            borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            border: '1px solid', borderColor: tab === id ? 'var(--accent)' : 'var(--border)',
            background: tab === id ? 'var(--accent-ghost)' : 'var(--surface-1)',
            color: tab === id ? 'var(--accent)' : 'var(--fg-2)',
          }}>
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {tab === 'ideias' && <IdeiasTool />}
      {tab === 'legendas' && <LegendasTool />}
      {tab === 'briefing' && <BriefingTool />}

      {/* Outras ferramentas (arquitetura) */}
      <div style={{ marginTop: 36 }}>
        <span className="os-eyebrow" style={{ display: 'block', marginBottom: 16 }}>Mais ferramentas no roadmap</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {TOOLS.filter((t) => t.status === 'arquitetado').map((t) => {
            const Icon = ICONS[t.icon] ?? Sparkles
            return (
              <div key={t.slug} style={{ padding: 16, borderRadius: 'var(--r-md)', background: 'var(--surface-1)', border: '1px solid var(--border)', opacity: 0.85 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Icon size={16} color="var(--fg-3)" />
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-1)' }}>{t.nome}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.5 }}>{t.descricao}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ---------- componentes utilitários ---------- */

function Sources({ docs, source }: { docs: UsedDoc[]; source: string }) {
  return (
    <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <BookOpenCheck size={14} color="var(--accent)" />
        <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
          Base consultada · {source === 'claude' ? 'gerado por IA' : 'modo demonstração'}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {docs.map((d) => (
          <span key={d.id} className="status-chip" style={{ fontSize: 11 }}>{d.titulo}</span>
        ))}
      </div>
    </div>
  )
}

function GenButton({ loading, onClick, label }: { loading: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px',
      borderRadius: 'var(--r-sm)', background: 'var(--accent)', color: '#0a0a0a',
      fontSize: 13, fontWeight: 600, border: '1px solid transparent',
      cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1,
    }}>
      <Sparkles size={15} /> {loading ? 'Gerando…' : label}
    </button>
  )
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 24 }}>{children}</div>
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard?.writeText(text); setDone(true); setTimeout(() => setDone(false), 1500) }}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--fg-2)', fontSize: 12, cursor: 'pointer' }}>
      {done ? <><Check size={13} /> Copiado</> : <><Copy size={13} /> Copiar</>}
    </button>
  )
}

/* ---------- 1) IDEIAS ---------- */

function IdeiasTool() {
  const [form, setForm] = useState({ nicho: '', objetivo: '', publico: '', servico: '', tom: '', dataRelevante: '' })
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState<{ data: { titulo: string; formato: string; pilar: string; porque: string }[]; source: string; usedDocs: UsedDoc[] } | null>(null)

  async function gerar() {
    if (!form.nicho || !form.objetivo) return
    setLoading(true)
    const r = await fetch('/api/ai/ideias', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setRes(await r.json()); setLoading(false)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
      <Panel>
        <span className="os-eyebrow" style={{ display: 'block', marginBottom: 18 }}>Gerador de ideias de conteúdo</span>
        <div style={{ display: 'grid', gap: 14 }}>
          {([['nicho', 'Nicho *', 'Ex.: ótica, estética, restaurante'], ['objetivo', 'Objetivo *', 'Ex.: autoridade, mais agendamentos'], ['publico', 'Público', 'Ex.: mulheres 30-50'], ['servico', 'Serviço / oferta', 'Ex.: lentes premium'], ['dataRelevante', 'Data / sazonalidade', 'Ex.: aniversário da loja']] as const).map(([k, l, ph]) => (
            <div key={k}><label style={labelStyle}>{l}</label><input style={inputStyle} placeholder={ph} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
          ))}
        </div>
        <div style={{ marginTop: 18 }}><GenButton loading={loading} onClick={gerar} label="Gerar ideias" /></div>
      </Panel>

      <Panel>
        {!res ? <Empty text="Preencha nicho e objetivo para gerar ideias contextualizadas." />
          : (
            <div>
              <span className="os-eyebrow" style={{ display: 'block', marginBottom: 16 }}>{res.data.length} ideias geradas</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {res.data.map((idea, i) => (
                  <div key={i} style={{ padding: 14, borderRadius: 'var(--r-md)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg-1)', marginBottom: 8 }}>{idea.titulo}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                      <span className="status-chip" style={{ fontSize: 11 }}>{idea.formato}</span>
                      <span className="status-chip" style={{ fontSize: 11, color: 'var(--accent)' }}>{idea.pilar}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.5 }}>{idea.porque}</p>
                  </div>
                ))}
              </div>
              <Sources docs={res.usedDocs} source={res.source} />
            </div>
          )}
      </Panel>
    </div>
  )
}

/* ---------- 2) LEGENDAS ---------- */

function LegendasTool() {
  const [form, setForm] = useState({ tema: '', formato: 'Carrossel', objetivo: '', tom: '' })
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState<{ data: { gancho: string; desenvolvimento: string; cta: string; hashtags: string[] }; source: string; usedDocs: UsedDoc[] } | null>(null)

  async function gerar() {
    if (!form.tema || !form.objetivo) return
    setLoading(true)
    const r = await fetch('/api/ai/legendas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setRes(await r.json()); setLoading(false)
  }

  const full = res ? `${res.data.gancho}\n\n${res.data.desenvolvimento}\n\n${res.data.cta}\n\n${res.data.hashtags.join(' ')}` : ''

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
      <Panel>
        <span className="os-eyebrow" style={{ display: 'block', marginBottom: 18 }}>Gerador de legendas</span>
        <div style={{ display: 'grid', gap: 14 }}>
          <div><label style={labelStyle}>Tema *</label><input style={inputStyle} placeholder="Ex.: como escolher a lente certa" value={form.tema} onChange={(e) => setForm({ ...form, tema: e.target.value })} /></div>
          <div><label style={labelStyle}>Formato</label>
            <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} value={form.formato} onChange={(e) => setForm({ ...form, formato: e.target.value })}>
              {['Carrossel', 'Reel', 'Post', 'Story'].map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Objetivo *</label><input style={inputStyle} placeholder="Ex.: autoridade, venda leve" value={form.objetivo} onChange={(e) => setForm({ ...form, objetivo: e.target.value })} /></div>
          <div><label style={labelStyle}>Tom (opcional)</label><input style={inputStyle} placeholder="Ex.: acolhedor e confiante" value={form.tom} onChange={(e) => setForm({ ...form, tom: e.target.value })} /></div>
        </div>
        <div style={{ marginTop: 18 }}><GenButton loading={loading} onClick={gerar} label="Gerar legenda" /></div>
      </Panel>

      <Panel>
        {!res ? <Empty text="Informe tema e objetivo para gerar a legenda no tom da marca." />
          : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span className="os-eyebrow">Legenda gerada</span>
                <CopyBtn text={full} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {([['Gancho', res.data.gancho], ['Desenvolvimento', res.data.desenvolvimento], ['CTA', res.data.cta]] as const).map(([k, v]) => (
                  <div key={k}>
                    <span style={{ fontSize: 10.5, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k}</span>
                    <p style={{ fontSize: 13.5, color: 'var(--fg-1)', lineHeight: 1.6, marginTop: 4, whiteSpace: 'pre-line' }}>{v}</p>
                  </div>
                ))}
                {res.data.hashtags?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {res.data.hashtags.map((h) => <span key={h} className="status-chip" style={{ fontSize: 11, color: 'var(--blue)' }}>{h}</span>)}
                  </div>
                )}
              </div>
              <Sources docs={res.usedDocs} source={res.source} />
            </div>
          )}
      </Panel>
    </div>
  )
}

/* ---------- 3) BRIEFING ---------- */

function BriefingTool() {
  const [form, setForm] = useState({ demanda: '', cliente: '', segmento: '' })
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState<{ data: { objetivo: string; publico: string; formatoIndicado: string; urgencia: string; mensagemPrincipal: string; sugestoes: string[]; perguntasComplementares: string[] }; source: string; usedDocs: UsedDoc[] } | null>(null)

  async function gerar() {
    if (!form.demanda) return
    setLoading(true)
    const r = await fetch('/api/ai/briefing', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setRes(await r.json()); setLoading(false)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
      <Panel>
        <span className="os-eyebrow" style={{ display: 'block', marginBottom: 18 }}>Transformador de demanda em briefing</span>
        <div style={{ display: 'grid', gap: 14 }}>
          <div><label style={labelStyle}>Demanda bagunçada do cliente *</label>
            <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={4} placeholder='Ex.: "chegou produto novo e quero divulgar essa semana"' value={form.demanda} onChange={(e) => setForm({ ...form, demanda: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>Cliente</label><input style={inputStyle} placeholder="Nome" value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} /></div>
            <div><label style={labelStyle}>Segmento</label><input style={inputStyle} placeholder="Ex.: ótica" value={form.segmento} onChange={(e) => setForm({ ...form, segmento: e.target.value })} /></div>
          </div>
        </div>
        <div style={{ marginTop: 18 }}><GenButton loading={loading} onClick={gerar} label="Organizar em briefing" /></div>
      </Panel>

      <Panel>
        {!res ? <Empty text="Cole uma demanda solta e a IA devolve um briefing estruturado." />
          : (
            <div>
              <span className="os-eyebrow" style={{ display: 'block', marginBottom: 16 }}>Briefing organizado</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                {([['Objetivo', res.data.objetivo], ['Público', res.data.publico], ['Formato', res.data.formatoIndicado], ['Urgência', res.data.urgencia]] as const).map(([k, v]) => (
                  <div key={k} style={{ padding: 12, borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 10.5, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</span>
                    <p style={{ fontSize: 12.5, color: 'var(--fg-1)', marginTop: 3, lineHeight: 1.4 }}>{v}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 10.5, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sugestões de conteúdo</span>
                <ul style={{ margin: '8px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {res.data.sugestoes.map((s, i) => <li key={i} style={{ fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>{s}</li>)}
                </ul>
              </div>
              <div>
                <span style={{ fontSize: 10.5, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Perguntas para fechar o briefing</span>
                <ul style={{ margin: '8px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {res.data.perguntasComplementares.map((q, i) => <li key={i} style={{ fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>{q}</li>)}
                </ul>
              </div>
              <Sources docs={res.usedDocs} source={res.source} />
            </div>
          )}
      </Panel>
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '48px 24px', textAlign: 'center', minHeight: 280 }}>
      <Sparkles size={30} style={{ color: 'var(--fg-4)' }} />
      <p style={{ fontSize: 13, color: 'var(--fg-3)', maxWidth: 260, lineHeight: 1.5 }}>{text}</p>
      <Link href="/painel/prompts" style={{ fontSize: 12, color: 'var(--accent)' }}>Ver a base de conhecimento →</Link>
    </div>
  )
}
