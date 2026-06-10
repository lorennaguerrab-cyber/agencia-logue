'use client'

import { useState, useEffect } from 'react'
import { useTopbar } from '@/lib/topbar-context'
import { equipment, costs, users, fmt } from '@/lib/db'
import type { EquipmentStatus, UserId } from '@/lib/db'

type Tab = 'equip' | 'soft' | 'collab'

const EQUIP_STATUS_STYLE: Record<EquipmentStatus, { background: string; color: string; label: string }> = {
  disponivel: { background: 'var(--green-ghost)',  color: 'var(--green)',  label: 'Disponível' },
  uso:        { background: 'var(--blue-ghost)',   color: 'var(--blue)',   label: 'Em uso' },
  manutencao: { background: 'var(--yellow-ghost)', color: 'var(--yellow)', label: 'Manutenção' },
}

function EquipStatusChip({ status }: { status: EquipmentStatus }) {
  const s = EQUIP_STATUS_STYLE[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 999,
      fontSize: 11, fontWeight: 500,
      background: s.background, color: s.color,
      border: '1px solid transparent',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, display: 'inline-block', flexShrink: 0 }} />
      {s.label}
    </span>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        fontSize: 13,
        fontWeight: 500,
        borderRadius: 'var(--r-sm)',
        border: '1px solid',
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s, color 0.15s',
        background: active ? 'var(--surface-2)' : 'transparent',
        borderColor: active ? 'var(--accent)' : 'var(--border)',
        color: active ? 'var(--fg-1)' : 'var(--fg-3)',
      }}
    >
      {children}
    </button>
  )
}

const TH_STYLE: React.CSSProperties = {
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--fg-3)',
  padding: '12px 16px',
  borderBottom: '1px solid var(--border)',
}

const TD_STYLE: React.CSSProperties = {
  padding: '13px 16px',
  borderBottom: '1px solid var(--border-soft)',
  fontSize: 13,
  verticalAlign: 'middle',
}

function EquipTab() {
  return (
    <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Equipamento', 'Status', 'Responsável', 'Compra'].map(col => (
              <th key={col} style={TH_STYLE}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {equipment.map((eq, i) => (
            <tr
              key={i}
              style={{ transition: 'background var(--dur)' }}
              onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--surface-2)'}
              onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
            >
              <td style={{ ...TD_STYLE, color: 'var(--fg-1)', fontWeight: 500 }}>{eq.name}</td>
              <td style={TD_STYLE}><EquipStatusChip status={eq.status} /></td>
              <td style={{ ...TD_STYLE, color: 'var(--fg-2)' }}>{eq.owner}</td>
              <td style={{ ...TD_STYLE, color: 'var(--fg-3)' }}>
                {new Date(eq.bought + 'T00:00:00').toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SoftTab() {
  const totalMonthly = costs.tools.reduce((s, t) => s + t.value, 0)
  return (
    <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Software', 'Valor', 'Vencimento', 'Finalidade'].map(col => (
              <th key={col} style={TH_STYLE}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {costs.tools.map((tool, i) => (
            <tr
              key={i}
              style={{ transition: 'background var(--dur)' }}
              onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--surface-2)'}
              onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
            >
              <td style={{ ...TD_STYLE, color: 'var(--fg-1)', fontWeight: 500 }}>{tool.name}</td>
              <td style={{ ...TD_STYLE, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>{fmt(tool.value)}</td>
              <td style={{ ...TD_STYLE, color: 'var(--fg-3)' }}>
                {new Date(tool.due + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              </td>
              <td style={{ ...TD_STYLE, color: 'var(--fg-2)' }}>{tool.purpose}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: 'var(--surface-2)' }}>
            <td style={{ ...TD_STYLE, fontWeight: 600, color: 'var(--fg-2)', borderBottom: 'none' }}>Total mensal</td>
            <td style={{ ...TD_STYLE, color: 'var(--accent)', fontWeight: 700, fontVariantNumeric: 'tabular-nums', borderBottom: 'none' }}>{fmt(totalMonthly)}</td>
            <td style={{ ...TD_STYLE, borderBottom: 'none' }} />
            <td style={{ ...TD_STYLE, borderBottom: 'none' }} />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function CollabTab() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
      {costs.collaborators.map((collab, i) => {
        // Find matching user
        const user = Object.values(users).find(u => u.name === collab.name || u.name.startsWith(collab.name) || collab.name === u.initials || u.name.toLowerCase().includes(collab.name.toLowerCase()))
        const initials = user ? user.initials : getInitials(collab.name)
        const role = user ? user.role : '—'

        const isPerClient = collab.model === 'por cliente'
        const hrLabel = isPerClient ? 'por cliente' : 'por diária'
        const countLabel = isPerClient ? 'Clientes ativos' : 'Diárias no mês'
        const countValue = isPerClient ? (collab.clients ?? 0) : (collab.days ?? 0)
        const unitAmount = countValue > 0 ? collab.total / countValue : 0

        return (
          <div
            key={i}
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)',
              padding: 24,
            }}
          >
            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 8,
                background: 'var(--accent)', color: '#0a0a0a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, flexShrink: 0,
                letterSpacing: '0.03em',
              }}>
                {initials}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)' }}>{collab.name}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{role} · {collab.model}</div>
              </div>
            </div>

            {/* Calc rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>Modelo</span>
                <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>{collab.model}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>{countLabel}</span>
                <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>{countValue}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>
                  {isPerClient ? 'Valor por cliente' : 'Valor por diária'}
                </span>
                <span style={{ fontSize: 13, color: 'var(--fg-2)', fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(unitAmount)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-2)' }}>Total no mês</span>
                <span className="os-title" style={{ fontSize: 16, color: 'var(--accent)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(collab.total)}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function AgenciaPage() {
  const { setConfig } = useTopbar()
  const [tab, setTab] = useState<Tab>('equip')

  useEffect(() => {
    setConfig({
      title: 'Agência',
      subtitle: 'Recursos e operação interna',
    })
  }, [setConfig])

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }} className="os-view-in">

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        <TabButton active={tab === 'equip'} onClick={() => setTab('equip')}>Equipamentos</TabButton>
        <TabButton active={tab === 'soft'} onClick={() => setTab('soft')}>Softwares</TabButton>
        <TabButton active={tab === 'collab'} onClick={() => setTab('collab')}>Colaboradoras</TabButton>
      </div>

      {tab === 'equip' && <EquipTab />}
      {tab === 'soft' && <SoftTab />}
      {tab === 'collab' && <CollabTab />}
    </div>
  )
}
