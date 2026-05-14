'use client'

import { useState } from 'react'
import { ChevronDown, CheckSquare, Square } from 'lucide-react'

const ROTINAS = [
  {
    id: 'manha',
    label: 'Rotina da Manhã',
    subtitle: 'Papel da Lola CEO',
    accent: '#FF78B0',
    steps: [
      'Verificar Google Agenda',
      'Definir prioridade principal do dia',
      'Checar mensagens dos clientes',
      'Captura mental rápida',
      'Revisar tarefas abertas',
    ],
  },
  {
    id: 'trabalho',
    label: 'Rotina de Trabalho',
    subtitle: 'Agência Logue',
    accent: '#A89AC9',
    steps: [
      'Conferir demandas abertas',
      'Responder e-mails e DMs profissionais',
      'Postar/agendar conteúdo do dia',
      'Registrar horas ou entregas',
    ],
  },
  {
    id: 'noite',
    label: 'Rotina da Noite',
    subtitle: 'Descompressão',
    accent: '#7FB68C',
    steps: [
      'Marcar tarefas concluídas',
      'Anotar ideia ou reflexão do dia',
      'Checar agenda do dia seguinte',
      'Fechar computador com intenção',
    ],
  },
]

function RotineBlock({ rotina }: { rotina: typeof ROTINAS[0] }) {
  const [open, setOpen] = useState(rotina.id === 'manha')
  const [checked, setChecked] = useState(() => {
    if (typeof window === 'undefined') return rotina.steps.map(() => false)
    const key = `rotina_${rotina.id}_${new Date().toDateString()}`
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : rotina.steps.map(() => false)
  })

  function toggle(i: number) {
    const next = checked.map((v: boolean, idx: number) => idx === i ? !v : v)
    setChecked(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`rotina_${rotina.id}_${new Date().toDateString()}`, JSON.stringify(next))
    }
  }

  const done = checked.filter(Boolean).length
  const pct = done / rotina.steps.length

  return (
    <div className="border rounded-[12px] overflow-hidden" style={{ borderColor: 'var(--gray-light)' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full px-4 py-3 bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: rotina.accent }}
          />
          <div className="text-left min-w-0">
            <p className="text-[13px] font-medium text-[var(--text-primary)] leading-tight">{rotina.label}</p>
            <p className="text-[11px] text-[var(--text-muted)]">{rotina.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span className="text-[11px] font-medium" style={{ color: rotina.accent }}>
            {done}/{rotina.steps.length}
          </span>
          <ChevronDown
            size={13}
            className="text-[var(--text-muted)] transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </button>

      {/* progress bar */}
      <div className="h-0.5 bg-[var(--bg-inset)]">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pct * 100}%`, backgroundColor: rotina.accent }}
        />
      </div>

      {open && (
        <div className="px-4 py-3 space-y-2 bg-[var(--bg-elevated)]">
          {rotina.steps.map((step, i) => (
            <button
              key={step}
              onClick={() => toggle(i)}
              className="flex items-center gap-2.5 w-full text-left group py-0.5"
            >
              {checked[i]
                ? <CheckSquare size={14} style={{ color: rotina.accent }} className="flex-shrink-0" />
                : <Square size={14} className="text-[var(--gray-light)] group-hover:text-pink-300 flex-shrink-0 transition-colors" />
              }
              <span className={`text-[12.5px] transition-colors leading-snug ${
                checked[i] ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
              }`}>
                {step}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function RotinasAncora() {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">Rotinas Âncora</p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">Estrutura que sustenta os dias.</p>
      </div>
      <div className="space-y-2">
        {ROTINAS.map((r) => <RotineBlock key={r.id} rotina={r} />)}
      </div>
    </div>
  )
}
