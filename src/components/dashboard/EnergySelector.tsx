'use client'

import { useLorennStore } from '@/lib/store'
import { ENERGY_CONFIGS } from '@/lib/energy'
import { EnergyMode } from '@/lib/types'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export function EnergySelector() {
  const { energyMode, setEnergyMode } = useLorennStore()
  const current = ENERGY_CONFIGS[energyMode]

  return (
    <div className="space-y-3">
      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Como você está agora?</p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {Object.values(ENERGY_CONFIGS).map((e) => {
          const active = energyMode === e.id
          return (
            <motion.button
              key={e.id}
              onClick={() => setEnergyMode(e.id as EnergyMode)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer',
                active
                  ? 'border-[var(--border-accent)] shadow-lg'
                  : 'border-[var(--border)] hover:border-[var(--border-accent)]/50 bg-[var(--bg-elevated)]'
              )}
              style={active ? {
                backgroundColor: `${e.color}99`,
                boxShadow: `0 0 20px ${e.accent}20`,
              } : {}}
              title={e.description}
            >
              <span className="text-xl leading-none">{e.emoji}</span>
              <span
                className="text-[10px] font-medium leading-tight text-center"
                style={{ color: active ? e.accent : 'var(--text-muted)' }}
              >
                {e.label}
              </span>
              {active && (
                <div
                  className="w-1 h-1 rounded-full pulse-dot"
                  style={{ backgroundColor: e.accent }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
      {current && (
        <motion.p
          key={current.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-[var(--text-secondary)]"
        >
          {current.description}
        </motion.p>
      )}
    </div>
  )
}
