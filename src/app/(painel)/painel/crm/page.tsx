'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Platform } from '@/lib/types'
import { PLATFORM_LABELS } from '@/lib/utils'
import { Card, CardBody } from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { Plus, Search, X, Check, Trash2, MessageCircle, Clock, Pencil } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface CRMRow {
  id: string
  nome: string
  tipo: 'marca' | 'influencer' | 'ugc' | 'collab' | 'networking'
  status: 'potencial' | 'em_contato' | 'negociando' | 'fechado' | 'arquivado'
  plataforma?: string
  proposta?: string
  valor?: number
  proxima_acao?: string
  data_followup?: string
  notas?: string
  created_at: string
}

const STATUS_CONFIG = {
  potencial:  { label: 'Potencial',   color: '#60A5FA', next: 'em_contato' as const },
  em_contato: { label: 'Em contato',  color: '#FBBF24', next: 'negociando' as const },
  negociando: { label: 'Negociando',  color: '#A78BFA', next: 'fechado' as const },
  fechado:    { label: 'Fechado',     color: '#34D399', next: null },
  arquivado:  { label: 'Arquivado',   color: '#908F8E', next: null },
}

const TYPE_CONFIG = {
  marca:      { label: 'Marca',       emoji: '🏢' },
  influencer: { label: 'Influencer',  emoji: '⭐' },
  ugc:        { label: 'UGC',         emoji: '📱' },
  collab:     { label: 'Collab',      emoji: '🤝' },
  networking: { label: 'Network',     emoji: '🌐' },
}

const DEMO: CRMRow[] = [
  { id: 'd1', nome: 'Reserva', tipo: 'marca', status: 'potencial', plataforma: 'instagram', proposta: 'UGC de moda feminina — coleção inverno 2026', valor: 800, proxima_acao: 'Enviar proposta personalizada', data_followup: new Date(Date.now() + 2*86400000).toISOString().slice(0,10), notas: 'Marca com estética alinhada.', created_at: new Date().toISOString() },
  { id: 'd2', nome: 'Mari Gonzalez', tipo: 'influencer', status: 'em_contato', plataforma: 'instagram', proposta: 'Collab série "Mulheres que viraram marca"', proxima_acao: 'Responder DM com proposta de formato', notas: '300k seguidores. Nicho comportamento.', created_at: new Date().toISOString() },
  { id: 'd3', nome: 'iFood', tipo: 'marca', status: 'negociando', plataforma: 'instagram', proposta: 'UGC campanha "Mãe que pede iFood"', valor: 1500, proxima_acao: 'Alinhar briefing criativo', notas: 'Segunda reunião agendada.', created_at: new Date().toISOString() },
  { id: 'd4', nome: 'Paolla Gisele', tipo: 'collab', status: 'fechado', plataforma: 'instagram', proposta: 'UGC planejamento — collab conjunto', valor: 600, proxima_acao: 'Entregar conteúdo até dia 20', created_at: new Date().toISOString() },
]

const EMPTY_FORM: Omit<CRMRow, 'id'|'created_at'> = {
  nome: '', tipo: 'marca', status: 'potencial',
  plataforma: '', proposta: '', valor: undefined,
  proxima_acao: '', data_followup: '', notas: '',
}

function CRMModal({ initial, onSave, onClose }: {
  initial?: Partial<CRMRow>
  onSave: (d: Omit<CRMRow,'id'|'created_at'>) => Promise<void>
  onClose: () => void
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial })
  const [saving, setSaving] = useState(false)
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await onSave({ ...form, valor: form.valor ? Number(form.valor) : undefined, plataforma: form.plataforma || undefined, data_followup: form.data_followup || undefined })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(43,43,43,0.35)', backdropFilter: 'blur(4px)' }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-md rounded-[20px] border bg-[var(--bg-surface)] max-h-[90vh] overflow-y-auto" style={{ borderColor: 'var(--gray-light)' }}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b sticky top-0 bg-[var(--bg-surface)]" style={{ borderColor: 'var(--gray-light)' }}>
          <p className="text-[14px] font-semibold text-[var(--text-primary)]">{initial?.id ? 'Editar contato' : 'Novo contato'}</p>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--bg-base)]"><X size={14} className="text-[var(--text-muted)]" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Nome</label>
            <input required value={form.nome} onChange={e => set('nome', e.target.value)} autoFocus className="w-full px-3.5 py-2.5 rounded-[10px] border text-[13.5px] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 transition-colors" style={{ borderColor: 'var(--gray-light)' }} placeholder="Reserva, Mari Gonzalez..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Tipo</label>
              <select value={form.tipo} onChange={e => set('tipo', e.target.value as CRMRow['tipo'])} className="w-full px-3 py-2 rounded-[10px] border text-[13px] bg-[var(--bg-base)] focus:outline-none transition-colors" style={{ borderColor: 'var(--gray-light)' }}>
                {Object.entries(TYPE_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Plataforma</label>
              <select value={form.plataforma || ''} onChange={e => set('plataforma', e.target.value)} className="w-full px-3 py-2 rounded-[10px] border text-[13px] bg-[var(--bg-base)] focus:outline-none transition-colors" style={{ borderColor: 'var(--gray-light)' }}>
                <option value="">— nenhuma —</option>
                {Object.entries(PLATFORM_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Proposta</label>
            <textarea value={form.proposta || ''} onChange={e => set('proposta', e.target.value)} rows={2} className="w-full px-3.5 py-2.5 rounded-[10px] border text-[13.5px] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 resize-none transition-colors" style={{ borderColor: 'var(--gray-light)' }} placeholder="UGC de moda feminina..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Valor (R$)</label>
              <input type="number" min={0} value={form.valor || ''} onChange={e => set('valor', e.target.value ? Number(e.target.value) : undefined)} className="w-full px-3 py-2 rounded-[10px] border text-[13px] bg-[var(--bg-base)] focus:outline-none transition-colors" style={{ borderColor: 'var(--gray-light)' }} />
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Follow-up</label>
              <input type="date" value={form.data_followup || ''} onChange={e => set('data_followup', e.target.value)} className="w-full px-3 py-2 rounded-[10px] border text-[13px] bg-[var(--bg-base)] focus:outline-none transition-colors" style={{ borderColor: 'var(--gray-light)' }} />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Próxima ação</label>
            <input value={form.proxima_acao || ''} onChange={e => set('proxima_acao', e.target.value)} className="w-full px-3.5 py-2.5 rounded-[10px] border text-[13.5px] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 transition-colors" style={{ borderColor: 'var(--gray-light)' }} placeholder="Enviar proposta, Responder DM..." />
          </div>
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Notas</label>
            <textarea value={form.notas || ''} onChange={e => set('notas', e.target.value)} rows={2} className="w-full px-3.5 py-2.5 rounded-[10px] border text-[13.5px] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 resize-none transition-colors" style={{ borderColor: 'var(--gray-light)' }} placeholder="Observações relevantes..." />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-full border text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-base)] transition-colors" style={{ borderColor: 'var(--gray-light)' }}>Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-full text-[13px] font-semibold text-white flex items-center justify-center gap-1.5 hover:opacity-90 disabled:opacity-60 transition-opacity" style={{ background: 'var(--pink)' }}>
              <Check size={13} />{saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CRMPage() {
  const [contacts, setContacts] = useState<CRMRow[]>(DEMO)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('todos')
  const [modal, setModal] = useState<{ open: boolean; contact: Partial<CRMRow> | null }>({ open: false, contact: null })

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('crm_contatos').select('*').order('created_at', { ascending: false })
    if (data && data.length > 0) setContacts(data as CRMRow[])
    else setContacts(DEMO)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function saveContact(data: Omit<CRMRow,'id'|'created_at'>) {
    if (modal.contact?.id && !modal.contact.id.startsWith('d')) {
      await supabase.from('crm_contatos').update(data).eq('id', modal.contact.id)
      toast.success('Contato atualizado!')
    } else {
      await supabase.from('crm_contatos').insert([data])
      toast.success('Contato criado!')
    }
    await load()
    setModal({ open: false, contact: null })
  }

  async function updateStatus(id: string, status: CRMRow['status']) {
    if (id.startsWith('d')) return
    await supabase.from('crm_contatos').update({ status }).eq('id', id)
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    toast.success(`→ ${STATUS_CONFIG[status].label}`)
  }

  async function deleteContact(id: string) {
    if (id.startsWith('d')) return
    await supabase.from('crm_contatos').delete().eq('id', id)
    setContacts(prev => prev.filter(c => c.id !== id))
    toast.success('Contato removido.')
  }

  const filtered = contacts.filter(c => {
    const ms = !search || c.nome.toLowerCase().includes(search.toLowerCase()) || c.proposta?.toLowerCase().includes(search.toLowerCase())
    const mst = filterStatus === 'todos' || c.status === filterStatus
    return ms && mst
  })

  const pendingFollowups = contacts.filter(c =>
    c.data_followup && new Date(c.data_followup) <= new Date(Date.now() + 3*86400000) && c.status !== 'arquivado'
  )

  const pipeline = contacts.filter(c => c.valor && (c.status === 'negociando' || c.status === 'em_contato')).reduce((s, c) => s + (c.valor || 0), 0)

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-syne)' }}>CRM Criativo</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Marcas, collabs, influencers e networking</p>
          </div>
          <button onClick={() => setModal({ open: true, contact: null })} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'var(--pink)' }}>
            <Plus size={14} /> Novo contato
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
            <Card key={s}>
              <CardBody className="py-3">
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{cfg.label}</p>
                <p className="text-xl font-bold mt-1" style={{ color: cfg.color }}>{contacts.filter(c => c.status === s).length}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Pipeline + follow-ups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pipeline > 0 && (
            <div className="rounded-[15px] p-4 border" style={{ background: 'color-mix(in srgb, #A78BFA 8%, white)', borderColor: 'color-mix(in srgb, #A78BFA 20%, white)' }}>
              <p className="text-[10.5px] font-medium uppercase tracking-wider mb-1" style={{ color: '#A78BFA' }}>Pipeline ativo</p>
              <p className="text-xl font-bold" style={{ color: '#A78BFA' }}>R$ {pipeline.toLocaleString('pt-BR')}</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Em negociação e contato</p>
            </div>
          )}
          {pendingFollowups.length > 0 && (
            <div className="rounded-[15px] p-4 border" style={{ background: 'color-mix(in srgb, #FBBF24 8%, white)', borderColor: 'color-mix(in srgb, #FBBF24 25%, white)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={13} style={{ color: '#FBBF24' }} />
                <p className="text-[10.5px] font-medium uppercase tracking-wider" style={{ color: '#FBBF24' }}>{pendingFollowups.length} follow-up(s) próximos</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {pendingFollowups.map(c => (
                  <span key={c.id} className="text-[11.5px] px-2.5 py-1 rounded-lg border text-[var(--text-secondary)]" style={{ background: 'var(--bg-surface)', borderColor: 'var(--gray-light)' }}>{c.nome}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 border rounded-[10px] px-3 py-2 flex-1 max-w-xs" style={{ borderColor: 'var(--gray-light)', background: 'var(--bg-base)' }}>
            <Search size={13} className="text-[var(--text-muted)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar contatos..." className="text-[13px] flex-1 bg-transparent focus:outline-none" />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {['todos', ...Object.keys(STATUS_CONFIG)].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className="px-3 py-1.5 rounded-full border text-[12px] transition-all" style={{ borderColor: filterStatus === s ? 'var(--pink)' : 'var(--gray-light)', background: filterStatus === s ? 'var(--pink-tint)' : 'transparent', color: filterStatus === s ? 'var(--pink-deep)' : 'var(--text-muted)' }}>
                {s === 'todos' ? 'Todos' : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-10">Carregando...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map(contact => {
              const s = STATUS_CONFIG[contact.status]
              const t = TYPE_CONFIG[contact.tipo]
              const isDemo = contact.id.startsWith('d')
              return (
                <div key={contact.id} className="rounded-[15px] border bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] p-4 space-y-3 group transition-colors" style={{ borderColor: 'var(--gray-light)' }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{t.emoji}</span>
                      <div>
                        <p className="text-[13.5px] font-semibold text-[var(--text-primary)]">{contact.nome}</p>
                        <p className="text-[10.5px] text-[var(--text-muted)]">{t.label}{contact.plataforma ? ` · ${PLATFORM_LABELS[contact.plataforma as Platform] || contact.plataforma}` : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10.5px] px-2 py-0.5 rounded-full font-semibold" style={{ color: s.color, background: `${s.color}18` }}>{s.label}</span>
                      {!isDemo && (
                        <>
                          <button onClick={() => setModal({ open: true, contact })} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[var(--bg-base)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"><Pencil size={12} /></button>
                          <button onClick={() => deleteContact(contact.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-[var(--text-muted)] hover:text-red-500 transition-all"><Trash2 size={12} /></button>
                        </>
                      )}
                    </div>
                  </div>

                  {contact.proposta && <p className="text-[12.5px] text-[var(--text-secondary)] leading-snug">{contact.proposta}</p>}

                  {contact.valor && <p className="text-[13px] font-semibold" style={{ color: '#34D399' }}>R$ {contact.valor.toLocaleString('pt-BR')}</p>}

                  {contact.proxima_acao && (
                    <div className="flex items-center gap-2 p-2.5 rounded-[10px]" style={{ background: 'var(--bg-base)', border: '1px solid var(--gray-light)' }}>
                      <MessageCircle size={11} className="text-[var(--text-muted)] flex-shrink-0" />
                      <span className="text-[12px] text-[var(--text-secondary)]">{contact.proxima_acao}</span>
                    </div>
                  )}

                  {contact.notas && <p className="text-[11px] text-[var(--text-muted)] italic">{contact.notas}</p>}

                  {s.next && !isDemo && (
                    <button onClick={() => updateStatus(contact.id, s.next!)} className="w-full text-[12px] font-medium py-1.5 rounded-full border transition-all hover:opacity-80" style={{ borderColor: STATUS_CONFIG[s.next].color, color: STATUS_CONFIG[s.next].color, background: `${STATUS_CONFIG[s.next].color}10` }}>
                      → {STATUS_CONFIG[s.next].label}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </motion.div>

      {modal.open && <CRMModal initial={modal.contact || undefined} onSave={saveContact} onClose={() => setModal({ open: false, contact: null })} />}
    </div>
  )
}
