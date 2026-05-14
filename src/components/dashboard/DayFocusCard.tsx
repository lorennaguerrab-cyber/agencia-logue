'use client'

import { useLorennStore } from '@/lib/store'
import { ENERGY_CONFIGS } from '@/lib/energy'

export function DayFocusCard() {
  const { energyMode } = useLorennStore()
  const e = ENERGY_CONFIGS[energyMode]

  const now = new Date()
  const weekday = now.toLocaleDateString('pt-BR', { weekday: 'long' })
  const day = now.getDate()
  const month = now.toLocaleDateString('pt-BR', { month: 'long' })
  const h = now.getHours()
  const greet = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div
      className="rounded-[15px] border relative overflow-hidden"
      style={{ background: 'var(--pink-tint)', borderColor: 'var(--pink-soft)' }}
    >
      {/* Flor decorativa */}
      <svg width="160" height="160" viewBox="0 0 180 180" style={{ position: 'absolute', right: -16, top: -24, opacity: 0.25, pointerEvents: 'none' }}>
        <g stroke="var(--pink)" strokeWidth="1.3" fill="none" strokeLinecap="round">
          <path d="M90 30c-10 12-10 26 0 38s10 24 0 36"/>
          <path d="M60 60c12 10 26 10 38 0s24-10 36 0"/>
          <ellipse cx="90" cy="70" rx="12" ry="22" transform="rotate(0 90 70)"/>
          <ellipse cx="90" cy="70" rx="12" ry="22" transform="rotate(60 90 70)"/>
          <ellipse cx="90" cy="70" rx="12" ry="22" transform="rotate(120 90 70)"/>
          <circle cx="90" cy="70" r="5" fill="var(--pink)" stroke="none"/>
        </g>
      </svg>

      <div className="relative p-7">
        {/* Eyebrow */}
        <p className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)] mb-2">
          {weekday.charAt(0).toUpperCase() + weekday.slice(1)} · {day} de {month}
        </p>

        {/* Título */}
        <h1
          className="text-[30px] font-semibold leading-[1.05] text-[var(--text-primary)] mb-2"
          style={{ fontFamily: 'var(--font-syne)', letterSpacing: '-0.03em' }}
        >
          {greet}, Lorenna.
        </h1>

        {/* Subtítulo */}
        <p className="text-[14.5px] text-[var(--text-secondary)] mb-6" style={{ maxWidth: 480 }}>
          Hoje sua energia está{' '}
          <strong style={{ color: e.accent, fontWeight: 600 }}>{e.label.toLowerCase()}</strong>
          {' '}— {e.description.toLowerCase()}
        </p>

        {/* Pills */}
        <div className="flex flex-wrap gap-3">
          {[
            { icon: e.emoji, text: e.label },
            { icon: '🌸', text: '3 prioridades pra hoje' },
            { icon: '📅', text: '2 lembretes fixos' },
          ].map((p) => (
            <div
              key={p.text}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-white text-xs font-medium text-[var(--text-secondary)]"
              style={{ borderColor: 'var(--gray-light)' }}
            >
              <span className="text-sm">{p.icon}</span>
              {p.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
