'use client'

import { useState } from 'react'
import { Task, MicroStep } from '@/lib/types'
import { useLorennStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, Check, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PRIORITY_COLORS = {
  urgente: { text: '#F87171', bg: 'rgba(248,113,113,0.1)', label: 'Urgente' },
  alta: { text: '#FBBF24', bg: 'rgba(251,191,36,0.1)', label: 'Alta' },
  media: { text: '#A78BFA', bg: 'rgba(167,139,250,0.1)', label: 'Média' },
  baixa: { text: '#6EE7B7', bg: 'rgba(110,231,183,0.1)', label: 'Baixa' },
}

interface TaskCardProps {
  task: Task
  showMicrosteps?: boolean
}

export function TaskCard({ task, showMicrosteps = false }: TaskCardProps) {
  const { updateTask } = useLorennStore()
  const [expanded, setExpanded] = useState(showMicrosteps)
  const priority = PRIORITY_COLORS[task.prioridade]
  const completedSteps = task.microetapas.filter((s) => s.concluida).length
  const totalSteps = task.microetapas.length
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  function toggleStep(stepId: string) {
    const updated = task.microetapas.map((s) =>
      s.id === stepId ? { ...s, concluida: !s.concluida } : s
    )
    updateTask(task.id, { microetapas: updated })
  }

  function completeTask() {
    updateTask(task.id, {
      status: task.status === 'concluida' ? 'pendente' : 'concluida',
    })
  }

  const done = task.status === 'concluida'

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-200',
        done
          ? 'bg-[var(--bg-surface)] border-[var(--border)] opacity-50'
          : 'bg-[var(--bg-elevated)] border-[var(--border)] hover:border-[var(--border-accent)]/40'
      )}
    >
      <div className="p-3.5">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={completeTask}
            className={cn(
              'flex-shrink-0 w-5 h-5 rounded-lg border-2 flex items-center justify-center mt-0.5 transition-all duration-200',
              done
                ? 'bg-[var(--accent)] border-[var(--accent)]'
                : 'border-[var(--border)] hover:border-[var(--accent)]'
            )}
          >
            {done && <Check size={11} className="text-white" />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={cn(
                'text-sm font-medium leading-snug',
                done ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'
              )}>
                {task.titulo}
              </p>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                style={{ color: priority.text, backgroundColor: priority.bg }}
              >
                {priority.label}
              </span>
            </div>

            {/* Progress bar */}
            {totalSteps > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: progress === 100 ? '#34D399' : 'var(--accent)',
                    }}
                  />
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">
                  {completedSteps}/{totalSteps}
                </span>
              </div>
            )}
          </div>

          {/* Expand */}
          {totalSteps > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-0.5"
            >
              {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </button>
          )}
        </div>
      </div>

      {/* Microetapas */}
      <AnimatePresence>
        {expanded && totalSteps > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 pl-11 space-y-2 border-t border-[var(--border)] pt-3">
              {task.microetapas.map((step) => (
                <button
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className="flex items-start gap-2 w-full text-left group"
                >
                  <div className={cn(
                    'flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center mt-0.5 transition-all',
                    step.concluida
                      ? 'bg-emerald-500/20 border-emerald-500/50'
                      : 'border-[var(--border)] group-hover:border-[var(--accent)]'
                  )}>
                    {step.concluida && <Check size={9} className="text-emerald-400" />}
                  </div>
                  <span className={cn(
                    'text-xs leading-snug',
                    step.concluida
                      ? 'text-[var(--text-muted)] line-through'
                      : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                  )}>
                    {step.descricao}
                  </span>
                  {step.tempo_estimado && (
                    <span className="text-[10px] text-[var(--text-muted)] ml-auto flex-shrink-0">
                      ~{step.tempo_estimado}min
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function NextActionCard({ task }: { task: Task }) {
  const nextStep = task.microetapas.find((s) => !s.concluida)
  const { updateTask } = useLorennStore()

  if (!nextStep && task.microetapas.length > 0) return null

  return (
    <div className="rounded-xl p-4 border border-[var(--border-accent)] bg-[var(--accent-soft)]">
      <div className="flex items-center gap-2 mb-2">
        <Zap size={14} className="text-[var(--text-accent)]" />
        <p className="text-xs font-semibold text-[var(--text-accent)] uppercase tracking-wider">Próxima ação</p>
      </div>
      <p className="text-sm text-[var(--text-primary)] font-medium mb-1">{task.titulo}</p>
      {nextStep && (
        <p className="text-xs text-[var(--text-secondary)]">→ {nextStep.descricao}</p>
      )}
    </div>
  )
}
