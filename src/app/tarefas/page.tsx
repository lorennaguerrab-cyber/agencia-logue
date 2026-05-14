'use client'

import { useState } from 'react'
import { useLorennStore } from '@/lib/store'
import { Task, TaskCategory } from '@/lib/types'
import { ENERGY_CONFIGS } from '@/lib/energy'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TaskCard } from '@/components/dashboard/TaskCard'
import { Plus, Zap, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

const DEMO_TASKS: Task[] = [
  {
    id: 't1',
    titulo: 'Criar roteiro do reel sobre branding',
    descricao: 'Reel de 60s sobre como uma boa identidade visual transforma negócios',
    status: 'pendente',
    prioridade: 'alta',
    energia_necessaria: ['criativa'],
    microetapas: [
      { id: 'ms1', task_id: 't1', ordem: 1, descricao: 'Definir gancho principal', concluida: true, tempo_estimado: 5 },
      { id: 'ms2', task_id: 't1', ordem: 2, descricao: 'Escrever script de 60s', concluida: false, tempo_estimado: 15 },
      { id: 'ms3', task_id: 't1', ordem: 3, descricao: 'Revisar e ajustar ritmo', concluida: false, tempo_estimado: 10 },
    ],
    categoria: 'conteudo',
    recorrente: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 't2',
    titulo: 'Entregar posts semana Pratique Academia',
    status: 'em_progresso',
    prioridade: 'urgente',
    energia_necessaria: ['operacional'],
    microetapas: [
      { id: 'ms4', task_id: 't2', ordem: 1, descricao: 'Criar 3 artes no Canva', concluida: true, tempo_estimado: 20 },
      { id: 'ms5', task_id: 't2', ordem: 2, descricao: 'Escrever 3 legendas', concluida: false, tempo_estimado: 15 },
      { id: 'ms6', task_id: 't2', ordem: 3, descricao: 'Agendar no Meta Business Suite', concluida: false, tempo_estimado: 10 },
    ],
    categoria: 'cliente',
    cliente_id: '1',
    recorrente: true,
    recorrencia: 'semanal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 't3',
    titulo: 'Escrever newsletter semanal',
    status: 'pendente',
    prioridade: 'alta',
    energia_necessaria: ['criativa', 'foco'],
    microetapas: [
      { id: 'ms7', task_id: 't3', ordem: 1, descricao: 'Definir tema da semana', concluida: false, tempo_estimado: 5 },
      { id: 'ms8', task_id: 't3', ordem: 2, descricao: 'Escrever rascunho com IA', concluida: false, tempo_estimado: 20 },
      { id: 'ms9', task_id: 't3', ordem: 3, descricao: 'Revisar e personalizar', concluida: false, tempo_estimado: 15 },
      { id: 'ms10', task_id: 't3', ordem: 4, descricao: 'Programar envio no Mailchimp', concluida: false, tempo_estimado: 5 },
    ],
    categoria: 'conteudo',
    recorrente: true,
    recorrencia: 'semanal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 't4',
    titulo: 'Responder e-mails pendentes',
    status: 'pendente',
    prioridade: 'media',
    energia_necessaria: ['operacional', 'social', 'cansada'],
    microetapas: [],
    categoria: 'administrativo',
    recorrente: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 't5',
    titulo: 'Escrever post para o blog Papel da Lola',
    status: 'pendente',
    prioridade: 'media',
    energia_necessaria: ['criativa', 'foco'],
    microetapas: [
      { id: 'ms11', task_id: 't5', ordem: 1, descricao: 'Escolher tema com alto potencial SEO', concluida: false, tempo_estimado: 10 },
      { id: 'ms12', task_id: 't5', ordem: 2, descricao: 'Estruturar o artigo', concluida: false, tempo_estimado: 10 },
      { id: 'ms13', task_id: 't5', ordem: 3, descricao: 'Escrever com apoio de IA', concluida: false, tempo_estimado: 30 },
      { id: 'ms14', task_id: 't5', ordem: 4, descricao: 'Otimizar SEO e publicar', concluida: false, tempo_estimado: 15 },
    ],
    categoria: 'conteudo',
    recorrente: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const FILTER_ENERGY_OPTIONS = [
  { value: 'todas', label: 'Todas energias' },
  ...Object.values(ENERGY_CONFIGS).map((e) => ({ value: e.id, label: `${e.emoji} ${e.label}` })),
]

export default function TarefasPage() {
  const { tasks: storeTasks, addTask, energyMode } = useLorennStore()
  const [filterStatus, setFilterStatus] = useState<string>('ativas')
  const [filterEnergy, setFilterEnergy] = useState<string>('todas')
  const [showForm, setShowForm] = useState(false)
  const [newTask, setNewTask] = useState({ titulo: '', prioridade: 'media' as Task['prioridade'] })

  const allTasks = storeTasks.length > 0 ? [...storeTasks, ...DEMO_TASKS] : DEMO_TASKS

  const filtered = allTasks.filter((t) => {
    const matchStatus =
      filterStatus === 'ativas'
        ? t.status !== 'concluida'
        : filterStatus === 'concluidas'
        ? t.status === 'concluida'
        : true
    const matchEnergy =
      filterEnergy === 'todas' || t.energia_necessaria.includes(filterEnergy as any)
    return matchStatus && matchEnergy
  })

  function handleCreateTask() {
    if (!newTask.titulo.trim()) return
    addTask({
      id: crypto.randomUUID(),
      titulo: newTask.titulo,
      status: 'pendente',
      prioridade: newTask.prioridade,
      energia_necessaria: [energyMode],
      microetapas: [],
      categoria: 'pessoal',
      recorrente: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    toast.success('Tarefa criada!')
    setNewTask({ titulo: '', prioridade: 'media' })
    setShowForm(false)
  }

  const byPriority = {
    urgente: filtered.filter((t) => t.prioridade === 'urgente' && t.status !== 'concluida'),
    alta: filtered.filter((t) => t.prioridade === 'alta' && t.status !== 'concluida'),
    media: filtered.filter((t) => t.prioridade === 'media' && t.status !== 'concluida'),
    baixa: filtered.filter((t) => t.prioridade === 'baixa' && t.status !== 'concluida'),
    concluidas: filtered.filter((t) => t.status === 'concluida'),
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Tarefas</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {filtered.filter((t) => t.status !== 'concluida').length} ativas · {filtered.filter((t) => t.status === 'concluida').length} concluídas
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={15} />
            Nova tarefa
          </Button>
        </div>

        {/* New task quick form */}
        {showForm && (
          <Card variant="accent">
            <CardBody className="pt-4 space-y-3">
              <input
                autoFocus
                value={newTask.titulo}
                onChange={(e) => setNewTask({ ...newTask, titulo: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
                placeholder="O que precisa ser feito?"
                className="w-full text-sm text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-2.5"
              />
              <div className="flex gap-2 items-center justify-between">
                <select
                  value={newTask.prioridade}
                  onChange={(e) => setNewTask({ ...newTask, prioridade: e.target.value as any })}
                  className="text-sm text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-3 py-2"
                >
                  <option value="urgente">🔴 Urgente</option>
                  <option value="alta">🟡 Alta</option>
                  <option value="media">🟣 Média</option>
                  <option value="baixa">🟢 Baixa</option>
                </select>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
                  <Button variant="primary" size="sm" onClick={handleCreateTask}>Criar</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {['ativas', 'concluidas', 'todas'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                filterStatus === s
                  ? 'bg-[var(--accent-soft)] border-[var(--border-accent)] text-[var(--text-accent)]'
                  : 'bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {s === 'ativas' ? 'Ativas' : s === 'concluidas' ? 'Concluídas' : 'Todas'}
            </button>
          ))}
          <select
            value={filterEnergy}
            onChange={(e) => setFilterEnergy(e.target.value)}
            className="text-xs text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg px-3 py-1.5"
          >
            {FILTER_ENERGY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Tasks by priority */}
        <div className="space-y-6">
          {byPriority.urgente.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 pulse-dot" />
                Urgente ({byPriority.urgente.length})
              </p>
              <div className="space-y-2">{byPriority.urgente.map((t) => <TaskCard key={t.id} task={t} />)}</div>
            </div>
          )}
          {byPriority.alta.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Alta prioridade ({byPriority.alta.length})
              </p>
              <div className="space-y-2">{byPriority.alta.map((t) => <TaskCard key={t.id} task={t} />)}</div>
            </div>
          )}
          {byPriority.media.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Média ({byPriority.media.length})
              </p>
              <div className="space-y-2">{byPriority.media.map((t) => <TaskCard key={t.id} task={t} />)}</div>
            </div>
          )}
          {byPriority.baixa.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Baixa ({byPriority.baixa.length})
              </p>
              <div className="space-y-2">{byPriority.baixa.map((t) => <TaskCard key={t.id} task={t} />)}</div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
