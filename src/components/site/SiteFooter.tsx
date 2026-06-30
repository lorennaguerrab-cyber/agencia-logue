import Link from 'next/link'
import { AtSign, Mail, ArrowUpRight } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-1)', marginTop: 80 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 40 }} className="site-footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 16 }}>
              <span className="os-title" style={{ fontSize: 26, letterSpacing: '-0.04em', color: 'var(--fg-1)' }}>logue</span>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', alignSelf: 'flex-end', marginBottom: 6 }} />
            </div>
            <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6, maxWidth: 360 }}>
              Branding, social media, conteúdo estratégico, design e produção criativa. Estratégia e estética, com método.
            </p>
          </div>

          <div>
            <div className="os-eyebrow" style={{ marginBottom: 14 }}>Navegar</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['/sobre', 'Sobre'], ['/servicos', 'Serviços'], ['/pacotes', 'Pacotes'], ['/portfolio', 'Portfólio'], ['/blog', 'Conteúdos']].map(([href, label]) => (
                <Link key={href} href={href} style={{ fontSize: 14, color: 'var(--fg-2)' }}>{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <div className="os-eyebrow" style={{ marginBottom: 14 }}>Contato</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="mailto:contato@agencialogue.com.br" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--fg-2)' }}>
                <Mail size={15} /> contato@agencialogue.com.br
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--fg-2)' }}>
                <AtSign size={15} /> @agencialogue
              </a>
              <Link href="/contato" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--accent)' }}>
                Pedir um orçamento <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 12.5, color: 'var(--fg-4)' }}>© {new Date().getFullYear()} Agência Logue. Todos os direitos reservados.</span>
          <Link href="/login" style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>Área do cliente · Equipe</Link>
        </div>
      </div>
    </footer>
  )
}
