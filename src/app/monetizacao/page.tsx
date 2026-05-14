'use client'

import { useState } from 'react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Sparkles, RefreshCw, DollarSign, TrendingUp, ShoppingBag, FileText, Video, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const DAILY_IDEAS = [
  { tipo: 'Afiliado', plataforma: 'Shopee', ideia: 'Poste um story mostrando um conjunto de canetas coloridas com link de afiliado. "Essas canetas mudaram minha vida criativa — link na bio"', cor: '#EF4444', icon: ShoppingBag },
  { tipo: 'Afiliado', plataforma: 'Shopee', ideia: 'Recomende um organizador de mesa ou porta-papelaria com aesthetic minimalista. Perfeito para o público do Papel da Lola.', cor: '#EF4444', icon: ShoppingBag },
  { tipo: 'Afiliado', plataforma: 'Mercado Livre', ideia: 'Faça um reel "3 coisas que comprei esse mês e amei" com produtos de baixo ticket + links de afiliado na descrição.', cor: '#F59E0B', icon: ShoppingBag },
  { tipo: 'Afiliado', plataforma: 'Amazon', ideia: 'Story com livro de branding ou marketing que você realmente leu. "Tá lendo esse livro agora — link para comprar na bio."', cor: '#F97316', icon: ShoppingBag },
  { tipo: 'Conteúdo pago', plataforma: 'Instagram', ideia: 'Venda um template de calendário editorial por R$9,90. Promova com um reel mostrando como você usa.', cor: '#8B5CF6', icon: FileText },
  { tipo: 'Conteúdo pago', plataforma: 'Hotmart', ideia: 'Mini e-book "Como montar seu primeiro calendário de conteúdo" — R$19,90. Divulgue no Stories por 24h.', cor: '#8B5CF6', icon: FileText },
  { tipo: 'UGC', plataforma: 'Marcas locais', ideia: 'Entre em contato com uma marca local de Itabira para propor um pacote UGC de 4 vídeos. Apresente seu portfólio.', cor: '#10B981', icon: Video },
  { tipo: 'Newsletter', plataforma: 'Substack', ideia: 'Envie uma edição extra da newsletter com assunto quente da semana. Chame para assinar o plano pago.', cor: '#FF6719', icon: Mail },
  { tipo: 'Consultoria', plataforma: 'DM/WhatsApp', ideia: 'Ofereça uma sessão de 30min de "revisão de bio e feed" por R$97 via DM. Limite de 3 vagas hoje.', cor: '#EC4899', icon: TrendingUp },
  { tipo: 'Afiliado', plataforma: 'Shopee', ideia: 'Review de eletrônico útil para criadores (ring light, microfone, suporte de celular). Story ou Reels com link.', cor: '#EF4444', icon: ShoppingBag },
  { tipo: 'Afiliado', plataforma: 'Shopee', ideia: 'Post de "achados de make" com produtos de beleza que você usa. "Uso há X meses — link para comprar."', cor: '#EC4899', icon: ShoppingBag },
  { tipo: 'Afiliado', plataforma: 'Shopee', ideia: 'Story de "roupinha favorita do mês" com link de afiliado para a peça ou look similar.', cor: '#EC4899', icon: ShoppingBag },
  { tipo: 'Afiliado', plataforma: 'Shopee', ideia: 'Sapato ou tênis que está usando muito — story casual "esse tênis tá aparecendo demais aqui em casa, link na bio."', cor: '#F97316', icon: ShoppingBag },
  { tipo: 'Conteúdo pago', plataforma: 'Instagram Close Friends', ideia: 'Crie um grupo de Close Friends para conteúdo exclusivo por R$29,90/mês. Anuncie hoje nas Stories.', cor: '#EC4899', icon: TrendingUp },
  { tipo: 'Agência', plataforma: 'Prospecção', ideia: 'Envie mensagem para 3 empresas locais com uma análise gratuita do Instagram delas. Feche reunião de diagnóstico.', cor: '#3B82F6', icon: TrendingUp },
  { tipo: 'Afiliado', plataforma: 'Amazon', ideia: 'Recomende livro de maternidade ou desenvolvimento pessoal para o público do Papel da Lola.', cor: '#F97316', icon: ShoppingBag },
]

const MONETIZATION_OVERVIEW = [
  { label: 'Agência Logue', meta: 'R$ 6.000/mês', cor: '#EC4899' },
  { label: 'UGC Creator', meta: 'R$ 2.000/mês', cor: '#8B5CF6' },
  { label: 'Afiliados', meta: 'R$ 500/mês', cor: '#EF4444' },
  { label: 'Produtos digitais', meta: 'R$ 1.000/mês', cor: '#10B981' },
  { label: 'Consultoria', meta: 'R$ 500/mês', cor: '#F59E0B' },
]

function getDailyIdeaIndex() {
  const day = new Date().getDate()
  return day % DAILY_IDEAS.length
}

export default function MonetizacaoPage() {
  const [currentIdea, setCurrentIdea] = useState(getDailyIdeaIndex())
  const [shown, setShown] = useState(true)
  const idea = DAILY_IDEAS[currentIdea]

  function nextIdea() {
    setShown(false)
    setTimeout(() => {
      setCurrentIdea((prev) => (prev + 1) % DAILY_IDEAS.length)
      setShown(true)
    }, 200)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Monetização</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Suas fontes de renda e ideias para monetizar hoje</p>
      </div>

      {/* Ideia do dia */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-amber-500" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Ideia para monetizar HOJE</h2>
        </div>
        <AnimatePresence mode="wait">
          {shown && (
            <motion.div
              key={currentIdea}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <div className="bg-white rounded-2xl border shadow-[0_2px_12px_rgba(0,0,0,0.08)] p-5" style={{ borderColor: `${idea.cor}25` }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${idea.cor}12` }}>
                    <idea.icon size={16} style={{ color: idea.cor }} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: idea.cor }}>{idea.tipo}</span>
                    <p className="text-[11px] text-[var(--text-muted)]">{idea.plataforma}</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-primary)] leading-relaxed font-medium">{idea.ideia}</p>
                <div className="mt-4">
                  <Button variant="secondary" size="sm" onClick={nextIdea}>
                    <RefreshCw size={13} />
                    Outra ideia
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overview de fontes */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign size={15} className="text-[var(--text-muted)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Fontes de renda — metas</h2>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-3">
          {MONETIZATION_OVERVIEW.map((m) => (
            <div key={m.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.cor }} />
                <span className="text-sm text-[var(--text-secondary)]">{m.label}</span>
              </div>
              <span className="text-sm font-semibold text-[var(--text-primary)]">{m.meta}</span>
            </div>
          ))}
          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--text-primary)]">Total meta</span>
            <span className="text-sm font-bold text-pink-600">R$ 10.000/mês</span>
          </div>
        </CardBody>
      </Card>

      {/* Banco de ideias afiliados */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Todas as ideias de afiliado</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{DAILY_IDEAS.length} ideias no banco</p>
        </CardHeader>
        <CardBody className="pt-0 space-y-2">
          {DAILY_IDEAS.slice(0, 6).map((idea, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${idea.cor}12` }}>
                <idea.icon size={12} style={{ color: idea.cor }} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: idea.cor }}>{idea.tipo} · {idea.plataforma}</p>
                <p className="text-xs text-[var(--text-secondary)] leading-snug">{idea.ideia}</p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  )
}
