'use client'

import { useState } from 'react'
import { CRMContact } from '@/lib/types'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PLATFORM_LABELS } from '@/lib/utils'
import { Sparkles, Plus, Search, MessageCircle, ExternalLink, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

const DEMO_CONTACTS: CRMContact[] = [
  {
    id: 'crm1',
    nome: 'Reserva',
    tipo: 'marca',
    status: 'potencial',
    plataforma: 'instagram',
    proposta: 'UGC de moda feminina — coleção inverno 2026',
    valor: 800,
    proxima_acao: 'Enviar proposta personalizada',
    data_followup: new Date(Date.now() + 2 * 86400000).toISOString(),
    notas: 'Marca com estética alinhada. Alta chance de fechar.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'crm2',
    nome: 'Mari Gonzalez',
    tipo: 'influencer',
    status: 'em_contato',
    plataforma: 'instagram',
    proposta: 'Collab série "Mulheres que viraram marca"',
    proxima_acao: 'Responder DM com proposta de formato',
    data_followup: new Date(Date.now() + 86400000).toISOString(),
    notas: '300k seguidores. Nicho comportamento e carreira.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'crm3',
    nome: 'iFood',
    tipo: 'marca',
    status: 'negociando',
    plataforma: 'instagram',
    proposta: 'UGC campanha "Mãe que pede iFood"',
    valor: 1500,
    proxima_acao: 'Alinhar briefing criativo com o time',
    notas: 'Contato via e-mail. Segunda reunião agendada.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'crm4',
    nome: 'Paolla Gisele',
    tipo: 'collab',
    status: 'fechado',
    plataforma: 'instagram',
    proposta: 'UGC planejamento — collab conjunto',
    valor: 600,
    proxima_acao: 'Entregar conteúdo até dia 20',
    notas: 'Collab confirmado. Conteúdo em produção.',
    created_at: new Date().toISOString(),
  },
]

const STATUS_CONFIG = {
  potencial: { label: 'Potencial', variant: 'blue' as const, color: '#60A5FA' },
  em_contato: { label: 'Em contato', variant: 'yellow' as const, color: '#FBBF24' },
  negociando: { label: 'Negociando', variant: 'purple' as const, color: '#A78BFA' },
  fechado: { label: 'Fechado', variant: 'green' as const, color: '#34D399' },
  arquivado: { label: 'Arquivado', variant: 'default' as const, color: '#5A5870' },
}

const TYPE_CONFIG = {
  marca: { label: 'Marca', emoji: '🏢' },
  influencer: { label: 'Influencer', emoji: '⭐' },
  ugc: { label: 'UGC', emoji: '📱' },
  collab: { label: 'Collab', emoji: '🤝' },
  networking: { label: 'Network', emoji: '🌐' },
}

export default function CRMPage() {
  const [contacts, setContacts] = useState<CRMContact[]>(DEMO_CONTACTS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('todos')

  const filtered = contacts.filter((c) => {
    const matchSearch = !search || c.nome.toLowerCase().includes(search.toLowerCase()) || c.proposta?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'todos' || c.status === filterStatus
    return matchSearch && matchStatus
  })

  const pendingFollowups = contacts.filter((c) =>
    c.data_followup && new Date(c.data_followup) <= new Date(Date.now() + 3 * 86400000) && c.status !== 'arquivado'
  )

  function updateStatus(id: string, status: CRMContact['status']) {
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, status } : c))
    toast.success('Status atualizado!')
  }

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">CRM Criativo</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Marcas, collabs, influencers e networking em um lugar
            </p>
          </div>
          <Button variant="primary">
            <Plus size={15} />
            Novo contato
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
            <Card key={status}>
              <CardBody className="py-3">
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{cfg.label}</p>
                <p className="text-xl font-bold mt-1" style={{ color: cfg.color }}>
                  {contacts.filter((c) => c.status === status).length}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Follow-up alerts */}
        {pendingFollowups.length > 0 && (
          <Card variant="accent">
            <CardBody className="py-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-[var(--text-accent)]" />
                <p className="text-xs font-semibold text-[var(--text-accent)]">
                  {pendingFollowups.length} follow-up(s) próximo(s)
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {pendingFollowups.map((c) => (
                  <span
                    key={c.id}
                    className="text-xs px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)]"
                  >
                    {c.nome} — {c.proxima_acao}
                  </span>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-3 py-2 flex-1 max-w-xs">
            <Search size={14} className="text-[var(--text-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar contatos..."
              className="text-sm flex-1"
            />
          </div>
          <div className="flex gap-1.5">
            {['todos', ...Object.keys(STATUS_CONFIG)].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  filterStatus === s
                    ? 'bg-[var(--accent-soft)] border-[var(--border-accent)] text-[var(--text-accent)]'
                    : 'bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                {s === 'todos' ? 'Todos' : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Board view */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((contact) => {
            const status = STATUS_CONFIG[contact.status]
            const type = TYPE_CONFIG[contact.tipo]
            return (
              <Card key={contact.id} hoverable>
                <CardBody className="pt-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{type.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{contact.nome}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{type.label} · {contact.plataforma && PLATFORM_LABELS[contact.plataforma]}</p>
                      </div>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>

                  {contact.proposta && (
                    <p className="text-xs text-[var(--text-secondary)] leading-snug">{contact.proposta}</p>
                  )}

                  {contact.valor && (
                    <p className="text-sm font-semibold" style={{ color: '#34D399' }}>
                      R$ {contact.valor.toLocaleString('pt-BR')}
                    </p>
                  )}

                  {contact.proxima_acao && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-base)] border border-[var(--border)]">
                      <MessageCircle size={12} className="text-[var(--text-muted)] flex-shrink-0" />
                      <span className="text-xs text-[var(--text-secondary)]">{contact.proxima_acao}</span>
                    </div>
                  )}

                  {contact.notas && (
                    <p className="text-[11px] text-[var(--text-muted)] italic">{contact.notas}</p>
                  )}

                  {/* Status actions */}
                  <div className="flex gap-1.5 pt-1 flex-wrap">
                    {contact.status === 'potencial' && (
                      <Button size="sm" variant="secondary" onClick={() => updateStatus(contact.id, 'em_contato')}>
                        Entrar em contato
                      </Button>
                    )}
                    {contact.status === 'em_contato' && (
                      <Button size="sm" variant="secondary" onClick={() => updateStatus(contact.id, 'negociando')}>
                        Iniciar negociação
                      </Button>
                    )}
                    {contact.status === 'negociando' && (
                      <Button size="sm" variant="primary" onClick={() => updateStatus(contact.id, 'fechado')}>
                        Fechar ✓
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
