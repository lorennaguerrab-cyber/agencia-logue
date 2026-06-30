'use client'

import { useState } from 'react'
import { useClientStore } from '@/lib/client/store'
import { ClientHeader } from '@/components/client/ClientShell'
import { Sparkles, Send, Lightbulb, Paperclip } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const STATUS_LABEL: Record<string, string> = {
  pendente: 'Pendente', em_producao: 'Em produção', em_revisao: 'Em revisão', aprovado: 'Aprovado', entregue: 'Entregue',
}
const STATUS_COLOR: Record<string, string> = {
  pendente: 'var(--fg-3)', em_producao: 'var(--blue)', em_revisao: 'var(--yellow)', aprovado: 'var(--green)', entregue: 'var(--green)',
}

interface BriefingResult {
  objetivo: string
  formatoIndicado: string
  urgencia: string
  sugestoes: string[]
  perguntasComplementares: string[]
}

export default function DemandasPage() {
  const { account, demandas, addDemanda } = useClientStore()
  const [tipo, setTipo] = useState<'demanda' | 'ideia'>('demanda')
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(false)
  const [organized, setOrganized] = useState<BriefingResult | null>(null)

  function enviar() {
    if (!titulo.trim()) { toast.error('Dê um título à sua demanda.'); return }
    addDemanda({ titulo, descricao, tipo })
    toast.success(tipo === 'ideia' ? 'Ideia enviada! 💡' : 'Demanda enviada para a equipe!')
    setTitulo(''); setDescricao(''); setOrganized(null)
  }

  async function organizar() {
    const demanda = `${titulo}. ${descricao}`.trim()
    if (!demanda || demanda === '.') { toast.error('Escreva sua ideia primeiro.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/ai/briefing', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demanda, cliente: account?.marca, segmento: account?.segmento }),
      })
      const json = await res.json()
      setOrganized(json.data)
      toast.success('A IA organizou sua ideia ✨')
    } catch {
      toast.error('Não consegui organizar agora. Tente de novo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#181818', color: '#f4f4f2', border: '1px solid #2a2a2a', fontSize: 13 } }} />
      <ClientHeader title="Demandas & Ideias" subtitle="Envie um pedido de conteúdo ou solte uma ideia — a equipe organiza o resto." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }} className="client-grid">
        {/* Form */}
        <div className="card-soft" style={{ padding: 24 }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--surface-2)', padding: 4, borderRadius: 'var(--r-md)', marginBottom: 20, width: 'fit-content' }}>
            {(['demanda', 'ideia'] as const).map((t) => (
              <button key={t} onClick={() => setTipo(t)} style={{
                padding: '7px 16px', borderRadius: 'var(--r-sm)', fontSize: 13, border: 'none', cursor: 'pointer',
                background: tipo === t ? 'var(--surface-1)' : 'transparent', color: tipo === t ? 'var(--fg-1)' : 'var(--fg-3)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                {t === 'demanda' ? <Send size={13} /> : <Lightbulb size={13} />}
                {t === 'demanda' ? 'Demanda' : 'Ideia solta'}
              </button>
            ))}
          </div>

          <label style={lbl}>Título</label>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder={tipo === 'ideia' ? 'Ex.: mostrar os bastidores da loja' : 'Ex.: divulgar coleção nova'} style={field} />

          <label style={{ ...lbl, marginTop: 14 }}>Descrição</label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={4} placeholder="Conte com suas palavras, sem se preocupar em organizar — a gente cuida disso." style={{ ...field, resize: 'vertical' }} />

          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            <button onClick={enviar} className="btn-accent">Enviar para a equipe</button>
            <button onClick={organizar} disabled={loading} className="btn-ghost">
              <Sparkles size={15} /> {loading ? 'Organizando…' : 'Organizar com IA'}
            </button>
          </div>
          <p style={{ fontSize: 12, color: 'var(--fg-4)', marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Paperclip size={12} /> Para enviar fotos e arquivos, use a pasta do Drive (em “Como enviar materiais”).
          </p>

          {organized && (
            <div style={{ marginTop: 20, padding: 18, borderRadius: 'var(--r-md)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <span className="os-eyebrow" style={{ color: 'var(--accent)' }}>Briefing organizado pela IA</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
                {[['Objetivo', organized.objetivo], ['Formato', organized.formatoIndicado], ['Urgência', organized.urgencia]].map(([k, v]) => (
                  <div key={k}><span style={{ fontSize: 11, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</span><p style={{ fontSize: 13, color: 'var(--fg-1)', marginTop: 3 }}>{v}</p></div>
                ))}
              </div>
              {organized.sugestoes?.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <span style={{ fontSize: 11, color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sugestões</span>
                  <ul style={{ margin: '8px 0 0', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {organized.sugestoes.map((s, i) => <li key={i} style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* List */}
        <div className="card-soft" style={{ padding: 22 }}>
          <span className="os-eyebrow" style={{ display: 'block', marginBottom: 14 }}>Seus envios</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {demandas.map((d) => (
              <div key={d.id} style={{ padding: '12px 14px', borderRadius: 'var(--r-md)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 13, color: 'var(--fg-1)', fontWeight: 500 }}>{d.titulo}</span>
                  {d.tipo === 'ideia' && <Lightbulb size={13} color="var(--fg-4)" style={{ flexShrink: 0, marginTop: 2 }} />}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--fg-4)' }}>{new Date(d.criadoEm + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                  <span className="status-chip" style={{ color: STATUS_COLOR[d.status] }}>{STATUS_LABEL[d.status]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--fg-2)', marginBottom: 7 }
const field: React.CSSProperties = { width: '100%', padding: '11px 13px', borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--fg-1)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }
