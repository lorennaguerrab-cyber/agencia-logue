'use client'

import { useState } from 'react'
import { Task } from '@/lib/types'
import { useLorennStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, Check, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PRIORITY_CONFIG = {
  urgente: { text: '#DC2626', bg: '#FEF2F2', border: '#FECACA', label: 'Urgente' },
  alta: { text: '#D97706', bg: '#FFFBEB', border: '#FDE68A', label: 'Alta' },
  media: { text: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE', label: 'Média' },
  baixa: { text: '#059669', bg: '#ECFDF5', border: '#A7F3D0', label: 'Baixa' },
}

interface TaskCardProps {
  task: Task
  showMicrosteps?: boolean
}

export function TaskCard({ task, showMicrosteps = false }: TaskCardProps) {
  const { updateTask } = useLorennStore()
  const [expanded, setExpanded] = useState(showMicrosteps)
  const p = PRIORITY_CONFIG[task.prioridade]
  const completedSteps = task.microetapas.filter((s) => s.concluida).length
  const totalSteps = task.microetapas.length
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0
  const done = task.status === 'concluida'

  function toggleStep(stepId: string) {
    const updated = task.microetapas.map((s) => s.id === stepId ? { ...s, concluida: !s.concluida } : s)
    updateTask(task.id, { microetapas: updated })
  }

  function completeTask() {
    updateTask(task.id, { status: done ? 'pendente' : 'concluida' })
  }

  return (
    <div
      className={cn(
        'rounded-xl border bg-white transition-all duration-200',
        'shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
        done ? 'opacity-50' : 'hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:-translate-y-px',
      )}
    >
      <div className="p-3.5">
        <div className="flex items-start gap-3">
          <button
            onClick={completeTask}
            className={cn(
              'flex-shrink-0 w-5 h-5 rounded-lg border-2 flex items-center justify-center mt-0.5 transition-all',
              done ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 hover:border-indigo-400'
            )}
          >
            {done && <Check size={11} className="text-white" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={cn('text-sm font-medium leading-snug', done ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]')}>
                {task.titulo}
              </p>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold border flex-shrink-0"
                style={{ color: p.text, backgroundColor: p.bg, borderColor: p.border }}
              >
                {p.label}
              </span>
            </div>

            {totalSteps > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: progress === 100 ? '#10B981' : '#6366F1' }}
                  />
                </div>
                <span className="text-[10px] text-[var(--text-muted)] font-medium">{completedSteps}/{totalSteps}</span>
              </div>
            )}
          </div>

          {totalSteps > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-0.5 flex-shrink-0"
            >
              {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && totalSteps > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 pl-11 space-y-2 border-t border-gray-100 pt-3">
              {task.microetapas.map((step) => (
                <button
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className="flex items-start gap-2 w-full text-left group"
                >
                  <div className={cn(
                    'flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center mt-0.5 transition-all',
                    step.concluida ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 group-hover:border-indigo-400'
                  )}>
                    {step.concluida && <Check size={9} className="text-white" />}
                  </div>
                  <span className={cn('text-xs leading-snug flex-1', step.concluida ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]')}>
                    {step.descricao}
                  </span>
                  {step.tempo_estimado && (
                    <span className="text-[10px] text-[var(--text-muted)] ml-auto flex-shrink-0">~{step.tempo_estimado}min</span>
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
  if (!nextStep && task.microetapas.length > 0) return null

  return (
    <div className="rounded-xl p-4 border border-indigo-100 bg-indigo-50 shadow-[0_1px_3px_rgba(99,102,241,0.08)]">
      <div className="flex items-center gap-2 mb-2">
        <Zap size={14} className="text-indigo-500" />
        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Próxima ação</p>
      </div>
      <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">{task.titulo}</p>
      {nextStep && <p className="text-xs text-[var(--text-secondary)]">→ {nextStep.descricao}</p>}
    </div>
  )
}
