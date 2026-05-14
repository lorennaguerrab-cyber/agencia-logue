'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const MOCK_CLIENTS = [
  { id: '1', nome: 'Pratique Academia', cor: '#10B981', custo_cognitivo: 2, tarefas_pendentes: 3 },
  { id: '2', nome: 'Espaço Criar', cor: '#8B5CF6', custo_cognitivo: 1, tarefas_pendentes: 1 },
  { id: '3', nome: 'Óptica Igor Giordano', cor: '#3B82F6', custo_cognitivo: 2, tarefas_pendentes: 2 },
  { id: '4', nome: 'Jornal Cidades Minerais', cor: '#EF4444', custo_cognitivo: 5, tarefas_pendentes: 4 },
]

export function ClientsWidget() {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-medium">Clientes ativos</p>
        <Link href="/clientes" className="text-[10px] text-indigo-500 hover:text-indigo-700 flex items-center gap-1 font-semibold">
          Ver todos <ArrowRight size={10} />
        </Link>
      </div>
      <div className="space-y-1.5">
        {MOCK_CLIENTS.map((client) => (
          <Link
            key={client.id}
            href="/clientes"
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[var(--border)] hover:border-indigo-200 hover:bg-indigo-50/40 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <div
              className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: `${client.cor}15`, color: client.cor }}
            >
              {client.nome[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{client.nome}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: i < client.custo_cognitivo ? '#EF4444' : '#E5E7EB' }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">carga cog.</span>
              </div>
            </div>
            {client.tarefas_pendentes > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                {client.tarefas_pendentes}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
