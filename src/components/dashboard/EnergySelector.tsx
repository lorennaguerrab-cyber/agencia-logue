'use client'

import { useLorennStore } from '@/lib/store'
import { ENERGY_CONFIGS } from '@/lib/energy'
import type { EnergyMode } from '@/lib/types'

export function EnergySelector() {
  const { energyMode, setEnergyMode } = useLorennStore()

  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">Sua energia agora</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">O sistema esconde o que não cabe nesse estado.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.values(ENERGY_CONFIGS).map((e) => {
          const active = energyMode === e.id
          return (
            <button
              key={e.id}
              onClick={() => setEnergyMode(e.id as EnergyMode)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-[12.5px] font-medium transition-all duration-150"
              style={{
                background: active
                  ? `color-mix(in srgb, ${e.accent} 14%, white)`
                  : 'var(--bg-surface)',
                borderColor: active ? e.accent : 'var(--gray-light)',
                color: active ? e.accent : 'var(--text-secondary)',
                fontWeight: active ? 600 : 500,
              }}
            >
              <span className="text-sm">{e.emoji}</span>
              {e.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
