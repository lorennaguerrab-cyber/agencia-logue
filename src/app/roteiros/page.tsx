'use client'

import { useEffect, useState } from 'react'
import { useTopbar } from '@/lib/topbar-context'
import { clients, clientById, fmt } from '@/lib/db'
import { Film, Download } from 'lucide-react'

interface Block {
  num: string
  tag: string
  cena: string
  perguntas: string[]
  edicao: string
}

function getBlocks(clientName: string): Block[] {
  return [
    {
      num: '01',
      tag: 'Gancho / Abertura',
      cena: `${clientName} segura uma armação contra a luz da vitrine. Close no detalhe da haste autoral.`,
      perguntas: [
        'O que te fez abrir a ótica há 4 anos?',
        'Qual foi a primeira armação que você desenhou?',
      ],
      edicao: 'Corte seco na batida da música. Texto na tela: "4 anos enxergando diferente."',
    },
    {
      num: '02',
      tag: 'Desenvolvimento / Conflito',
      cena: `Bastidores do atendimento: ${clientName} ajustando óculos no rosto de um cliente, conversa real.`,
      perguntas: [
        'O que muda quando a armação é escolhida a dedo?',
        'Conta de um cliente que voltou a enxergar bem.',
      ],
      edicao: 'B-roll em câmera lenta das mãos. Áudio ambiente baixo sob a narração.',
    },
    {
      num: '03',
      tag: 'Virada / Emoção',
      cena: 'Cliente se olha no espelho e sorri. Reação genuína, sem roteiro de fala.',
      perguntas: [
        'Como é ver a reação de alguém que se gostou no espelho?',
      ],
      edicao: 'Sobe a música no sorriso. Texto: "não é só óculos. é como você se vê."',
    },
    {
      num: '04',
      tag: 'CTA / Fechamento',
      cena: `${clientName} de braços cruzados na frente da loja, olhando pra câmera com confiança.`,
      perguntas: [
        'Convida quem tá assistindo pra conhecer.',
      ],
      edicao: 'Logo no canto. CTA: agende seu horário.',
    },
  ]
}

export default function RoteirosPage() {
  const { setConfig } = useTopbar()

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [videoType, setVideoType] = useState('Institucional/aniversário')
  const [objetivo, setObjetivo] = useState('Conexão/orgulho')
  const [duracao, setDuracao] = useState('30–45s')
  const [generated, setGenerated] = useState(false)

  useEffect(() => {
    setConfig({
      title: 'Gerador de Roteiros',
      subtitle: 'Metodologia Logue · roteiro em 4 blocos',
    })
  }, [setConfig])

  const selectedClient = selectedClientId ? clientById(selectedClientId) : null

  const scriptTitle =
    selectedClient?.id === 'igor'
      ? 'Aniversário 4 anos — Igor Giordano Eyewear'
      : selectedClient
      ? `${selectedClient.name} — vídeo institucional`
      : ''

  const blocks = selectedClient ? getBlocks(selectedClient.name) : []

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }} className="os-view-in">

      {/* Top form card */}
      <div style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        padding: 24,
        marginBottom: 20,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>

          {/* Cliente */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
              Cliente
            </label>
            <select
              value={selectedClientId ?? ''}
              onChange={e => { setSelectedClientId(e.target.value || null); setGenerated(false) }}
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--fg-1)',
                fontSize: 13,
                padding: '10px 12px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">Selecionar cliente…</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Tipo de vídeo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
              Tipo de vídeo
            </label>
            <select
              value={videoType}
              onChange={e => setVideoType(e.target.value)}
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--fg-1)',
                fontSize: 13,
                padding: '10px 12px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option>Institucional/aniversário</option>
              <option>Depoimento</option>
              <option>Educativo</option>
              <option>Bastidores</option>
            </select>
          </div>

          {/* Objetivo emocional */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
              Objetivo emocional
            </label>
            <select
              value={objetivo}
              onChange={e => setObjetivo(e.target.value)}
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--fg-1)',
                fontSize: 13,
                padding: '10px 12px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option>Conexão/orgulho</option>
              <option>Confiança</option>
              <option>Aspiração</option>
              <option>Identificação</option>
            </select>
          </div>

          {/* Duração final */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
              Duração final
            </label>
            <select
              value={duracao}
              onChange={e => setDuracao(e.target.value)}
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-sm)',
                color: 'var(--fg-1)',
                fontSize: 13,
                padding: '10px 12px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option>30–45s</option>
              <option>60s</option>
              <option>90s</option>
            </select>
          </div>
        </div>

        {/* Button row */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setGenerated(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 'var(--r-sm)',
              background: 'var(--accent)', color: '#0a0a0a',
              fontSize: 13, fontWeight: 600,
              border: '1px solid transparent', cursor: 'pointer',
            }}
          >
            <Film size={16} /> Gerar roteiro
          </button>

          {generated && (
            <button
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', borderRadius: 'var(--r-sm)',
                background: 'transparent', color: 'var(--fg-2)',
                fontSize: 13, fontWeight: 500,
                border: '1px solid var(--border)', cursor: 'pointer',
              }}
            >
              <Download size={16} /> Exportar roteiro
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {(!selectedClientId || !generated) && (
        <div style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)',
          padding: 48,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          textAlign: 'center',
        }}>
          <span style={{
            width: 56, height: 56, borderRadius: 'var(--r-md)',
            background: 'var(--surface-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--fg-3)',
            marginBottom: 4,
          }}>
            <Film size={28} />
          </span>
          <span className="os-title" style={{ fontSize: 16, color: 'var(--fg-1)' }}>
            Roteiro em 4 blocos
          </span>
          <span style={{ fontSize: 13, color: 'var(--fg-3)', maxWidth: 360, lineHeight: 1.6 }}>
            Selecione um cliente e preencha as opções acima para gerar um roteiro estruturado pela Metodologia Logue.
          </span>
        </div>
      )}

      {/* Generated state */}
      {selectedClientId && generated && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Meta section */}
          <div style={{ marginBottom: 4 }}>
            <div className="os-eyebrow" style={{ marginBottom: 6 }}>Roteiro gerado</div>
            <h2 className="os-title" style={{ fontSize: 22, color: 'var(--fg-1)', letterSpacing: '-0.02em', margin: 0 }}>
              {scriptTitle}
            </h2>
          </div>

          {/* 4 block cards */}
          {blocks.map(block => (
            <div
              key={block.num}
              style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-lg)',
                padding: 24,
              }}
            >
              {/* Block head */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--fg-3)',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-sm)',
                  padding: '3px 8px',
                  letterSpacing: '0.06em',
                }}>
                  {block.num}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)' }}>
                  {block.tag}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* Cena */}
                <div>
                  <div className="os-eyebrow" style={{ marginBottom: 6 }}>Cena</div>
                  <p style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.7, margin: 0 }}>
                    {block.cena}
                  </p>
                </div>

                {/* Perguntas */}
                <div>
                  <div className="os-eyebrow" style={{ marginBottom: 8 }}>Perguntas de destrave</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {block.perguntas.map((q, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.6 }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 7 }} />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direção de edição */}
                <div>
                  <div className="os-eyebrow" style={{ marginBottom: 6 }}>Direção de edição</div>
                  <p style={{ fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.7, margin: 0 }}>
                    {block.edicao}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
