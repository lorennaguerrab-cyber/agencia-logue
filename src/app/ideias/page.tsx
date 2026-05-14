'use client'

import { useState } from 'react'
import { useLorennStore } from '@/lib/store'
import { Idea, IdeaCategory, Platform } from '@/lib/types'
import { CATEGORY_LABELS, PLATFORM_LABELS, PLATFORM_COLORS, cn } from '@/lib/utils'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Lightbulb,
  Plus,
  Search,
  Sparkles,
  FileText,
  Mail,
  Play,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

const STATUS_CONFIG = {
  bruta: { label: 'Bruta', color: '#9B99B4', variant: 'default' as const },
  desenvolvendo: { label: 'Desenvolvendo', color: '#FBBF24', variant: 'yellow' as const },
  pronta: { label: 'Pronta', color: '#34D399', variant: 'green' as const },
  aplicada: { label: 'Aplicada', color: '#A78BFA', variant: 'purple' as const },
}

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  instagram: <span className="text-[10px]">IG</span>,
  youtube: <Play size={11} />,
  tiktok: <span className="text-[10px]">TK</span>,
  blog: <FileText size={11} />,
  newsletter: <Mail size={11} />,
  linkedin: <span className="text-[10px]">in</span>,
  collab: <Sparkles size={11} />,
  pinterest: <span className="text-[10px]">Pi</span>,
}

const DEMO_IDEAS: Idea[] = [
  {
    id: 'demo1',
    titulo: '"Domingo é o único dia em que tenho 47 ideias criativas e zero energia pra executar qualquer uma."',
    descricao: 'Frase perfeita pra reel de bastidores. Ressonância altíssima com criadores.',
    categoria: 'bastidores',
    plataformas: ['instagram', 'tiktok'],
    status: 'pronta',
    tags: ['humor', 'relatable', 'bastidores'],
    conexoes: ['demo3'],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo2',
    titulo: 'Série "Mulheres que viraram marca" — Análise completa de posicionamento',
    descricao: 'Episódio 1: Luisa Sonza. Episódio 2: Kylie Jenner. Episódio 3: Anitta.',
    categoria: 'mulheres_incriveis',
    plataformas: ['youtube', 'blog', 'newsletter'],
    status: 'desenvolvendo',
    tags: ['série', 'branding', 'mulheres'],
    conexoes: ['demo4'],
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo3',
    titulo: 'Por que a Duolingo domina o TikTok (e o que você pode copiar)',
    descricao: 'Análise profunda da estratégia de conteúdo da Duolingo. Tom irreverente + consistência.',
    categoria: 'analise_marcas',
    plataformas: ['blog', 'youtube', 'newsletter'],
    status: 'bruta',
    tags: ['análise', 'tiktok', 'branding'],
    conexoes: [],
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo4',
    titulo: '5 ferramentas de IA que uso todo dia no trabalho (sem complicar)',
    descricao: 'Claude, Midjourney, Whisper, Canva AI, ChatGPT. Como uso cada um na prática.',
    categoria: 'inteligencia_artificial',
    plataformas: ['instagram', 'youtube', 'blog'],
    status: 'pronta',
    tags: ['IA', 'ferramentas', 'produtividade'],
    conexoes: [],
    created_at: new Date(Date.now() - 345600000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo5',
    titulo: 'Como me organizo sendo mãe, criadora de conteúdo e dona de agência',
    descricao: 'O método real — sem glamour, sem mentira. Maternidade + trabalho autoral.',
    categoria: 'maternidade',
    plataformas: ['instagram', 'blog', 'newsletter'],
    status: 'desenvolvendo',
    tags: ['maternidade', 'rotina', 'autoral'],
    conexoes: [],
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [IdeaCategory, string][]
const PLATFORMS = Object.entries(PLATFORM_LABELS) as [Platform, string][]

export default function IdeiasPage() {
  const { ideas: storeIdeas, addIdea } = useLorennStore()
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<IdeaCategory | 'todas'>('todas')
  const [filterStatus, setFilterStatus] = useState<string>('todos')
  const [showForm, setShowForm] = useState(false)
  const [newIdea, setNewIdea] = useState({ titulo: '', descricao: '', categoria: 'criatividade' as IdeaCategory })

  const allIdeas = storeIdeas.length > 0 ? [...storeIdeas, ...DEMO_IDEAS] : DEMO_IDEAS

  const filtered = allIdeas.filter((idea) => {
    const matchSearch = !search || idea.titulo.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCategory === 'todas' || idea.categoria === filterCategory
    const matchStatus = filterStatus === 'todos' || idea.status === filterStatus
    return matchSearch && matchCat && matchStatus
  })

  function handleCreate() {
    if (!newIdea.titulo.trim()) return
    addIdea({
      id: crypto.randomUUID(),
      titulo: newIdea.titulo,
      descricao: newIdea.descricao,
      categoria: newIdea.categoria,
      plataformas: [],
      status: 'bruta',
      tags: [],
      conexoes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    toast.success('Ideia salva!')
    setNewIdea({ titulo: '', descricao: '', categoria: 'criatividade' })
    setShowForm(false)
  }

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Banco de Ideias</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {allIdeas.length} ideias · {allIdeas.filter((i) => i.status === 'pronta').length} prontas para usar
            </p>
          </div>
          <Button variant="primary" onClick={() => setShowForm(true)}>
            <Plus size={15} />
            Nova ideia
          </Button>
        </div>

        {/* New idea form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card variant="accent">
                <CardBody className="pt-5 space-y-3">
                  <input
                    autoFocus
                    value={newIdea.titulo}
                    onChange={(e) => setNewIdea({ ...newIdea, titulo: e.target.value })}
                    placeholder="Qual é a ideia?"
                    className="w-full text-sm text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-2.5 focus:border-[var(--border-accent)] transition-colors"
                  />
                  <textarea
                    value={newIdea.descricao}
                    onChange={(e) => setNewIdea({ ...newIdea, descricao: e.target.value })}
                    placeholder="Desenvolva um pouco... (opcional)"
                    className="w-full text-sm text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-2.5 resize-none h-20 focus:border-[var(--border-accent)] transition-colors"
                  />
                  <select
                    value={newIdea.categoria}
                    onChange={(e) => setNewIdea({ ...newIdea, categoria: e.target.value as IdeaCategory })}
                    className="text-sm text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-2 w-full"
                  >
                    {CATEGORIES.map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancelar</Button>
                    <Button variant="primary" size="sm" onClick={handleCreate}>Salvar ideia</Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap items-center">
          <div className="flex items-center gap-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-3 py-2 flex-1 max-w-xs">
            <Search size={14} className="text-[var(--text-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ideias..."
              className="text-sm flex-1"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="text-sm text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-3 py-2"
          >
            <option value="todas">Todas categorias</option>
            {CATEGORIES.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-3 py-2"
          >
            <option value="todos">Todos status</option>
            {Object.entries(STATUS_CONFIG).map(([value, cfg]) => (
              <option key={value} value={value}>{cfg.label}</option>
            ))}
          </select>
        </div>

        {/* Ideas grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((idea) => {
            const status = STATUS_CONFIG[idea.status]
            return (
              <Card key={idea.id} hoverable>
                <CardBody className="pt-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-[var(--text-primary)] leading-snug flex-1">
                      {idea.titulo}
                    </p>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>

                  {idea.descricao && (
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {idea.descricao}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 flex-wrap">
                      <Badge variant="default">{CATEGORY_LABELS[idea.categoria] || idea.categoria}</Badge>
                      {idea.plataformas.map((p) => (
                        <span
                          key={p}
                          className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: `${PLATFORM_COLORS[p] || '#7C3AED'}22`,
                            color: PLATFORM_COLORS[p] || '#7C3AED',
                          }}
                        >
                          {PLATFORM_ICONS[p]}
                          {PLATFORM_LABELS[p]}
                        </span>
                      ))}
                    </div>
                    {idea.conexoes.length > 0 && (
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {idea.conexoes.length} conexão(ões)
                      </span>
                    )}
                  </div>

                  {/* Suggested platforms */}
                  {idea.plataformas.length === 0 && (
                    <div className="pt-1">
                      <p className="text-[10px] text-[var(--text-muted)] mb-1.5">Onde pode usar:</p>
                      <div className="flex gap-1 flex-wrap">
                        {(['instagram', 'youtube', 'blog', 'newsletter'] as Platform[]).map((p) => (
                          <span
                            key={p}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-hover)] text-[var(--text-muted)] border border-[var(--border)]"
                          >
                            {PLATFORM_LABELS[p]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Lightbulb size={32} className="text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
            <p className="text-[var(--text-muted)]">Nenhuma ideia encontrada.</p>
            <Button variant="primary" size="sm" className="mt-4" onClick={() => setShowForm(true)}>
              Criar a primeira ideia
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
