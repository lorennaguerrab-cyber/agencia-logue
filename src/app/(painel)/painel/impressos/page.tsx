'use client'

import { useState } from 'react'
import { Card, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Printer, ChevronLeft, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Template {
  id: string
  titulo: string
  descricao: string
  cor: string
  perguntas: { id: string; label: string; tipo: 'text' | 'textarea' | 'checklist'; opcoes?: string[] }[]
  gerador: (respostas: Record<string, string>) => string
}

const TEMPLATES: Template[] = [
  {
    id: 'rotina-semanal',
    titulo: 'Rotina Semanal',
    descricao: 'Planejamento da semana com blocos de foco',
    cor: '#EC4899',
    perguntas: [
      { id: 'semana', label: 'Qual semana? (ex: 19 a 25 de maio)', tipo: 'text' },
      { id: 'intencao', label: 'Qual a intenção principal da semana?', tipo: 'text' },
      { id: 'prioridade1', label: 'Prioridade 1 da semana', tipo: 'text' },
      { id: 'prioridade2', label: 'Prioridade 2 da semana', tipo: 'text' },
      { id: 'prioridade3', label: 'Prioridade 3 da semana', tipo: 'text' },
      { id: 'evitar', label: 'O que você quer evitar essa semana?', tipo: 'textarea' },
      { id: 'recompensa', label: 'Como vai se recompensar se completar as prioridades?', tipo: 'text' },
    ],
    gerador: (r) => `ROTINA SEMANAL — ${r.semana || '___________'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✦ INTENÇÃO DA SEMANA
${r.intencao || '___________________________________________'}

✦ PRIORIDADES
1. ${r.prioridade1 || '___________________________________________'}
2. ${r.prioridade2 || '___________________________________________'}
3. ${r.prioridade3 || '___________________________________________'}

✦ O QUE EVITAR
${r.evitar || '___________________________________________'}

✦ RECOMPENSA
${r.recompensa || '___________________________________________'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BLOCOS DA SEMANA

SEG  [ ] Manhã: ____________________  [ ] Tarde: ____________________
TER  [ ] Manhã: ____________________  [ ] Tarde: ____________________
QUA  [ ] Manhã: ____________________  [ ] Tarde: ____________________
QUI  [ ] Manhã: ____________________  [ ] Tarde: ____________________
SEX  [ ] Manhã: ____________________  [ ] Tarde: ____________________
SÁB  [ ] _______________________________________________
DOM  [ ] Descanso / ___________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOTAS LIVRES
_______________________________________________________
_______________________________________________________
_______________________________________________________`,
  },
  {
    id: 'planner-diario',
    titulo: 'Planner Diário',
    descricao: 'Planner com prioridades, tarefas e estado emocional',
    cor: '#8B5CF6',
    perguntas: [
      { id: 'data', label: 'Data de hoje', tipo: 'text' },
      { id: 'humor', label: 'Como você está chegando hoje? (1 palavra)', tipo: 'text' },
      { id: 'foco', label: 'Foco principal do dia', tipo: 'text' },
      { id: 'tarefa1', label: 'Tarefa mais importante', tipo: 'text' },
      { id: 'tarefa2', label: 'Segunda tarefa', tipo: 'text' },
      { id: 'tarefa3', label: 'Terceira tarefa', tipo: 'text' },
      { id: 'rapida1', label: 'Tarefa rápida 1 (menos de 5 min)', tipo: 'text' },
      { id: 'rapida2', label: 'Tarefa rápida 2', tipo: 'text' },
      { id: 'rapida3', label: 'Tarefa rápida 3', tipo: 'text' },
      { id: 'gratidao', label: 'Uma coisa pela qual sou grata hoje', tipo: 'text' },
    ],
    gerador: (r) => `PLANNER DIÁRIO — ${r.data || '_____ / _____ / _____'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMO ESTOU CHEGANDO: ${r.humor || '_____________'}

✦ FOCO DO DIA
${r.foco || '___________________________________________'}

✦ TOP 3 TAREFAS
[ ] ${r.tarefa1 || '___________________________________________'}
[ ] ${r.tarefa2 || '___________________________________________'}
[ ] ${r.tarefa3 || '___________________________________________'}

✦ TAREFAS RÁPIDAS (< 5 min)
[ ] ${r.rapida1 || '___________________________________________'}
[ ] ${r.rapida2 || '___________________________________________'}
[ ] ${r.rapida3 || '___________________________________________'}

✦ HORÁRIOS
08h ____________________  12h ____________________
09h ____________________  13h ____________________
10h ____________________  14h ____________________
11h ____________________  15h ____________________
                           16h ____________________
                           17h ____________________
                           18h+ ___________________

✦ GRATIDÃO
${r.gratidao || '___________________________________________'}

✦ COMO TERMINEI O DIA
___________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  },
  {
    id: 'checklist-conteudo',
    titulo: 'Checklist de Conteúdo',
    descricao: 'Lista de verificação para publicações',
    cor: '#EC4899',
    perguntas: [
      { id: 'plataforma', label: 'Plataforma (Instagram, TikTok, YouTube...)', tipo: 'text' },
      { id: 'tipo', label: 'Tipo de conteúdo (Reel, Story, Post, Vídeo...)', tipo: 'text' },
      { id: 'tema', label: 'Tema / assunto do conteúdo', tipo: 'text' },
      { id: 'gancho', label: 'Qual o gancho de abertura?', tipo: 'textarea' },
    ],
    gerador: (r) => `CHECKLIST DE CONTEÚDO
Plataforma: ${r.plataforma || '_____________'}  |  Tipo: ${r.tipo || '_____________'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEMA: ${r.tema || '___________________________________________'}

GANCHO:
${r.gancho || '___________________________________________'}

✦ PRÉ-PRODUÇÃO
[ ] Roteiro / script escrito
[ ] Referências coletadas
[ ] Materiais separados (roupas, props, local)
[ ] Legenda escrita
[ ] Hashtags definidas
[ ] CTA definido
[ ] Link / produto referenciado

✦ PRODUÇÃO
[ ] Gravado / fotografado
[ ] Iluminação OK
[ ] Áudio OK
[ ] Figurino/make OK
[ ] Expressão/energia OK

✦ PÓS-PRODUÇÃO
[ ] Editado
[ ] Legenda revisada
[ ] Thumbnail criada
[ ] Aprovado

✦ PUBLICAÇÃO
[ ] Agendado ou publicado
[ ] Stories de divulgação feitos
[ ] Respondeu primeiros comentários
[ ] Resultado monitorado em 24h

NOTAS: ___________________________________________`,
  },
  {
    id: 'plano-monetizacao',
    titulo: 'Plano de Monetização',
    descricao: 'Estratégias e metas financeiras da semana',
    cor: '#10B981',
    perguntas: [
      { id: 'semana', label: 'Semana de referência', tipo: 'text' },
      { id: 'meta', label: 'Meta financeira da semana (R$)', tipo: 'text' },
      { id: 'produto', label: 'Produto/serviço principal da semana', tipo: 'text' },
      { id: 'preco', label: 'Preço sugerido', tipo: 'text' },
      { id: 'canal', label: 'Canal de venda principal (Instagram, WhatsApp...)', tipo: 'text' },
      { id: 'acao1', label: 'Ação de venda 1 (ex: story com link afiliado)', tipo: 'text' },
      { id: 'acao2', label: 'Ação de venda 2', tipo: 'text' },
      { id: 'acao3', label: 'Ação de venda 3', tipo: 'text' },
      { id: 'oportunidade', label: 'Melhor oportunidade da semana (produto/parceria/sazonal)', tipo: 'textarea' },
    ],
    gerador: (r) => `PLANO DE MONETIZAÇÃO — ${r.semana || '___________'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

META DA SEMANA: R$ ${r.meta || '_______'}

✦ PRODUTO PRINCIPAL
${r.produto || '___________________________________________'}
Preço: R$ ${r.preco || '_______'}  |  Canal: ${r.canal || '_____________'}

✦ MELHOR OPORTUNIDADE
${r.oportunidade || '___________________________________________'}

✦ AÇÕES DE VENDA
[ ] ${r.acao1 || '___________________________________________'}
[ ] ${r.acao2 || '___________________________________________'}
[ ] ${r.acao3 || '___________________________________________'}

✦ FONTES ATIVAS ESTA SEMANA
[ ] Agência Logue — clientes: _____________________
[ ] Afiliados (Shopee/ML/Amazon)
[ ] Produto digital / template
[ ] UGC Creator
[ ] Consultoria / mentoria
[ ] Outro: _____________________

✦ RESULTADO
Meta: R$ ${r.meta || '_______'}  |  Realizado: R$ _______  |  Diferença: R$ _______

APRENDIZADO: ___________________________________________
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
  },
  {
    id: 'alimentacao',
    titulo: 'Planejamento Alimentação',
    descricao: 'Organização de refeições da semana',
    cor: '#F59E0B',
    perguntas: [
      { id: 'semana', label: 'Semana de referência', tipo: 'text' },
      { id: 'intencao', label: 'Intenção alimentar da semana (ex: mais proteína, menos glúten)', tipo: 'text' },
      { id: 'compras', label: 'O que precisa comprar? (liste os principais)', tipo: 'textarea' },
    ],
    gerador: (r) => `PLANEJAMENTO ALIMENTAR — ${r.semana || '___________'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INTENÇÃO: ${r.intencao || '___________________________________________'}

LISTA DE COMPRAS:
${r.compras || '___________________________________________'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

          CAFÉ        ALMOÇO        LANCHE        JANTAR
SEG   ___________  ___________  ___________  ___________
TER   ___________  ___________  ___________  ___________
QUA   ___________  ___________  ___________  ___________
QUI   ___________  ___________  ___________  ___________
SEX   ___________  ___________  ___________  ___________
SÁB   ___________  ___________  ___________  ___________
DOM   ___________  ___________  ___________  ___________

NOTAS / RECEITAS PARA TESTAR:
___________________________________________
___________________________________________`,
  },
  {
    id: 'rotina-emocional',
    titulo: 'Rotina Emocional',
    descricao: 'Acompanhamento de estado emocional diário',
    cor: '#F9A8D4',
    perguntas: [
      { id: 'semana', label: 'Semana de referência', tipo: 'text' },
      { id: 'intencao', label: 'Como quero me sentir essa semana?', tipo: 'text' },
      { id: 'gatilho', label: 'Qual gatilho você quer observar essa semana?', tipo: 'text' },
      { id: 'cuidado', label: 'Um cuidado que vai priorizar essa semana', tipo: 'text' },
    ],
    gerador: (r) => `ROTINA EMOCIONAL — ${r.semana || '___________'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INTENÇÃO: ${r.intencao || '___________________________________________'}
GATILHO PARA OBSERVAR: ${r.gatilho || '___________________________________________'}
CUIDADO DA SEMANA: ${r.cuidado || '___________________________________________'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REGISTRO DIÁRIO

       HUMOR (1-5)  ENERGIA (1-5)  ANOTAÇÃO
SEG    _________    _________    ________________________
TER    _________    _________    ________________________
QUA    _________    _________    ________________________
QUI    _________    _________    ________________________
SEX    _________    _________    ________________________
SÁB    _________    _________    ________________________
DOM    _________    _________    ________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REFLEXÃO DA SEMANA

O que foi bom: ___________________________________________
O que foi difícil: ___________________________________________
O que quero levar para terapia: ___________________________________________
___________________________________________
___________________________________________`,
  },
  {
    id: 'planejamento-mensal',
    titulo: 'Planejamento Mensal',
    descricao: 'Visão geral do mês com metas',
    cor: '#3B82F6',
    perguntas: [
      { id: 'mes', label: 'Mês e ano', tipo: 'text' },
      { id: 'palavra', label: 'Uma palavra para esse mês', tipo: 'text' },
      { id: 'meta_financeira', label: 'Meta financeira do mês (R$)', tipo: 'text' },
      { id: 'meta_conteudo', label: 'Meta de conteúdo (ex: 12 reels, 3 vídeos)', tipo: 'text' },
      { id: 'meta_pessoal', label: 'Meta pessoal / bem-estar', tipo: 'text' },
      { id: 'projeto1', label: 'Projeto 1 do mês', tipo: 'text' },
      { id: 'projeto2', label: 'Projeto 2 do mês', tipo: 'text' },
      { id: 'evitar', label: 'O que evitar / limitar esse mês', tipo: 'text' },
    ],
    gerador: (r) => `PLANEJAMENTO MENSAL — ${r.mes || '___________'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PALAVRA DO MÊS: ${r.palavra || '_____________'}

✦ METAS
Financeira: R$ ${r.meta_financeira || '_______'}
Conteúdo: ${r.meta_conteudo || '___________________________________________'}
Pessoal: ${r.meta_pessoal || '___________________________________________'}

✦ PROJETOS
1. ${r.projeto1 || '___________________________________________'}
2. ${r.projeto2 || '___________________________________________'}

✦ EVITAR / LIMITAR
${r.evitar || '___________________________________________'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SEMANAS DO MÊS

Semana 1 (___/___) ___________________________________________
Semana 2 (___/___) ___________________________________________
Semana 3 (___/___) ___________________________________________
Semana 4 (___/___) ___________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REFLEXÃO FINAL DO MÊS
O que conquistei: ___________________________________________
O que ficou para o próximo: ___________________________________________`,
  },
  {
    id: 'agenda-semanal',
    titulo: 'Agenda Semanal',
    descricao: 'Compromissos e horários da semana',
    cor: '#34D399',
    perguntas: [
      { id: 'semana', label: 'Semana de referência', tipo: 'text' },
      { id: 'compromissos', label: 'Liste seus compromissos fixos da semana', tipo: 'textarea' },
      { id: 'bloco_criacao', label: 'Melhor horário para criação de conteúdo', tipo: 'text' },
    ],
    gerador: (r) => `AGENDA SEMANAL — ${r.semana || '___________'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BLOCO IDEAL PARA CRIAÇÃO: ${r.bloco_criacao || '___________'}

COMPROMISSOS FIXOS:
${r.compromissos || '___________________________________________'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

       08h   09h   10h   11h   12h   13h   14h   15h   16h   17h   18h+
SEG  |_____|_____|_____|_____|_____|_____|_____|_____|_____|_____|_____|
TER  |_____|_____|_____|_____|_____|_____|_____|_____|_____|_____|_____|
QUA  |_____|_____|_____|_____|_____|_____|_____|_____|_____|_____|_____|
QUI  |_____|_____|_____|_____|_____|_____|_____|_____|_____|_____|_____|
SEX  |_____|_____|_____|_____|_____|_____|_____|_____|_____|_____|_____|
SÁB  |_____|_____|_____|_____|_____|_____|_____|_____|_____|_____|_____|
DOM  |_____|_____|_____|_____|_____|_____|_____|_____|_____|_____|_____|`,
  },
]

export default function ImpressosPage() {
  const [selected, setSelected] = useState<Template | null>(null)
  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [gerado, setGerado] = useState<string | null>(null)

  function handleGerar() {
    if (!selected) return
    setGerado(selected.gerador(respostas))
  }

  function handleImprimir() {
    if (!gerado) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<html><head><title>${selected?.titulo}</title><style>
      body { font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.6; padding: 32px; color: #111; }
      pre { white-space: pre-wrap; word-wrap: break-word; }
      @media print { body { padding: 20px; } }
    </style></head><body><pre>${gerado}</pre><script>window.print()<\/script></body></html>`)
    win.document.close()
  }

  function reset() {
    setSelected(null)
    setRespostas({})
    setGerado(null)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        {selected && (
          <button onClick={reset} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <ChevronLeft size={20} />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            {selected ? selected.titulo : 'Impressos & Planners'}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {selected ? selected.descricao : 'Gere documentos personalizados para imprimir'}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Template grid */}
        {!selected && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => { setSelected(t); setRespostas({}); setGerado(null) }}
                className="text-left bg-white rounded-2xl border border-[var(--border)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.09)] hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-xl mb-3 flex items-center justify-center" style={{ backgroundColor: `${t.cor}15` }}>
                  <Printer size={15} style={{ color: t.cor }} />
                </div>
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">{t.titulo}</p>
                <p className="text-xs text-[var(--text-muted)] leading-snug">{t.descricao}</p>
                <div className="mt-3 text-[10px] font-semibold uppercase tracking-wider transition-colors" style={{ color: t.cor }}>
                  Gerar →
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {/* Form */}
        {selected && !gerado && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={14} style={{ color: selected.cor }} />
                <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  Responda para personalizar o documento
                </p>
              </div>
              <div className="space-y-4">
                {selected.perguntas.map((p) => (
                  <div key={p.id}>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">{p.label}</label>
                    {p.tipo === 'textarea' ? (
                      <textarea
                        value={respostas[p.id] || ''}
                        onChange={(e) => setRespostas((prev) => ({ ...prev, [p.id]: e.target.value }))}
                        placeholder="Digite aqui..."
                        rows={3}
                        className="w-full text-sm text-[var(--text-primary)] bg-[var(--bg-base)] border border-[var(--border)] rounded-xl px-3 py-2.5 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 resize-none transition-all"
                      />
                    ) : (
                      <input
                        type="text"
                        value={respostas[p.id] || ''}
                        onChange={(e) => setRespostas((prev) => ({ ...prev, [p.id]: e.target.value }))}
                        placeholder="Digite aqui..."
                        className="w-full text-sm text-[var(--text-primary)] bg-[var(--bg-base)] border border-[var(--border)] rounded-xl px-3 py-2.5 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-all"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleGerar}>
                <Sparkles size={14} />
                Gerar documento
              </Button>
              <Button variant="secondary" onClick={reset}>Cancelar</Button>
            </div>
          </motion.div>
        )}

        {/* Preview + print */}
        {selected && gerado && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleImprimir}>
                <Printer size={14} />
                Imprimir / Salvar PDF
              </Button>
              <Button variant="secondary" onClick={() => setGerado(null)}>Editar respostas</Button>
              <Button variant="ghost" onClick={reset}>Novo documento</Button>
            </div>
            <Card>
              <CardBody>
                <pre className="text-xs text-[var(--text-secondary)] font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {gerado}
                </pre>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
