'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTopbar } from '@/lib/topbar-context'
import { clients, OsClient } from '@/lib/db'
import { CATEGORY_LABELS, PLATFORM_LABELS, PLATFORM_COLORS } from '@/lib/utils'
import {
  MY_ROUTINES, MY_CHANNELS, getClientRoutines, getStorySequence,
  rotateBySeed, dayOfYear, RoutineTemplate, Objetivo,
} from '@/lib/rotinas'
import { Heart, RefreshCw, Copy, Image as ImageIcon, Repeat2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

type Tab = 'meu' | 'clientes'

function objetivoStyle(o: Objetivo): { color: string; background: string } {
  switch (o) {
    case 'educação':      return { color: 'var(--blue)',   background: 'var(--blue-ghost)' }
    case 'autoridade':    return { color: 'var(--yellow)', background: 'var(--yellow-ghost)' }
    case 'vendas':        return { color: 'var(--green)',  background: 'var(--green-ghost)' }
    case 'relacionamento':return { color: 'var(--red)',    background: 'var(--red-ghost)' }
    case 'bastidores':    return { color: 'var(--fg-2)',   background: 'var(--surface-2)' }
  }
}

function Chip({ label, color, background }: { label: string; color: string; background: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: 999,
      fontSize: 11, fontWeight: 500, color, background, whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

async function copy(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copiado!`)
  } catch {
    toast.error('Não foi possível copiar.')
  }
}

function RoutineCard({ r, liked, onToggle }: { r: RoutineTemplate; liked: boolean; onToggle: () => void }) {
  const os = objetivoStyle(r.objetivo)
  return (
    <div style={{
      background: 'var(--surface-1)', border: `1px solid ${liked ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 'var(--r-lg)', padding: 18, display: 'flex', flexDirection: 'column', gap: 10,
      transition: 'border-color var(--dur)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <p style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg-1)', lineHeight: 1.4, margin: 0 }}>{r.titulo}</p>
        <button
          onClick={onToggle}
          title={liked ? 'Remover da lista' : 'Curtir esse tema'}
          style={{
            flexShrink: 0, width: 30, height: 30, borderRadius: 'var(--r-sm)',
            background: liked ? 'var(--accent-ghost)' : 'var(--surface-2)',
            border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Heart size={15} color={liked ? 'var(--accent)' : 'var(--fg-3)'} fill={liked ? 'var(--accent)' : 'none'} />
        </button>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Chip label={r.formato} color="var(--fg-2)" background="var(--surface-2)" />
        <Chip label={r.objetivo} color={os.color} background={os.background} />
        <Chip label={CATEGORY_LABELS[r.categoria] ?? r.categoria} color="var(--fg-3)" background="var(--surface-2)" />
      </div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {r.plataformas.map(p => (
          <span key={p} style={{ fontSize: 10.5, fontWeight: 500, padding: '2px 8px', borderRadius: 999, color: PLATFORM_COLORS[p], background: `${PLATFORM_COLORS[p]}20` }}>
            {PLATFORM_LABELS[p]}
          </span>
        ))}
      </div>
    </div>
  )
}

function RoutinePackage({ r }: { r: RoutineTemplate }) {
  const conteudoPronto = [r.gancho, ...r.corpo, r.cta].join('\n\n')
  const sequencia = getStorySequence(r.objetivo)

  return (
    <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <span className="os-eyebrow">{r.formato} · {r.objetivo}</span>
        <h3 className="os-title" style={{ fontSize: 16, color: 'var(--fg-1)', marginTop: 6 }}>{r.titulo}</h3>
      </div>

      {/* Conteúdo pronto */}
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span className="os-eyebrow">Conteúdo pronto</span>
          <button onClick={() => copy(conteudoPronto, 'Conteúdo')} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--fg-3)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <Copy size={12} /> Copiar
          </button>
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--fg-2)', whiteSpace: 'pre-line', margin: 0 }}>{conteudoPronto}</p>
      </div>

      {/* Prompt de arte */}
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span className="os-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ImageIcon size={12} /> Prompt para gerar a arte</span>
          <button onClick={() => copy(r.artPrompt, 'Prompt')} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--fg-3)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <Copy size={12} /> Copiar
          </button>
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--fg-2)', margin: 0 }}>{r.artPrompt}</p>
        <p style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 8, marginBottom: 0 }}>Cole esse prompt no gerador de imagem que você usar (Canva, claude.ai/design, Midjourney etc.).</p>
      </div>

      {/* Sequência de stories */}
      <div>
        <span className="os-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}><Repeat2 size={12} /> Sequência de stories pra divulgar</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sequencia.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--fg-4)', minWidth: 74, flexShrink: 0, paddingTop: 2 }}>{s.label}</span>
              <p style={{ fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.5, margin: 0 }}>{s.texto}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Desdobramento */}
      <div>
        <span className="os-eyebrow" style={{ marginBottom: 10, display: 'block' }}>Ideias de desdobramento</span>
        <ul style={{ margin: 0, padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {r.desdobramento.map((d, i) => (
            <li key={i} style={{ fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function RotinasPage() {
  const { setConfig } = useTopbar()
  const [tab, setTab] = useState<Tab>('meu')
  const [offset, setOffset] = useState(0)
  const [liked, setLiked] = useState<Set<string>>(new Set())
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  useEffect(() => {
    setConfig({ title: 'Rotina Diária de Conteúdo', subtitle: 'Selecione os temas de hoje e leve pra produção' })
  }, [setConfig])

  const today = useMemo(() => new Date(), [])
  const seed = dayOfYear(today) + offset

  const myToday = useMemo(() => rotateBySeed(MY_ROUTINES, seed, 6), [seed])

  const selectedClient: OsClient | undefined = clients.find(c => c.id === selectedClientId)
  const clientPool = useMemo(() => selectedClient ? getClientRoutines(selectedClient) : [], [selectedClient])
  const clientToday = useMemo(() => rotateBySeed(clientPool, seed, clientPool.length), [clientPool, seed])

  function toggleLike(id: string) {
    setLiked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function findRoutine(id: string): RoutineTemplate | undefined {
    return MY_ROUTINES.find(r => r.id === id)
      ?? clients.flatMap(c => getClientRoutines(c)).find(r => r.id === id)
  }

  const likedRoutines = [...liked].map(findRoutine).filter((r): r is RoutineTemplate => !!r)

  const dateLabel = today.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }} className="os-view-in">

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[{ id: 'meu' as Tab, label: 'Meu conteúdo' }, { id: 'clientes' as Tab, label: 'Clientes da Agência' }].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 16px', borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 500,
              border: '1px solid var(--border)',
              background: tab === t.id ? 'var(--accent-ghost)' : 'var(--surface-1)',
              color: tab === t.id ? 'var(--accent)' : 'var(--fg-2)',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'meu' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <span className="os-eyebrow">Rotina de hoje · {dateLabel}</span>
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {MY_CHANNELS.map(c => (
                  <Chip key={c.id} label={c.label} color="var(--fg-3)" background="var(--surface-2)" />
                ))}
              </div>
            </div>
            <button
              onClick={() => setOffset(o => o + 1)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--fg-2)', background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '8px 14px', cursor: 'pointer' }}
            >
              <RefreshCw size={13} /> Sortear outras
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {myToday.map(r => (
              <RoutineCard key={r.id} r={r} liked={liked.has(r.id)} onToggle={() => toggleLike(r.id)} />
            ))}
          </div>
        </div>
      )}

      {tab === 'clientes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <span className="os-eyebrow" style={{ display: 'block', marginBottom: 8 }}>Cliente</span>
            <select
              value={selectedClientId ?? ''}
              onChange={e => setSelectedClientId(e.target.value || null)}
              style={{
                padding: '10px 14px', borderRadius: 'var(--r-sm)', background: 'var(--surface-2)',
                border: '1px solid var(--border)', color: 'var(--fg-1)', fontSize: 13, minWidth: 260,
              }}
            >
              <option value="">Selecione um cliente</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {!selectedClient && (
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 40, textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'var(--fg-3)', margin: 0 }}>Escolha um cliente pra ver a rotina de conteúdo de hoje.</p>
            </div>
          )}

          {selectedClient && clientPool.length === 0 && (
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 40, textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'var(--fg-3)', margin: 0 }}>{selectedClient.name} está sem plano ativo no momento — sem brief pra gerar rotina de conteúdo agora.</p>
            </div>
          )}

          {selectedClient && clientPool.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              {clientToday.map(r => (
                <RoutineCard key={r.id} r={r} liked={liked.has(r.id)} onToggle={() => toggleLike(r.id)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pacote gerado das rotinas curtidas */}
      {likedRoutines.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span className="os-eyebrow">Conteúdo pronto · {likedRoutines.length} tema{likedRoutines.length > 1 ? 's' : ''} selecionado{likedRoutines.length > 1 ? 's' : ''}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {likedRoutines.map(r => <RoutinePackage key={r.id} r={r} />)}
          </div>
        </div>
      )}
    </div>
  )
}
