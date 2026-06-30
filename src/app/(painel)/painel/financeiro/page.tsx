'use client'

import { useEffect } from 'react'
import { useTopbar } from '@/lib/topbar-context'
import {
  clients,
  costs,
  revenue6m,
  monthlyRevenue,
  totalCosts,
  fmtK,
  fmt,
  getPlanLabel,
} from '@/lib/db'
import { Wallet, TrendingUp, Users, ArrowUpRight } from 'lucide-react'

function StatusChip({ paid }: { paid: boolean }) {
  const style = paid
    ? { color: 'var(--green)', background: 'var(--green-ghost)', borderColor: 'rgba(77,255,145,.24)', dot: 'var(--green)', label: 'Pago' }
    : { color: 'var(--red)',   background: 'var(--red-ghost)',   borderColor: 'rgba(255,77,77,.24)',  dot: 'var(--red)',   label: 'Pendente' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999,
      fontSize: 11, fontWeight: 500,
      border: '1px solid',
      color: style.color, background: style.background, borderColor: style.borderColor,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: style.dot, display: 'inline-block' }} />
      {style.label}
    </span>
  )
}

export default function FinanceiroPage() {
  const { setConfig } = useTopbar()

  useEffect(() => {
    setConfig({
      title: 'Financeiro',
      subtitle: 'Junho 2026',
    })
  }, [setConfig])

  const revenue = monthlyRevenue()
  const costTotal = totalCosts()
  const net = revenue - costTotal
  const margin = revenue > 0 ? Math.round((net / revenue) * 100) : 0
  const collabTotal = costs.collaborators.reduce((s, c) => s + c.total, 0)

  const maxRev = Math.max(...revenue6m.map(m => m.value))

  // Active clients with value for the table
  const activeClients = clients.filter(c => c.value > 0)

  const toolsTotal = costs.tools.reduce((s, t) => s + t.value, 0)

  // Projections
  const projections = [
    { month: 'Jul', value: revenue },
    { month: 'Ago', value: revenue },
    { month: 'Set', value: revenue + 600 },
  ]

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }} className="os-view-in">

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>

        {/* Receita total */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Receita total</span>
            <span style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', color: 'var(--fg-2)' }}>
              <Wallet size={17} />
            </span>
          </div>
          <div className="os-title" style={{ fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1 }}>{fmt(revenue)}</div>
          <span style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>clientes ativos</span>
        </div>

        {/* Custo total */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Custo total</span>
            <span style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', color: 'var(--fg-2)' }}>
              <TrendingUp size={17} />
            </span>
          </div>
          <div className="os-title" style={{ fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1 }}>{fmt(costTotal)}</div>
          <span style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>ferramentas + colaboradoras</span>
        </div>

        {/* Margem líquida */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Margem líquida</span>
            <span style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', color: 'var(--fg-2)' }}>
              <ArrowUpRight size={17} />
            </span>
          </div>
          <div className="os-title" style={{ fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--accent)' }}>{fmt(net)}</div>
          <span style={{
            fontSize: 11.5,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            color: margin >= 0 ? 'var(--green)' : 'var(--red)',
          }}>
            {margin >= 0 ? '+' : ''}{margin}% de margem
          </span>
        </div>

        {/* Colaboradoras */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Colaboradoras</span>
            <span style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', color: 'var(--fg-2)' }}>
              <Users size={17} />
            </span>
          </div>
          <div className="os-title" style={{ fontSize: 26, letterSpacing: '-0.02em', lineHeight: 1 }}>{fmt(collabTotal)}</div>
          <span style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>{costs.collaborators.length} colaboradoras ativas</span>
        </div>

      </div>

      {/* 2-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* LEFT column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Bar chart — Receita últimos 6 meses */}
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20 }}>
            <span className="os-title" style={{ fontSize: 14, color: 'var(--fg-1)', display: 'block', marginBottom: 20 }}>
              Receita · últimos 6 meses
            </span>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
              {revenue6m.map(m => (
                <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%' }}>
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{
                      width: '100%',
                      background: 'var(--accent)',
                      borderRadius: '4px 4px 0 0',
                      height: `${(m.value / maxRev) * 100}%`,
                      minHeight: 4,
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>{m.month}</span>
                  <span style={{ fontSize: 10, color: 'var(--fg-4)' }}>{fmtK(m.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by client table */}
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px 14px' }}>
              <span className="os-title" style={{ fontSize: 14, color: 'var(--fg-1)' }}>Receita por cliente</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Cliente', 'Valor', 'Status'].map(col => (
                    <th key={col} style={{
                      textAlign: 'left',
                      fontSize: 11, fontWeight: 600,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: 'var(--fg-3)',
                      padding: '10px 16px',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeClients.map(c => (
                  <tr
                    key={c.id}
                    style={{ transition: 'background var(--dur)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--surface-2)'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                  >
                    <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border-soft)', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 500, color: 'var(--fg-1)', fontSize: 13 }}>{c.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 2 }}>{getPlanLabel(c)}</div>
                    </td>
                    <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border-soft)', fontSize: 13, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums', verticalAlign: 'middle' }}>
                      {fmt(c.value)}
                    </td>
                    <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border-soft)', verticalAlign: 'middle' }}>
                      <StatusChip paid={c.value > 0} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* RIGHT column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Projection card */}
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20 }}>
            <span className="os-title" style={{ fontSize: 14, color: 'var(--fg-1)', display: 'block', marginBottom: 16 }}>
              Projeção · próximos 3 meses
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {projections.map((p, i) => (
                <div
                  key={p.month}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 0',
                    borderBottom: i < projections.length - 1 ? '1px solid var(--border-soft)' : 'none',
                  }}
                >
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-1)' }}>{p.month}</span>
                    <span style={{ fontSize: 11.5, color: 'var(--fg-3)', marginLeft: 6 }}>2026</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {p.value > revenue && (
                      <span style={{ fontSize: 10.5, color: 'var(--green)', fontWeight: 500 }}>+{fmt(p.value - revenue)}</span>
                    )}
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>
                      {fmt(p.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tools card */}
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20 }}>
            <span className="os-title" style={{ fontSize: 14, color: 'var(--fg-1)', display: 'block', marginBottom: 16 }}>
              Ferramentas / assinaturas
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {costs.tools.map((tool, i) => (
                <div
                  key={tool.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border-soft)',
                  }}
                >
                  <div>
                    <span style={{ fontSize: 13, color: 'var(--fg-1)', fontWeight: 500 }}>{tool.name}</span>
                    <div style={{ fontSize: 11, color: 'var(--fg-4)', marginTop: 2 }}>{tool.purpose}</div>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--fg-2)', fontVariantNumeric: 'tabular-nums', flexShrink: 0, marginLeft: 12 }}>
                    {fmt(tool.value)}
                  </span>
                </div>
              ))}
              {/* Total row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0 0',
                marginTop: 4,
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
                  Total
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(toolsTotal)}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
