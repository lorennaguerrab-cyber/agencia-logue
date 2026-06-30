'use client'

import { useState } from 'react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { RefreshCw, ChevronRight } from 'lucide-react'

const STREAMS = [
  { nome: 'Serviços (Agência Logue)', icon: '💼', cor: '#7FB68C', receita: 4000, meta: 6000,
    canais: ['Itabira Fit', 'Espaço Criar', 'Óptica Igor Giordano', 'Jornal CM'],
    tipo: 'Receita imediata · alto controle' },
  { nome: 'Afiliados', icon: '🛍️', cor: '#FF78B0', receita: 0, meta: 800,
    canais: ['Shopee', 'Mercado Livre', 'Amazon'],
    tipo: 'Passiva · escalável · baixo esforço por venda' },
  { nome: 'Produtos digitais', icon: '📦', cor: '#A89AC9', receita: 0, meta: 1200,
    canais: ['Loja própria', 'Hotmart', 'Sympla'],
    tipo: 'Cria 1 vez, vende várias' },
  { nome: 'Newsletter Substack', icon: '💌', cor: '#E89B4C', receita: 0, meta: 400,
    canais: ['Substack'],
    tipo: 'Construir base · monetizar em 6 meses' },
  { nome: 'UGC · Collabs', icon: '⭐', cor: '#5A6F9C', receita: 0, meta: 1500,
    canais: ['Instagram', 'TikTok'],
    tipo: 'Pontual · valor médio R$ 600-1500' },
  { nome: 'Adsense + Blog', icon: '📊', cor: '#908F8E', receita: 0, meta: 200,
    canais: ['Blog WordPress'],
    tipo: 'Cresce com SEO · longo prazo' },
  { nome: 'Comunidade paga', icon: '🤝', cor: '#FFC7DD', receita: 0, meta: 1000,
    canais: ['Telegram (futuro)'],
    tipo: 'Recorrente · alta fidelização' },
]

type IdeiaPool = { cat: string; desc: string; plataforma: string; tempo: string; dificuldade: string }

const IDEAS_POOL: IdeiaPool[] = [
  { cat: 'papelaria', desc: 'Story com kit de canetas coloridas pra planner: "as 5 cores que eu uso pra dividir minha semana"', plataforma: 'Shopee', tempo: '15 min', dificuldade: 'baixa' },
  { cat: 'papelaria', desc: 'Reel "anatomia da minha mesa criativa" mostrando 3-4 produtos com links de afiliado', plataforma: 'Shopee + ML', tempo: '40 min', dificuldade: 'média' },
  { cat: 'papelaria', desc: 'Carrossel com 5 cadernos lindos de até R$ 50 (com links na bio)', plataforma: 'Mercado Livre', tempo: '25 min', dificuldade: 'baixa' },
  { cat: 'make', desc: 'Story rápido com batom que tô usando essa semana + link Shopee/ML', plataforma: 'Shopee', tempo: '5 min', dificuldade: 'baixa' },
  { cat: 'make', desc: '"5 produtos de farmácia que ninguém te conta" — carrossel com afiliado', plataforma: 'Shopee', tempo: '30 min', dificuldade: 'média' },
  { cat: 'make', desc: 'Reel "GRWM mãe corrida de 3 minutos" com 3-4 produtos linkáveis', plataforma: 'Shopee + ML', tempo: '45 min', dificuldade: 'média' },
  { cat: 'moda', desc: 'Story com look do dia + link da peça-chave', plataforma: 'Shopee', tempo: '5 min', dificuldade: 'baixa' },
  { cat: 'moda', desc: '"3 saias longas até R$ 80 que eu salvaria" — carrossel', plataforma: 'Mercado Livre', tempo: '20 min', dificuldade: 'baixa' },
  { cat: 'eletronico', desc: 'Indicar o tripé/ring light que você usa pra gravar — story com link', plataforma: 'Shopee', tempo: '5 min', dificuldade: 'baixa' },
  { cat: 'eletronico', desc: 'Reel "tudo que eu usa pra trabalhar de casa" com 5-6 links', plataforma: 'Shopee + ML', tempo: '40 min', dificuldade: 'média' },
  { cat: 'casa', desc: 'Story com organizadores baratos do dia-a-dia (banheiro, mesa)', plataforma: 'Shopee', tempo: '10 min', dificuldade: 'baixa' },
  { cat: 'casa', desc: 'Carrossel "5 itens de casa por menos de R$ 30 que mudam o ambiente"', plataforma: 'Mercado Livre', tempo: '25 min', dificuldade: 'média' },
  { cat: 'livros', desc: 'Story de um livro que você tá lendo + link na bio', plataforma: 'Amazon', tempo: '5 min', dificuldade: 'baixa' },
  { cat: 'livros', desc: 'Reel "livros infantis que valem cada centavo" pros pais', plataforma: 'Amazon', tempo: '30 min', dificuldade: 'média' },
  { cat: 'livros', desc: '"3 livros sobre branding que mudaram meu olhar" — carrossel com afiliado', plataforma: 'Amazon', tempo: '25 min', dificuldade: 'baixa' },
  { cat: 'infantil', desc: 'Brinquedo educativo do Miguel + link Shopee', plataforma: 'Shopee', tempo: '10 min', dificuldade: 'baixa' },
  { cat: 'infantil', desc: 'Material escolar pros gêmeos com link', plataforma: 'Mercado Livre', tempo: '15 min', dificuldade: 'baixa' },
  { cat: 'proprio', desc: 'Postar um story divulgando seu template / mini-curso na loja própria', plataforma: 'Loja própria', tempo: '5 min', dificuldade: 'baixa' },
  { cat: 'proprio', desc: 'Reel mostrando como você usa seu próprio planner imprimível', plataforma: 'Loja própria', tempo: '20 min', dificuldade: 'baixa' },
  { cat: 'ugc', desc: 'Mandar DM pra 3 marcas pequenas com proposta de UGC simples', plataforma: 'Instagram DM', tempo: '20 min', dificuldade: 'média' },
  { cat: 'ugc', desc: 'Atualizar seu mediakit no Canva e mandar pro inbox de uma marca', plataforma: 'E-mail', tempo: '30 min', dificuldade: 'média' },
  { cat: 'agencia', desc: 'Enviar mensagem para 3 empresas locais com análise gratuita do Instagram delas', plataforma: 'WhatsApp', tempo: '20 min', dificuldade: 'média' },
  { cat: 'agencia', desc: 'Ofereça revisão de bio por R$97 via DM — 3 vagas hoje', plataforma: 'Instagram DM', tempo: '5 min', dificuldade: 'baixa' },
]

const CAT_LABELS: Record<string, { label: string; emoji: string; cor: string }> = {
  papelaria:  { label: 'Papelaria',      emoji: '✏️', cor: '#FF78B0' },
  make:       { label: 'Make',           emoji: '💄', cor: '#E8538D' },
  moda:       { label: 'Moda',           emoji: '👗', cor: '#A89AC9' },
  eletronico: { label: 'Eletrônicos',    emoji: '🎧', cor: '#5A6F9C' },
  casa:       { label: 'Casa',           emoji: '🪴', cor: '#7FB68C' },
  livros:     { label: 'Livros',         emoji: '📚', cor: '#E89B4C' },
  infantil:   { label: 'Infantil',       emoji: '🧸', cor: '#FFC7DD' },
  proprio:    { label: 'Produto próprio',emoji: '✨', cor: '#FF78B0' },
  ugc:        { label: 'UGC / Marcas',   emoji: '🤝', cor: '#A89AC9' },
  agencia:    { label: 'Agência',        emoji: '💼', cor: '#7FB68C' },
}

const DIFIC_COR: Record<string, string> = { baixa: '#7FB68C', média: '#E89B4C', alta: '#C44878' }

function getDailyIdea(): IdeiaPool {
  const seed = new Date().getDate() + new Date().getMonth() * 31
  return IDEAS_POOL[seed % IDEAS_POOL.length]
}

export default function MonetizacaoPage() {
  const [idea, setIdea] = useState<IdeiaPool>(getDailyIdea)
  const [catFilter, setCatFilter] = useState<string | null>(null)

  const cats = [...new Set(IDEAS_POOL.map(i => i.cat))]
  const filtered = catFilter ? IDEAS_POOL.filter(i => i.cat === catFilter) : IDEAS_POOL

  const totalMeta = STREAMS.reduce((s, m) => s + m.meta, 0)
  const totalReceita = STREAMS.reduce((s, m) => s + m.receita, 0)

  function randomIdea() {
    const pool = catFilter ? IDEAS_POOL.filter(i => i.cat === catFilter) : IDEAS_POOL
    setIdea(pool[Math.floor(Math.random() * pool.length)])
  }

  const catInfo = CAT_LABELS[idea.cat] || { label: idea.cat, emoji: '💡', cor: '#FF78B0' }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-syne)' }}>Monetização</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Suas fontes de receita + ideia de hoje para monetizar agora</p>
      </div>

      {/* Ideia do dia */}
      <div className="rounded-[15px] p-5 border" style={{ background: `${catInfo.cor}10`, borderColor: `${catInfo.cor}30` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{catInfo.emoji}</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: catInfo.cor }}>Monetizar hoje · {catInfo.label}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-[var(--text-muted)]">⏱ {idea.tempo}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${DIFIC_COR[idea.dificuldade]}18`, color: DIFIC_COR[idea.dificuldade] }}>
                  {idea.dificuldade}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">via {idea.plataforma}</span>
              </div>
            </div>
          </div>
          <button
            onClick={randomIdea}
            className="p-2 rounded-[12px] transition-colors hover:bg-white/60"
            style={{ color: catInfo.cor }}
            title="Outra ideia"
          >
            <RefreshCw size={14} />
          </button>
        </div>
        <p className="text-sm text-[var(--text-primary)] leading-relaxed">{idea.desc}</p>
      </div>

      {/* Visão geral */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Fontes de receita</h2>
            <div className="text-right">
              <p className="text-xs text-[var(--text-muted)]">Meta total</p>
              <p className="text-base font-bold" style={{ fontFamily: 'var(--font-syne)', color: 'var(--pink-deep)' }}>
                R$ {totalMeta.toLocaleString('pt-BR')}/mês
              </p>
            </div>
          </div>
          {/* Barra de progresso geral */}
          <div className="mt-3 h-1.5 bg-[var(--gray-light)] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${Math.min((totalReceita / totalMeta) * 100, 100)}%`, background: 'var(--pink)' }} />
          </div>
          <p className="text-[10px] text-[var(--text-muted)] mt-1">
            R$ {totalReceita.toLocaleString('pt-BR')} de R$ {totalMeta.toLocaleString('pt-BR')} — {Math.round((totalReceita / totalMeta) * 100)}%
          </p>
        </CardHeader>
        <CardBody className="pt-0 space-y-2">
          {STREAMS.map((s) => {
            const pct = Math.min((s.receita / s.meta) * 100, 100)
            return (
              <div key={s.nome} className="flex items-center gap-3 p-3 rounded-[15px] bg-[var(--bg-elevated)] border border-[var(--border)]">
                <span className="text-lg flex-shrink-0">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{s.nome}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      R$ {s.receita.toLocaleString('pt-BR')} / R$ {s.meta.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="h-1 bg-[var(--gray-light)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: s.cor }} />
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">{s.tipo}</p>
                </div>
              </div>
            )
          })}
        </CardBody>
      </Card>

      {/* Banco de ideias de monetização */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Banco de ideias</h2>
          <p className="text-[10px] text-[var(--text-muted)]">{filtered.length} ideias</p>
        </div>

        {/* Filtros por categoria */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          <button
            onClick={() => setCatFilter(null)}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all"
            style={!catFilter ? { background: 'var(--pink)', color: 'white', borderColor: 'var(--pink)' } : { background: 'var(--offwhite)', color: 'var(--text-muted)', borderColor: 'var(--gray-light)' }}
          >
            Todas
          </button>
          {cats.map(c => {
            const info = CAT_LABELS[c] || { label: c, emoji: '', cor: '#908F8E' }
            const active = catFilter === c
            return (
              <button
                key={c}
                onClick={() => setCatFilter(active ? null : c)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all"
                style={active
                  ? { background: info.cor, color: 'white', borderColor: info.cor }
                  : { background: 'var(--offwhite)', color: 'var(--text-muted)', borderColor: 'var(--gray-light)' }}
              >
                {info.emoji} {info.label}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.slice(0, 12).map((item, i) => {
            const info = CAT_LABELS[item.cat] || { label: item.cat, emoji: '💡', cor: '#FF78B0' }
            return (
              <button
                key={i}
                onClick={() => setIdea(item)}
                className="text-left p-3 rounded-[15px] bg-white border border-[var(--border)] hover:border-[var(--pink-soft)] transition-all"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-xs">{info.emoji}</span>
                  <span className="text-[10px] font-medium" style={{ color: info.cor }}>{info.label}</span>
                  <span className="text-[10px] text-[var(--text-muted)] ml-auto">⏱ {item.tempo}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-snug">{item.desc}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">via {item.plataforma}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
