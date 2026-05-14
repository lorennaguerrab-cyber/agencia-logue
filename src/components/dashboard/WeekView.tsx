'use client'

import { cn } from '@/lib/utils'

const WEEK_STRUCTURE = [
  { day: 'Seg', focus: 'Burocracia + Blog', color: '#6366F1' },
  { day: 'Ter', focus: 'Clientes', color: '#3B82F6' },
  { day: 'Qua', focus: 'Conteúdo', color: '#8B5CF6' },
  { day: 'Qui', focus: 'Newsletter', color: '#10B981' },
  { day: 'Sex', focus: 'YouTube', color: '#EF4444' },
  { day: 'Sáb', focus: 'Leveza', color: '#EC4899' },
  { day: 'Dom', focus: 'Descanso', color: '#F59E0B' },
]

export function WeekView() {
  const today = new Date().getDay()
  const dayIndex = today === 0 ? 6 : today - 1

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-medium">Estrutura da semana</p>
      <div className="grid grid-cols-7 gap-1.5">
        {WEEK_STRUCTURE.map((day, i) => {
          const isToday = i === dayIndex
          return (
            <div
              key={day.day}
              className={cn(
                'rounded-xl p-2 border transition-all text-center',
                isToday
                  ? 'border-indigo-200 bg-indigo-50 shadow-[0_2px_8px_rgba(99,102,241,0.1)]'
                  : 'border-[var(--border)] bg-white'
              )}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-wide mb-0.5"
                style={{ color: isToday ? day.color : 'var(--text-muted)' }}
              >
                {day.day}
              </p>
              <p className="text-[9px] text-[var(--text-muted)] leading-tight">{day.focus}</p>
              {isToday && (
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full mx-auto pulse-dot" style={{ backgroundColor: day.color }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
