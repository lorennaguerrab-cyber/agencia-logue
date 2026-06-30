'use client'

import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { ExternalLink, Play, Globe } from 'lucide-react'

const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lorennaguerra/', icon: Globe, color: '#0A66C2' },
  { label: 'YouTube @lorennaguerra', href: 'https://www.youtube.com/@lorennaguerra', icon: Play, color: '#FF0000' },
  { label: 'Papel da Lola (site)', href: 'https://www.papeldalola.com', icon: Globe, color: '#EC4899' },
  { label: '@lorennagn', href: 'https://www.instagram.com/lorennagn/', icon: Globe, color: '#E1306C' },
  { label: '@papeldalola', href: 'https://www.instagram.com/papeldalola/', icon: Globe, color: '#E1306C' },
  { label: '@agencialogue', href: 'https://www.instagram.com/agencialogue/', icon: Globe, color: '#E1306C' },
  { label: 'Substack', href: 'https://lorennagn.substack.com/', icon: Globe, color: '#FF6719' },
  { label: 'TikTok @papeldalola', href: 'https://www.tiktok.com/@papeldalola', icon: Globe, color: '#000000' },
  { label: 'TikTok @lorennagn', href: 'https://www.tiktok.com/@lorennagn', icon: Globe, color: '#000000' },
]

const MONETIZATION_FORMS = [
  { titulo: 'Agência Logue', desc: 'Gestão de redes sociais para empresas. Clientes ativos: Academia Itabira Fit, Espaço Criar, Óptica Igor Giordano, Jornal Cidades Minerais.', color: '#EC4899' },
  { titulo: 'UGC Creator', desc: 'Criação de conteúdo para marcas sem aparecer como rosto oficial. Produto gerado, pago por entrega.', color: '#8B5CF6' },
  { titulo: 'Papel da Lola (Blog)', desc: 'Blog sobre branding, maternidade e IA. Monetização via afiliados, patrocínios e produtos digitais.', color: '#EC4899' },
  { titulo: 'Newsletter', desc: 'Lista própria no Substack. Potencial de patrocínio e venda de produtos.', color: '#F59E0B' },
  { titulo: 'YouTube', desc: 'Canal @lorennaguerra. Monetização via AdSense, membros e patrocínios.', color: '#EF4444' },
  { titulo: 'Afiliados (Shopee/ML)', desc: 'Comissão por vendas via links de afiliado em stories, reels e blog.', color: '#10B981' },
  { titulo: 'Produtos Digitais', desc: 'Cursos, templates, e-books sobre branding pessoal e criação de conteúdo.', color: '#3B82F6' },
]

export default function SobrePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Sobre</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Sua identidade, marcas e formas de monetização</p>
      </div>

      {/* Quem é Lorenna */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Lorenna Guerra</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">@lorennagn</p>
        </CardHeader>
        <CardBody className="pt-0">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Criadora de conteúdo, estrategista de marcas e CEO da Agência Logue. Trabalha na interseção entre branding pessoal, maternidade e inteligência artificial. Mãe de três, com TDAH + TEA nível 1 + altas habilidades — constrói sistemas que funcionam para o seu cérebro.
          </p>
        </CardBody>
      </Card>

      {/* Papel da Lola */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-400" />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Papel da Lola</h2>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">papeldalola.com · @papeldalola</p>
        </CardHeader>
        <CardBody className="pt-0">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Blog e marca pessoal sobre branding, maternidade criativa e IA aplicada à vida real. Espaço onde Lorenna documenta sua jornada como criadora e mãe, compartilha bastidores e ajuda outras mulheres a construírem suas marcas.
          </p>
        </CardBody>
      </Card>

      {/* Agência Logue */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-400" />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Agência Logue</h2>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">@agencialogue</p>
        </CardHeader>
        <CardBody className="pt-0">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Agência de gestão de redes sociais focada em pequenas e médias empresas locais. Estratégia, criação de conteúdo e relacionamento com influenciadores. Atende clientes em Itabira e região.
          </p>
        </CardBody>
      </Card>

      {/* Formas de monetização */}
      <div>
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">Formas de monetização</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MONETIZATION_FORMS.map((m) => (
            <div key={m.titulo} className="bg-white rounded-xl border border-[var(--border)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                <p className="text-sm font-semibold text-[var(--text-primary)]">{m.titulo}</p>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Redes sociais */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Todas as redes</h2>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--bg-hover)] transition-all group"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${s.color}12` }}>
                  <s.icon size={15} style={{ color: s.color }} />
                </div>
                <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{s.label}</span>
                <ExternalLink size={11} className="text-[var(--text-muted)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
