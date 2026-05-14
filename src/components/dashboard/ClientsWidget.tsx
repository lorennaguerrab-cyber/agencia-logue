'use client'

import { useLorennStore } from '@/lib/store'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const MOCK_CLIENTS = [
  {
    id: '1',
    nome: 'Pratique Academia',
    cor: '#6EE7B7',
    custo_cognitivo: 2,
    status: 'ativo' as const,
    tarefas_pendentes: 3,
  },
  {
    id: '2',
    nome: 'Espaço Criar',
    cor: '#A78BFA',
    custo_cognitivo: 1,
    status: 'ativo' as const,
    tarefas_pendentes: 1,
  },
  {
    id: '3',
    nome: 'Óptica Igor Giordano',
    cor: '#60A5FA',
    custo_cognitivo: 2,
    status: 'ativo' as const,
    tarefas_pendentes: 2,
  },
  {
    id: '4',
    nome: 'Jornal Cidades Minerais',
    cor: '#F87171',
    custo_cognitivo: 5,
    status: 'ativo' as const,
    tarefas_pendentes: 4,
  },
]

export function ClientsWidget() {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Clientes ativos</p>
        <Link href="/clientes" className="text-[10px] text-[var(--text-accent)] hover:underline flex items-center gap-1">
          Ver todos <ArrowRight size={10} />
        </Link>
      </div>
      <div className="space-y-2">
        {MOCK_CLIENTS.map((client) => (
          <Link
            key={client.id}
            href={`/clientes/${client.id}`}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-accent)]/40 transition-all group"
          >
            <div
              className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: `${client.cor}33`, color: client.cor }}
            >
              {client.nome[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--text-primary)] truncate">{client.nome}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          i < client.custo_cognitivo ? '#F87171' : 'var(--bg-hover)',
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">carga cog.</span>
              </div>
            </div>
            {client.tarefas_pendentes > 0 && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[var(--accent-soft)] text-[var(--text-accent)] border border-[var(--border-accent)]">
                {client.tarefas_pendentes}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
