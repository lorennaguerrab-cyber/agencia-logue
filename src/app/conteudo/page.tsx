'use client'

import { useState } from 'react'
import { ContentItem } from '@/lib/types'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CATEGORY_LABELS, PLATFORM_LABELS, PLATFORM_COLORS, formatDate } from '@/lib/utils'
import {
  FileText,
  Plus,
  Calendar,
  Search,
  LayoutGrid,
  List,
} from 'lucide-react'
import { motion } from 'framer-motion'

const STATUS_CONFIG = {
  ideia: { label: 'Ideia', color: '#9B99B4', bg: 'rgba(155,153,180,0.1)' },
  rascunho: { label: 'Rascunho', color: '#FBBF24', bg: 'rgba(251,191,36,0.1)' },
  filmando: { label: 'Filmando', color: '#F87171', bg: 'rgba(248,113,113,0.1)' },
  editando: { label: 'Editando', color: '#FB923C', bg: 'rgba(251,146,60,0.1)' },
  revisao: { label: 'Revisão', color: '#A78BFA', bg: 'rgba(167,139,250,0.1)' },
  agendado: { label: 'Agendado', color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
  publicado: { label: 'Publicado', color: '#34D399', bg: 'rgba(52,211,153,0.1)' },
}

const TYPE_EMOJIS: Record<string, string> = {
  reel: '🎬',
  youtube: '▶️',
  blog: '✍️',
  newsletter: '📩',
  tiktok: '🎵',
  shorts: '⚡',
  carrossel: '🖼',
}

const DEMO_CONTENT: ContentItem[] = [
  {
    id: 'c1',
    titulo: 'Como organizo minha semana de trabalho sendo mãe e criadora',
    tipo: 'blog',
    plataformas: ['blog', 'newsletter'],
    status: 'publicado',
    categoria: 'rotina',
    data_publicacao: new Date(Date.now() - 7 * 86400000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'c2',
    titulo: 'Reel: Por que sua marca precisa de uma voz única',
    tipo: 'reel',
    plataformas: ['instagram', 'tiktok'],
    status: 'editando',
    categoria: 'branding',
    data_filmagem: new Date(Date.now() - 2 * 86400000).toISOString(),
    data_publicacao: new Date(Date.now() + 2 * 86400000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'c3',
    titulo: 'Newsletter: 5 ferramentas de IA que mudaram minha produtividade',
    tipo: 'newsletter',
    plataformas: ['newsletter'],
    status: 'rascunho',
    categoria: 'inteligencia_artificial',
    data_publicacao: new Date(Date.now() + 3 * 86400000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'c4',
    titulo: 'Análise de marca: Duolingo e o poder do caos controlado',
    tipo: 'youtube',
    plataformas: ['youtube', 'blog'],
    status: 'ideia',
    categoria: 'analise_marcas',
    created_at: new Date().toISOString(),
  },
  {
    id: 'c5',
    titulo: 'Série Mulheres Incríveis — Ep. 01: Luisa Sonza como marca',
    tipo: 'youtube',
    plataformas: ['youtube'],
    status: 'rascunho',
    categoria: 'mulheres_incriveis',
    data_filmagem: new Date(Date.now() + 5 * 86400000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'c6',
    titulo: 'Reel bastidores: minha rotina de criação de conteúdo',
    tipo: 'reel',
    plataformas: ['instagram'],
    status: 'agendado',
    categoria: 'bastidores',
    data_publicacao: new Date(Date.now() + 1 * 86400000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'c7',
    titulo: 'Carrossel: 7 erros de branding que destroem marcas pequenas',
    tipo: 'carrossel',
    plataformas: ['instagram', 'linkedin'],
    status: 'revisao',
    categoria: 'branding',
    data_publicacao: new Date(Date.now() + 4 * 86400000).toISOString(),
    created_at: new Date().toISOString(),
  },
]

const KANBAN_COLS = ['ideia', 'rascunho', 'filmando', 'editando', 'revisao', 'agendado', 'publicado'] as const

export default function ConteudoPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [search, setSearch] = useState('')

  const filtered = DEMO_CONTENT.filter((c) =>
    !search || c.titulo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-full"
      >
        {/* Header */}
        <div className="flex items-start justify-between max-w-5xl mx-auto">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Central de Conteúdo</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {DEMO_CONTENT.length} conteúdos · {DEMO_CONTENT.filter((c) => c.status === 'publicado').length} publicados
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl p-1 gap-1">
              <button
                onClick={() => setView('kanban')}
                className={`p-1.5 rounded-lg transition-all ${view === 'kanban' ? 'bg-[var(--accent-soft)] text-[var(--text-accent)]' : 'text-[var(--text-muted)]'}`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-[var(--accent-soft)] text-[var(--text-accent)]' : 'text-[var(--text-muted)]'}`}
              >
                <List size={15} />
              </button>
            </div>
            <Button variant="primary" size="sm">
              <Plus size={14} />
              Novo conteúdo
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-3 py-2 max-w-sm">
            <Search size={14} className="text-[var(--text-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar conteúdos..."
              className="text-sm flex-1"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-5xl mx-auto grid grid-cols-4 md:grid-cols-7 gap-2">
          {KANBAN_COLS.map((status) => {
            const cfg = STATUS_CONFIG[status]
            const count = DEMO_CONTENT.filter((c) => c.status === status).length
            return (
              <div key={status} className="text-center p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
                <p className="text-lg font-bold" style={{ color: cfg.color }}>{count}</p>
                <p className="text-[9px] text-[var(--text-muted)]">{cfg.label}</p>
              </div>
            )
          })}
        </div>

        {/* Kanban */}
        {view === 'kanban' && (
          <div className="flex gap-3 overflow-x-auto pb-4">
            {KANBAN_COLS.map((status) => {
              const cfg = STATUS_CONFIG[status]
              const items = filtered.filter((c) => c.status === status)
              return (
                <div key={status} className="flex-shrink-0 w-64">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                    <p className="text-xs font-semibold" style={{ color: cfg.color }}>{cfg.label}</p>
                    <span className="text-[10px] text-[var(--text-muted)] ml-auto">{items.length}</span>
                  </div>
                  <div className="space-y-2 min-h-[100px]">
                    {items.map((item) => {
                      const platColors = item.plataformas.map((p) => PLATFORM_COLORS[p]).filter(Boolean)
                      return (
                        <Card key={item.id} hoverable>
                          <CardBody className="py-3 px-3 space-y-2">
                            <div className="flex items-start gap-1.5">
                              <span className="text-sm flex-shrink-0 mt-0.5">{TYPE_EMOJIS[item.tipo]}</span>
                              <p className="text-xs font-medium text-[var(--text-primary)] leading-snug">{item.titulo}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1 flex-wrap">
                                {item.plataformas.slice(0, 3).map((p) => (
                                  <span
                                    key={p}
                                    className="text-[9px] px-1.5 py-0.5 rounded-full"
                                    style={{
                                      backgroundColor: `${PLATFORM_COLORS[p] || '#7C3AED'}22`,
                                      color: PLATFORM_COLORS[p] || '#7C3AED',
                                    }}
                                  >
                                    {PLATFORM_LABELS[p]}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {(item.data_publicacao || item.data_filmagem) && (
                              <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                                <Calendar size={9} />
                                {item.data_publicacao ? formatDate(item.data_publicacao) : `📹 ${formatDate(item.data_filmagem!)}`}
                              </p>
                            )}
                          </CardBody>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* List view */}
        {view === 'list' && (
          <div className="max-w-5xl mx-auto space-y-2">
            {filtered.map((item) => {
              const cfg = STATUS_CONFIG[item.status]
              return (
                <Card key={item.id} hoverable>
                  <CardBody className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg flex-shrink-0">{TYPE_EMOJIS[item.tipo]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{item.titulo}</p>
                        <p className="text-[11px] text-[var(--text-muted)]">{CATEGORY_LABELS[item.categoria] || item.categoria}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {item.data_publicacao && (
                          <span className="text-[11px] text-[var(--text-muted)]">{formatDate(item.data_publicacao)}</span>
                        )}
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: cfg.bg, color: cfg.color }}
                        >
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
