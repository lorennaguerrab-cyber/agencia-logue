import { ContatoForm } from './ContatoForm'
import { Mail, AtSign, MessageCircle } from 'lucide-react'

export const metadata = { title: 'Contato · Agência Logue' }

export default function ContatoPage() {
  return (
    <div className="os-view-in">
      <section className="site-section" style={{ paddingTop: 'clamp(56px, 8vw, 96px)', paddingBottom: 40 }}>
        <span className="site-eyebrow">Contato & Orçamento</span>
        <h1 className="site-h1" style={{ marginTop: 20, maxWidth: 760 }}>Vamos começar uma conversa.</h1>
        <p className="site-lead" style={{ maxWidth: 600, marginTop: 24 }}>
          Conte sobre sua marca e seu objetivo. Respondemos com um caminho — não com um pacote pronto.
        </p>
      </section>

      <section className="site-section" style={{ paddingBottom: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24, alignItems: 'start' }} className="site-footer-grid">
          <ContatoForm />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              [Mail, 'E-mail', 'contato@agencialogue.com.br', 'mailto:contato@agencialogue.com.br'],
              [AtSign, 'Instagram', '@agencialogue', 'https://instagram.com'],
              [MessageCircle, 'WhatsApp', 'Resposta em até 1 dia útil', '#'],
            ].map(([Icon, label, value, href]) => {
              const I = Icon as React.ElementType
              return (
                <a key={label as string} href={href as string} className="card-soft" style={{ display: 'flex', gap: 14, alignItems: 'center', padding: 20 }}>
                  <span style={{ display: 'inline-flex', width: 42, height: 42, borderRadius: 'var(--r-md)', background: 'var(--accent-ghost)', color: 'var(--accent)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <I size={19} />
                  </span>
                  <span>
                    <span style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)' }}>{label as string}</span>
                    <span style={{ display: 'block', fontSize: 14.5, color: 'var(--fg-1)' }}>{value as string}</span>
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
