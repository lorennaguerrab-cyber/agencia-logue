'use client'

import { useState } from 'react'
import { useLorennStore } from '@/lib/store'
import { ENERGY_CONFIGS } from '@/lib/energy'
import { getGreeting, formatDateFull } from '@/lib/utils'
import { Pencil, Check } from 'lucide-react'
import { motion } from 'framer-motion'

export function DayFocusCard() {
  const { dayFocus, setDayFocus, energyMode } = useLorennStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(dayFocus)
  const energy = ENERGY_CONFIGS[energyMode]

  function save() {
    setDayFocus(draft)
    setEditing(false)
  }

  const today = formatDateFull(new Date())

  return (
    <div
      className="rounded-2xl p-6 border transition-all duration-400 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${energy.color}cc 0%, var(--bg-surface) 100%)`,
        borderColor: `${energy.accent}33`,
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ backgroundColor: energy.accent }}
      />

      <div className="relative">
        <p className="text-sm text-[var(--text-secondary)] mb-1">{today}</p>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">
          {getGreeting()}, Lorenna
        </h1>

        {/* Focus */}
        <div className="mt-4">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Foco do dia</p>
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && save()}
                placeholder="Qual é o foco de hoje?"
                className="flex-1 text-base font-medium text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border-accent)] rounded-xl px-3 py-2"
              />
              <button
                onClick={save}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: `${energy.accent}33`, color: energy.accent }}
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setEditing(true); setDraft(dayFocus) }}
              className="group flex items-center gap-2 text-left"
            >
              {dayFocus ? (
                <p className="text-lg font-medium text-[var(--text-primary)]">{dayFocus}</p>
              ) : (
                <p className="text-base text-[var(--text-muted)] italic">Clique para definir seu foco...</p>
              )}
              <Pencil size={13} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>

        {/* Suggested actions */}
        <div className="mt-4">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Sugerido para agora</p>
          <div className="flex flex-wrap gap-2">
            {energy.suggestedActions.slice(0, 3).map((action) => (
              <span
                key={action}
                className="text-xs px-2.5 py-1 rounded-lg border"
                style={{
                  backgroundColor: `${energy.accent}11`,
                  borderColor: `${energy.accent}22`,
                  color: energy.accent,
                }}
              >
                {action}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
