'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { Card, CardBody } from '@/components/ui/Card'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Heart, Zap, TrendingUp, AlertTriangle, CheckCircle,
  CreditCard, Star, ChevronDown, ChevronRight,
  Plus, X, Pencil, Trash2, Check,
} from 'lucide-react'

interface ClientRow {
  id: string
  nome: string
  cor: string
  retorno_financeiro: number
  custo_cognitivo: number
  alinhamento: number
  esforco: number
  satisfacao: number
  status: 'ativo' | 'pausado' | 'encerrado'
  proximas_acoes: string[]
  tarefas_pendentes: number
  payment_day: number
  payment_status: 'pago' | 'pendente'
  created_at: string
}

const FALLBACK: ClientRow[] = [
  { id: '1', nome: 'Academia Itabira Fit', cor: '#6EE7B7', retorno_financeiro: 1800, custo_cognitivo: 2, alinhamento: 4, esforco: 3, satisfacao: 4, status: 'ativo', proximas_acoes: ['Criar posts para semana 3', 'Enviar relatório mensal', 'Reunião de pauta — quinta'], tarefas_pendentes: 3, payment_day: 5, payment_status: 'pago', created_at: '' },
  { id: '2', nome: 'Espaço Criar', cor: '#A78BFA', retorno_financeiro: 2200, custo_cognitivo: 1, alinhamento: 5, esforco: 2, satisfacao: 5, status: 'ativo', proximas_acoes: ['Entregar calendário editorial de junho', 'Criar stories da semana'], tarefas_pendentes: 2, payment_day: 10, payment_status: 'pago', created_at: '' },
  { id: '3', nome: 'Óptica Igor Giordano', cor: '#60A5FA', retorno_financeiro: 1500, custo_cognitivo: 2, alinhamento: 3, esforco: 3, satisfacao: 4, status: 'ativo', proximas_acoes: ['Criar campanha dia dos namorados', 'Fotos de produto — agendar'], tarefas_pendentes: 2, payment_day: 15, payment_status: 'pendente', created_at: '' },
  { id: '4', nome: 'Jornal Cidades Minerais', cor: '#F87171', retorno_financeiro: 900, custo_cognitivo: 5, alinhamento: 1, esforco: 5, satisfacao: 2, status: 'ativo', proximas_acoes: ['Escrever roteiro plenária', 'Gravar entrevista — terça'], tarefas_pendentes: 4, payment_day: 20, payment_status: 'pendente', created_at: '' },
]

const COLORS = ['#FF78B0', '#A78BFA', '#60A5FA', '#6EE7B7', '#FBBF24', '#F87171', '#34D399', '#FB923C']

const EMPTY: Omit<ClientRow, 'id' | 'created_at'> = {
  nome: '', cor: '#FF78B0', retorno_financeiro: 0,
  custo_cognitivo: 3, alinhamento: 3, esforco: 3, satisfacao: 3,
  status: 'ativo', proximas_acoes: [], tarefas_pendentes: 0,
  payment_day: 10, payment_status: 'pendente',
}

function ScoreBar({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full transition-all" style={{ backgroundColor: i < value ? color : 'var(--bg-hover)' }} />
      ))}
    </div>
  )
}

function getCogLoad(n: number) {
  if (n >= 5) return { label: 'Crítico', color: '#F87171' }
  if (n >= 4) return { label: 'Alto', color: '#FBBF24' }
  if (n >= 3) return { label: 'Médio', color: '#A78BFA' }
  return { label: 'Baixo', color: '#34D399' }
}

function StarRating({ value, onChange, color }: { value: number; onChange: (v: number) => void; color: string }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)}>
          <div className="w-4 h-4 rounded-full transition-all" style={{ backgroundColor: n <= value ? color : 'var(--bg-hover)' }} />
        </button>
      ))}
    </div>
  )
}

function ClientModal({ client, onSave, onClose }: {
  client: Partial<ClientRow> | null
  onSave: (data: Omit<ClientRow, 'id' | 'created_at'>) => Promise<void>
  onClose: () => void
}) {
  const [form, setForm] = useState<Omit<ClientRow, 'id' | 'created_at'>>(
    client ? {
      nome: client.nome ?? '',
      cor: client.cor ?? '#FF78B0',
      retorno_financeiro: client.retorno_financeiro ?? 0,
      custo_cognitivo: client.custo_cognitivo ?? 3,
      alinhamento: client.alinhamento ?? 3,
      esforco: client.esforco ?? 3,
      satisfacao: client.satisfacao ?? 3,
      status: client.status ?? 'ativo',
      proximas_acoes: client.proximas_acoes ?? [],
      tarefas_pendentes: client.tarefas_pendentes ?? 0,
      payment_day: client.payment_day ?? 10,
      payment_status: client.payment_status ?? 'pendente',
    } : { ...EMPTY }
  )
  const [acoesRaw, setAcoesRaw] = useState((client?.proximas_acoes ?? []).join('\n'))
  const [saving, setSaving] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await onSave({ ...form, proximas_acoes: acoesRaw.split('\n').map(s => s.trim()).filter(Boolean) })
    setSaving(false)
  }

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(43,43,43,0.35)', backdropFilter: 'blur(4px)' }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-lg rounded-[20px] border bg-[var(--bg-surface)] max-h-[90vh] overflow-y-auto" style={{ borderColor: 'var(--gray-light)' }}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b sticky top-0 bg-[var(--bg-surface)]" style={{ borderColor: 'var(--gray-light)' }}>
          <p className="text-[14px] font-semibold text-[var(--text-primary)]">{client?.id ? 'Editar cliente' : 'Novo cliente'}</p>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--bg-base)] transition-colors">
            <X size={14} className="text-[var(--text-muted)]" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-5">
          {/* Nome */}
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Nome do cliente</label>
            <input required value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Ex: Academia Itabira Fit" className="w-full px-3.5 py-2.5 rounded-[10px] border text-[13.5px] text-[var(--text-primary)] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 transition-colors" style={{ borderColor: 'var(--gray-light)' }} />
          </div>

          {/* Cor + Valor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Cor</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button key={c} type="button" onClick={() => set('cor', c)} className="w-6 h-6 rounded-full border-2 transition-all" style={{ backgroundColor: c, borderColor: form.cor === c ? 'var(--text-primary)' : 'transparent' }} />
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Valor mensal (R$)</label>
              <input type="number" min={0} value={form.retorno_financeiro} onChange={e => set('retorno_financeiro', Number(e.target.value))} className="w-full px-3.5 py-2.5 rounded-[10px] border text-[13.5px] text-[var(--text-primary)] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 transition-colors" style={{ borderColor: 'var(--gray-light)' }} />
            </div>
          </div>

          {/* Métricas */}
          <div className="space-y-3">
            <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block">Métricas</label>
            {[
              { label: 'Carga cognitiva', key: 'custo_cognitivo' as const, color: getCogLoad(form.custo_cognitivo).color },
              { label: 'Alinhamento', key: 'alinhamento' as const, color: '#A78BFA' },
              { label: 'Esforço', key: 'esforco' as const, color: '#FBBF24' },
              { label: 'Satisfação', key: 'satisfacao' as const, color: '#34D399' },
            ].map(m => (
              <div key={m.key} className="flex items-center justify-between">
                <span className="text-[12.5px] text-[var(--text-secondary)] w-36">{m.label}</span>
                <StarRating value={form[m.key]} onChange={v => set(m.key, v as 1|2|3|4|5)} color={m.color} />
              </div>
            ))}
          </div>

          {/* Pagamento */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Dia de pagamento</label>
              <input type="number" min={1} max={31} value={form.payment_day} onChange={e => set('payment_day', Number(e.target.value))} className="w-full px-3.5 py-2.5 rounded-[10px] border text-[13.5px] text-[var(--text-primary)] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 transition-colors" style={{ borderColor: 'var(--gray-light)' }} />
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Status pagamento</label>
              <select value={form.payment_status} onChange={e => set('payment_status', e.target.value as 'pago' | 'pendente')} className="w-full px-3.5 py-2.5 rounded-[10px] border text-[13.5px] text-[var(--text-primary)] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 transition-colors" style={{ borderColor: 'var(--gray-light)' }}>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
              </select>
            </div>
          </div>

          {/* Próximas ações */}
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Próximas ações (uma por linha)</label>
            <textarea value={acoesRaw} onChange={e => setAcoesRaw(e.target.value)} rows={3} placeholder="Criar posts da semana&#10;Enviar relatório&#10;Reunião de pauta" className="w-full px-3.5 py-2.5 rounded-[10px] border text-[13.5px] text-[var(--text-primary)] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 resize-none transition-colors" style={{ borderColor: 'var(--gray-light)' }} />
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-full border text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-base)] transition-colors" style={{ borderColor: 'var(--gray-light)' }}>Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-full text-[13px] font-semibold text-white flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 disabled:opacity-60" style={{ background: 'var(--pink)' }}>
              <Check size={13} />
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ClientCard({ client, onEdit, onDelete }: { client: ClientRow; onEdit: () => void; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const cogLoad = getCogLoad(client.custo_cognitivo)
  const roi = client.retorno_financeiro / Math.max(client.esforco * client.custo_cognitivo, 1)
  const roiLabel = roi > 250 ? 'Excelente' : roi > 150 ? 'Bom' : roi > 80 ? 'Regular' : 'Atenção'
  const roiColor = roi > 250 ? '#34D399' : roi > 150 ? '#A78BFA' : roi > 80 ? '#FBBF24' : '#F87171'
  const isPago = client.payment_status === 'pago'

  return (
    <Card>
      <div className="h-1 rounded-t-[15px]" style={{ backgroundColor: client.cor }} />
      <CardBody className="pt-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold" style={{ backgroundColor: `${client.cor}22`, color: client.cor }}>
              {client.nome[0]}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">{client.nome}</h3>
              <p className="text-xs text-[var(--text-muted)]">R$ {client.retorno_financeiro.toLocaleString('pt-BR')}/mês</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {client.tarefas_pendentes > 0 && (
              <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: `${client.cor}22`, color: client.cor }}>
                {client.tarefas_pendentes} tarefas
              </span>
            )}
            <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-[var(--bg-base)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]">
              <Pencil size={13} />
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <button onClick={onDelete} className="text-[10px] font-semibold px-2 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">Confirmar</button>
                <button onClick={() => setConfirmDelete(false)} className="text-[10px] px-2 py-1 rounded-full bg-[var(--bg-base)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors">Cancelar</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-[var(--text-muted)] hover:text-red-500">
                <Trash2 size={13} />
              </button>
            )}
            <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg hover:bg-[var(--bg-base)] transition-colors text-[var(--text-muted)]">
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide flex items-center gap-1"><Brain size={9} /> Carga</span>
                <span className="text-[10px]" style={{ color: cogLoad.color }}>{cogLoad.label}</span>
              </div>
              <ScoreBar value={client.custo_cognitivo} color={cogLoad.color} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide flex items-center gap-1"><Heart size={9} /> Alinhamento</span>
                <span className="text-[10px] text-[var(--text-secondary)]">{client.alinhamento}/5</span>
              </div>
              <ScoreBar value={client.alinhamento} color="#A78BFA" />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide flex items-center gap-1"><Zap size={9} /> Esforço</span>
                <span className="text-[10px] text-[var(--text-secondary)]">{client.esforco}/5</span>
              </div>
              <ScoreBar value={client.esforco} color="#FBBF24" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide flex items-center gap-1"><TrendingUp size={9} /> ROI</span>
                <span className="text-[10px]" style={{ color: roiColor }}>{roiLabel}</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: `linear-gradient(to right, ${roiColor} ${Math.min(roi / 3, 100)}%, var(--bg-hover) ${Math.min(roi / 3, 100)}%)` }} />
            </div>
          </div>
        </div>

        {client.custo_cognitivo >= 4 && (
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200">
            <AlertTriangle size={13} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600">Custo cognitivo alto. Considere renegociar escopo ou valor.</p>
          </div>
        )}

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="pt-2 border-t border-[var(--border)] space-y-4">
                {client.proximas_acoes.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Próximas ações</p>
                    {client.proximas_acoes.map((a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: client.cor }} />
                        <span className="text-xs text-[var(--text-secondary)]">{a}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1"><CreditCard size={9} /> Pagamento</p>
                  <div className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-hover)]">
                    <span className="text-xs text-[var(--text-secondary)]">Dia {client.payment_day} de cada mês</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: isPago ? '#34D39922' : '#F8717122', color: isPago ? '#34D399' : '#F87171' }}>
                      {isPago ? 'Pago' : 'Pendente'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardBody>
    </Card>
  )
}

export default function ClientesPage() {
  const [clients, setClients] = useState<ClientRow[]>(FALLBACK)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; client: Partial<ClientRow> | null }>({ open: false, client: null })

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('clientes').select('*').order('created_at')
    if (!error && data && data.length > 0) setClients(data as ClientRow[])
    else setClients(FALLBACK)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function saveClient(data: Omit<ClientRow, 'id' | 'created_at'>) {
    if (modal.client?.id) {
      await supabase.from('clientes').update(data).eq('id', modal.client.id)
      toast.success('Cliente atualizado!')
    } else {
      await supabase.from('clientes').insert([data])
      toast.success('Cliente criado!')
    }
    await load()
    setModal({ open: false, client: null })
  }

  async function deleteClient(id: string) {
    await supabase.from('clientes').delete().eq('id', id)
    toast.success('Cliente removido.')
    await load()
  }

  const totalReceita = clients.reduce((s, c) => s + c.retorno_financeiro, 0)
  const meta = 20000
  const pendentes = clients.filter(c => c.payment_status === 'pendente').length

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-syne)' }}>Clientes</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Visão estratégica de retorno, esforço e alinhamento</p>
          </div>
          <button
            onClick={() => setModal({ open: true, client: null })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--pink)' }}
          >
            <Plus size={14} /> Novo cliente
          </button>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Receita atual', value: `R$ ${totalReceita.toLocaleString('pt-BR')}`, sub: `Meta: R$ ${meta.toLocaleString('pt-BR')}`, bar: totalReceita / meta, barColor: totalReceita >= meta ? '#34D399' : '#FF78B0' },
            { label: 'Faltam para meta', value: `R$ ${Math.max(meta - totalReceita, 0).toLocaleString('pt-BR')}`, sub: `${Math.round((totalReceita / meta) * 100)}% atingido`, bar: null, barColor: '' },
            { label: 'Clientes ativos', value: String(clients.filter(c => c.status === 'ativo').length), sub: `${clients.filter(c => c.alinhamento >= 4).length} alinhados`, bar: null, barColor: '' },
            { label: 'Pagtos pendentes', value: String(pendentes), sub: pendentes === 0 ? 'Tudo em dia ✓' : `${pendentes} aguardando`, bar: null, barColor: '' },
          ].map(stat => (
            <Card key={stat.label}>
              <CardBody className="py-4">
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                {stat.bar !== null && (
                  <div className="mt-2 h-1 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(stat.bar * 100, 100)}%`, backgroundColor: stat.barColor }} />
                  </div>
                )}
                <p className="text-[11px] text-[var(--text-muted)] mt-1">{stat.sub}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-12 text-sm text-[var(--text-muted)]">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clients.map(c => (
              <ClientCard
                key={c.id}
                client={c}
                onEdit={() => setModal({ open: true, client: c })}
                onDelete={() => deleteClient(c.id)}
              />
            ))}
          </div>
        )}
      </motion.div>

      {modal.open && (
        <ClientModal
          client={modal.client}
          onSave={saveClient}
          onClose={() => setModal({ open: false, client: null })}
        />
      )}
    </div>
  )
}
