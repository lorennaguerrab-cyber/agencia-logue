'use client'

import { useState } from 'react'
import { Task } from '@/lib/types'
import { useLorennStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, Check, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PRIORITY = {
  urgente: { color: '#C44878', label: 'Urgente' },
  alta:    { color: '#E89B4C', label: 'Alta'    },
  media:   { color: '#FF78B0', label: 'Média'   },
  baixa:   { color: '#7FB68C', label: 'Baixa'   },
}

function PriorityDot({ prioridade, size = 10 }: { prioridade: Task['prioridade']; size?: number }) {
  const { color } = PRIORITY[prioridade]
  return (
    <div
      className="rounded-full flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: color }}
    />
  )
}

interface TaskCardProps {
  task: Task
  showMicrosteps?: boolean
}

export function TaskCard({ task, showMicrosteps = false }: TaskCardProps) {
  const { updateTask } = useLorennStore()
  const [expanded, setExpanded] = useState(showMicrosteps)
  const p = PRIORITY[task.prioridade]
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
        'rounded-[12px] border bg-[var(--bg-surface)] transition-all duration-150',
        done ? 'opacity-50' : 'hover:bg-[var(--bg-elevated)]',
      )}
      style={{ borderColor: 'var(--gray-light)' }}
    >
      <div className="p-3.5">
        <div className="flex items-start gap-3">

          {/* Circular priority indicator + check */}
          <button
            onClick={completeTask}
            className="flex-shrink-0 mt-0.5 relative group"
            title={done ? 'Marcar pendente' : 'Marcar concluída'}
          >
            <div
              className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
              style={{
                borderColor: done ? p.color : p.color,
                background: done ? p.color : 'transparent',
              }}
            >
              {done
                ? <Check size={10} className="text-white" />
                : <div className="w-2 h-2 rounded-full opacity-40 group-hover:opacity-80 transition-opacity" style={{ backgroundColor: p.color }} />
              }
            </div>
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={cn(
                'text-[13px] font-medium leading-snug flex-1',
                done ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'
              )}>
                {task.titulo}
              </p>
              <span
                className="text-[10.5px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                style={{
                  color: p.color,
                  background: `color-mix(in srgb, ${p.color} 12%, white)`,
                }}
              >
                {p.label}
              </span>
            </div>

            {totalSteps > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-[var(--bg-base)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: progress === 100 ? '#7FB68C' : p.color }}
                  />
                </div>
                <span className="text-[10px] text-[var(--text-muted)] font-medium flex-shrink-0">{completedSteps}/{totalSteps}</span>
              </div>
            )}
          </div>

          {totalSteps > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-0.5 flex-shrink-0"
            >
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
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
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 pl-11 space-y-2 pt-3" style={{ borderTop: '1px solid var(--gray-light)' }}>
              {task.microetapas.map((step) => (
                <button
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className="flex items-start gap-2 w-full text-left group"
                >
                  <div className={cn(
                    'flex-shrink-0 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all',
                    step.concluida ? '' : 'group-hover:opacity-70'
                  )} style={{
                    borderColor: step.concluida ? '#7FB68C' : 'var(--gray-light)',
                    background: step.concluida ? '#7FB68C' : 'transparent',
                  }}>
                    {step.concluida && <Check size={8} className="text-white" />}
                  </div>
                  <span className={cn(
                    'text-[12px] leading-snug flex-1',
                    step.concluida
                      ? 'text-[var(--text-muted)] line-through'
                      : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                  )}>
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
  const p = PRIORITY[task.prioridade]

  return (
    <div
      className="rounded-[12px] p-4 border"
      style={{
        background: `color-mix(in srgb, ${p.color} 7%, white)`,
        borderColor: `color-mix(in srgb, ${p.color} 20%, white)`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Zap size={13} style={{ color: p.color }} />
        <p className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: p.color }}>Próxima ação</p>
      </div>
      <p className="text-[13.5px] font-semibold text-[var(--text-primary)] mb-1">{task.titulo}</p>
      {nextStep && (
        <p className="text-[12px] text-[var(--text-secondary)]">→ {nextStep.descricao}</p>
      )}
    </div>
  )
}
