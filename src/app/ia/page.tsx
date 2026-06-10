'use client'

import { useEffect, useState } from 'react'
import { useTopbar } from '@/lib/topbar-context'
import { clients } from '@/lib/db'
import { Sparkles, Clock, ArrowUpRight } from 'lucide-react'

interface Idea {
  t: string
  f: string
  o: string
  time: string
}

const ideasByClient: Record<string, Idea[]> = {
  igor: [
    { t: 'Os 3 erros ao escolher uma armação', f: 'Reel', o: 'educação', time: '1 dia' },
    { t: 'Bastidores: como nasce uma coleção autoral', f: 'Carrossel', o: 'autoridade', time: '2 dias' },
    { t: 'Cliente conta por que voltou à Igor Giordano', f: 'Reel', o: 'relacionamento', time: '1 dia' },
    { t: 'Aniversário 4 anos: a história da ótica', f: 'Reel', o: 'autoridade', time: '2 dias' },
    { t: 'Antes/depois: lente certa muda tudo', f: 'Estático', o: 'vendas', time: '4h' },
    { t: 'Quiz: qual armação combina com seu rosto', f: 'Story', o: 'relacionamento', time: '4h' },
  ],
  mariana: [
    { t: 'Ansiedade não é frescura: entenda', f: 'Reel', o: 'educação', time: '1 dia' },
    { t: '3 sinais de que a terapia está funcionando', f: 'Carrossel', o: 'autoridade', time: '1 dia' },
    { t: 'Mito x verdade sobre TCC', f: 'Carrossel', o: 'educação', time: '1 dia' },
    { t: 'Como é a primeira sessão (sem medo)', f: 'Reel', o: 'relacionamento', time: '1 dia' },
    { t: 'Pausa de 1 minuto: respiração guiada', f: 'Reel', o: 'relacionamento', time: '4h' },
    { t: 'Quando procurar um psicólogo?', f: 'Estático', o: 'vendas', time: '4h' },
  ],
}

function getObjectiveStyle(o: string): { color: string; background: string; borderColor: string } {
  switch (o) {
    case 'educação':
      return { color: 'var(--blue)', background: 'var(--blue-ghost)', borderColor: 'rgba(77,153,255,.24)' }
    case 'autoridade':
      return { color: 'var(--yellow)', background: 'var(--yellow-ghost)', borderColor: 'rgba(232,255,77,.24)' }
    case 'vendas':
      return { color: 'var(--green)', background: 'var(--green-ghost)', borderColor: 'rgba(77,255,145,.24)' }
    default:
      return { color: 'var(--fg-2)', background: 'var(--surface-2)', borderColor: 'var(--border)' }
  }
}

function Chip({ label, color, background, borderColor }: { label: string; color: string; background: string; borderColor: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: 999,
      fontSize: 11, fontWeight: 500,
      border: '1px solid',
      color, background, borderColor,
    }}>
      {label}
    </span>
  )
}

export default function IAPage() {
  const { setConfig } = useTopbar()

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [objetivo, setObjetivo] = useState('')
  const [evento, setEvento] = useState('')
  const [restricoes, setRestricoes] = useState('')
  const [generated, setGenerated] = useState(false)

  useEffect(() => {
    setConfig({
      title: 'IA de Conteúdo',
      subtitle: 'Ideias com o contexto real da marca',
    })
  }, [setConfig])

  const selectedClient = clients.find(c => c.id === selectedClientId)

  function getIdeas(): Idea[] {
    if (!selectedClientId) return ideasByClient.igor
    return ideasByClient[selectedClientId] ?? ideasByClient.igor
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    borderRadius: 'var(--r-sm)',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    color: 'var(--fg-1)', fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 600,
    letterSpacing: '0.06em', textTransform: 'uppercase' as const,
    color: 'var(--fg-3)', marginBottom: 6,
  }

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }} className="os-view-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Form card */}
          <div style={{
            background: 'var(--surface-1)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)', padding: 24,
          }}>
            <span className="os-eyebrow" style={{
              display: 'block', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--fg-3)', marginBottom: 20,
            }}>
              Configurar geração
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

              {/* Cliente — full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Cliente</label>
                <select
                  value={selectedClientId ?? ''}
                  onChange={e => {
                    setSelectedClientId(e.target.value || null)
                    setGenerated(false)
                  }}
                  style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Objetivo do mês */}
              <div>
                <label style={labelStyle}>Objetivo do mês</label>
                <input
                  type="text"
                  placeholder="Ex.: aumentar autoridade"
                  value={objetivo}
                  onChange={e => setObjetivo(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Evento especial */}
              <div>
                <label style={labelStyle}>Evento especial</label>
                <input
                  type="text"
                  placeholder="Ex.: aniversário, lançamento"
                  value={evento}
                  onChange={e => setEvento(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Restrições — full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Restrições</label>
                <input
                  type="text"
                  placeholder="Ex.: não falar preço, sem promessas"
                  value={restricoes}
                  onChange={e => setRestricoes(e.target.value)}
                  style={inputStyle}
                />
              </div>

            </div>

            {/* Button row */}
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  if (selectedClientId) setGenerated(true)
                }}
                disabled={!selectedClientId}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px', borderRadius: 'var(--r-sm)',
                  background: selectedClientId ? 'var(--accent)' : 'var(--surface-2)',
                  color: selectedClientId ? '#0a0a0a' : 'var(--fg-4)',
                  fontSize: 13, fontWeight: 600,
                  border: '1px solid transparent', cursor: selectedClientId ? 'pointer' : 'not-allowed',
                  transition: 'background var(--dur)',
                }}
              >
                <Sparkles size={15} />
                Gerar ideias
              </button>
            </div>
          </div>

          {/* Ideas section */}
          {!selectedClientId && (
            <div style={{
              background: 'var(--surface-1)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)', padding: 40,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            }}>
              <Sparkles size={32} style={{ color: 'var(--fg-4)' }} />
              <p className="os-title" style={{ fontSize: 15, color: 'var(--fg-2)', margin: 0 }}>
                Selecione um cliente
              </p>
              <p style={{ fontSize: 13, color: 'var(--fg-3)', margin: 0, textAlign: 'center' }}>
                Escolha um cliente acima para gerar ideias contextualizadas para a marca.
              </p>
            </div>
          )}

          {selectedClientId && generated && (
            <div style={{
              background: 'var(--surface-1)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)', padding: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <span className="os-eyebrow" style={{
                  fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--fg-3)',
                }}>
                  Ideias geradas
                </span>
                <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>
                  {getIdeas().length} ideias
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {getIdeas().map((idea, i) => {
                  const objStyle = getObjectiveStyle(idea.o)
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 16,
                      padding: '16px', borderRadius: 'var(--r-md)',
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                    }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: 'var(--fg-4)',
                        fontVariantNumeric: 'tabular-nums',
                        flexShrink: 0, marginTop: 2, minWidth: 20,
                      }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg-1)', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                          {idea.t}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          <Chip
                            label={idea.f}
                            color="var(--fg-2)"
                            background="var(--surface-1)"
                            borderColor="var(--border)"
                          />
                          <Chip
                            label={idea.o}
                            color={objStyle.color}
                            background={objStyle.background}
                            borderColor={objStyle.borderColor}
                          />
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '3px 10px', borderRadius: 999,
                            fontSize: 11, fontWeight: 500,
                            color: 'var(--fg-3)',
                          }}>
                            <Clock size={10} />
                            {idea.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Brand context card — only when client is selected */}
          {selectedClient && (
            <div style={{
              background: 'var(--surface-1)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)', padding: 24,
            }}>
              <span className="os-eyebrow" style={{
                display: 'block', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--fg-3)', marginBottom: 16,
              }}>
                Contexto da marca
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Tom de voz', value: selectedClient.tone },
                  { label: 'Segmento', value: selectedClient.segment },
                  { label: 'Plano', value: selectedClient.plan ? selectedClient.plan : '—' },
                ].map(field => (
                  <div key={field.label}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                      {field.label}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  Briefing
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.6, margin: 0 }}>
                  {selectedClient.brief}
                </p>
              </div>
            </div>
          )}

          {/* Como funciona card — always shown */}
          <div style={{
            background: 'var(--surface-1)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)', padding: 24,
          }}>
            <span className="os-eyebrow" style={{
              display: 'block', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--fg-3)', marginBottom: 16,
            }}>
              Como funciona
            </span>
            <ol style={{ margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Selecione o cliente para carregar o briefing e tom de voz.',
                'Defina o objetivo do mês e eventos especiais.',
                'Adicione restrições que a IA deve respeitar.',
                'Clique em "Gerar ideias" para criar sugestões contextualizadas.',
                'Use as ideias como base para roteiros, reels e carrosséis.',
              ].map((step, i) => (
                <li key={i} style={{ fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.6 }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>
    </div>
  )
}
