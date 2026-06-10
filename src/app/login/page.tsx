'use client'

import { useRouter } from 'next/navigation'
import { useOsStore } from '@/lib/os-store'
import { users, activeClients, monthlyRevenue, fmtK, type UserId } from '@/lib/db'
import { ArrowRight, LogIn } from 'lucide-react'

const USER_ORDER: UserId[] = ['lorenna', 'jeff', 'ingred', 'kamile']

export default function LoginPage() {
  const router = useRouter()
  const { logIn } = useOsStore()

  function handleLogin(userId: UserId) {
    logIn(userId)
    const u = users[userId]
    router.replace(u.access === 'collab' ? '/entregas' : '/')
  }

  const stats = [
    { value: String(activeClients().length), label: 'clientes ativos' },
    { value: fmtK(monthlyRevenue()),         label: 'receita / mês' },
    { value: '10',                           label: 'módulos' },
  ]

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1.1fr 1fr', height: '100vh',
    }}>
      {/* Left panel */}
      <div style={{
        background: 'var(--surface-1)',
        borderRight: '1px solid var(--border)',
        padding: 64,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', right: -120, bottom: -120,
          width: 360, height: 360, borderRadius: '50%',
          background: 'var(--accent-ghost)', filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 48, position: 'relative' }}>
          <span className="os-title" style={{ fontSize: 34, letterSpacing: '-0.04em', color: 'var(--fg-1)' }}>logue</span>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--accent)', alignSelf: 'flex-end', marginBottom: 7 }} />
          <span className="os-title" style={{ fontSize: 15, letterSpacing: '0.1em', color: 'var(--accent)', marginLeft: 8 }}>OS</span>
        </div>

        <h1 className="os-display" style={{
          fontSize: 44, lineHeight: 1.05, letterSpacing: '-0.03em',
          marginBottom: 20, color: 'var(--fg-1)', position: 'relative',
        }}>
          O sistema operacional<br />
          da <span style={{ color: 'var(--accent)' }}>Agência Logue</span>.
        </h1>

        <p style={{
          fontSize: 15, color: 'var(--fg-2)', lineHeight: 1.6,
          maxWidth: 420, position: 'relative',
        }}>
          Clientes, conteúdo, entregas, contratos e finanças — em um só lugar. Estratégia em cada tela.
        </p>

        <div style={{ display: 'flex', gap: 40, marginTop: 48, position: 'relative' }}>
          {stats.map(s => (
            <div key={s.label}>
              <div className="os-title" style={{ fontSize: 24, color: 'var(--fg-1)' }}>{s.value}</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-3)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div className="os-eyebrow" style={{ marginBottom: 8 }}>Entrar</div>
          <h2 className="os-title" style={{ fontSize: 22, marginBottom: 4, color: 'var(--fg-1)' }}>
            Bem-vinda de volta
          </h2>
          <p style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 24 }}>
            Selecione seu perfil para acessar.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {USER_ORDER.map(id => {
              const u = users[id]
              return (
                <button
                  key={id}
                  onClick={() => handleLogin(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                    background: 'var(--surface-1)', border: '1px solid var(--border)',
                    borderRadius: 'var(--r-md)', padding: 12,
                    transition: 'border-color var(--dur), background var(--dur)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'
                    ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-2)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
                    ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-1)'
                  }}
                >
                  <span style={{
                    width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                    background: 'var(--accent)', color: '#0a0a0a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
                  }}>
                    {u.initials}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 13.5, fontWeight: 500, color: 'var(--fg-1)' }}>
                      {u.name}
                    </span>
                    <span style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)' }}>
                      {u.role}{u.access === 'collab' ? ' · acesso restrito' : ''}
                    </span>
                  </span>
                  <ArrowRight size={16} color="var(--fg-3)" />
                </button>
              )
            })}
          </div>

          <hr style={{ border: 'none', height: 1, background: 'var(--border)', margin: '24px 0' }} />

          <form onSubmit={e => { e.preventDefault(); handleLogin('lorenna') }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-2)', marginBottom: 6, display: 'block' }}>E-mail</label>
              <input
                type="email"
                defaultValue="lorenna@logue.com.br"
                style={{
                  width: '100%', background: 'var(--surface-2)', color: 'var(--fg-1)',
                  border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
                  padding: '10px 12px', fontSize: 13, outline: 'none',
                }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-2)', marginBottom: 6, display: 'block' }}>Senha</label>
              <input
                type="password"
                defaultValue="logueos"
                style={{
                  width: '100%', background: 'var(--surface-2)', color: 'var(--fg-1)',
                  border: '1px solid var(--border)', borderRadius: 'var(--r-sm)',
                  padding: '10px 12px', fontSize: 13, outline: 'none',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', padding: '10px 16px', borderRadius: 'var(--r-sm)',
                background: 'var(--accent)', color: '#0a0a0a',
                fontSize: 13, fontWeight: 600, border: '1px solid transparent',
                cursor: 'pointer',
              }}
            >
              <LogIn size={16} /> Acessar o sistema
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
