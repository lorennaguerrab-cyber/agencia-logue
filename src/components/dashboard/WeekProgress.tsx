'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckSquare, Lightbulb, TrendingUp } from 'lucide-react'

interface Stats {
  tarefasConcluidas: number
  tarefasPendentes: number
  ideiasCapturadas: number
  receitaMes: number
}

function startOfWeek() {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString()
}

function startOfMonth() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString()
}

export function WeekProgress() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    async function load() {
      const weekStart = startOfWeek()
      const monthStart = startOfMonth()

      const [concluidas, pendentes, ideias, receita] = await Promise.all([
        supabase.from('tarefas').select('id', { count: 'exact', head: true }).eq('status', 'concluida').gte('updated_at', weekStart),
        supabase.from('tarefas').select('id', { count: 'exact', head: true }).neq('status', 'concluida'),
        supabase.from('ideias').select('id', { count: 'exact', head: true }).gte('created_at', weekStart),
        supabase.from('financeiro').select('valor').eq('tipo', 'receita').gte('data', monthStart.slice(0, 10)),
      ])

      const receitaTotal = receita.data?.reduce((s, r) => s + (r.valor || 0), 0) ?? 0

      setStats({
        tarefasConcluidas: concluidas.count ?? 0,
        tarefasPendentes: pendentes.count ?? 0,
        ideiasCapturadas: ideias.count ?? 0,
        receitaMes: receitaTotal,
      })
    }
    load()
  }, [])

  if (!stats) return null

  const items = [
    { icon: CheckSquare, label: 'Feitas esta semana', value: String(stats.tarefasConcluidas), color: '#7FB68C' },
    { icon: TrendingUp,  label: 'Pendentes',          value: String(stats.tarefasPendentes),  color: '#FF78B0' },
    { icon: Lightbulb,   label: 'Ideias esta semana', value: String(stats.ideiasCapturadas),  color: '#FBBF24' },
  ]

  return (
    <div className="space-y-3">
      <p className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">Semana em números</p>
      <div className="grid grid-cols-3 gap-2">
        {items.map(i => (
          <div key={i.label} className="rounded-[12px] border p-3 text-center" style={{ borderColor: 'var(--gray-light)', background: `${i.color}08` }}>
            <i.icon size={14} className="mx-auto mb-1.5" style={{ color: i.color }} />
            <p className="text-[18px] font-bold leading-none" style={{ color: i.color, fontFamily: 'var(--font-syne)' }}>{i.value}</p>
            <p className="text-[9.5px] text-[var(--text-muted)] mt-1 leading-tight">{i.label}</p>
          </div>
        ))}
      </div>
      {stats.receitaMes > 0 && (
        <div className="flex items-center justify-between px-3 py-2.5 rounded-[12px] border" style={{ borderColor: 'var(--gray-light)', background: 'color-mix(in srgb, #7FB68C 8%, white)' }}>
          <p className="text-[12px] text-[var(--text-secondary)]">Receita este mês</p>
          <p className="text-[13px] font-semibold" style={{ color: '#7FB68C' }}>R$ {stats.receitaMes.toLocaleString('pt-BR')}</p>
        </div>
      )}
    </div>
  )
}
