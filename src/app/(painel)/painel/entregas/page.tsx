'use client'

import { useEffect } from 'react'
import { Plus, Clock, Film, Package, Camera, Edit2 } from 'lucide-react'
import {
  deliveries,
  kanbanCols,
  checklists,
  clientById,
  userById,
  daysUntil,
  type OsDelivery,
  type OsKanbanCol,
  type DeliveryType,
} from '@/lib/db'
import { useTopbar } from '@/lib/topbar-context'
import { useOsStore } from '@/lib/os-store'
import type { OsUser } from '@/lib/db'

// ── Type icon map ────────────────────────────────────────────────────────────

function TypeIcon({ type }: { type: DeliveryType }) {
  const size = 11
  if (type === 'video')      return <Film size={size} />
  if (type === 'ensaio')     return <Camera size={size} />
  if (type === 'identidade') return <Edit2 size={size} />
  return <Package size={size} />
}

// ── Kanban Card ──────────────────────────────────────────────────────────────

function KanbanCard({ delivery }: { delivery: OsDelivery }) {
  const days  = daysUntil(delivery.due)
  const late  = delivery.col !== 'entregue' && days < 0
  const soon  = delivery.col !== 'entregue' && days >= 0 && days <= 2
  const client = clientById(delivery.client)
  const owner  = userById(delivery.owner)

  const dueLabelColor = late
    ? 'var(--red)'
    : soon
    ? 'var(--yellow)'
    : 'var(--fg-3)'

  const dueText = late
    ? `${Math.abs(days)}d`
    : days === 0
    ? 'hoje'
    : `${days}d`

  return (
    <div
      style={{
        background: 'var(--surface-2)',
        border: `1px solid ${late ? 'rgba(255,77,77,.4)' : 'var(--border)'}`,
        borderRadius: 'var(--r-md)',
        padding: 14,
        transition: 'border-color var(--dur), transform var(--dur)',
        cursor: 'default',
      }}
    >
      {/* Top row: type badge + due */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span
          style={{
            fontSize: 10.5,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--fg-3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <TypeIcon type={delivery.type} />
          {delivery.type}
        </span>
        <span
          style={{
            fontSize: 11,
            color: dueLabelColor,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <Clock size={12} />
          {dueText}
        </span>
      </div>

      {/* Task name */}
      <div style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.4, marginBottom: 12 }}>
        {delivery.task}
      </div>

      {/* Footer: client + owner avatar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>{client?.name}</span>
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: 'var(--surface-3)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--fg-2)',
          }}
          title={owner?.name}
        >
          {owner?.initials}
        </span>
      </div>
    </div>
  )
}

// ── Kanban Column ────────────────────────────────────────────────────────────

function KanbanColumn({
  col,
  isCollab,
  user,
}: {
  col: OsKanbanCol
  isCollab: boolean
  user: OsUser | null
}) {
  let items = deliveries.filter((d) => d.col === col.id)
  if (isCollab && user) {
    items = items.filter((d) => d.owner === user.id)
  }

  return (
    <div
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: 14,
      }}
    >
      {/* Column header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 6px 14px',
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: 'var(--fg-2)',
          }}
        >
          {col.name}
        </span>
        <span
          style={{
            fontSize: 11,
            color: 'var(--fg-3)',
            background: 'var(--surface-2)',
            borderRadius: 999,
            padding: '2px 8px',
          }}
        >
          {items.length}
        </span>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((d) => (
          <KanbanCard key={d.id} delivery={d} />
        ))}
        {items.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--fg-4)',
              fontSize: 12,
              padding: '18px 0',
            }}
          >
            Vazio
          </div>
        )}
      </div>
    </div>
  )
}

// ── Checklist Templates ──────────────────────────────────────────────────────

function ChecklistTemplates() {
  return (
    <div
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: 20,
        marginTop: 24,
      }}
    >
      <div className="os-eyebrow" style={{ marginBottom: 14 }}>
        Checklist automático por tipo de projeto
      </div>
      {Object.entries(checklists).map(([key, steps]) => {
        const label =
          key === 'social'
            ? 'Social Media'
            : key === 'identidade'
            ? 'Identidade Visual'
            : 'Vídeo'

        return (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '8px 0',
              borderBottom: '1px solid var(--border-soft)',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 500,
                border: '1px solid var(--border)',
                color: 'var(--fg-2)',
                background: 'var(--surface-2)',
                whiteSpace: 'nowrap',
              }}
            >
              {label} · {steps.length} etapas
            </span>
            <span style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>
              {steps.join(' → ')}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function EntregasPage() {
  const { setConfig } = useTopbar()
  const { user } = useOsStore()
  const isCollab = user?.access === 'collab'

  useEffect(() => {
    setConfig({
      title: 'Entregas',
      subtitle: 'Kanban da agência',
      actions: (
        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 14px',
            borderRadius: 'var(--r-sm)',
            background: 'var(--accent)',
            color: '#0a0a0a',
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Plus size={16} /> Nova entrega
        </button>
      ),
    })
  }, [setConfig])

  return (
    <div className="os-view-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Kanban board */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          alignItems: 'start',
        }}
      >
        {kanbanCols.map((col) => (
          <KanbanColumn
            key={col.id}
            col={col}
            isCollab={isCollab}
            user={user}
          />
        ))}
      </div>

      {/* Checklist templates (owners only) */}
      {!isCollab && <ChecklistTemplates />}
    </div>
  )
}
