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
      <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-medium">Como você está agora?</p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {Object.values(ENERGY_CONFIGS).map((e) => {
          const active = energyMode === e.id
          return (
            <motion.button
              key={e.id}
              onClick={() => setEnergyMode(e.id as EnergyMode)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer',
                active
                  ? 'shadow-[0_2px_8px_rgba(99,102,241,0.15)]'
                  : 'border-[var(--border)] bg-white hover:bg-[var(--bg-hover)] hover:border-indigo-200'
              )}
              style={active ? {
                backgroundColor: `${e.accent}10`,
                borderColor: `${e.accent}28`,
              } : {}}
              title={e.description}
            >
              <span className="text-xl leading-none">{e.emoji}</span>
              <span
                className="text-[10px] font-semibold leading-tight text-center"
                style={{ color: active ? e.accent : 'var(--text-muted)' }}
              >
                {e.label}
              </span>
              {active && (
                <div className="w-1 h-1 rounded-full pulse-dot" style={{ backgroundColor: e.accent }} />
              )}
            </motion.button>
          )
        })}
      </div>
      {current && (
        <motion.p
          key={current.id}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-[var(--text-secondary)]"
        >
          {current.description}
        </motion.p>
      )}
    </div>
  )
}
