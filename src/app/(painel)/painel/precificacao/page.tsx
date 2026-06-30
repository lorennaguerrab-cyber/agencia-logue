'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTopbar } from '@/lib/topbar-context'
import { plans, oneOffs, fmt } from '@/lib/db'
import { Check, FileText, Calculator } from 'lucide-react'

export default function PrecificacaoPage() {
  const { setConfig } = useTopbar()
  const router = useRouter()

  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [duration, setDuration] = useState<4 | 6 | 12>(6)
  const [leadName, setLeadName] = useState('')

  useEffect(() => {
    setConfig({
      title: 'Precificação',
      subtitle: 'Monte a proposta com a tabela real',
    })
  }, [setConfig])

  function toggle(id: string) {
    // Plans are mutually exclusive
    const isPlan = plans.some(p => p.id === id)
    if (isPlan) {
      setSelected(prev => {
        const next: Record<string, boolean> = { ...prev }
        // Deselect all plans first
        plans.forEach(p => { next[p.id] = false })
        next[id] = !prev[id]
        return next
      })
    } else {
      setSelected(prev => ({ ...prev, [id]: !prev[id] }))
    }
  }

  const activeOneOffs = oneOffs.filter(s => s.min != null && s.min > 0)

  // Calculations
  const selectedPlan = plans.find(p => selected[p.id])
  const monthly = selectedPlan?.price ?? 0

  const oneoffTotal = activeOneOffs.reduce((sum, s) => {
    if (selected[s.id] && s.min != null) return sum + s.min
    return sum
  }, 0)

  const contractTotal = monthly * duration + oneoffTotal
  const ingred = monthly > 0 ? 450 * duration : 0
  const kamile = monthly > 0 ? 300 * duration : 0
  const cost = ingred + kamile
  const margin = contractTotal > 0 ? Math.round(((contractTotal - cost) / contractTotal) * 100) : 0
  const marginBarWidth = Math.max(0, Math.min(100, margin))

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }} className="os-view-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Form card */}
          <div style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: 24,
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

              {/* Cliente / Lead */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
                  Cliente / Lead
                </label>
                <input
                  type="text"
                  value={leadName}
                  onChange={e => setLeadName(e.target.value)}
                  placeholder="Nome do cliente ou lead…"
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-sm)',
                    color: 'var(--fg-1)',
                    fontSize: 13,
                    padding: '10px 12px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Duração do contrato */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
                  Duração do contrato
                </label>
                <select
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value) as 4 | 6 | 12)}
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-sm)',
                    color: 'var(--fg-1)',
                    fontSize: 13,
                    padding: '10px 12px',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value={4}>4 meses</option>
                  <option value={6}>6 meses</option>
                  <option value={12}>12 meses</option>
                </select>
              </div>
            </div>
          </div>

          {/* Services card */}
          <div style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: 24,
          }}>

            {/* Planos mensais */}
            <div className="os-eyebrow" style={{ marginBottom: 12 }}>Planos mensais</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
              {plans.map(plan => {
                const isSelected = !!selected[plan.id]
                return (
                  <div
                    key={plan.id}
                    onClick={() => toggle(plan.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px',
                      borderRadius: 'var(--r-md)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                      background: isSelected ? 'var(--accent-ghost)' : 'var(--surface-2)',
                      cursor: 'pointer',
                      transition: 'background 0.15s, border-color 0.15s',
                    }}
                  >
                    {/* Check */}
                    <span style={{
                      width: 20, height: 20, borderRadius: 'var(--r-sm)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                      background: isSelected ? 'var(--accent)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      color: '#0a0a0a',
                    }}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </span>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>
                        {plan.name}
                        {plan.popular && (
                          <span style={{
                            marginLeft: 8, fontSize: 10, fontWeight: 600,
                            color: 'var(--accent)', background: 'var(--accent-ghost)',
                            border: '1px solid rgba(232,255,77,.3)',
                            borderRadius: 999, padding: '2px 7px',
                            letterSpacing: '0.06em', textTransform: 'uppercase',
                          }}>Popular</span>
                        )}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 2 }}>
                        {plan.videos} vídeos/mês
                      </div>
                    </div>

                    {/* Price */}
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                      {fmt(plan.price)}<span style={{ fontSize: 11, fontWeight: 400, color: 'var(--fg-3)' }}>/mês</span>
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Serviços pontuais */}
            <div className="os-eyebrow" style={{ marginBottom: 12 }}>Serviços pontuais</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeOneOffs.map(service => {
                const isSelected = !!selected[service.id]
                return (
                  <div
                    key={service.id}
                    onClick={() => toggle(service.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 16px',
                      borderRadius: 'var(--r-md)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                      background: isSelected ? 'var(--accent-ghost)' : 'var(--surface-2)',
                      cursor: 'pointer',
                      transition: 'background 0.15s, border-color 0.15s',
                    }}
                  >
                    {/* Check */}
                    <span style={{
                      width: 20, height: 20, borderRadius: 'var(--r-sm)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                      background: isSelected ? 'var(--accent)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      color: '#0a0a0a',
                    }}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </span>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)' }}>{service.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 2 }}>por {service.unit}</div>
                    </div>

                    {/* Price */}
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                      {fmt(service.min)}
                    </span>
                  </div>
                )
              })}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN — sticky */}
        <div style={{ position: 'sticky', top: 0, alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Summary card */}
          <div style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: 24,
          }}>
            <div className="os-eyebrow" style={{ marginBottom: 16 }}>Resumo da proposta</div>

            {/* Calc rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>Mensalidade</span>
                <span style={{ fontSize: 13, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>
                  {monthly > 0 ? fmt(monthly) : <span style={{ color: 'var(--fg-4)' }}>—</span>}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>× {duration} meses</span>
                <span style={{ fontSize: 13, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>
                  {monthly > 0 ? fmt(monthly * duration) : <span style={{ color: 'var(--fg-4)' }}>—</span>}
                </span>
              </div>
              {oneoffTotal > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>Pontuais</span>
                  <span style={{ fontSize: 13, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>{fmt(oneoffTotal)}</span>
                </div>
              )}
              <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)' }}>Total do contrato</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
                  {contractTotal > 0 ? fmt(contractTotal) : <span style={{ color: 'var(--fg-4)', fontSize: 14, fontWeight: 400 }}>—</span>}
                </span>
              </div>
            </div>

            {/* Custos estimados */}
            <div className="os-eyebrow" style={{ marginBottom: 12 }}>Custos estimados</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>Ingred · por cliente</span>
                <span style={{ fontSize: 12.5, color: ingred > 0 ? 'var(--fg-2)' : 'var(--fg-4)', fontVariantNumeric: 'tabular-nums' }}>
                  {ingred > 0 ? `R$450 × ${duration} = ${fmt(ingred)}` : '—'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>Kamile · por diária</span>
                <span style={{ fontSize: 12.5, color: kamile > 0 ? 'var(--fg-2)' : 'var(--fg-4)', fontVariantNumeric: 'tabular-nums' }}>
                  {kamile > 0 ? `R$300 × ${duration} = ${fmt(kamile)}` : '—'}
                </span>
              </div>
            </div>

            {/* Margem */}
            <div className="os-eyebrow" style={{ marginBottom: 12 }}>Margem</div>
            <div style={{ marginBottom: 8 }}>
              <div style={{
                height: 8,
                borderRadius: 999,
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${marginBarWidth}%`,
                  background: margin >= 50 ? 'var(--green)' : margin >= 30 ? 'var(--accent)' : 'var(--red)',
                  borderRadius: 999,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>
                {contractTotal > 0 ? `Líquido ${fmt(contractTotal - cost)}` : 'Sem dados'}
              </span>
              <span style={{
                fontSize: 15, fontWeight: 700,
                color: margin >= 50 ? 'var(--green)' : margin >= 30 ? 'var(--accent)' : margin > 0 ? 'var(--red)' : 'var(--fg-4)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {contractTotal > 0 ? `${margin}%` : '—'}
              </span>
            </div>
          </div>

          {/* Button row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '12px 18px',
                borderRadius: 'var(--r-sm)',
                background: 'var(--accent)', color: '#0a0a0a',
                fontSize: 13, fontWeight: 600,
                border: '1px solid transparent', cursor: 'pointer',
              }}
            >
              <FileText size={15} /> Gerar proposta PDF
            </button>

            <button
              onClick={() => router.push('/painel/contratos')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '12px 18px',
                borderRadius: 'var(--r-sm)',
                background: 'transparent', color: 'var(--fg-2)',
                fontSize: 13, fontWeight: 500,
                border: '1px solid var(--border)', cursor: 'pointer',
              }}
            >
              <Calculator size={15} /> Converter em contrato
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
