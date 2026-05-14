'use client'

import { useState } from 'react'
import { Client } from '@/lib/types'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import {
  Users,
  TrendingUp,
  Brain,
  Heart,
  Zap,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CLIENTS: Client[] = [
  {
    id: '1',
    nome: 'Pratique Academia',
    cor: '#6EE7B7',
    retorno_financeiro: 1800,
    custo_cognitivo: 2,
    alinhamento: 4,
    esforco: 3,
    satisfacao: 4,
    status: 'ativo',
    proximas_acoes: [
      'Criar posts para semana 3',
      'Enviar relatório mensal',
      'Reunião de pauta — quinta',
    ],
    tarefas_pendentes: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    nome: 'Espaço Criar',
    cor: '#A78BFA',
    retorno_financeiro: 2200,
    custo_cognitivo: 1,
    alinhamento: 5,
    esforco: 2,
    satisfacao: 5,
    status: 'ativo',
    proximas_acoes: [
      'Entregar calendário editorial de junho',
      'Criar stories da semana',
    ],
    tarefas_pendentes: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    nome: 'Óptica Igor Giordano',
    cor: '#60A5FA',
    retorno_financeiro: 1500,
    custo_cognitivo: 2,
    alinhamento: 3,
    esforco: 3,
    satisfacao: 4,
    status: 'ativo',
    proximas_acoes: [
      'Criar campanha dia dos namorados',
      'Fotos de produto — agendar',
    ],
    tarefas_pendentes: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    nome: 'Jornal Cidades Minerais',
    cor: '#F87171',
    retorno_financeiro: 900,
    custo_cognitivo: 5,
    alinhamento: 1,
    esforco: 5,
    satisfacao: 2,
    status: 'ativo',
    proximas_acoes: [
      'Escrever roteiro plenária mineração',
      'Gravar entrevista — terça',
      'Editar vídeo semanal',
      'Enviar para aprovação',
    ],
    tarefas_pendentes: 4,
    created_at: new Date().toISOString(),
  },
]

function ScoreBar({
  value,
  max = 5,
  color,
}: {
  value: number
  max?: number
  color: string
}) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full transition-all"
          style={{
            backgroundColor: i < value ? color : 'var(--bg-hover)',
          }}
        />
      ))}
    </div>
  )
}

function getCogLoadAlert(load: number) {
  if (load >= 5) return { label: 'Crítico', color: '#F87171', icon: AlertTriangle }
  if (load >= 4) return { label: 'Alto', color: '#FBBF24', icon: AlertTriangle }
  if (load >= 3) return { label: 'Médio', color: '#A78BFA', icon: null }
  return { label: 'Baixo', color: '#34D399', icon: CheckCircle }
}

function ClientCard({ client }: { client: Client }) {
  const [expanded, setExpanded] = useState(false)
  const cogLoad = getCogLoadAlert(client.custo_cognitivo)
  const roi = client.retorno_financeiro / (client.esforco * client.custo_cognitivo)
  const roiLabel = roi > 250 ? 'Excelente' : roi > 150 ? 'Bom' : roi > 80 ? 'Regular' : 'Atenção'
  const roiColor = roi > 250 ? '#34D399' : roi > 150 ? '#A78BFA' : roi > 80 ? '#FBBF24' : '#F87171'

  return (
    <Card>
      {/* Color accent bar */}
      <div className="h-1 rounded-t-2xl" style={{ backgroundColor: client.cor }} />

      <CardBody className="pt-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: `${client.cor}22`, color: client.cor }}
            >
              {client.nome[0]}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">{client.nome}</h3>
              <p className="text-xs text-[var(--text-muted)]">
                R$ {client.retorno_financeiro.toLocaleString('pt-BR')}/mês
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {client.tarefas_pendentes > 0 && (
              <span
                className="text-[10px] font-bold px-2 py-1 rounded-full"
                style={{ backgroundColor: `${client.cor}22`, color: client.cor }}
              >
                {client.tarefas_pendentes} tarefas
              </span>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 transition-colors"
            >
              {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide flex items-center gap-1">
                  <Brain size={9} /> Carga cognitiva
                </span>
                <span className="text-[10px]" style={{ color: cogLoad.color }}>{cogLoad.label}</span>
              </div>
              <ScoreBar value={client.custo_cognitivo} color={cogLoad.color} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide flex items-center gap-1">
                  <Heart size={9} /> Alinhamento
                </span>
                <span className="text-[10px] text-[var(--text-secondary)]">{client.alinhamento}/5</span>
              </div>
              <ScoreBar value={client.alinhamento} color="#A78BFA" />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide flex items-center gap-1">
                  <Zap size={9} /> Esforço
                </span>
                <span className="text-[10px] text-[var(--text-secondary)]">{client.esforco}/5</span>
              </div>
              <ScoreBar value={client.esforco} color="#FBBF24" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide flex items-center gap-1">
                  <TrendingUp size={9} /> ROI real
                </span>
                <span className="text-[10px]" style={{ color: roiColor }}>{roiLabel}</span>
              </div>
              <div
                className="h-1.5 rounded-full"
                style={{
                  background: `linear-gradient(to right, ${roiColor} ${Math.min(roi / 3, 100)}%, var(--bg-hover) ${Math.min(roi / 3, 100)}%)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Alert for high cognitive cost */}
        {client.custo_cognitivo >= 4 && (
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-red-950/20 border border-red-900/20">
            <AlertTriangle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-300">
              Este cliente tem custo cognitivo muito alto. Considere renegociar escopo ou valor.
            </p>
          </div>
        )}

        {/* Expanded: next actions */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 border-t border-[var(--border)] space-y-2">
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                  Próximas ações
                </p>
                {client.proximas_acoes.map((action, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: client.cor }} />
                    <span className="text-xs text-[var(--text-secondary)]">{action}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardBody>
    </Card>
  )
}

export default function ClientesPage() {
  const totalReceita = CLIENTS.reduce((sum, c) => sum + c.retorno_financeiro, 0)
  const avgCogLoad = CLIENTS.reduce((sum, c) => sum + c.custo_cognitivo, 0) / CLIENTS.length
  const metaRenda = 20000

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Central de Clientes</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Visão estratégica de retorno, esforço e alinhamento
          </p>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardBody className="py-4">
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Receita atual</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">
                R$ {totalReceita.toLocaleString('pt-BR')}
              </p>
              <div className="mt-2">
                <div className="h-1 bg-[var(--bg-hover)] rounded-full">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((totalReceita / metaRenda) * 100, 100)}%`,
                      backgroundColor: totalReceita >= metaRenda ? '#34D399' : '#A78BFA',
                    }}
                  />
                </div>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">
                  Meta: R$ {metaRenda.toLocaleString('pt-BR')} · {Math.round((totalReceita / metaRenda) * 100)}%
                </p>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="py-4">
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Faltam para meta</p>
              <p className="text-xl font-bold text-[var(--warning)]">
                R$ {(metaRenda - totalReceita).toLocaleString('pt-BR')}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">Meta: R$ 20.000/mês</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="py-4">
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Clientes ativos</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">{CLIENTS.length}</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                {CLIENTS.filter((c) => c.alinhamento >= 4).length} alinhados
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="py-4">
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Carga cognitiva</p>
              <p className="text-xl font-bold" style={{ color: avgCogLoad >= 4 ? '#F87171' : avgCogLoad >= 3 ? '#FBBF24' : '#34D399' }}>
                {avgCogLoad.toFixed(1)}/5
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">média atual</p>
            </CardBody>
          </Card>
        </div>

        {/* Clients */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CLIENTS.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
