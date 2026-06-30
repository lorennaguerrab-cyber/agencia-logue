import { retrieve, brandCore, buildContextBlock, type KbCategoria } from '@/lib/kb'
import { runLlm, extractJson } from './provider'

/* ============================================================
   Ferramentas de IA da Agência Logue
   Toda geração: (1) recupera contexto da base de conhecimento,
   (2) injeta núcleo de marca (tom + restrições), (3) chama o
   modelo OU usa um gerador-modelo determinístico de fallback.
   ============================================================ */

export interface AiResponse<T> {
  data: T
  source: 'claude' | 'fallback'
  usedDocs: { id: string; titulo: string; categoria: string }[]
}

const BASE_SYSTEM = `Você é o assistente de conteúdo da Agência Logue, uma agência de branding, social media, conteúdo estratégico, design e produção criativa.

Responda SEMPRE seguindo a base de conhecimento, o tom de voz e a metodologia da Agência Logue fornecidos no contexto.

Regras invioláveis:
- Tom humano, profissional, criativo, claro e sofisticado. Nunca robótico ou genérico.
- Proibido: promessas milagrosas, resultados garantidos, hype ("explodir", "segredo", "fórmula mágica"), superlativos vazios.
- Cada peça tem propósito estratégico (autoridade, conexão, venda, prova social, bastidores ou educação).
- Seja específico e útil para execução prática. Respeite as restrições da marca.
- Responda em português do Brasil.`

function context(query: string, categorias?: KbCategoria[]) {
  const retrieved = retrieve(query, { categorias, limit: 6 })
  const core = brandCore()
  const all = [...core, ...retrieved]
  const usedDocs = dedupe(all).map((d) => ({
    id: d.id,
    titulo: d.titulo,
    categoria: d.categoria,
  }))
  return { block: buildContextBlock(all), usedDocs }
}

function dedupe<T extends { id: string }>(arr: T[]): T[] {
  const seen = new Set<string>()
  return arr.filter((x) => (seen.has(x.id) ? false : (seen.add(x.id), true)))
}

function systemWith(block: string) {
  return `${BASE_SYSTEM}\n\n--- BASE DE CONHECIMENTO (consulte antes de responder) ---\n${block}`
}

/* ============================================================
   1) GERADOR DE IDEIAS DE CONTEÚDO
   ============================================================ */

export interface IdeiasInput {
  nicho: string
  objetivo: string
  publico?: string
  servico?: string
  tom?: string
  dataRelevante?: string
}

export interface IdeiaItem {
  titulo: string
  formato: 'Reel' | 'Carrossel' | 'Story' | 'Post'
  pilar: string
  porque: string
}

export async function gerarIdeias(input: IdeiasInput): Promise<AiResponse<IdeiaItem[]>> {
  const query = `${input.nicho} ${input.objetivo} ${input.servico ?? ''} ${input.publico ?? ''} ${input.dataRelevante ?? ''}`
  const { block, usedDocs } = context(query, ['banco-ideias', 'regra-conteudo', 'servico', 'pacote'])

  const user = `Gere 6 ideias de conteúdo para:
- Nicho: ${input.nicho}
- Objetivo: ${input.objetivo}
- Público: ${input.publico || 'não informado'}
- Serviço/oferta: ${input.servico || 'não informado'}
- Tom: ${input.tom || 'tom da Logue'}
- Data/sazonalidade: ${input.dataRelevante || 'nenhuma'}

Varie formatos (Reel, Carrossel, Story, Post) e pilares (autoridade, conexão, venda, prova social, bastidores, educação).
Responda APENAS um array JSON: [{"titulo","formato","pilar","porque"}]. "porque" = 1 frase do racional estratégico.`

  const llm = await runLlm({ system: systemWith(block), user })
  if (llm) {
    const parsed = extractJson<IdeiaItem[]>(llm)
    if (Array.isArray(parsed) && parsed.length) {
      return { data: parsed.slice(0, 8), source: 'claude', usedDocs }
    }
  }
  return { data: fallbackIdeias(input), source: 'fallback', usedDocs }
}

function fallbackIdeias(input: IdeiasInput): IdeiaItem[] {
  const n = input.nicho || 'sua marca'
  const obj = input.objetivo || 'autoridade'
  const data = input.dataRelevante
  const base: IdeiaItem[] = [
    { titulo: `3 erros que ${n} comete antes de decidir`, formato: 'Carrossel', pilar: 'Autoridade', porque: 'Educa e posiciona como referência ao nomear um problema real.' },
    { titulo: `Bastidores: como nasce um trabalho de ${n}`, formato: 'Reel', pilar: 'Bastidores', porque: 'Humaniza a marca e gera conexão mostrando o processo.' },
    { titulo: `O resultado de quem confiou em ${n}`, formato: 'Carrossel', pilar: 'Prova social', porque: 'Constrói confiança com prova real, sem prometer milagre.' },
    { titulo: `Mito x verdade sobre ${n}`, formato: 'Reel', pilar: 'Educação', porque: 'Quebra objeções comuns e demonstra domínio do assunto.' },
    { titulo: `Como dar o primeiro passo com ${n}`, formato: 'Post', pilar: 'Venda', porque: `Apresenta a oferta de forma leve, conectada ao objetivo de ${obj}.` },
    { titulo: `Enquete: o que mais trava você em ${n}?`, formato: 'Story', pilar: 'Conexão', porque: 'Gera interação e gera insumo para próximos conteúdos.' },
  ]
  if (data) {
    base.unshift({
      titulo: `Campanha de ${data}: a ideia certa para ${n}`,
      formato: 'Carrossel',
      pilar: 'Venda',
      porque: `Aproveita ${data} conectando a data ao valor da marca, sem oportunismo.`,
    })
  }
  return base
}

/* ============================================================
   2) GERADOR DE LEGENDAS
   ============================================================ */

export interface LegendaInput {
  tema: string
  formato: string
  objetivo: string
  tom?: string
}

export interface LegendaOutput {
  gancho: string
  desenvolvimento: string
  cta: string
  hashtags: string[]
}

export async function gerarLegenda(input: LegendaInput): Promise<AiResponse<LegendaOutput>> {
  const { block, usedDocs } = context(`${input.tema} ${input.objetivo} ${input.formato}`, [
    'modelo-legenda', 'regra-conteudo', 'tom-de-voz',
  ])

  const user = `Escreva uma legenda para:
- Tema: ${input.tema}
- Formato: ${input.formato}
- Objetivo: ${input.objetivo}
- Tom: ${input.tom || 'tom da Logue'}

Estruture com gancho (1ª linha que para o scroll), desenvolvimento (2-4 parágrafos curtos com valor real) e CTA único e claro.
Responda APENAS JSON: {"gancho","desenvolvimento","cta","hashtags":["#..."]} (5-8 hashtags relevantes, sem genéricas).`

  const llm = await runLlm({ system: systemWith(block), user })
  if (llm) {
    const parsed = extractJson<LegendaOutput>(llm)
    if (parsed?.gancho && parsed?.cta) {
      return {
        data: { ...parsed, hashtags: parsed.hashtags ?? [] },
        source: 'claude',
        usedDocs,
      }
    }
  }
  return { data: fallbackLegenda(input), source: 'fallback', usedDocs }
}

function fallbackLegenda(input: LegendaInput): LegendaOutput {
  const tema = input.tema || 'seu tema'
  const isVenda = /venda|oferta|promo|compra/i.test(input.objetivo)
  return {
    gancho: `A maioria erra ${tema} antes mesmo de começar.`,
    desenvolvimento:
      `Existe um detalhe simples que muda tudo quando o assunto é ${tema} — e quase ninguém presta atenção nele.\n\n` +
      `Na prática, o que separa um bom resultado de um resultado mediano não é fazer mais. É fazer com clareza e intenção.\n\n` +
      `Foi assim que passamos a tratar ${tema}: menos ruído, mais propósito. Cada escolha com um porquê.`,
    cta: isVenda
      ? 'Quer aplicar isso na sua marca? Chama a gente no direct.'
      : 'Salva esse post pra consultar quando precisar — e me conta nos comentários como você faz hoje.',
    hashtags: ['#agencialogue', '#estrategiademarca', '#conteudoestrategico', '#branding', '#socialmedia'],
  }
}

/* ============================================================
   3) TRANSFORMADOR DE IDEIA SOLTA EM BRIEFING
   ============================================================ */

export interface BriefingInput {
  demanda: string
  cliente?: string
  segmento?: string
}

export interface BriefingOutput {
  objetivo: string
  publico: string
  formatoIndicado: string
  urgencia: string
  mensagemPrincipal: string
  sugestoes: string[]
  perguntasComplementares: string[]
}

export async function transformarBriefing(input: BriefingInput): Promise<AiResponse<BriefingOutput>> {
  const { block, usedDocs } = context(`${input.demanda} ${input.segmento ?? ''}`, [
    'briefing', 'pergunta-estrategica', 'regra-conteudo', 'campanha',
  ])

  const user = `Um cliente enviou esta demanda bagunçada:
"${input.demanda}"
${input.cliente ? `Cliente: ${input.cliente}` : ''}${input.segmento ? ` — Segmento: ${input.segmento}` : ''}

Transforme em um briefing organizado.
Responda APENAS JSON: {"objetivo","publico","formatoIndicado","urgencia","mensagemPrincipal","sugestoes":["..."],"perguntasComplementares":["..."]}.
"sugestoes" = 3-5 ideias de conteúdo concretas. "perguntasComplementares" = 3-4 perguntas estratégicas para fechar o briefing.`

  const llm = await runLlm({ system: systemWith(block), user })
  if (llm) {
    const parsed = extractJson<BriefingOutput>(llm)
    if (parsed?.objetivo) {
      return {
        data: {
          ...parsed,
          sugestoes: parsed.sugestoes ?? [],
          perguntasComplementares: parsed.perguntasComplementares ?? [],
        },
        source: 'claude',
        usedDocs,
      }
    }
  }
  return { data: fallbackBriefing(input), source: 'fallback', usedDocs }
}

function fallbackBriefing(input: BriefingInput): BriefingOutput {
  const d = input.demanda.toLowerCase()
  const isLancamento = /produto novo|lançamento|chegou|novidade/.test(d)
  const isPromo = /promo|desconto|oferta|black/.test(d)
  const isEvento = /evento|feira|participar|congresso/.test(d)

  const objetivo = isPromo ? 'Venda — converter com uma oferta clara'
    : isLancamento ? 'Apresentar a novidade e gerar desejo'
    : isEvento ? 'Autoridade e relacionamento a partir do evento'
    : 'Conexão e clareza sobre a mensagem'

  const formato = isLancamento ? 'Reel de apresentação + carrossel de detalhes'
    : isPromo ? 'Post de oferta + sequência de stories'
    : isEvento ? 'Stories de bastidores + reel pós-evento'
    : 'Carrossel ou reel, conforme a mensagem'

  return {
    objetivo,
    publico: input.segmento ? `Público da marca no segmento de ${input.segmento}` : 'Cliente ideal da marca (a confirmar persona)',
    formatoIndicado: formato,
    urgencia: isPromo || isEvento ? 'Alta — depende de data' : 'Média — planejável',
    mensagemPrincipal: `Comunicar "${input.demanda.trim()}" de forma estratégica, conectada ao valor da marca.`,
    sugestoes: [
      isLancamento ? 'Reel mostrando o produto/novidade em uso, com gancho no problema que resolve.' : 'Reel com gancho no benefício principal.',
      'Carrossel detalhando o que é, para quem e o primeiro passo.',
      'Sequência de stories com bastidor + enquete + CTA.',
      isPromo ? 'Post de oferta com condição clara (sem urgência falsa).' : 'Post de prova social conectado ao tema.',
    ],
    perguntasComplementares: [
      'Qual é a única ação que você quer que o público tome com este conteúdo?',
      'Existe alguma data ou prazo que torna isso urgente?',
      'Quais provas (fotos, depoimentos, números) você já tem disponíveis?',
      'Há algo que NÃO pode ser dito ou mostrado?',
    ],
  }
}

/* ============================================================
   REGISTRO DAS 10 FERRAMENTAS (arquitetura)
   As 3 primeiras estão implementadas; as demais têm endpoint
   e contrato previstos (ver README / api/ai).
   ============================================================ */

export interface ToolMeta {
  slug: string
  nome: string
  descricao: string
  status: 'pronto' | 'arquitetado'
  icon: string
}

export const TOOLS: ToolMeta[] = [
  { slug: 'ideias', nome: 'Gerador de ideias', descricao: 'Ideias de posts, reels, carrosséis e stories por nicho, objetivo e público.', status: 'pronto', icon: 'Lightbulb' },
  { slug: 'legendas', nome: 'Gerador de legendas', descricao: 'Legenda com gancho, desenvolvimento e CTA, no tom da marca.', status: 'pronto', icon: 'Type' },
  { slug: 'briefing', nome: 'Demanda → Briefing', descricao: 'Transforma uma ideia solta em briefing organizado e acionável.', status: 'pronto', icon: 'ClipboardList' },
  { slug: 'roteiros', nome: 'Roteiros de Reels', descricao: 'Hook, fala principal, cenas, texto na tela e CTA.', status: 'arquitetado', icon: 'Film' },
  { slug: 'stories', nome: 'Stories do dia', descricao: 'Sequência com enquete, caixinha, bastidor, venda leve e prova social.', status: 'arquitetado', icon: 'CircleDot' },
  { slug: 'calendario', nome: 'Calendário editorial', descricao: 'Plano de 7, 15 ou 30 dias por pilares de conteúdo.', status: 'arquitetado', icon: 'CalendarDays' },
  { slug: 'diagnostico', nome: 'Diagnóstico de perfil', descricao: 'Análise de bio, destaques, linha editorial e posicionamento.', status: 'arquitetado', icon: 'Search' },
  { slug: 'campanhas', nome: 'Campanhas sazonais', descricao: 'Conceito, peças, oferta, roteiro, CTA e cronograma por data comercial.', status: 'arquitetado', icon: 'Megaphone' },
  { slug: 'assistente-briefing', nome: 'Assistente de briefing', descricao: 'Conduz o cliente com perguntas estratégicas até um briefing completo.', status: 'arquitetado', icon: 'MessagesSquare' },
  { slug: 'banco-ideias', nome: 'Banco de ideias por nicho', descricao: 'Ideias adaptadas a estética, psicologia, ótica, restaurante e mais.', status: 'arquitetado', icon: 'Boxes' },
]
