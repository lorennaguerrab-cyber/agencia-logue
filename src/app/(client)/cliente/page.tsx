'use client'

import Link from 'next/link'
import { useClientStore } from '@/lib/client/store'
import { ClientHeader } from '@/components/client/ClientShell'
import { SEED_APROVACOES, SEED_CALENDAR } from '@/lib/client/data'
import { CheckSquare, Send, CalendarDays, FolderOpen, ArrowRight, ExternalLink } from 'lucide-react'

export default function ClienteDashboard() {
  const { account, demandas } = useClientStore()
  if (!account) return null

  const pendentes = SEED_APROVACOES.filter((a) => a.status === 'pendente').length
  const emAndamento = demandas.filter((d) => d.status !== 'entregue').length
  const proximos = SEED_CALENDAR.filter((c) => c.status !== 'publicado').length

  return (
    <div>
      <ClientHeader title={`Olá, ${account.nome.split(' ')[0]} 👋`} subtitle={`${account.marca} · ${account.pacote}`} />

      {/* Projeto + stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { icon: CheckSquare, label: 'Aguardando você', value: pendentes, href: '/cliente/aprovacoes', tone: 'var(--yellow)' },
          { icon: Send, label: 'Demandas ativas', value: emAndamento, href: '/cliente/demandas', tone: 'var(--blue)' },
          { icon: CalendarDays, label: 'Próximas publicações', value: proximos, href: '/cliente/calendario', tone: 'var(--green)' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <Link key={s.label} href={s.href} className="card-soft" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ display: 'inline-flex', width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', color: s.tone, alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} />
              </span>
              <span className="os-title" style={{ fontSize: 28, color: 'var(--fg-1)' }}>{s.value}</span>
              <span style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>{s.label}</span>
            </Link>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }} className="client-grid">
        {/* Aprovações pendentes */}
        <div className="card-soft" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 className="os-title" style={{ fontSize: 16, color: 'var(--fg-1)' }}>Conteúdos para aprovar</h2>
            <Link href="/cliente/aprovacoes" style={{ fontSize: 12.5, color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              Ver todos <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SEED_APROVACOES.map((a) => (
              <Link key={a.id} href="/cliente/aprovacoes" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--r-md)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--yellow)', flexShrink: 0 }} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 13.5, color: 'var(--fg-1)', fontWeight: 500 }}>{a.titulo}</span>
                  <span style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)' }}>{a.formato} · prazo {new Date(a.prazo + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                </span>
                <span className="status-chip" style={{ color: 'var(--yellow)' }}>pendente</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Projeto */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card-soft" style={{ padding: 22 }}>
            <span className="os-eyebrow" style={{ marginBottom: 14, display: 'block' }}>Seu projeto</span>
            {[
              ['Marca', account.marca],
              ['Segmento', account.segmento],
              ['Pacote', account.pacote],
              ['Gerente', account.gerente],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-soft)' }}>
                <span style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>{k}</span>
                <span style={{ fontSize: 12.5, color: 'var(--fg-1)', fontWeight: 500, textAlign: 'right', maxWidth: 150 }}>{v}</span>
              </div>
            ))}
            <a href={account.driveUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--accent)', marginTop: 14 }}>
              <FolderOpen size={15} /> Abrir pasta do Drive <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
