'use client'

import { useState } from 'react'
import { ClientHeader } from '@/components/client/ClientShell'
import { SEED_BRIEFINGS, type Briefing } from '@/lib/client/data'
import { ClipboardList, Check, ChevronRight } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function BriefingsPage() {
  const [briefings, setBriefings] = useState<Briefing[]>(SEED_BRIEFINGS)
  const [active, setActive] = useState<Briefing | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  function open(b: Briefing) {
    setActive(b)
    const init: Record<number, string> = {}
    b.perguntas.forEach((p, i) => { if (p.r) init[i] = p.r })
    setAnswers(init)
  }

  function save() {
    if (!active) return
    setBriefings((prev) => prev.map((b) =>
      b.id === active.id
        ? { ...b, status: 'respondido', perguntas: b.perguntas.map((p, i) => ({ ...p, r: answers[i] ?? p.r })) }
        : b
    ))
    toast.success('Briefing enviado para a equipe!')
    setActive(null)
  }

  return (
    <div>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#181818', color: '#f4f4f2', border: '1px solid #2a2a2a', fontSize: 13 } }} />
      <ClientHeader title="Briefings" subtitle="Responda para a equipe entender exatamente o que você precisa." />

      {!active ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {briefings.map((b) => (
            <button key={b.id} onClick={() => open(b)} className="card-soft" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ display: 'inline-flex', width: 42, height: 42, borderRadius: 'var(--r-md)', background: 'var(--surface-2)', color: 'var(--accent)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ClipboardList size={19} />
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: 15, fontWeight: 500, color: 'var(--fg-1)', marginBottom: 4 }}>{b.titulo}</span>
                <span style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>{b.perguntas.length} perguntas</span>
              </span>
              <span className="status-chip" style={{ color: b.status === 'respondido' ? 'var(--green)' : 'var(--yellow)' }}>
                {b.status === 'respondido' ? <><Check size={12} /> respondido</> : 'a responder'}
              </span>
              <ChevronRight size={18} color="var(--fg-4)" />
            </button>
          ))}
        </div>
      ) : (
        <div className="card-soft" style={{ padding: 28, maxWidth: 720 }}>
          <h2 className="os-title" style={{ fontSize: 19, color: 'var(--fg-1)', marginBottom: 20 }}>{active.titulo}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {active.perguntas.map((p, i) => (
              <div key={i}>
                <label style={{ display: 'block', fontSize: 13.5, fontWeight: 500, color: 'var(--fg-1)', marginBottom: 8 }}>{p.q}</label>
                <textarea
                  value={answers[i] ?? ''}
                  onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                  rows={2}
                  placeholder="Sua resposta…"
                  style={{ width: '100%', padding: '11px 13px', borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--fg-1)', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button onClick={save} className="btn-accent">Enviar briefing</button>
            <button onClick={() => setActive(null)} className="btn-ghost">Voltar</button>
          </div>
        </div>
      )}
    </div>
  )
}
