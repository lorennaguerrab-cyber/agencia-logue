'use client'

import { useState, useEffect } from 'react'
import { useTopbar } from '@/lib/topbar-context'
import { network, scripts, fmt } from '@/lib/db'
import type { NetworkStage, OsNetworkContact } from '@/lib/db'
import { Plus, Send } from 'lucide-react'

type Tab = 'leads' | 'influencers' | 'agencias'

const STAGE_STYLE: Record<NetworkStage, { background: string; color: string; label: string }> = {
  frio:        { background: 'var(--blue-ghost)',   color: 'var(--blue)',   label: 'Frio' },
  aquecido:    { background: 'var(--yellow-ghost)', color: 'var(--yellow)', label: 'Aquecido' },
  proposta:    { background: 'var(--blue-ghost)',   color: 'var(--blue)',   label: 'Proposta enviada' },
  negociacao:  { background: 'var(--yellow-ghost)', color: 'var(--yellow)', label: 'Negociação' },
  fechado:     { background: 'var(--green-ghost)',  color: 'var(--green)',  label: 'Fechado' },
  perdido:     { background: 'var(--surface-2)',    color: 'var(--fg-3)',   label: 'Perdido' },
}

const SCRIPT_STAGES: Array<{ key: string; label: string; stage: NetworkStage }> = [
  { key: 'frio',     label: 'Frio',              stage: 'frio' },
  { key: 'aquecido', label: 'Aquecido',           stage: 'aquecido' },
  { key: 'proposta', label: 'Proposta enviada',   stage: 'proposta' },
]

function StageChip({ stage }: { stage: NetworkStage }) {
  const s = STAGE_STYLE[stage]
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

function ContactTable({ contacts }: { contacts: OsNetworkContact[] }) {
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

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={TH_STYLE}>Contato</th>
          <th style={TH_STYLE}>Estágio</th>
          <th style={TH_STYLE}>Potencial</th>
          <th style={TH_STYLE}>Próxima ação</th>
          <th style={{ ...TH_STYLE, width: 90 }} />
        </tr>
      </thead>
      <tbody>
        {contacts.map((c, i) => (
          <tr
            key={i}
            style={{ transition: 'background var(--dur)', cursor: 'default' }}
            onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'var(--surface-2)'}
            onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
          >
            <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border-soft)', verticalAlign: 'middle' }}>
              <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--fg-1)' }}>{c.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 2 }}>{c.segment}</div>
            </td>
            <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border-soft)', verticalAlign: 'middle' }}>
              <StageChip stage={c.stage} />
            </td>
            <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border-soft)', fontSize: 13, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums', verticalAlign: 'middle' }}>
              {c.value > 0 ? fmt(c.value) : <span style={{ color: 'var(--fg-4)' }}>permuta</span>}
            </td>
            <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border-soft)', verticalAlign: 'middle' }}>
              <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>{c.next}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-4)', marginTop: 2 }}>
                {new Date(c.last + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              </div>
            </td>
            <td style={{ padding: '13px 12px', borderBottom: '1px solid var(--border-soft)', verticalAlign: 'middle' }}>
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 'var(--r-sm)',
                background: 'transparent', color: 'var(--fg-2)',
                fontSize: 12, fontWeight: 500,
                border: '1px solid var(--border)', cursor: 'pointer',
              }}>
                <Send size={12} /> Abordar
              </button>
            </td>
          </tr>
        ))}
        {contacts.length === 0 && (
          <tr>
            <td colSpan={5} style={{ padding: '24px 16px', textAlign: 'center', fontSize: 13, color: 'var(--fg-3)' }}>
              Nenhum contato nesta categoria.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default function RedePage() {
  const { setConfig } = useTopbar()
  const [tab, setTab] = useState<Tab>('leads')

  useEffect(() => {
    setConfig({
      title: 'Rede Estratégica',
      subtitle: 'Pipeline de relacionamento',
      actions: (
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '10px 16px', borderRadius: 'var(--r-sm)',
          background: 'var(--accent)', color: '#0a0a0a',
          fontSize: 13, fontWeight: 600,
          border: '1px solid transparent', cursor: 'pointer',
        }}>
          <Plus size={15} /> Novo contato
        </button>
      ),
    })
  }, [setConfig])

  const contacts = tab === 'leads'
    ? network.leads
    : tab === 'influencers'
    ? network.influencers
    : network.agencias

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }} className="os-view-in">

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        <TabButton active={tab === 'leads'} onClick={() => setTab('leads')}>Leads</TabButton>
        <TabButton active={tab === 'influencers'} onClick={() => setTab('influencers')}>Influencers</TabButton>
        <TabButton active={tab === 'agencias'} onClick={() => setTab('agencias')}>Agências parceiras</TabButton>
      </div>

      {/* 2-column split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

        {/* Left: contacts table */}
        <div style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)',
          overflow: 'hidden',
        }}>
          <ContactTable contacts={contacts} />
        </div>

        {/* Right: scripts card */}
        <div style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)',
          padding: 20,
        }}>
          <div className="os-eyebrow" style={{ marginBottom: 16 }}>Scripts de abordagem</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {SCRIPT_STAGES.map(({ key, stage }) => (
              <div key={key}>
                <div style={{ marginBottom: 8 }}>
                  <StageChip stage={stage} />
                </div>
                <p style={{
                  fontSize: 12.5,
                  color: 'var(--fg-2)',
                  lineHeight: 1.55,
                  margin: 0,
                }}>
                  {scripts[key]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
