'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTopbar } from '@/lib/topbar-context'
import {
  clients,
  activeClients,
  getPlanLabel,
  daysUntil,
  fmt,
} from '@/lib/db'
import { ChevronRight, Plus } from 'lucide-react'

const STATUS_STYLE = {
  ativo:     { color: 'var(--green)',  background: 'var(--green-ghost)',  borderColor: 'rgba(77,255,145,.24)' },
  reajuste:  { color: 'var(--yellow)', background: 'var(--yellow-ghost)', borderColor: 'rgba(232,255,77,.24)' },
  renovacao: { color: 'var(--red)',    background: 'var(--red-ghost)',    borderColor: 'rgba(255,77,77,.24)'  },
}

const STATUS_LABEL = {
  ativo:     'Ativo',
  reajuste:  'Reajuste',
  renovacao: 'Renovação',
}

function StatusChip({ status }: { status: 'ativo' | 'reajuste' | 'renovacao' }) {
  const s = STATUS_STYLE[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999,
      fontSize: 11, fontWeight: 500,
      border: '1px solid',
      color: s.color, background: s.background, borderColor: s.borderColor,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
      {STATUS_LABEL[status]}
    </span>
  )
}

export default function ClientesPage() {
  const router = useRouter()
  const { setConfig } = useTopbar()
  const active = activeClients()

  useEffect(() => {
    setConfig({
      title: 'Clientes',
      subtitle: `${clients.length} no total · ${active.length} ativos`,
      actions: (
        <button
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 16px', borderRadius: 'var(--r-sm)',
            background: 'var(--accent)', color: '#0a0a0a',
            fontSize: 13, fontWeight: 600,
            border: '1px solid transparent', cursor: 'pointer',
          }}
        >
          <Plus size={16} /> Novo cliente
        </button>
      ),
    })
  }, [setConfig, active.length])

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }} className="os-view-in">
      <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Cliente', 'Plano', 'Valor', 'Renovação', 'Status'].map(col => (
                <th key={col} style={{
                  textAlign: 'left', fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--fg-3)', padding: '14px 20px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  {col}
                </th>
              ))}
              <th style={{ width: 40, borderBottom: '1px solid var(--border)' }} />
            </tr>
          </thead>
          <tbody>
            {clients.map((c, i) => {
              const days = daysUntil(c.renew)
              const renewDate = new Date(c.renew + 'T00:00:00')
              const dateLabel = renewDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
              const isLast = i === clients.length - 1

              return (
                <tr
                  key={c.id}
                  style={{ transition: 'background var(--dur)', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--surface-2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                  onClick={() => router.push(`/clientes/${c.id}`)}
                >
                  {/* Cliente */}
                  <td style={{ padding: '16px 20px', borderBottom: isLast ? 'none' : '1px solid var(--border-soft)', verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 500, fontSize: 13.5, color: 'var(--fg-1)' }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 3 }}>
                      {c.segment}
                      {c.city && <span style={{ marginLeft: 6, opacity: 0.7 }}>· {c.city}</span>}
                    </div>
                  </td>

                  {/* Plano */}
                  <td style={{ padding: '16px 20px', borderBottom: isLast ? 'none' : '1px solid var(--border-soft)', fontSize: 13, color: 'var(--fg-2)', verticalAlign: 'middle' }}>
                    {getPlanLabel(c)}
                  </td>

                  {/* Valor */}
                  <td style={{ padding: '16px 20px', borderBottom: isLast ? 'none' : '1px solid var(--border-soft)', fontSize: 13, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums', verticalAlign: 'middle' }}>
                    {c.value > 0
                      ? <span style={{ fontWeight: 500 }}>{fmt(c.value)}<span style={{ fontSize: 11, color: 'var(--fg-3)', fontWeight: 400 }}>/mês</span></span>
                      : <span style={{ color: 'var(--fg-4)' }}>—</span>
                    }
                  </td>

                  {/* Renovação */}
                  <td style={{ padding: '16px 20px', borderBottom: isLast ? 'none' : '1px solid var(--border-soft)', verticalAlign: 'middle' }}>
                    <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>{dateLabel}</div>
                    <div style={{
                      fontSize: 11.5, marginTop: 3, fontWeight: 500,
                      color: days <= 0 ? 'var(--red)' : days <= 7 ? 'var(--yellow)' : 'var(--fg-3)',
                    }}>
                      {days < 0
                        ? `${Math.abs(days)}d em atraso`
                        : days === 0
                          ? 'vence hoje'
                          : days <= 7
                            ? `${days}d restantes`
                            : `${days}d`
                      }
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '16px 20px', borderBottom: isLast ? 'none' : '1px solid var(--border-soft)', verticalAlign: 'middle' }}>
                    <StatusChip status={c.status} />
                  </td>

                  {/* Chevron */}
                  <td style={{ padding: '16px 14px', borderBottom: isLast ? 'none' : '1px solid var(--border-soft)', verticalAlign: 'middle', color: 'var(--fg-4)' }}>
                    <ChevronRight size={15} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
