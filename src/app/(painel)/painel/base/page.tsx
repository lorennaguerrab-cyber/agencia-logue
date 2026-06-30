'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTopbar } from '@/lib/topbar-context'
import { KB_SEED, CATEGORIA_LABEL, type KbDoc, type KbCategoria } from '@/lib/kb'
import { BookOpen, Search, Plus, Pencil, Check, X, Info } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const CATS = Object.keys(CATEGORIA_LABEL) as KbCategoria[]

export default function BasePage() {
  const { setConfig } = useTopbar()
  const [docs, setDocs] = useState<KbDoc[]>(KB_SEED)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<KbCategoria | 'all'>('all')
  const [editing, setEditing] = useState<KbDoc | null>(null)

  useEffect(() => {
    setConfig({ title: 'Base de conhecimento', subtitle: 'O contexto que a IA consulta antes de responder' })
  }, [setConfig])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return docs.filter((d) => {
      if (cat !== 'all' && d.categoria !== cat) return false
      if (!q) return true
      return (d.titulo + ' ' + d.conteudo + ' ' + d.tags.join(' ')).toLowerCase().includes(q)
    })
  }, [docs, query, cat])

  function save(updated: KbDoc) {
    setDocs((prev) => {
      const exists = prev.some((d) => d.id === updated.id)
      return exists ? prev.map((d) => (d.id === updated.id ? updated : d)) : [updated, ...prev]
    })
    setEditing(null)
    toast.success('Documento salvo (rascunho local).')
  }

  function novo() {
    setEditing({ id: `doc-${Date.now()}`, categoria: 'servico', titulo: '', conteudo: '', tags: [] })
  }

  const counts = useMemo(() => {
    const m: Record<string, number> = {}
    docs.forEach((d) => { m[d.categoria] = (m[d.categoria] ?? 0) + 1 })
    return m
  }, [docs])

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }} className="os-view-in">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#181818', color: '#f4f4f2', border: '1px solid #2a2a2a', fontSize: 13 } }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 'var(--r-md)', background: 'var(--accent-ghost)', border: '1px solid rgba(232,255,77,.2)', marginBottom: 20 }}>
        <Info size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>
          Estes são os documentos que alimentam as ferramentas de IA. Edições aqui são <strong>rascunhos locais</strong> no MVP — em produção elas persistem no Supabase (<code>kb_documentos</code>) e passam a valer para todas as gerações.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '9px 12px', flex: '1 1 240px' }}>
          <Search size={15} color="var(--fg-3)" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar na base…" style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--fg-1)', fontSize: 13, width: '100%' }} />
        </div>
        <button onClick={novo} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 'var(--r-sm)', background: 'var(--accent)', color: '#0a0a0a', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          <Plus size={15} /> Novo documento
        </button>
      </div>

      {/* category filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        <Chip active={cat === 'all'} onClick={() => setCat('all')} label={`Todos (${docs.length})`} />
        {CATS.filter((c) => counts[c]).map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(c)} label={`${CATEGORIA_LABEL[c]} (${counts[c]})`} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
        {filtered.map((d) => (
          <div key={d.id} style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
              <span className="status-chip" style={{ color: 'var(--accent)' }}><BookOpen size={11} /> {CATEGORIA_LABEL[d.categoria]}</span>
              <button onClick={() => setEditing(d)} style={{ background: 'transparent', border: 'none', color: 'var(--fg-3)', cursor: 'pointer', padding: 4 }}><Pencil size={14} /></button>
            </div>
            <h3 className="os-title" style={{ fontSize: 15, color: 'var(--fg-1)', marginBottom: 8 }}>{d.titulo}</h3>
            <p style={{ fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.55, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{d.conteudo}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {d.tags.slice(0, 4).map((t) => <span key={t} style={{ fontSize: 10.5, color: 'var(--fg-4)' }}>#{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      {editing && <Editor doc={editing} onSave={save} onCancel={() => setEditing(null)} />}
    </div>
  )
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 12px', borderRadius: 'var(--r-pill)', fontSize: 12, cursor: 'pointer', border: '1px solid',
      borderColor: active ? 'var(--accent)' : 'var(--border)', background: active ? 'var(--accent-ghost)' : 'transparent',
      color: active ? 'var(--accent)' : 'var(--fg-3)',
    }}>{label}</button>
  )
}

function Editor({ doc, onSave, onCancel }: { doc: KbDoc; onSave: (d: KbDoc) => void; onCancel: () => void }) {
  const [titulo, setTitulo] = useState(doc.titulo)
  const [conteudo, setConteudo] = useState(doc.conteudo)
  const [categoria, setCategoria] = useState<KbCategoria>(doc.categoria)
  const [tags, setTags] = useState(doc.tags.join(', '))

  const fld: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--fg-1)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 560, background: 'var(--surface-1)', border: '1px solid var(--border-strong)', borderRadius: 'var(--r-lg)', padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="os-title" style={{ fontSize: 18, color: 'var(--fg-1)' }}>{doc.titulo ? 'Editar documento' : 'Novo documento'}</h2>
          <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: 'var(--fg-3)', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <div style={{ display: 'grid', gap: 14 }}>
          <div><label style={lbl}>Categoria</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value as KbCategoria)} style={{ ...fld, cursor: 'pointer' }}>
              {CATS.map((c) => <option key={c} value={c}>{CATEGORIA_LABEL[c]}</option>)}
            </select>
          </div>
          <div><label style={lbl}>Título</label><input value={titulo} onChange={(e) => setTitulo(e.target.value)} style={fld} /></div>
          <div><label style={lbl}>Conteúdo (a IA lê este texto)</label><textarea value={conteudo} onChange={(e) => setConteudo(e.target.value)} rows={7} style={{ ...fld, resize: 'vertical' }} /></div>
          <div><label style={lbl}>Tags (separadas por vírgula)</label><input value={tags} onChange={(e) => setTags(e.target.value)} style={fld} /></div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button onClick={() => onSave({ ...doc, titulo, conteudo, categoria, tags: tags.split(',').map((t) => t.trim()).filter(Boolean) })}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 'var(--r-sm)', background: 'var(--accent)', color: '#0a0a0a', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            <Check size={15} /> Salvar
          </button>
          <button onClick={onCancel} style={{ padding: '10px 18px', borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', color: 'var(--fg-2)', fontSize: 13, border: '1px solid var(--border)', cursor: 'pointer' }}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 6 }
