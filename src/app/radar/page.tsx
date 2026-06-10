'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTopbar } from '@/lib/topbar-context'
import { tickets, clientById, fmt } from '@/lib/db'
import { Send, Calculator } from 'lucide-react'

export default function RadarPage() {
  const router = useRouter()
  const { setConfig } = useTopbar()

  const totalPotential = tickets.reduce((s, t) => s + t.potential, 0)

  useEffect(() => {
    setConfig({
      title: 'Ticket Radar',
      subtitle: 'Oportunidades de upgrade na carteira',
      actions: (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', borderRadius: 999,
          background: 'var(--green-ghost)', border: '1px solid rgba(77,255,145,.24)',
          fontSize: 13, fontWeight: 600, color: 'var(--green)',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', flexShrink: 0 }} />
          +{fmt(totalPotential)} em potencial
        </span>
      ),
    })
  }, [setConfig, totalPotential])

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }} className="os-view-in">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 20,
      }}>
        {tickets.map((ticket, i) => {
          const client = clientById(ticket.client)
          return (
            <div
              key={i}
              style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div className="os-title" style={{ fontSize: 16, color: 'var(--fg-1)', marginBottom: 2 }}>
                    {client?.name ?? ticket.client}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>
                    {client?.segment ?? '—'} · {ticket.current}
                  </div>
                </div>
                <div className="os-title" style={{
                  fontSize: 18, color: 'var(--accent)',
                  whiteSpace: 'nowrap', flexShrink: 0,
                  letterSpacing: '-0.02em',
                }}>
                  +{fmt(ticket.potential)}
                </div>
              </div>

              {/* Gap / Target chips */}
              <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '4px 10px', borderRadius: 999,
                  fontSize: 11, fontWeight: 500,
                  background: 'var(--yellow-ghost)',
                  color: 'var(--yellow)',
                  border: '1px solid rgba(232,255,77,.24)',
                }}>
                  Gap: {ticket.gap}
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '4px 10px', borderRadius: 999,
                  fontSize: 11, fontWeight: 500,
                  background: 'var(--green-ghost)',
                  color: 'var(--green)',
                  border: '1px solid rgba(77,255,145,.24)',
                }}>
                  Target: {ticket.target}
                </span>
              </div>

              {/* Argument */}
              <p style={{
                fontSize: 13,
                color: 'var(--fg-2)',
                lineHeight: 1.6,
                marginTop: 12,
                marginBottom: 16,
                flex: 1,
              }}>
                {ticket.argument}
              </p>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '9px 16px', borderRadius: 'var(--r-sm)',
                  background: 'var(--accent)', color: '#0a0a0a',
                  fontSize: 13, fontWeight: 600,
                  border: '1px solid transparent', cursor: 'pointer',
                  flex: 1, justifyContent: 'center',
                }}>
                  <Send size={14} /> Abordar agora
                </button>
                <button
                  onClick={() => router.push('/precificacao')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '9px 16px', borderRadius: 'var(--r-sm)',
                    background: 'transparent', color: 'var(--fg-2)',
                    fontSize: 13, fontWeight: 500,
                    border: '1px solid var(--border)', cursor: 'pointer',
                    flex: 1, justifyContent: 'center',
                  }}
                >
                  <Calculator size={14} /> Simular proposta
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
