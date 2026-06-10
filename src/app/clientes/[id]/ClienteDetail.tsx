'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTopbar } from '@/lib/topbar-context'
import {
  clientById,
  getPlanLabel,
  daysUntil,
  fmt,
} from '@/lib/db'
import { Film, Camera, Package } from 'lucide-react'

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

function HistoryIcon({ type }: { type: string }) {
  const iconStyle = { color: 'var(--fg-3)', flexShrink: 0 }
  if (type === 'Vídeo' || type === 'Roteiro') return <Film size={15} style={iconStyle} />
  if (type === 'Ensaio') return <Camera size={15} style={iconStyle} />
  return <Package size={15} style={iconStyle} />
}

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

export default function ClienteDetail({ id }: { id: string }) {
  const router = useRouter()
  const { setConfig } = useTopbar()
  const client = clientById(id)

  useEffect(() => {
    if (!client) {
      setConfig({ title: 'Cliente não encontrado' })
      return
    }

    setConfig({
      title: client.name,
      subtitle: client.segment,
      actions: (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => router.push('/contratos')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 16px', borderRadius: 'var(--r-sm)',
              background: 'transparent', color: 'var(--fg-1)',
              fontSize: 13, fontWeight: 600,
              border: '1px solid var(--border)', cursor: 'pointer',
            }}
          >
            Gerar contrato
          </button>
          <button
            onClick={() => router.push('/ia')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 16px', borderRadius: 'var(--r-sm)',
              background: 'var(--accent)', color: '#0a0a0a',
              fontSize: 13, fontWeight: 600,
              border: '1px solid transparent', cursor: 'pointer',
            }}
          >
            IA de conteúdo
          </button>
        </div>
      ),
    })
  }, [client, setConfig, router])

  if (!client) {
    return (
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 40 }} className="os-view-in">
        <div style={{
          background: 'var(--surface-1)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)', padding: 40, textAlign: 'center',
        }}>
          <p style={{ fontSize: 15, color: 'var(--fg-3)' }}>Cliente não encontrado.</p>
        </div>
      </div>
    )
  }

  const days = daysUntil(client.renew)

  const infoFields = [
    { label: 'Documento', value: client.doc },
    { label: 'Telefone', value: client.phone },
    { label: 'Cidade', value: client.city },
    { label: 'Início', value: formatDate(client.start) },
    {
      label: 'Renovação',
      value: formatDate(client.renew),
      extra: `${Math.abs(days)}d ${days < 0 ? 'em atraso' : 'restantes'}`,
      urgent: days <= 7,
    },
    { label: 'Tom de voz', value: client.tone },
  ]

  const alertThresholds = [30, 15, 7]

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }} className="os-view-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Plan card */}
          <div style={{
            background: 'var(--surface-1)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)', padding: 24,
          }}>
            <span className="os-eyebrow" style={{
              display: 'block', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--fg-3)', marginBottom: 12,
            }}>
              Plano contratado
            </span>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 6 }}>
              <span className="os-title" style={{ fontSize: 24, letterSpacing: '-0.02em', color: 'var(--fg-1)' }}>
                {getPlanLabel(client)}
              </span>
              <StatusChip status={client.status} />
            </div>

            <div style={{ marginBottom: 20 }}>
              {client.value > 0
                ? <span style={{ fontSize: 14, color: 'var(--fg-2)' }}>
                    {fmt(client.value)}<span style={{ fontSize: 12, color: 'var(--fg-3)' }}>/mês</span>
                  </span>
                : <span style={{ fontSize: 14, color: 'var(--fg-4)' }}>Valor a definir</span>
              }
            </div>

            {/* 2x3 info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {infoFields.map((f) => (
                <div key={f.label}>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                    {f.label}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.4 }}>
                    {f.value || <span style={{ color: 'var(--fg-4)' }}>—</span>}
                    {'extra' in f && f.extra && (
                      <span style={{
                        display: 'inline-block', marginLeft: 6, fontSize: 11, fontWeight: 500,
                        color: f.urgent ? 'var(--yellow)' : 'var(--fg-3)',
                      }}>
                        {f.extra}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Briefing card */}
          <div style={{
            background: 'var(--surface-1)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)', padding: 24,
          }}>
            <span className="os-eyebrow" style={{
              display: 'block', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--fg-3)', marginBottom: 12,
            }}>
              Briefing
            </span>
            <p style={{ fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.7, marginBottom: 16 }}>
              {client.brief}
            </p>
            {client.services.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {client.services.map(s => (
                  <span key={s} style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '5px 12px', borderRadius: 999,
                    fontSize: 11.5, fontWeight: 500,
                    border: '1px solid var(--border)',
                    background: 'var(--surface-2)', color: 'var(--fg-2)',
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Histórico card */}
          <div style={{
            background: 'var(--surface-1)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)', padding: 24,
          }}>
            <span className="os-eyebrow" style={{
              display: 'block', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--fg-3)', marginBottom: 16,
            }}>
              Histórico
            </span>
            {client.history.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--fg-3)' }}>Nenhum histórico registrado.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {client.history.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <HistoryIcon type={h.type} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: 'var(--fg-1)', fontWeight: 500 }}>{h.label}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 2 }}>{h.type} · {formatDate(h.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Alertas de renovação */}
          <div style={{
            background: 'var(--surface-1)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)', padding: 24,
          }}>
            <span className="os-eyebrow" style={{
              display: 'block', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--fg-3)', marginBottom: 16,
            }}>
              Alertas de renovação
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {alertThresholds.map(threshold => {
                const active = days <= threshold
                const color = threshold === 7 ? 'var(--red)' : threshold === 15 ? 'var(--yellow)' : 'var(--blue)'
                const bgColor = threshold === 7 ? 'var(--red-ghost)' : threshold === 15 ? 'var(--yellow-ghost)' : 'var(--blue-ghost)'
                const borderColor = threshold === 7
                  ? 'rgba(255,77,77,.24)'
                  : threshold === 15
                    ? 'rgba(232,255,77,.24)'
                    : 'rgba(77,153,255,.24)'

                return (
                  <span key={threshold} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '8px 14px', borderRadius: 'var(--r-sm)',
                    fontSize: 12, fontWeight: 500,
                    border: '1px solid',
                    color: active ? color : 'var(--fg-3)',
                    background: active ? bgColor : 'var(--surface-2)',
                    borderColor: active ? borderColor : 'var(--border)',
                    opacity: active ? 1 : 0.6,
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: active ? color : 'var(--fg-4)',
                      flexShrink: 0,
                    }} />
                    {threshold} dias para renovar
                  </span>
                )
              })}
            </div>
          </div>

          {/* Ações rápidas */}
          <div style={{
            background: 'var(--surface-1)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)', padding: 24,
          }}>
            <span className="os-eyebrow" style={{
              display: 'block', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--fg-3)', marginBottom: 16,
            }}>
              Ações rápidas
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Gerar ideias do mês', href: '/ia' },
                { label: 'Novo roteiro', href: '/roteiros' },
                { label: 'Nova proposta', href: '/precificacao' },
                { label: 'Registrar contato', href: null },
              ].map(action => (
                <button
                  key={action.label}
                  onClick={() => action.href && router.push(action.href)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                    padding: '10px 14px', borderRadius: 'var(--r-sm)',
                    background: 'transparent', color: 'var(--fg-1)',
                    fontSize: 13, fontWeight: 500,
                    border: '1px solid var(--border)', cursor: action.href ? 'pointer' : 'default',
                    width: '100%', textAlign: 'left',
                    transition: 'background var(--dur)',
                  }}
                  onMouseEnter={e => {
                    if (action.href) (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-2)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
