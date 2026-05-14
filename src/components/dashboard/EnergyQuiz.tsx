'use client'

import { useState } from 'react'
import { useLorennStore } from '@/lib/store'
import { ENERGY_CONFIGS } from '@/lib/energy'
import type { EnergyMode } from '@/lib/types'
import { X, ChevronRight, Sparkles } from 'lucide-react'

const QUESTIONS = [
  {
    id: 'corpo',
    pergunta: 'Como está seu corpo agora?',
    opcoes: [
      { label: 'Pesado, cansado — precisando de leveza', modos: ['cansada', 'maternidade'] },
      { label: 'Com energia, pronto para produzir', modos: ['operacional', 'foco'] },
      { label: 'Elétrico, cheio de vontade de criar', modos: ['criativa', 'gravacao'] },
      { label: 'Tranquilo, no ritmo — nem acelerado nem no fundo', modos: ['social', 'operacional'] },
    ],
  },
  {
    id: 'mente',
    pergunta: 'O que está passando na sua cabeça?',
    opcoes: [
      { label: 'Muita coisa ao mesmo tempo — preciso organizar', modos: ['operacional', 'foco'] },
      { label: 'Ideias piscando — quero explorar e criar', modos: ['criativa', 'foco'] },
      { label: 'Pensamentos dos filhos, família, casa', modos: ['maternidade', 'cansada'] },
      { label: 'Quase em branco — estou presente, mas vazia', modos: ['cansada', 'social'] },
    ],
  },
  {
    id: 'vontade',
    pergunta: 'O que você conseguiria fazer agora sem forçar?',
    opcoes: [
      { label: 'Responder mensagens, organizar coisas simples', modos: ['social', 'cansada'] },
      { label: 'Criar, escrever, gravar algo', modos: ['criativa', 'gravacao'] },
      { label: 'Executar tarefas, cumprir entregas', modos: ['operacional', 'foco'] },
      { label: 'Estar presente com os filhos ou descansar', modos: ['maternidade', 'cansada'] },
    ],
  },
  {
    id: 'contexto',
    pergunta: 'Como está seu contexto agora?',
    opcoes: [
      { label: 'Estou em casa, filhos por perto', modos: ['maternidade', 'social'] },
      { label: 'Tenho bloco de tempo livre — posso me concentrar', modos: ['foco', 'criativa'] },
      { label: 'Tenho câmera, luz, estrutura — posso gravar', modos: ['gravacao', 'criativa'] },
      { label: 'Estou no modo trabalho, mas sem criatividade alta', modos: ['operacional', 'social'] },
    ],
  },
]

function score(answers: number[]): EnergyMode {
  const counts: Partial<Record<EnergyMode, number>> = {}

  answers.forEach((ansIdx, qIdx) => {
    const modos = QUESTIONS[qIdx].opcoes[ansIdx]?.modos ?? []
    modos.forEach((m) => {
      counts[m as EnergyMode] = (counts[m as EnergyMode] ?? 0) + 1
    })
  })

  const sorted = (Object.entries(counts) as [EnergyMode, number][]).sort((a, b) => b[1] - a[1])
  return sorted[0]?.[0] ?? 'operacional'
}

interface Props {
  onClose: () => void
}

export function EnergyQuiz({ onClose }: Props) {
  const { setEnergyMode } = useLorennStore()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<EnergyMode | null>(null)

  function choose(optionIdx: number) {
    const next = [...answers, optionIdx]

    if (step < QUESTIONS.length - 1) {
      setAnswers(next)
      setStep(step + 1)
    } else {
      const mode = score(next)
      setResult(mode)
    }
  }

  function apply() {
    if (result) {
      setEnergyMode(result)
      onClose()
    }
  }

  const q = QUESTIONS[step]
  const energy = result ? ENERGY_CONFIGS[result] : null
  const progress = ((step) / QUESTIONS.length) * 100

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(43,43,43,0.35)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full max-w-md rounded-[20px] border bg-[var(--bg-surface)]"
        style={{ borderColor: 'var(--gray-light)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: 'var(--gray-light)' }}>
          <div>
            <p className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {result ? 'Resultado' : `Pergunta ${step + 1} de ${QUESTIONS.length}`}
            </p>
            <p className="text-[14px] font-semibold text-[var(--text-primary)] mt-0.5">
              {result ? 'Sua energia agora' : 'Quiz de energia'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--bg-base)] transition-colors"
          >
            <X size={14} className="text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Progress bar */}
        {!result && (
          <div className="h-0.5 bg-[var(--bg-base)]">
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${progress}%`, background: 'var(--pink)' }}
            />
          </div>
        )}

        <div className="p-6">
          {!result ? (
            <>
              <p className="text-[16px] font-medium text-[var(--text-primary)] leading-snug mb-5">
                {q.pergunta}
              </p>
              <div className="space-y-2.5">
                {q.opcoes.map((op, i) => (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    className="w-full text-left px-4 py-3.5 rounded-[12px] border text-[13.5px] text-[var(--text-secondary)] transition-all hover:border-pink-300 hover:bg-[var(--pink-tint)] hover:text-[var(--text-primary)] flex items-center justify-between group"
                    style={{ borderColor: 'var(--gray-light)' }}
                  >
                    {op.label}
                    <ChevronRight size={13} className="text-[var(--text-muted)] group-hover:text-[var(--pink)] flex-shrink-0 ml-2 transition-colors" />
                  </button>
                ))}
              </div>
            </>
          ) : energy ? (
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"
                style={{ background: `color-mix(in srgb, ${energy.accent} 14%, white)` }}
              >
                {energy.emoji}
              </div>
              <p className="text-[22px] font-semibold leading-tight mb-1" style={{ color: energy.accent, fontFamily: 'var(--font-syne)' }}>
                {energy.label}
              </p>
              <p className="text-[13px] text-[var(--text-secondary)] mb-6 leading-relaxed">
                {energy.description}
              </p>

              <div className="rounded-[12px] p-4 mb-6 text-left space-y-1.5" style={{ background: `color-mix(in srgb, ${energy.accent} 8%, white)`, border: `1px solid color-mix(in srgb, ${energy.accent} 20%, white)` }}>
                <p className="text-[10.5px] font-medium uppercase tracking-[0.12em] mb-2" style={{ color: energy.accent }}>O que faz sentido agora</p>
                {energy.suggestedActions.slice(0, 4).map((a) => (
                  <div key={a} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: energy.accent }} />
                    <p className="text-[12.5px] text-[var(--text-secondary)]">{a}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { setStep(0); setAnswers([]); setResult(null) }}
                  className="flex-1 px-4 py-2.5 rounded-full border text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-base)] transition-colors"
                  style={{ borderColor: 'var(--gray-light)' }}
                >
                  Refazer
                </button>
                <button
                  onClick={apply}
                  className="flex-1 px-4 py-2.5 rounded-full text-[13px] font-semibold text-white flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                  style={{ background: energy.accent }}
                >
                  <Sparkles size={13} />
                  Aplicar energia
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
