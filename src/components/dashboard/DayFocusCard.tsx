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
  const today = formatDateFull(new Date())

  function save() {
    setDayFocus(draft)
    setEditing(false)
  }

  return (
    <div
      className="rounded-2xl p-6 border relative overflow-hidden bg-white"
      style={{
        borderColor: `${energy.accent}20`,
        background: `linear-gradient(135deg, ${energy.accent}08 0%, #FFFFFF 55%)`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-[0.07]"
        style={{ backgroundColor: energy.accent }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">{today}</p>
          <span
            className="text-[11px] px-2.5 py-1 rounded-full font-semibold border"
            style={{ backgroundColor: `${energy.accent}10`, borderColor: `${energy.accent}20`, color: energy.accent }}
          >
            {energy.emoji} {energy.label}
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mt-2">
          {getGreeting()}, Lorenna
        </h1>

        <div className="mt-5">
          <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-medium mb-2">Foco do dia</p>
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && save()}
                placeholder="Qual é o foco de hoje?"
                className="flex-1 text-base font-semibold text-[var(--text-primary)] bg-white border border-indigo-200 rounded-xl px-3 py-2 shadow-[0_0_0_3px_rgba(99,102,241,0.08)] focus:outline-none"
              />
              <button
                onClick={save}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: `${energy.accent}12`, color: energy.accent }}
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
                <p className="text-xl font-semibold text-[var(--text-primary)]">{dayFocus}</p>
              ) : (
                <p className="text-base text-[var(--text-muted)] italic">Clique para definir seu foco...</p>
              )}
              <Pencil size={13} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {energy.suggestedActions.slice(0, 3).map((action) => (
            <span
              key={action}
              className="text-xs px-2.5 py-1 rounded-lg border font-medium"
              style={{
                backgroundColor: `${energy.accent}08`,
                borderColor: `${energy.accent}18`,
                color: energy.accent,
              }}
            >
              {action}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
