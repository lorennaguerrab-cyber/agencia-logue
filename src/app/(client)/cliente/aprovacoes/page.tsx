'use client'

import { useState } from 'react'
import { ClientHeader } from '@/components/client/ClientShell'
import { SEED_APROVACOES, type Aprovacao } from '@/lib/client/data'
import { Check, MessageSquare, CheckCircle2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function AprovacoesPage() {
  const [items, setItems] = useState<Aprovacao[]>(SEED_APROVACOES)
  const [ajusteFor, setAjusteFor] = useState<string | null>(null)
  const [nota, setNota] = useState('')

  function aprovar(id: string) {
    setItems((p) => p.map((a) => (a.id === id ? { ...a, status: 'aprovado' } : a)))
    toast.success('Conteúdo aprovado! Já vai para a agenda. ✅')
  }
  function pedirAjuste(id: string) {
    if (!nota.trim()) { toast.error('Conte o que ajustar.'); return }
    setItems((p) => p.map((a) => (a.id === id ? { ...a, status: 'ajustes' } : a)))
    toast.success('Pedido de ajuste enviado para a equipe.')
    setAjusteFor(null); setNota('')
  }

  return (
    <div>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#181818', color: '#f4f4f2', border: '1px solid #2a2a2a', fontSize: 13 } }} />
      <ClientHeader title="Aprovações" subtitle="Revise os conteúdos. Aprove ou peça ajustes — sua palavra final." />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.map((a) => (
          <div key={a.id} className="card-soft" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
              <div>
                <h2 className="os-title" style={{ fontSize: 18, color: 'var(--fg-1)', marginBottom: 4 }}>{a.titulo}</h2>
                <span style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>{a.formato} · prazo {new Date(a.prazo + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</span>
              </div>
              {a.status === 'aprovado' && <span className="status-chip" style={{ color: 'var(--green)' }}><Check size={12} /> aprovado</span>}
              {a.status === 'ajustes' && <span className="status-chip" style={{ color: 'var(--yellow)' }}>ajustes pedidos</span>}
              {a.status === 'pendente' && <span className="status-chip" style={{ color: 'var(--fg-3)' }}>aguardando você</span>}
            </div>

            <div style={{ padding: 16, borderRadius: 'var(--r-md)', background: 'var(--surface-2)', border: '1px solid var(--border)', whiteSpace: 'pre-line', fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 18 }}>
              {a.legenda}
            </div>

            {a.status === 'pendente' && (
              ajusteFor === a.id ? (
                <div>
                  <textarea value={nota} onChange={(e) => setNota(e.target.value)} rows={3} placeholder="O que você gostaria de ajustar?" style={{ width: '100%', padding: '11px 13px', borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--fg-1)', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 12 }} />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => pedirAjuste(a.id)} className="btn-accent">Enviar ajuste</button>
                    <button onClick={() => { setAjusteFor(null); setNota('') }} className="btn-ghost">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button onClick={() => aprovar(a.id)} className="btn-accent"><CheckCircle2 size={16} /> Aprovar</button>
                  <button onClick={() => setAjusteFor(a.id)} className="btn-ghost"><MessageSquare size={15} /> Pedir ajustes</button>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
