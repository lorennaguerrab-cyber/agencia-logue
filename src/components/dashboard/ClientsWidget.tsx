'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Cliente = {
  id: string
  nome: string
  cor: string
  receita: number
  payment_status: string
}

const FALLBACK: Cliente[] = [
  { id: '1', nome: 'Academia Itabira Fit', cor: '#7FB68C', receita: 1200, payment_status: 'pago' },
  { id: '2', nome: 'Espaço Criar', cor: '#A89AC9', receita: 800, payment_status: 'pendente' },
  { id: '3', nome: 'Óptica Igor Giordano', cor: '#5A6F9C', receita: 1000, payment_status: 'pendente' },
  { id: '4', nome: 'Jornal Cidades Minerais', cor: '#E89B4C', receita: 500, payment_status: 'pendente' },
]

export function ClientsWidget() {
  const [clientes, setClientes] = useState<Cliente[]>(FALLBACK)

  useEffect(() => {
    supabase
      .from('clientes')
      .select('id, nome, cor, receita, payment_status')
      .eq('ativo', true)
      .order('nome')
      .then(({ data }) => { if (data && data.length > 0) setClientes(data) })
  }, [])

  const total = clientes.reduce((s, c) => s + (c.receita || 0), 0)

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-medium">Clientes ativos</p>
        <span className="text-[10px] text-[var(--text-muted)]">R$ {total.toLocaleString('pt-BR')}/mês</span>
      </div>
      <div className="space-y-1.5">
        {clientes.map((c) => (
          <Link
            key={c.id}
            href="/clientes"
            className="flex items-center gap-3 p-2.5 rounded-[15px] bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--pink-soft)] transition-all"
          >
            <div
              className="w-7 h-7 rounded-full flex-shrink-0"
              style={{ backgroundColor: c.cor }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{c.nome}</p>
              <p className="text-[10px] text-[var(--text-muted)]">R$ {c.receita.toLocaleString('pt-BR')}/mês</p>
            </div>
            {c.payment_status === 'atrasado' && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100">!</span>
            )}
            {c.payment_status === 'pendente' && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'var(--pink-tint)', color: 'var(--pink-deep)' }}>•</span>
            )}
          </Link>
        ))}
      </div>
      <Link href="/clientes" className="flex items-center gap-1 text-[10px] font-semibold pt-1" style={{ color: 'var(--pink-deep)' }}>
        Ver todos <ArrowRight size={10} />
      </Link>
    </div>
  )
}
