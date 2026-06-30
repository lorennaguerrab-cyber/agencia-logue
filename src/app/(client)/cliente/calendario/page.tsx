'use client'

import { ClientHeader } from '@/components/client/ClientShell'
import { SEED_CALENDAR } from '@/lib/client/data'

const STATUS: Record<string, { label: string; color: string }> = {
  planejado: { label: 'Planejado', color: 'var(--fg-3)' },
  em_producao: { label: 'Em produção', color: 'var(--blue)' },
  aprovacao: { label: 'Aguardando você', color: 'var(--yellow)' },
  agendado: { label: 'Agendado', color: 'var(--green)' },
  publicado: { label: 'Publicado', color: 'var(--green)' },
}

const PILAR_COLOR: Record<string, string> = {
  Autoridade: 'var(--yellow)', Conexão: 'var(--blue)', Venda: 'var(--green)',
  'Prova social': 'var(--accent)', Bastidores: 'var(--fg-2)', Educação: 'var(--blue)',
}

export default function CalendarioPage() {
  const items = [...SEED_CALENDAR].sort((a, b) => a.data.localeCompare(b.data))

  return (
    <div>
      <ClientHeader title="Calendário editorial" subtitle="O que está planejado para sua marca neste ciclo." />

      <div className="card-soft" style={{ padding: 0, overflow: 'hidden' }}>
        {items.map((c, i) => {
          const date = new Date(c.data + 'T00:00:00')
          const st = STATUS[c.status]
          return (
            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 16, alignItems: 'center', padding: '16px 20px', borderTop: i === 0 ? 'none' : '1px solid var(--border-soft)' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="os-title" style={{ fontSize: 22, color: 'var(--fg-1)', lineHeight: 1 }}>{date.getDate()}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase' }}>{date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</div>
              </div>
              <div>
                <div style={{ fontSize: 14, color: 'var(--fg-1)', fontWeight: 500, marginBottom: 6 }}>{c.titulo}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="status-chip">{c.formato}</span>
                  <span className="status-chip" style={{ color: PILAR_COLOR[c.pilar] ?? 'var(--fg-2)' }}>{c.pilar}</span>
                </div>
              </div>
              <span className="status-chip" style={{ color: st.color }}>{st.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
