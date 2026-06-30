'use client'

import { useState, useEffect } from 'react'
import { useLorennStore } from '@/lib/store'
import { ENERGY_CONFIGS } from '@/lib/energy'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { Plus, ChevronDown, ChevronRight, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'
import type { EnergyMode } from '@/lib/types'

type Micro = { id: string; descricao: string; concluida: boolean; tempo_estimado?: number }
type Tarefa = {
  id: string
  titulo: string
  status: 'pendente' | 'em_progresso' | 'concluida'
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  categoria?: string
  energia?: string[]
  microetapas?: Micro[]
}

const PRIO_COLOR: Record<string, string> = {
  urgente: '#C44878', alta: '#E89B4C', media: '#FF78B0', baixa: '#7FB68C',
}
const PRIO_LABEL: Record<string, string> = {
  urgente: 'Urgente', alta: 'Alta', media: 'Média', baixa: 'Baixa',
}

function TaskRow({ task, onToggle, onToggleMicro }: {
  task: Tarefa
  onToggle: (id: string, current: Tarefa['status']) => void
  onToggleMicro: (taskId: string, microId: string, done: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const micro = task.microetapas || []
  const done = micro.filter(m => m.concluida).length
  const next = micro.find(m => !m.concluida)
  const cor = PRIO_COLOR[task.prioridade]
  const concluida = task.status === 'concluida'

  return (
    <div className="bg-white rounded-[15px] border border-[var(--border)] overflow-hidden">
      <div className="flex items-start gap-3 p-3.5">
        {/* Círculo de status */}
        <button
          onClick={() => onToggle(task.id, task.status)}
          className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
          style={{
            borderColor: cor,
            background: concluida ? cor : 'transparent',
          }}
        >
          {concluida && <Check size={11} color="white" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-medium leading-snug ${concluida ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
              {task.titulo}
            </p>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {micro.length > 0 && (
                <span className="text-[10px] text-[var(--text-muted)]">{done}/{micro.length}</span>
              )}
              {micro.length > 0 && (
                <button onClick={() => setOpen(!open)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              )}
            </div>
          </div>

          {/* Barra de progresso */}
          {micro.length > 0 && (
            <div className="mt-2 h-1 rounded-full bg-[var(--gray-light)] overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${(done / micro.length) * 100}%`, background: cor }} />
            </div>
          )}

          {/* Próxima ação (colapsado) */}
          {!open && next && !concluida && (
            <div className="mt-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px]" style={{ background: 'var(--pink-tint)', border: '1px solid var(--pink-soft)' }}>
              <ChevronRight size={10} style={{ color: 'var(--pink-deep)', flexShrink: 0 }} />
              <span className="text-[11px] font-medium" style={{ color: 'var(--pink-deep)' }}>Próxima:</span>
              <span className="text-[11px] text-[var(--text-primary)]">{next.descricao}</span>
              {next.tempo_estimado && <span className="text-[10px] text-[var(--text-muted)] ml-auto">~{next.tempo_estimado}min</span>}
            </div>
          )}

          {/* Microetapas (aberto) */}
          {open && (
            <div className="mt-2 space-y-1.5">
              {micro.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onToggleMicro(task.id, m.id, m.concluida)}
                  className="flex items-center gap-2.5 w-full text-left p-2 rounded-[10px] hover:bg-[var(--offwhite)] transition-colors"
                >
                  <div className="w-4 h-4 rounded-[4px] border-[1.5px] flex items-center justify-center flex-shrink-0" style={{ borderColor: m.concluida ? cor : 'var(--gray)', background: m.concluida ? cor : 'transparent' }}>
                    {m.concluida && <Check size={9} color="white" strokeWidth={3} />}
                  </div>
                  <span className={`text-xs flex-1 ${m.concluida ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>{m.descricao}</span>
                  {m.tempo_estimado && <span className="text-[10px] text-[var(--text-muted)]">{m.tempo_estimado}min</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PRIORIDADES: Tarefa['prioridade'][] = ['urgente', 'alta', 'media', 'baixa']

export default function TarefasPage() {
  const { energyMode } = useLorennStore()
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'ativas' | 'concluidas' | 'todas'>('ativas')
  const [filterPrio, setFilterPrio] = useState<string>('todas')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ titulo: '', prioridade: 'media' as Tarefa['prioridade'], microetapas: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadTarefas()
  }, [])

  async function loadTarefas() {
    setLoading(true)
    const { data: tasks } = await supabase
      .from('tarefas')
      .select('id, titulo, status, prioridade, categoria, energia')
      .order('created_at', { ascending: false })

    if (!tasks) { setLoading(false); return }

    // Busca microetapas
    const ids = tasks.map(t => t.id)
    const { data: micros } = ids.length > 0
      ? await supabase.from('microetapas').select('id, tarefa_id, descricao, concluida, tempo_estimado, ordem').in('tarefa_id', ids).order('ordem')
      : { data: [] }

    const withMicro: Tarefa[] = tasks.map(t => ({
      ...t,
      microetapas: (micros || []).filter(m => m.tarefa_id === t.id),
    }))

    setTarefas(withMicro)
    setLoading(false)
  }

  async function createTask() {
    if (!form.titulo.trim()) return
    setSaving(true)
    const { data: task } = await supabase
      .from('tarefas')
      .insert({ titulo: form.titulo, status: 'pendente', prioridade: form.prioridade, categoria: 'pessoal', energia: [energyMode] })
      .select()
      .single()

    if (task && form.microetapas.trim()) {
      const steps = form.microetapas.split('\n').filter(Boolean).map((d, i) => ({ tarefa_id: task.id, descricao: d.trim(), ordem: i + 1 }))
      await supabase.from('microetapas').insert(steps)
    }

    toast.success('Tarefa criada!')
    setForm({ titulo: '', prioridade: 'media', microetapas: '' })
    setShowForm(false)
    setSaving(false)
    loadTarefas()
  }

  async function toggleTask(id: string, current: Tarefa['status']) {
    const next = current === 'concluida' ? 'pendente' : 'concluida'
    await supabase.from('tarefas').update({ status: next }).eq('id', id)
    setTarefas(prev => prev.map(t => t.id === id ? { ...t, status: next } : t))
  }

  async function toggleMicro(taskId: string, microId: string, done: boolean) {
    await supabase.from('microetapas').update({ concluida: !done }).eq('id', microId)
    setTarefas(prev => prev.map(t => t.id === taskId
      ? { ...t, microetapas: (t.microetapas || []).map(m => m.id === microId ? { ...m, concluida: !done } : m) }
      : t
    ))
  }

  const filtered = tarefas.filter(t => {
    const matchStatus = filterStatus === 'ativas' ? t.status !== 'concluida' : filterStatus === 'concluidas' ? t.status === 'concluida' : true
    const matchPrio = filterPrio === 'todas' || t.prioridade === filterPrio
    return matchStatus && matchPrio
  })

  const ativas = tarefas.filter(t => t.status !== 'concluida').length
  const concluidas = tarefas.filter(t => t.status === 'concluida').length

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-syne)' }}>Tarefas</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {loading ? 'Carregando…' : `${ativas} ativas · ${concluidas} concluídas`}
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} /> Nova tarefa
        </Button>
      </div>

      {/* Formulário nova tarefa */}
      {showForm && (
        <div className="rounded-[15px] p-4 space-y-3 border" style={{ background: 'var(--pink-tint)', borderColor: 'var(--pink-soft)' }}>
          <input
            autoFocus
            value={form.titulo}
            onChange={e => setForm({ ...form, titulo: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && createTask()}
            placeholder="O que precisa ser feito?"
            className="w-full text-sm bg-white border border-[var(--border)] rounded-[12px] px-3 py-2.5 outline-none focus:border-[var(--pink)]"
          />
          <textarea
            value={form.microetapas}
            onChange={e => setForm({ ...form, microetapas: e.target.value })}
            placeholder="Microetapas (uma por linha — opcional)"
            rows={3}
            className="w-full text-sm bg-white border border-[var(--border)] rounded-[12px] px-3 py-2.5 outline-none focus:border-[var(--pink)] resize-none"
          />
          <div className="flex items-center justify-between">
            <select
              value={form.prioridade}
              onChange={e => setForm({ ...form, prioridade: e.target.value as Tarefa['prioridade'] })}
              className="text-sm bg-white border border-[var(--border)] rounded-[12px] px-3 py-2 outline-none"
            >
              <option value="urgente">🔴 Urgente</option>
              <option value="alta">🟡 Alta</option>
              <option value="media">🩷 Média</option>
              <option value="baixa">🟢 Baixa</option>
            </select>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button variant="primary" size="sm" onClick={createTask} disabled={saving || !form.titulo.trim()}>
                {saving ? 'Salvando…' : 'Criar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-1.5 flex-wrap">
        {(['ativas', 'concluidas', 'todas'] as const).map(s => (
          <button key={s}
            onClick={() => setFilterStatus(s)}
            className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
            style={filterStatus === s
              ? { background: 'var(--pink)', color: 'white', borderColor: 'var(--pink)' }
              : { background: 'var(--offwhite)', color: 'var(--text-muted)', borderColor: 'var(--gray-light)' }}
          >
            {s === 'ativas' ? 'Ativas' : s === 'concluidas' ? 'Concluídas' : 'Todas'}
          </button>
        ))}
        <button
          onClick={() => setFilterPrio('todas')}
          className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
          style={filterPrio === 'todas'
            ? { background: 'var(--ink)', color: 'white', borderColor: 'var(--ink)' }
            : { background: 'var(--offwhite)', color: 'var(--text-muted)', borderColor: 'var(--gray-light)' }}
        >
          Todas prioridades
        </button>
        {PRIORIDADES.map(p => (
          <button key={p}
            onClick={() => setFilterPrio(filterPrio === p ? 'todas' : p)}
            className="text-xs px-3 py-1.5 rounded-full border font-medium transition-all"
            style={filterPrio === p
              ? { background: PRIO_COLOR[p], color: 'white', borderColor: PRIO_COLOR[p] }
              : { background: 'var(--offwhite)', color: 'var(--text-muted)', borderColor: 'var(--gray-light)' }}
          >
            {PRIO_LABEL[p]}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-[var(--text-muted)] text-sm">Carregando tarefas…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl mb-2">✨</p>
          <p className="text-sm text-[var(--text-muted)]">
            {filterStatus === 'ativas' ? 'Nenhuma tarefa ativa. Que paz!' : 'Nenhuma tarefa aqui.'}
          </p>
          {filterStatus === 'ativas' && (
            <button onClick={() => setShowForm(true)} className="mt-3 text-xs font-semibold" style={{ color: 'var(--pink-deep)' }}>
              + Criar primeira tarefa
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {PRIORIDADES.map(prio => {
            const group = filtered.filter(t => t.prioridade === prio && t.status !== 'concluida')
            if (group.length === 0) return null
            return (
              <div key={prio}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: PRIO_COLOR[prio] }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: PRIO_COLOR[prio] }} />
                  {PRIO_LABEL[prio]} ({group.length})
                </p>
                <div className="space-y-2">
                  {group.map(t => <TaskRow key={t.id} task={t} onToggle={toggleTask} onToggleMicro={toggleMicro} />)}
                </div>
              </div>
            )
          })}
          {/* Concluídas */}
          {filtered.filter(t => t.status === 'concluida').length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2 text-[var(--text-muted)] flex items-center gap-1.5">
                <Check size={10} />
                Concluídas ({filtered.filter(t => t.status === 'concluida').length})
              </p>
              <div className="space-y-2">
                {filtered.filter(t => t.status === 'concluida').map(t => <TaskRow key={t.id} task={t} onToggle={toggleTask} onToggleMicro={toggleMicro} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
