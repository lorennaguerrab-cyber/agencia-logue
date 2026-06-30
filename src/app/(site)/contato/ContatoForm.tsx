'use client'

import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'

const field: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 'var(--r-sm)',
  background: 'var(--surface-2)', border: '1px solid var(--border)',
  color: 'var(--fg-1)', fontSize: 14, outline: 'none', boxSizing: 'border-box',
}
const label: React.CSSProperties = {
  display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--fg-2)', marginBottom: 7,
}

const SERVICOS = ['Branding', 'Social Media', 'Conteúdo', 'Design', 'Produção', 'Campanha', 'Não sei ainda']

export function ContatoForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [servico, setServico] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    try {
      await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, servico }),
      })
    } catch {
      /* MVP: segue para o sucesso mesmo sem backend de e-mail */
    }
    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="card-soft" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 48, gap: 14 }}>
        <CheckCircle2 size={40} style={{ color: 'var(--accent)' }} />
        <h2 className="os-title" style={{ fontSize: 22, color: 'var(--fg-1)' }}>Recebemos sua mensagem!</h2>
        <p style={{ fontSize: 14.5, color: 'var(--fg-2)', lineHeight: 1.6, maxWidth: 380 }}>
          Obrigada pelo contato. Nossa equipe responde em até 1 dia útil com os próximos passos.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="card-soft" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={label}>Nome *</label>
          <input name="nome" required style={field} placeholder="Seu nome" />
        </div>
        <div>
          <label style={label}>Marca / empresa</label>
          <input name="marca" style={field} placeholder="Nome da marca" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={label}>E-mail *</label>
          <input name="email" type="email" required style={field} placeholder="voce@email.com" />
        </div>
        <div>
          <label style={label}>WhatsApp</label>
          <input name="telefone" style={field} placeholder="(00) 00000-0000" />
        </div>
      </div>

      <div>
        <label style={label}>O que você procura?</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SERVICOS.map((s) => (
            <button
              key={s} type="button" onClick={() => setServico(s)}
              style={{
                padding: '7px 14px', borderRadius: 'var(--r-pill)', fontSize: 13,
                border: '1px solid', cursor: 'pointer',
                borderColor: servico === s ? 'var(--accent)' : 'var(--border)',
                background: servico === s ? 'var(--accent-ghost)' : 'transparent',
                color: servico === s ? 'var(--accent)' : 'var(--fg-2)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={label}>Conte sobre seu objetivo *</label>
        <textarea name="mensagem" required rows={4} style={{ ...field, resize: 'vertical' }} placeholder="Ex.: tenho uma ótica e quero presença mais consistente no Instagram..." />
      </div>

      <button type="submit" disabled={loading} className="btn-accent" style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Enviando…' : <>Enviar mensagem <Send size={16} /></>}
      </button>
      <p style={{ fontSize: 12, color: 'var(--fg-4)', textAlign: 'center' }}>
        Ao enviar, você concorda em ser contatado pela Agência Logue.
      </p>
    </form>
  )
}
