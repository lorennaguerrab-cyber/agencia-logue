'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { IdeaCategory, Platform } from '@/lib/types'
import { CATEGORY_LABELS, PLATFORM_LABELS, PLATFORM_COLORS } from '@/lib/utils'
import { Card, CardBody } from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { Plus, Search, X, Check, Trash2, LayoutGrid, List, Calendar } from 'lucide-react'

interface ConteudoRow {
  id: string
  titulo: string
  tipo: 'reel' | 'youtube' | 'blog' | 'newsletter' | 'tiktok' | 'shorts' | 'carrossel'
  plataformas: Platform[]
  status: 'ideia' | 'rascunho' | 'filmando' | 'editando' | 'revisao' | 'agendado' | 'publicado'
  categoria: IdeaCategory
  data_filmagem?: string
  data_publicacao?: string
  url_post?: string
  created_at: string
}

const STATUS_CONFIG = {
  ideia:     { label: 'Ideia',      color: '#908F8E' },
  rascunho:  { label: 'Rascunho',   color: '#FBBF24' },
  filmando:  { label: 'Filmando',   color: '#F87171' },
  editando:  { label: 'Editando',   color: '#FB923C' },
  revisao:   { label: 'Revisão',    color: '#A78BFA' },
  agendado:  { label: 'Agendado',   color: '#60A5FA' },
  publicado: { label: 'Publicado',  color: '#34D399' },
}

const TIPOS = ['reel','youtube','blog','newsletter','tiktok','shorts','carrossel'] as const
const TYPE_EMOJIS: Record<string, string> = { reel:'🎬', youtube:'▶️', blog:'✍️', newsletter:'📩', tiktok:'🎵', shorts:'⚡', carrossel:'🖼' }
const KANBAN_COLS = Object.keys(STATUS_CONFIG) as ConteudoRow['status'][]

const DEMO: ConteudoRow[] = [
  { id: 'd1', titulo: 'Como organizo minha semana sendo mãe e criadora', tipo: 'blog', plataformas: ['blog','newsletter'], status: 'publicado', categoria: 'rotina', created_at: new Date().toISOString() },
  { id: 'd2', titulo: 'Reel: Por que sua marca precisa de uma voz única', tipo: 'reel', plataformas: ['instagram','tiktok'], status: 'editando', categoria: 'branding', created_at: new Date().toISOString() },
  { id: 'd3', titulo: 'Newsletter: 5 ferramentas de IA que uso todo dia', tipo: 'newsletter', plataformas: ['newsletter'], status: 'rascunho', categoria: 'inteligencia_artificial', created_at: new Date().toISOString() },
  { id: 'd4', titulo: 'Análise: Duolingo e o poder do caos controlado', tipo: 'youtube', plataformas: ['youtube','blog'], status: 'ideia', categoria: 'analise_marcas', created_at: new Date().toISOString() },
  { id: 'd5', titulo: 'Série Mulheres Incríveis — Ep. 01: Luisa Sonza', tipo: 'youtube', plataformas: ['youtube'], status: 'rascunho', categoria: 'mulheres_incriveis', created_at: new Date().toISOString() },
  { id: 'd6', titulo: 'Bastidores: minha rotina de criação de conteúdo', tipo: 'reel', plataformas: ['instagram'], status: 'agendado', categoria: 'bastidores', created_at: new Date().toISOString() },
]

function ConteudoModal({ onSave, onClose }: { onSave: (d: Omit<ConteudoRow,'id'|'created_at'>) => Promise<void>; onClose: () => void }) {
  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState<ConteudoRow['tipo']>('reel')
  const [categoria, setCategoria] = useState<IdeaCategory>('criatividade')
  const [plataformas, setPlataformas] = useState<Platform[]>([])
  const [dataFilmagem, setDataFilmagem] = useState('')
  const [dataPublicacao, setDataPublicacao] = useState('')
  const [saving, setSaving] = useState(false)

  function togglePlat(p: Platform) {
    setPlataformas(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await onSave({ titulo, tipo, categoria, plataformas, status: 'ideia', data_filmagem: dataFilmagem || undefined, data_publicacao: dataPublicacao || undefined })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(43,43,43,0.35)', backdropFilter: 'blur(4px)' }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-md rounded-[20px] border bg-[var(--bg-surface)] max-h-[90vh] overflow-y-auto" style={{ borderColor: 'var(--gray-light)' }}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b sticky top-0 bg-[var(--bg-surface)]" style={{ borderColor: 'var(--gray-light)' }}>
          <p className="text-[14px] font-semibold text-[var(--text-primary)]">Novo conteúdo</p>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--bg-base)]"><X size={14} className="text-[var(--text-muted)]" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Título</label>
            <input required value={titulo} onChange={e => setTitulo(e.target.value)} autoFocus className="w-full px-3.5 py-2.5 rounded-[10px] border text-[13.5px] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 transition-colors" style={{ borderColor: 'var(--gray-light)' }} placeholder="Reel: Como eu..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Formato</label>
              <select value={tipo} onChange={e => setTipo(e.target.value as ConteudoRow['tipo'])} className="w-full px-3 py-2 rounded-[10px] border text-[13px] bg-[var(--bg-base)] focus:outline-none transition-colors" style={{ borderColor: 'var(--gray-light)' }}>
                {TIPOS.map(t => <option key={t} value={t}>{TYPE_EMOJIS[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Categoria</label>
              <select value={categoria} onChange={e => setCategoria(e.target.value as IdeaCategory)} className="w-full px-3 py-2 rounded-[10px] border text-[13px] bg-[var(--bg-base)] focus:outline-none transition-colors" style={{ borderColor: 'var(--gray-light)' }}>
                {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Data de filmagem</label>
              <input type="date" value={dataFilmagem} onChange={e => setDataFilmagem(e.target.value)} className="w-full px-3 py-2 rounded-[10px] border text-[13px] bg-[var(--bg-base)] focus:outline-none transition-colors" style={{ borderColor: 'var(--gray-light)' }} />
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Data de publicação</label>
              <input type="date" value={dataPublicacao} onChange={e => setDataPublicacao(e.target.value)} className="w-full px-3 py-2 rounded-[10px] border text-[13px] bg-[var(--bg-base)] focus:outline-none transition-colors" style={{ borderColor: 'var(--gray-light)' }} />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-2">Plataformas</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(PLATFORM_LABELS).map(([v, l]) => (
                <button key={v} type="button" onClick={() => togglePlat(v as Platform)} className="px-2.5 py-1 rounded-full text-[11.5px] border transition-all" style={{ borderColor: plataformas.includes(v as Platform) ? 'var(--pink)' : 'var(--gray-light)', background: plataformas.includes(v as Platform) ? 'var(--pink-tint)' : 'transparent', color: plataformas.includes(v as Platform) ? 'var(--pink-deep)' : 'var(--text-muted)' }}>{l}</button>
              ))}
            </div>
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

export default function ConteudoPage() {
  const [items, setItems] = useState<ConteudoRow[]>(DEMO)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('conteudo').select('*').order('created_at', { ascending: false })
    if (data && data.length > 0) setItems(data as ConteudoRow[])
    else setItems(DEMO)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function saveConteudo(data: Omit<ConteudoRow,'id'|'created_at'>) {
    await supabase.from('conteudo').insert([data])
    await load()
    setModalOpen(false)
  }

  async function updateStatus(id: string, status: ConteudoRow['status']) {
    if (id.startsWith('d')) return
    await supabase.from('conteudo').update({ status }).eq('id', id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  async function deleteItem(id: string) {
    if (id.startsWith('d')) return
    await supabase.from('conteudo').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const filtered = items.filter(i => !search || i.titulo.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen p-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-full">

        <div className="flex items-start justify-between max-w-5xl mx-auto">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-syne)' }}>Central de Conteúdo</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{items.length} conteúdos · {items.filter(i => i.status === 'publicado').length} publicados</p>
          </div>
          <div className="flex gap-2">
            <div className="flex bg-[var(--bg-base)] border rounded-[10px] p-0.5 gap-0.5" style={{ borderColor: 'var(--gray-light)' }}>
              {(['kanban','list'] as const).map(v => (
                <button key={v} onClick={() => setView(v)} className="p-1.5 rounded-[8px] transition-all" style={{ background: view === v ? 'var(--bg-surface)' : 'transparent', color: view === v ? 'var(--pink)' : 'var(--text-muted)' }}>
                  {v === 'kanban' ? <LayoutGrid size={14} /> : <List size={14} />}
                </button>
              ))}
            </div>
            <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'var(--pink)' }}>
              <Plus size={14} /> Novo conteúdo
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-5xl mx-auto grid grid-cols-4 md:grid-cols-7 gap-2">
          {KANBAN_COLS.map(s => {
            const cfg = STATUS_CONFIG[s]
            const count = items.filter(i => i.status === s).length
            return (
              <div key={s} className="text-center p-2 rounded-[10px] border" style={{ borderColor: 'var(--gray-light)' }}>
                <p className="text-lg font-bold" style={{ color: cfg.color }}>{count}</p>
                <p className="text-[9px] text-[var(--text-muted)]">{cfg.label}</p>
              </div>
            )
          })}
        </div>

        {/* Search */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 border rounded-[10px] px-3 py-2 max-w-sm" style={{ borderColor: 'var(--gray-light)', background: 'var(--bg-base)' }}>
            <Search size={13} className="text-[var(--text-muted)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar conteúdos..." className="text-[13px] flex-1 bg-transparent focus:outline-none" />
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-10">Carregando...</p>
        ) : view === 'kanban' ? (
          <div className="flex gap-3 overflow-x-auto pb-4 px-0">
            {KANBAN_COLS.map(status => {
              const cfg = STATUS_CONFIG[status]
              const col = filtered.filter(i => i.status === status)
              const nextStatus = KANBAN_COLS[KANBAN_COLS.indexOf(status) + 1]
              return (
                <div key={status} className="flex-shrink-0 w-60">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                    <p className="text-[12px] font-semibold" style={{ color: cfg.color }}>{cfg.label}</p>
                    <span className="text-[10px] text-[var(--text-muted)] ml-auto">{col.length}</span>
                  </div>
                  <div className="space-y-2 min-h-[80px]">
                    {col.map(item => (
                      <div key={item.id} className="rounded-[12px] border bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] p-3 space-y-2 group transition-colors" style={{ borderColor: 'var(--gray-light)' }}>
                        <div className="flex items-start gap-1.5">
                          <span className="text-sm flex-shrink-0 mt-0.5">{TYPE_EMOJIS[item.tipo]}</span>
                          <p className="text-[12px] font-medium text-[var(--text-primary)] leading-snug flex-1">{item.titulo}</p>
                          {!item.id.startsWith('d') && (
                            <button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 p-0.5 text-[var(--text-muted)] hover:text-red-500 transition-all">
                              <Trash2 size={11} />
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.plataformas.slice(0,3).map(p => (
                            <span key={p} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${PLATFORM_COLORS[p]||'#7C3AED'}20`, color: PLATFORM_COLORS[p]||'#7C3AED' }}>
                              {PLATFORM_LABELS[p]}
                            </span>
                          ))}
                        </div>
                        {item.data_publicacao && (
                          <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                            <Calendar size={9} />{new Date(item.data_publicacao + 'T00:00:00').toLocaleDateString('pt-BR')}
                          </p>
                        )}
                        {nextStatus && !item.id.startsWith('d') && (
                          <button onClick={() => updateStatus(item.id, nextStatus)} className="w-full text-[10.5px] font-medium py-1 rounded-full border transition-all hover:opacity-80 text-center" style={{ borderColor: STATUS_CONFIG[nextStatus].color, color: STATUS_CONFIG[nextStatus].color, background: `${STATUS_CONFIG[nextStatus].color}10` }}>
                            → {STATUS_CONFIG[nextStatus].label}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-2">
            {filtered.map(item => {
              const cfg = STATUS_CONFIG[item.status]
              const nextStatus = KANBAN_COLS[KANBAN_COLS.indexOf(item.status) + 1]
              return (
                <div key={item.id} className="flex items-center gap-3 p-3.5 rounded-[12px] border bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] group transition-colors" style={{ borderColor: 'var(--gray-light)' }}>
                  <span className="text-lg flex-shrink-0">{TYPE_EMOJIS[item.tipo]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">{item.titulo}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{CATEGORY_LABELS[item.categoria] || item.categoria}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.data_publicacao && <span className="text-[11px] text-[var(--text-muted)]">{new Date(item.data_publicacao + 'T00:00:00').toLocaleDateString('pt-BR')}</span>}
                    <span className="text-[10.5px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${cfg.color}18`, color: cfg.color }}>{cfg.label}</span>
                    {nextStatus && !item.id.startsWith('d') && (
                      <button onClick={() => updateStatus(item.id, nextStatus)} className="text-[11px] px-2 py-1 rounded-full border transition-all hover:opacity-80" style={{ borderColor: STATUS_CONFIG[nextStatus].color, color: STATUS_CONFIG[nextStatus].color }}>→ {STATUS_CONFIG[nextStatus].label}</button>
                    )}
                    {!item.id.startsWith('d') && (
                      <button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-muted)] hover:text-red-500 transition-all">
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </motion.div>

      {modalOpen && <ConteudoModal onSave={saveConteudo} onClose={() => setModalOpen(false)} />}
    </div>
  )
}
