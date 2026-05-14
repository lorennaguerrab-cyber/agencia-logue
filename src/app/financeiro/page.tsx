'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { Card, CardBody } from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { Plus, X, Check, TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react'

interface EntradaRow {
  id: string
  descricao: string
  valor: number
  tipo: 'receita' | 'despesa'
  categoria: string
  cliente_id?: string
  data: string
  created_at: string
}

interface ClienteSimples {
  id: string
  nome: string
  cor: string
  retorno_financeiro: number
}

const CATEGORIAS_RECEITA = ['Cliente', 'UGC', 'Afiliado', 'Produto digital', 'Consultoria', 'Outro']
const CATEGORIAS_DESPESA = ['Ferramentas', 'Marketing', 'Equipamento', 'Educação', 'Operacional', 'Outro']

const STATIC_CLIENTES: ClienteSimples[] = [
  { id: '1', nome: 'Academia Itabira Fit', cor: '#6EE7B7', retorno_financeiro: 1800 },
  { id: '2', nome: 'Espaço Criar', cor: '#A78BFA', retorno_financeiro: 2200 },
  { id: '3', nome: 'Óptica Igor Giordano', cor: '#60A5FA', retorno_financeiro: 1500 },
  { id: '4', nome: 'Jornal Cidades Minerais', cor: '#F87171', retorno_financeiro: 900 },
]

function nowYearMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function monthLabel(ym: string) {
  const [y, m] = ym.split('-')
  const d = new Date(Number(y), Number(m) - 1)
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

function prevMonth(ym: string) {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(y, m - 2)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function nextMonth(ym: string) {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(y, m)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function EntradaModal({ onSave, onClose, clientes }: {
  onSave: (data: Omit<EntradaRow, 'id' | 'created_at'>) => Promise<void>
  onClose: () => void
  clientes: ClienteSimples[]
}) {
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('receita')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [categoria, setCategoria] = useState('Cliente')
  const [clienteId, setClienteId] = useState('')
  const [data, setData] = useState(new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await onSave({ descricao, valor: Number(valor), tipo, categoria, cliente_id: clienteId || undefined, data })
    setSaving(false)
  }

  const cats = tipo === 'receita' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(43,43,43,0.35)', backdropFilter: 'blur(4px)' }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-md rounded-[20px] border bg-[var(--bg-surface)]" style={{ borderColor: 'var(--gray-light)' }}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: 'var(--gray-light)' }}>
          <p className="text-[14px] font-semibold text-[var(--text-primary)]">Nova entrada</p>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--bg-base)]"><X size={14} className="text-[var(--text-muted)]" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          {/* Tipo toggle */}
          <div className="flex rounded-full border overflow-hidden" style={{ borderColor: 'var(--gray-light)' }}>
            {(['receita', 'despesa'] as const).map(t => (
              <button key={t} type="button" onClick={() => { setTipo(t); setCategoria(t === 'receita' ? 'Cliente' : 'Ferramentas') }} className="flex-1 py-2 text-[12.5px] font-medium transition-colors capitalize" style={{ background: tipo === t ? (t === 'receita' ? 'var(--pink)' : '#F87171') : 'transparent', color: tipo === t ? 'white' : 'var(--text-muted)' }}>
                {t === 'receita' ? '+ Receita' : '− Despesa'}
              </button>
            ))}
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Descrição</label>
            <input required value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Ex: Pagamento mensal Espaço Criar" className="w-full px-3.5 py-2.5 rounded-[10px] border text-[13.5px] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 transition-colors" style={{ borderColor: 'var(--gray-light)' }} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Valor (R$)</label>
              <input required type="number" min="0" step="0.01" value={valor} onChange={e => setValor(e.target.value)} placeholder="0,00" className="w-full px-3.5 py-2.5 rounded-[10px] border text-[13.5px] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 transition-colors" style={{ borderColor: 'var(--gray-light)' }} />
            </div>
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Data</label>
              <input required type="date" value={data} onChange={e => setData(e.target.value)} className="w-full px-3.5 py-2.5 rounded-[10px] border text-[13.5px] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 transition-colors" style={{ borderColor: 'var(--gray-light)' }} />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Categoria</label>
            <select value={categoria} onChange={e => setCategoria(e.target.value)} className="w-full px-3.5 py-2.5 rounded-[10px] border text-[13.5px] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 transition-colors" style={{ borderColor: 'var(--gray-light)' }}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {tipo === 'receita' && (
            <div>
              <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">Cliente (opcional)</label>
              <select value={clienteId} onChange={e => setClienteId(e.target.value)} className="w-full px-3.5 py-2.5 rounded-[10px] border text-[13.5px] bg-[var(--bg-base)] focus:outline-none focus:border-pink-300 transition-colors" style={{ borderColor: 'var(--gray-light)' }}>
                <option value="">— Nenhum —</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-full border text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-base)] transition-colors" style={{ borderColor: 'var(--gray-light)' }}>Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 rounded-full text-[13px] font-semibold text-white flex items-center justify-center gap-1.5 hover:opacity-90 disabled:opacity-60 transition-opacity" style={{ background: tipo === 'receita' ? 'var(--pink)' : '#F87171' }}>
              <Check size={13} />{saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function FinanceiroPage() {
  const [mes, setMes] = useState(nowYearMonth())
  const [entradas, setEntradas] = useState<EntradaRow[]>([])
  const [clientes, setClientes] = useState<ClienteSimples[]>(STATIC_CLIENTES)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const META = 20000

  const load = useCallback(async () => {
    setLoading(true)
    const [year, month] = mes.split('-')
    const from = `${year}-${month}-01`
    const to = `${year}-${month}-31`
    const { data } = await supabase.from('financeiro').select('*').gte('data', from).lte('data', to).order('data', { ascending: false })
    if (data) setEntradas(data as EntradaRow[])

    const { data: cData } = await supabase.from('clientes').select('id,nome,cor,retorno_financeiro')
    if (cData && cData.length > 0) setClientes(cData as ClienteSimples[])

    setLoading(false)
  }, [mes])

  useEffect(() => { load() }, [load])

  async function saveEntrada(data: Omit<EntradaRow, 'id' | 'created_at'>) {
    await supabase.from('financeiro').insert([data])
    toast.success(data.tipo === 'receita' ? 'Receita registrada!' : 'Despesa registrada!')
    await load()
    setModalOpen(false)
  }

  async function deleteEntrada(id: string) {
    await supabase.from('financeiro').delete().eq('id', id)
    toast.success('Entrada removida.')
    await load()
  }

  const receitas = entradas.filter(e => e.tipo === 'receita')
  const despesas = entradas.filter(e => e.tipo === 'despesa')
  const totalReceita = receitas.reduce((s, e) => s + e.valor, 0)
  const totalDespesa = despesas.reduce((s, e) => s + e.valor, 0)
  const liquido = totalReceita - totalDespesa

  const receitasPorCategoria = CATEGORIAS_RECEITA.map(cat => ({
    cat,
    total: receitas.filter(e => e.categoria === cat).reduce((s, e) => s + e.valor, 0),
  })).filter(x => x.total > 0)

  const receitasCliente = clientes.map(c => ({
    ...c,
    recebido: receitas.filter(e => e.cliente_id === c.id).reduce((s, e) => s + e.valor, 0),
  }))

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-syne)' }}>Financeiro</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Receitas, despesas e progresso da meta mensal</p>
          </div>
          <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: 'var(--pink)' }}>
            <Plus size={14} /> Nova entrada
          </button>
        </div>

        {/* Navegação de mês */}
        <div className="flex items-center gap-3">
          <button onClick={() => setMes(prevMonth(mes))} className="px-3 py-1.5 rounded-full border text-[12px] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors capitalize" style={{ borderColor: 'var(--gray-light)' }}>‹ anterior</button>
          <span className="text-[14px] font-semibold text-[var(--text-primary)] capitalize">{monthLabel(mes)}</span>
          <button onClick={() => setMes(nextMonth(mes))} className="px-3 py-1.5 rounded-full border text-[12px] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors capitalize" style={{ borderColor: 'var(--gray-light)' }}>próximo ›</button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Receita bruta', value: `R$ ${totalReceita.toLocaleString('pt-BR')}`, color: 'var(--pink)', icon: TrendingUp },
            { label: 'Despesas', value: `R$ ${totalDespesa.toLocaleString('pt-BR')}`, color: '#F87171', icon: TrendingDown },
            { label: 'Líquido', value: `R$ ${liquido.toLocaleString('pt-BR')}`, color: liquido >= 0 ? '#34D399' : '#F87171', icon: Wallet },
            { label: 'Meta mensal', value: `${Math.round((totalReceita / META) * 100)}%`, color: totalReceita >= META ? '#34D399' : '#FBBF24', icon: Target },
          ].map(k => (
            <Card key={k.label}>
              <CardBody className="py-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <k.icon size={11} style={{ color: k.color }} />
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{k.label}</p>
                </div>
                <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Barra meta */}
        <Card>
          <CardBody className="py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12.5px] font-medium text-[var(--text-primary)]">Progresso da meta — R$ {META.toLocaleString('pt-BR')}/mês</p>
              <p className="text-[12px] font-semibold" style={{ color: totalReceita >= META ? '#34D399' : 'var(--pink)' }}>
                R$ {totalReceita.toLocaleString('pt-BR')} / R$ {META.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="h-3 bg-[var(--bg-base)] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min((totalReceita / META) * 100, 100)}%`, background: totalReceita >= META ? '#34D399' : 'linear-gradient(to right, var(--pink), var(--pink-deep))' }} />
            </div>
            {totalReceita < META && (
              <p className="text-[11px] text-[var(--text-muted)] mt-1.5">Faltam R$ {(META - totalReceita).toLocaleString('pt-BR')} para bater a meta</p>
            )}
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Entradas do mês */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">Entradas do mês</p>
            {loading ? (
              <p className="text-sm text-[var(--text-muted)] py-6 text-center">Carregando...</p>
            ) : entradas.length === 0 ? (
              <div className="rounded-[15px] border border-dashed flex flex-col items-center py-10 gap-2" style={{ borderColor: 'var(--gray-light)' }}>
                <p className="text-sm text-[var(--text-muted)]">Nenhuma entrada este mês</p>
                <button onClick={() => setModalOpen(true)} className="text-[12px] font-medium" style={{ color: 'var(--pink)' }}>+ Adicionar primeira entrada</button>
              </div>
            ) : (
              <div className="space-y-2">
                {entradas.map(e => (
                  <div key={e.id} className="flex items-center justify-between p-3.5 rounded-[12px] border bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] transition-colors group" style={{ borderColor: 'var(--gray-light)' }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: e.tipo === 'receita' ? 'var(--pink)' : '#F87171' }} />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">{e.descricao}</p>
                        <p className="text-[11px] text-[var(--text-muted)]">{e.categoria} · {new Date(e.data + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-[13px] font-semibold" style={{ color: e.tipo === 'receita' ? '#34D399' : '#F87171' }}>
                        {e.tipo === 'receita' ? '+' : '−'} R$ {e.valor.toLocaleString('pt-BR')}
                      </span>
                      <button onClick={() => deleteEntrada(e.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-[var(--text-muted)] hover:text-red-500">
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lateral */}
          <div className="space-y-4">

            {/* Por categoria */}
            {receitasPorCategoria.length > 0 && (
              <Card>
                <CardBody className="py-4 space-y-3">
                  <p className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">Receita por categoria</p>
                  {receitasPorCategoria.map(r => (
                    <div key={r.cat}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] text-[var(--text-secondary)]">{r.cat}</span>
                        <span className="text-[12px] font-medium text-[var(--text-primary)]">R$ {r.total.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="h-1.5 bg-[var(--bg-base)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${totalReceita > 0 ? (r.total / totalReceita) * 100 : 0}%`, background: 'var(--pink)' }} />
                      </div>
                    </div>
                  ))}
                </CardBody>
              </Card>
            )}

            {/* Por cliente */}
            <Card>
              <CardBody className="py-4 space-y-3">
                <p className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">Mensalidades clientes</p>
                {receitasCliente.map(c => (
                  <div key={c.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.cor }} />
                      <span className="text-[12px] text-[var(--text-secondary)] truncate">{c.nome}</span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-[12px] font-medium" style={{ color: c.recebido > 0 ? '#34D399' : 'var(--text-muted)' }}>
                        {c.recebido > 0 ? `R$ ${c.recebido.toLocaleString('pt-BR')}` : 'Pendente'}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)]">meta R$ {c.retorno_financeiro.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>

          </div>
        </div>
      </motion.div>

      {modalOpen && <EntradaModal onSave={saveEntrada} onClose={() => setModalOpen(false)} clientes={clientes} />}
    </div>
  )
}
