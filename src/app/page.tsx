'use client'

import { useLorennStore } from '@/lib/store'
import { ENERGY_CONFIGS } from '@/lib/energy'
import { EnergySelector } from '@/components/dashboard/EnergySelector'
import { DayFocusCard } from '@/components/dashboard/DayFocusCard'
import { WeekView } from '@/components/dashboard/WeekView'
import { TaskCard, NextActionCard } from '@/components/dashboard/TaskCard'
import { ClientsWidget } from '@/components/dashboard/ClientsWidget'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Zap, Lightbulb, ArrowRight, Bell } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const DEMO_TASKS = [
  {
    id: '1',
    titulo: 'Criar roteiro do reel sobre branding',
    status: 'pendente' as const,
    prioridade: 'alta' as const,
    energia_necessaria: ['criativa' as const],
    microetapas: [
      { id: 'ms1', task_id: '1', ordem: 1, descricao: 'Definir gancho principal', concluida: true, tempo_estimado: 5 },
      { id: 'ms2', task_id: '1', ordem: 2, descricao: 'Escrever script de 30s', concluida: false, tempo_estimado: 15 },
      { id: 'ms3', task_id: '1', ordem: 3, descricao: 'Revisar e ajustar ritmo', concluida: false, tempo_estimado: 10 },
    ],
    categoria: 'conteudo' as const,
    recorrente: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    titulo: 'Entregar posts semana Pratique Academia',
    status: 'em_progresso' as const,
    prioridade: 'urgente' as const,
    energia_necessaria: ['operacional' as const],
    microetapas: [
      { id: 'ms4', task_id: '2', ordem: 1, descricao: 'Criar artes no Canva', concluida: true, tempo_estimado: 20 },
      { id: 'ms5', task_id: '2', ordem: 2, descricao: 'Escrever legendas', concluida: false, tempo_estimado: 15 },
      { id: 'ms6', task_id: '2', ordem: 3, descricao: 'Agendar no Meta', concluida: false, tempo_estimado: 10 },
    ],
    categoria: 'cliente' as const,
    cliente_id: '1',
    recorrente: true,
    recorrencia: 'semanal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    titulo: 'Responder e-mails pendentes',
    status: 'pendente' as const,
    prioridade: 'media' as const,
    energia_necessaria: ['operacional' as const, 'social' as const, 'cansada' as const],
    microetapas: [],
    categoria: 'administrativo' as const,
    recorrente: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const DEMO_IDEAS = [
  { id: 'i1', titulo: '"Domingo é o único dia em que tenho 47 ideias criativas e zero energia pra executar"', categoria: 'bastidores', created_at: new Date().toISOString() },
  { id: 'i2', titulo: 'Série: Mulheres que viraram marca — episódio 1', categoria: 'mulheres_incriveis', created_at: new Date().toISOString() },
  { id: 'i3', titulo: 'Análise de marca: Por que a Duolingo domina o TikTok', categoria: 'analise_marcas', created_at: new Date().toISOString() },
]

const RECURRENCES = [
  { texto: '📚 Tarefas escolares do Davi', hora: 'Antes das 10h30', cor: '#F9A8D4' },
  { texto: '⚽ Futebol', hora: 'Qua e Sex às 8h20', cor: '#6EE7B7' },
]

export default function Dashboard() {
  const { energyMode, tasks: storeTasks, setCaptureOpen } = useLorennStore()
  const energy = ENERGY_CONFIGS[energyMode]

  const allTasks = storeTasks.length > 0 ? storeTasks : DEMO_TASKS
  const visibleTasks = energy.showHeavyTasks
    ? allTasks.filter((t) => t.status !== 'concluida')
    : allTasks.filter(
        (t) =>
          t.status !== 'concluida' &&
          (t.microetapas.length === 0 || t.microetapas.length <= 2) &&
          t.prioridade !== 'baixa'
      )

  const nextTask = allTasks.find(
    (t) => t.status !== 'concluida' && t.microetapas.some((s) => !s.concluida)
  )

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.07 } },
  }
  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Day Focus */}
        <motion.div variants={item}>
          <DayFocusCard />
        </motion.div>

        {/* Energy Selector */}
        <motion.div variants={item}>
          <Card>
            <CardBody className="pt-5">
              <EnergySelector />
            </CardBody>
          </Card>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks column */}
          <motion.div variants={item} className="lg:col-span-2 space-y-4">
            {/* Next action */}
            {nextTask && !energy.showHeavyTasks && (
              <NextActionCard task={nextTask} />
            )}

            {/* Tasks */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-[var(--text-primary)]">Tarefas</h2>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      {energy.showHeavyTasks
                        ? `${visibleTasks.length} para hoje`
                        : `${visibleTasks.length} tarefa(s) leve(s) — modo ${energy.label}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCaptureOpen(true)}
                  >
                    <Plus size={14} />
                    Nova
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0 space-y-2">
                {visibleTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[var(--text-muted)] text-sm">
                      {energy.showHeavyTasks
                        ? 'Nenhuma tarefa pendente. 🎉'
                        : 'Nenhuma tarefa leve para este modo. Descanse ou capture uma ideia.'}
                    </p>
                  </div>
                ) : (
                  visibleTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                )}
                <Link href="/tarefas" className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-accent)] transition-colors pt-2">
                  Ver todas as tarefas <ArrowRight size={11} />
                </Link>
              </CardBody>
            </Card>

            {/* Week view */}
            <motion.div variants={item}>
              <Card>
                <CardBody className="pt-5">
                  <WeekView />
                </CardBody>
              </Card>
            </motion.div>
          </motion.div>

          {/* Right column */}
          <motion.div variants={item} className="space-y-4">
            {/* Clients */}
            <Card>
              <CardBody className="pt-5">
                <ClientsWidget />
              </CardBody>
            </Card>

            {/* Recent ideas */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">Ideias recentes</h2>
                  <Link href="/ideias" className="text-[10px] text-[var(--text-accent)] hover:underline flex items-center gap-1">
                    Ver todas <ArrowRight size={10} />
                  </Link>
                </div>
              </CardHeader>
              <CardBody className="pt-0 space-y-2">
                {DEMO_IDEAS.map((idea) => (
                  <Link
                    key={idea.id}
                    href="/ideias"
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-accent)]/40 transition-all group"
                  >
                    <Lightbulb size={13} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors leading-snug">
                      {idea.titulo}
                    </p>
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-1"
                  onClick={() => setCaptureOpen(true)}
                >
                  <Plus size={13} />
                  Capturar ideia
                </Button>
              </CardBody>
            </Card>

            {/* Recorrências */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell size={14} className="text-[var(--text-muted)]" />
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">Lembretes fixos</h2>
                </div>
              </CardHeader>
              <CardBody className="pt-0 space-y-2">
                {RECURRENCES.map((r) => (
                  <div
                    key={r.texto}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]"
                  >
                    <span className="text-xs text-[var(--text-primary)]">{r.texto}</span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${r.cor}20`, color: r.cor }}
                    >
                      {r.hora}
                    </span>
                  </div>
                ))}
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
