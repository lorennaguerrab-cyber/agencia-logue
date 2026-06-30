'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useOsStore } from '@/lib/os-store'
import { useClientStore } from '@/lib/client/store'
import { users, type UserId } from '@/lib/db'
import { findClientByLogin } from '@/lib/client/data'
import { ArrowRight, LogIn, ArrowLeft } from 'lucide-react'

type Tab = 'cliente' | 'equipe'
const TEAM_ORDER: UserId[] = ['lorenna', 'jeff', 'ingred', 'kamile']

export default function LoginPage() {
  const router = useRouter()
  const { logIn: teamLogin } = useOsStore()
  const { logIn: clientLogin } = useClientStore()
  const [tab, setTab] = useState<Tab>('cliente')
  const [email, setEmail] = useState('cliente@logue.com.br')
  const [senha, setSenha] = useState('cliente')
  const [erro, setErro] = useState('')

  function handleClient(e: React.FormEvent) {
    e.preventDefault()
    const acc = findClientByLogin(email, senha)
    if (!acc) {
      setErro('E-mail ou senha inválidos. Dica: cliente@logue.com.br / cliente')
      return
    }
    clientLogin(acc.id)
    router.replace('/cliente')
  }

  function handleTeam(userId: UserId) {
    teamLogin(userId)
    const u = users[userId]
    router.replace(u.access === 'collab' ? '/painel/entregas' : '/painel')
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', minHeight: '100vh' }} className="login-grid">
      {/* Left — brand */}
      <div style={{ background: 'var(--surface-1)', borderRight: '1px solid var(--border)', padding: 'clamp(32px, 5vw, 64px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }} className="login-aside">
        <div style={{ position: 'absolute', right: -120, bottom: -120, width: 360, height: 360, borderRadius: '50%', background: 'var(--accent-ghost)', filter: 'blur(40px)' }} />
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fg-3)', marginBottom: 40, position: 'relative' }}>
          <ArrowLeft size={15} /> Voltar ao site
        </Link>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 36, position: 'relative' }}>
          <span className="os-title" style={{ fontSize: 34, letterSpacing: '-0.04em' }}>logue</span>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--accent)', alignSelf: 'flex-end', marginBottom: 7 }} />
        </div>
        <h1 className="os-display" style={{ fontSize: 'clamp(30px, 4vw, 42px)', lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 18, position: 'relative' }}>
          A sua marca,<br /><span style={{ color: 'var(--accent)' }}>organizada e no ar.</span>
        </h1>
        <p style={{ fontSize: 15, color: 'var(--fg-2)', lineHeight: 1.6, maxWidth: 420, position: 'relative' }}>
          Acompanhe seu projeto, responda briefings, envie demandas e aprove conteúdos — tudo em um lugar.
        </p>
      </div>

      {/* Right — auth */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px, 4vw, 48px)' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, background: 'var(--surface-2)', padding: 4, borderRadius: 'var(--r-md)', marginBottom: 28 }}>
            {(['cliente', 'equipe'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setErro('') }}
                style={{
                  flex: 1, padding: '9px', borderRadius: 'var(--r-sm)', fontSize: 13.5, fontWeight: 500, border: 'none', cursor: 'pointer',
                  background: tab === t ? 'var(--surface-1)' : 'transparent',
                  color: tab === t ? 'var(--fg-1)' : 'var(--fg-3)',
                }}
              >
                {t === 'cliente' ? 'Sou cliente' : 'Sou da equipe'}
              </button>
            ))}
          </div>

          {tab === 'cliente' ? (
            <form onSubmit={handleClient}>
              <div className="os-eyebrow" style={{ marginBottom: 8 }}>Área do cliente</div>
              <h2 className="os-title" style={{ fontSize: 22, marginBottom: 20 }}>Entrar na sua conta</h2>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>E-mail</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inp} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Senha</label>
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} style={inp} />
              </div>
              {erro && <p style={{ fontSize: 12.5, color: 'var(--red)', marginBottom: 14 }}>{erro}</p>}
              <button type="submit" className="btn-accent" style={{ width: '100%', justifyContent: 'center' }}>
                <LogIn size={16} /> Acessar minha área
              </button>
              <p style={{ fontSize: 12, color: 'var(--fg-4)', marginTop: 14, textAlign: 'center' }}>
                Demo: <strong style={{ color: 'var(--fg-3)' }}>cliente@logue.com.br</strong> / <strong style={{ color: 'var(--fg-3)' }}>cliente</strong>
              </p>
            </form>
          ) : (
            <div>
              <div className="os-eyebrow" style={{ marginBottom: 8 }}>Painel interno</div>
              <h2 className="os-title" style={{ fontSize: 22, marginBottom: 4 }}>Bem-vinda de volta</h2>
              <p style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 22 }}>Selecione seu perfil para acessar.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {TEAM_ORDER.map((id) => {
                  const u = users[id]
                  return (
                    <button key={id} onClick={() => handleTeam(id)} style={teamBtn}>
                      <span style={{ width: 38, height: 38, borderRadius: 8, flexShrink: 0, background: 'var(--accent)', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>
                        {u.initials}
                      </span>
                      <span style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <span style={{ display: 'block', fontSize: 13.5, fontWeight: 500, color: 'var(--fg-1)' }}>{u.name}</span>
                        <span style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)' }}>{u.role}{u.access === 'collab' ? ' · acesso restrito' : ''}</span>
                      </span>
                      <ArrowRight size={16} color="var(--fg-3)" />
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const lbl: React.CSSProperties = { fontSize: 12.5, fontWeight: 500, color: 'var(--fg-2)', marginBottom: 6, display: 'block' }
const inp: React.CSSProperties = { width: '100%', background: 'var(--surface-2)', color: 'var(--fg-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '11px 13px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }
const teamBtn: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, width: '100%', background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 12, cursor: 'pointer' }
