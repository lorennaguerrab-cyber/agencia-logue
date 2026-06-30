'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTopbar } from '@/lib/topbar-context'
import {
  clients,
  deliveries,
  monthlyRevenue,
  activeClients,
  overdueCount,
  totalCosts,
  clientById,
  userById,
  getPlanLabel,
  daysUntil,
  fmt,
} from '@/lib/db'
import {
  Wallet,
  Users,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'

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

export default function DashboardPage() {
  const router = useRouter()
  const { setConfig } = useTopbar()

  useEffect(() => {
    setConfig({
      title: 'Dashboard',
      subtitle: 'Visão geral · junho 2026',
      actions: (
        <button
          onClick={() => router.push('/painel/ia')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 16px', borderRadius: 'var(--r-sm)',
            background: 'var(--accent)', color: '#0a0a0a',
            fontSize: 13, fontWeight: 600,
            border: '1px solid transparent', cursor: 'pointer',
          }}
        >
          <Sparkles size={16} /> Gerar conteúdo
        </button>
      ),
    })
  }, [setConfig, router])

  // KPI data
  const revenue    = monthlyRevenue()
  const active     = activeClients()
  const overdue    = overdueCount()
  const costs      = totalCosts()
  const margin     = Math.round(((revenue - costs) / revenue) * 100)
  const netAmount  = revenue - costs

  // Urgent deliveries: non-delivered, sorted by due date, top 4
  const urgentDeliveries = deliveries
    .filter(d => d.col !== 'entregue')
    .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())
    .slice(0, 4)

  // Contract renewals: clients with daysUntil(renew) <= 35, sorted
  const renewalClients = clients
    .filter(c => daysUntil(c.renew) <= 35)
    .sort((a, b) => daysUntil(a.renew) - daysUntil(b.renew))

  function dueDotColor(d: typeof deliveries[0]) {
    if (d.late) return 'var(--red)'
    const days = daysUntil(d.due)
    if (days <= 2) return 'var(--yellow)'
    return 'var(--fg-4)'
  }

  function dueLabel(d: typeof deliveries[0]) {
    if (d.late) {
      const diff = daysUntil(d.due)
      return `${Math.abs(diff)}d atraso`
    }
    const diff = daysUntil(d.due)
    if (diff === 0) return 'hoje'
    return `${diff}d`
  }

  function dueLabelColor(d: typeof deliveries[0]) {
    if (d.late) return 'var(--red)'
    const days = daysUntil(d.due)
    if (days <= 2) return 'var(--yellow)'
    return 'var(--fg-3)'
  }

  function renewDotColor(days: number) {
    if (days < 0) return 'var(--red)'
    if (days <= 7) return 'var(--yellow)'
    return 'var(--fg-4)'
  }

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }} className="os-view-in">

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>

        {/* Receita mensal */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Receita mensal</span>
            <span style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', color: 'var(--fg-2)' }}>
              <Wallet size={17} />
            </span>
          </div>
          <div className="os-title" style={{ fontSize: 28, letterSpacing: '-0.02em', lineHeight: 1 }}>{fmt(revenue)}</div>
          <span style={{ fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--fg-3)' }}>+0% vs. maio</span>
        </div>

        {/* Clientes ativos */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Clientes ativos</span>
            <span style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', color: 'var(--fg-2)' }}>
              <Users size={17} />
            </span>
          </div>
          <div className="os-title" style={{ fontSize: 28, letterSpacing: '-0.02em', lineHeight: 1 }}>{active.length}</div>
          <span style={{ fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--red)' }}>
            {clients.length - active.length} em renovação
          </span>
        </div>

        {/* Entregas atrasadas */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Entregas atrasadas</span>
            <span style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', color: 'var(--fg-2)' }}>
              <AlertTriangle size={17} />
            </span>
          </div>
          <div className="os-title" style={{ fontSize: 28, letterSpacing: '-0.02em', lineHeight: 1 }}>{overdue}</div>
          <span style={{ fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--yellow)' }}>precisam de ação</span>
        </div>

        {/* Margem média */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Margem média</span>
            <span style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-2)', color: 'var(--fg-2)' }}>
              <TrendingUp size={17} />
            </span>
          </div>
          <div className="os-title" style={{ fontSize: 28, letterSpacing: '-0.02em', lineHeight: 1 }}>{margin}%</div>
          <span style={{ fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--green)' }}>
            líquido {fmt(netAmount)}
          </span>
        </div>
      </div>

      {/* Main 2-col split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* LEFT — Client table */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 14px' }}>
            <span className="os-title" style={{ fontSize: 15, color: 'var(--fg-1)' }}>Carteira de clientes</span>
            <Link href="/painel/clientes" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--fg-3)', transition: 'color var(--dur)' }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent)'}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--fg-3)'}
            >
              Ver todos <ArrowRight size={13} />
            </Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Cliente / Segmento', 'Plano', 'Valor', 'Status'].map(col => (
                  <th key={col} style={{ textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    {col}
                  </th>
                ))}
                <th style={{ width: 32, borderBottom: '1px solid var(--border)' }} />
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr
                  key={c.id}
                  style={{ transition: 'background var(--dur)', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--surface-2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                  onClick={() => window.location.href = `/painel/clientes/${c.id}`}
                >
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-soft)', fontSize: 13, verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 500, color: 'var(--fg-1)' }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 2 }}>{c.segment}</div>
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-soft)', fontSize: 13, color: 'var(--fg-2)', verticalAlign: 'middle' }}>
                    {getPlanLabel(c)}
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-soft)', fontSize: 13, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums', verticalAlign: 'middle' }}>
                    {c.value > 0 ? fmt(c.value) : <span style={{ color: 'var(--fg-4)' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-soft)', verticalAlign: 'middle' }}>
                    <StatusChip status={c.status} />
                  </td>
                  <td style={{ padding: '14px 12px', borderBottom: '1px solid var(--border-soft)', verticalAlign: 'middle', color: 'var(--fg-4)' }}>
                    <ChevronRight size={15} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Entregas urgentes */}
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="os-title" style={{ fontSize: 14, color: 'var(--fg-1)' }}>Entregas urgentes</span>
              <Link href="/painel/tarefas" style={{ fontSize: 11.5, color: 'var(--fg-3)', display: 'inline-flex', alignItems: 'center', gap: 3 }}
                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent)'}
                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'var(--fg-3)'}
              >
                Ver tudo <ArrowRight size={12} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {urgentDeliveries.map(d => {
                const clientData = clientById(d.client)
                const owner     = userById(d.owner)
                return (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: dueDotColor(d), flexShrink: 0, marginTop: 5 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: 'var(--fg-1)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {d.task}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 2 }}>
                        {clientData?.name ?? d.client} · {owner?.name ?? d.owner}
                      </div>
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 500, color: dueLabelColor(d), flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {dueLabel(d)}
                    </span>
                  </div>
                )
              })}
              {urgentDeliveries.length === 0 && (
                <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>Nenhuma entrega urgente.</span>
              )}
            </div>
          </div>

          {/* Vencimentos de contrato */}
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <span className="os-title" style={{ fontSize: 14, color: 'var(--fg-1)' }}>Vencimentos de contrato</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {renewalClients.map(c => {
                const days = daysUntil(c.renew)
                const dotColor = renewDotColor(days)
                const renewDate = new Date(c.renew + 'T00:00:00')
                const dateLabel = renewDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                return (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 2 }}>
                        Renova em {dateLabel}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11.5, fontWeight: 500, flexShrink: 0, whiteSpace: 'nowrap',
                      color: days < 0 ? 'var(--red)' : days <= 7 ? 'var(--yellow)' : 'var(--fg-3)',
                    }}>
                      {days < 0 ? `${Math.abs(days)}d atraso` : days === 0 ? 'hoje' : `${days}d`}
                    </span>
                  </div>
                )
              })}
              {renewalClients.length === 0 && (
                <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>Nenhum vencimento próximo.</span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
