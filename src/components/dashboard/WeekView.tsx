'use client'

import { cn } from '@/lib/utils'

const WEEK_STRUCTURE = [
  {
    day: 'Seg',
    focus: 'Burocracia + Blog',
    color: '#818CF8',
    items: ['Contratos', 'Organização', 'Blog', 'Planejamento'],
  },
  {
    day: 'Ter',
    focus: 'Clientes',
    color: '#60A5FA',
    items: ['Gravações externas', 'Entregas clientes'],
  },
  {
    day: 'Qua',
    focus: 'Conteúdo Pessoal',
    color: '#A78BFA',
    items: ['Reels', 'Posicionamento', 'Marca pessoal', '⚽ 8h20'],
  },
  {
    day: 'Qui',
    focus: 'Newsletter + Clientes',
    color: '#34D399',
    items: ['Gravações externas', 'Newsletter'],
  },
  {
    day: 'Sex',
    focus: 'YouTube + Criativo',
    color: '#F87171',
    items: ['Vídeos longos', 'Reels', 'Conteúdo autoral', '⚽ 8h20'],
  },
  {
    day: 'Sáb',
    focus: 'Leveza',
    color: '#F9A8D4',
    items: ['Maternidade', 'Lifestyle'],
  },
  {
    day: 'Dom',
    focus: 'Descanso',
    color: '#FCD34D',
    items: ['Rotina leve', 'Bastidores'],
  },
]

export function WeekView() {
  const today = new Date().getDay()
  const dayIndex = today === 0 ? 6 : today - 1

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Estrutura da semana</p>
      <div className="grid grid-cols-7 gap-1.5">
        {WEEK_STRUCTURE.map((day, i) => {
          const isToday = i === dayIndex
          return (
            <div
              key={day.day}
              className={cn(
                'rounded-xl p-2 border transition-all duration-200 text-center',
                isToday
                  ? 'border-[var(--border-accent)] bg-[var(--accent-soft)]'
                  : 'border-[var(--border)] bg-[var(--bg-elevated)]'
              )}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-wide mb-1"
                style={{ color: isToday ? day.color : 'var(--text-muted)' }}
              >
                {day.day}
              </p>
              <p className="text-[9px] text-[var(--text-muted)] leading-tight">{day.focus}</p>
              {isToday && (
                <div
                  className="mt-1.5 w-1.5 h-1.5 rounded-full mx-auto pulse-dot"
                  style={{ backgroundColor: day.color }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
