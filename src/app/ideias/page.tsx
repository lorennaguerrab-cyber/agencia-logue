'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { IdeaCategory, Platform } from '@/lib/types'
import { CATEGORY_LABELS, PLATFORM_LABELS, PLATFORM_COLORS } from '@/lib/utils'
import { Card, CardBody } from '@/components/ui/Card'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, Plus, Search, X, Check, Trash2, FileText, Mail, Play, Sparkles } from 'lucide-react'

interface IdeaRow {
  id: string
  titulo: string
  descricao?: string
  categoria: IdeaCategory
  plataformas: Platform[]
  status: 'bruta' | 'desenvolvendo' | 'pronta' | 'aplicada'
  tags: string[]
  created_at: string
}

const STATUS_CONFIG = {
  bruta:        { label: 'Bruta',        color: '#908F8E', next: 'desenvolvendo' as const },
  desenvolvendo:{ label: 'Desenvolvendo',color: '#FBBF24', next: 'pronta' as const },
  pronta:       { label: 'Pronta',       color: '#34D399', next: 'aplicada' as const },
  aplicada:     { label: 'Aplicada',     color: '#A78BFA', next: null },
}

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  instagram: <span className="text-[10px]">IG</span>,
  youtube: <Play size={10} />,
  tiktok: <span className="text-[10px]">TK</span>,
  blog: <FileText size={10} />,
  newsletter: <Mail size={10} />,
  linkedin: <span className="text-[10px]">in</span>,
  collab: <Sparkles size={10} />,
  pinterest: <span className="text-[10px]">Pi</span>,
}

const DEMO: IdeaRow[] = [
  { id: 'd1', titulo: '"Domingo é o único dia em que tenho 47 ideias e zero energia pra executar"', descricao: 'Frase perfeita pra reel de bastidores.', categoria: 'bastidores', plataformas: ['instagram','tiktok'], status: 'pronta', tags: ['humor','relatable'], created_at: new Date().toISOString() },
  { id: 'd2', titulo: 'Série "Mulheres que viraram marca" — análise de posicionamento', descricao: 'Luisa Sonza, Kylie Jenner, Anitta.', categoria: 'mulheres_incriveis', plataformas: ['youtube','blog','newsletter'], status: 'desenvolvendo', tags: ['série','branding'], created_at: new Date().toISOString() },
  { id: 'd3', titulo: 'Por que a Duolingo domina o TikTok (e o que copiar)', categoria: 'analise_marcas', plataformas: ['blog','youtube'], status: 'bruta', tags: ['análise','tiktok'], created_at: new Date().toISOString() },
  { id: 'd4', titulo: '5 ferramentas de IA que uso todo dia sem complicar', categoria: 'inteligencia_artificial', plataformas: ['instagram','youtube'], status: 'pronta', tags: ['IA','produtividade'], created_at: new Date().toISOString() },
]

const CATEGORIAS = Object.entries(CATEGORY_LABELS) as [IdeaCategory, string][]
const PLATAFORMAS = Object.entries(PLATFORM_LABELS) as [Platform, string][]

function IdeaModal({ onSave, onClose }: { onSave: (d: Omit<IdeaRow, 'id'|'created_at'>) => Promise<void>; onClose: () => void }) {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState<IdeaCategory>('criatividade')
  const [plataformas, setPlataformas] = useState<Platform[]>([])
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)

  function togglePlat(p: Platform) {
    setPlataformas(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!titulo.trim()) return
    setSaving(true)
    await onSave({ titulo, descricao: descricao || undefined, categoria, plataformas, status: 'bruta', tags: tags.split(',').map(t => t.trim()).filter(Boolean) })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(43,43,43,0.35)', backdropFilter: 'blur(4px)' }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-md rounded-[20px] border bg-[var(--bg-surface)]" style={{ borderColor: 'var(--gray-light)' }}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: 'var(--gray-light)' }}>
          <p className="text-[14px] font-semibold text-[var(--text-primary)]">Nova ideia</p>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--bg-base)]"><X size={14} className="text-[var(--text-muted)]" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Qual é a ideia?</label>
            <textarea required value={titulo} onChange={e => setTitulo(e.target.value)} autoFocus rows={2} className="w-full px-3.5 py-2.5 rounded-[10px] border text-[13.5px] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 resize-none transition-colors" style={{ borderColor: 'var(--gray-light)' }} placeholder="Descreva a ideia..." />
          </div>
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Desenvolvimento (opcional)</label>
            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={2} className="w-full px-3.5 py-2.5 rounded-[10px] border text-[13.5px] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 resize-none transition-colors" style={{ borderColor: 'var(--gray-light)' }} placeholder="Contexto, referências, ângulo..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Categoria</label>
              <select value={categoria} onChange={e => setCategoria(e.target.value as IdeaCategory)} className="w-full px-3 py-2 rounded-[10px] border text-[13px] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 transition-colors" style={{ borderColor: 'var(--gray-light)' }}>
                {CATEGORIAS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Tags (vírgula)</label>
              <input value={tags} onChange={e => setTags(e.target.value)} placeholder="humor, viral..." className="w-full px-3 py-2 rounded-[10px] border text-[13px] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 transition-colors" style={{ borderColor: 'var(--gray-light)' }} />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-2">Plataformas</label>
            <div className="flex flex-wrap gap-1.5">
              {PLATAFORMAS.map(([v, l]) => (
                <button key={v} type="button" onClick={() => togglePlat(v as Platform)} className="px-2.5 py-1 rounded-full text-[11.5px] border transition-all" style={{ borderColor: plataformas.includes(v as Platform) ? 'var(--pink)' : 'var(--gray-light)', background: plataformas.includes(v as Platform) ? 'var(--pink-tint)' : 'transparent', color: plataformas.includes(v as Platform) ? 'var(--pink-deep)' : 'var(--text-muted)' }}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-full border text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-base)] transition-colors" style={{ borderColor: 'var(--gray-light)' }}>Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-full text-[13px] font-semibold text-white flex items-center justify-center gap-1.5 hover:opacity-90 disabled:opacity-60 transition-opacity" style={{ background: 'var(--pink)' }}>
              <Check size={13} />{saving ? 'Salvando...' : 'Salvar ideia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function IdeiasPage() {
  const [ideas, setIdeas] = useState<IdeaRow[]>(DEMO)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState<IdeaCategory | 'todas'>('todas')
  const [filterStatus, setFilterStatus] = useState<string>('todos')
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('ideias').select('*').order('created_at', { ascending: false })
    if (data && data.length > 0) setIdeas(data as IdeaRow[])
    else setIdeas(DEMO)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function saveIdea(data: Omit<IdeaRow, 'id' | 'created_at'>) {
    await supabase.from('ideias').insert([data])
    await load()
    setModalOpen(false)
  }

  async function updateStatus(id: string, status: IdeaRow['status']) {
    if (id.startsWith('d')) return
    await supabase.from('ideias').update({ status }).eq('id', id)
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  async function deleteIdea(id: string) {
    if (id.startsWith('d')) return
    await supabase.from('ideias').delete().eq('id', id)
    setIdeas(prev => prev.filter(i => i.id !== id))
  }

  const filtered = ideas.filter(i => {
    const ms = !search || i.titulo.toLowerCase().includes(search.toLowerCase())
    const mc = filterCat === 'todas' || i.categoria === filterCat
    const mst = filterStatus === 'todos' || i.status === filterStatus
    return ms && mc && mst
  })

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-syne)' }}>Banco de Ideias</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{ideas.length} ideias · {ideas.filter(i => i.status === 'pronta').length} prontas para usar</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'var(--pink)' }}>
            <Plus size={14} /> Nova ideia
          </button>
        </div>

        {/* Status pills */}
        <div className="flex gap-2 flex-wrap">
          {[{ v: 'todos', l: 'Todas' }, ...Object.entries(STATUS_CONFIG).map(([v, c]) => ({ v, l: c.label }))].map(({ v, l }) => (
            <button key={v} onClick={() => setFilterStatus(v)} className="px-3 py-1.5 rounded-full border text-[12px] font-medium transition-all" style={{ borderColor: filterStatus === v ? 'var(--pink)' : 'var(--gray-light)', background: filterStatus === v ? 'var(--pink-tint)' : 'transparent', color: filterStatus === v ? 'var(--pink-deep)' : 'var(--text-muted)' }}>{l}</button>
          ))}
        </div>

        {/* Search + category */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 border rounded-[10px] px-3 py-2 flex-1 max-w-xs" style={{ borderColor: 'var(--gray-light)', background: 'var(--bg-base)' }}>
            <Search size={13} className="text-[var(--text-muted)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar ideias..." className="text-[13px] flex-1 bg-transparent focus:outline-none" />
          </div>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value as any)} className="px-3 py-2 rounded-[10px] border text-[13px] bg-[var(--bg-base)] focus:outline-none transition-colors" style={{ borderColor: 'var(--gray-light)' }}>
            <option value="todas">Todas categorias</option>
            {CATEGORIAS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-10">Carregando...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Lightbulb size={32} className="text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
            <p className="text-[var(--text-muted)] text-sm">Nenhuma ideia encontrada.</p>
            <button onClick={() => setModalOpen(true)} className="mt-4 px-4 py-2 rounded-full text-[13px] font-semibold text-white" style={{ background: 'var(--pink)' }}>Criar primeira ideia</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map(idea => {
              const s = STATUS_CONFIG[idea.status]
              const isDemo = idea.id.startsWith('d')
              return (
                <div key={idea.id} className="rounded-[15px] border bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] transition-all group" style={{ borderColor: 'var(--gray-light)' }}>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] font-medium text-[var(--text-primary)] leading-snug flex-1">{idea.titulo}</p>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-[10.5px] px-2 py-0.5 rounded-full font-semibold" style={{ color: s.color, background: `${s.color}18` }}>{s.label}</span>
                        {!isDemo && (
                          <button onClick={() => deleteIdea(idea.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-[var(--text-muted)] hover:text-red-500 transition-all">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {idea.descricao && <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">{idea.descricao}</p>}

                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex gap-1 flex-wrap items-center">
                        <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-[var(--bg-base)] text-[var(--text-muted)]">{CATEGORY_LABELS[idea.categoria] || idea.categoria}</span>
                        {idea.plataformas.map(p => (
                          <span key={p} className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${PLATFORM_COLORS[p] || '#7C3AED'}20`, color: PLATFORM_COLORS[p] || '#7C3AED' }}>
                            {PLATFORM_ICONS[p]}{PLATFORM_LABELS[p]}
                          </span>
                        ))}
                      </div>
                      {s.next && !isDemo && (
                        <button onClick={() => updateStatus(idea.id, s.next!)} className="text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all hover:opacity-80" style={{ borderColor: STATUS_CONFIG[s.next].color, color: STATUS_CONFIG[s.next].color, background: `${STATUS_CONFIG[s.next].color}10` }}>
                          → {STATUS_CONFIG[s.next].label}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </motion.div>

      {modalOpen && <IdeaModal onSave={saveIdea} onClose={() => setModalOpen(false)} />}
    </div>
  )
}
