/* Área do cliente — dados de demonstração.
   Em produção, cada cliente é uma linha em `clientes` (Supabase) com
   RLS por usuário; briefings, demandas, conteúdos e arquivos relacionados.
   Este módulo é o seed/mock para o MVP funcionar sem backend. */

export interface ClientAccount {
  id: string
  nome: string
  marca: string
  email: string
  senha: string
  segmento: string
  pacote: string
  gerente: string
  driveUrl: string
}

export const CLIENT_ACCOUNTS: ClientAccount[] = [
  {
    id: 'igor',
    nome: 'Igor Giordano',
    marca: 'Igor Giordano Óticas',
    email: 'cliente@logue.com.br',
    senha: 'cliente',
    segmento: 'Ótica · varejo local',
    pacote: 'Pacote Estratégico',
    gerente: 'Lorenna Guerra',
    driveUrl: 'https://drive.google.com',
  },
]

export interface Demanda {
  id: string
  titulo: string
  descricao: string
  tipo: 'demanda' | 'ideia'
  status: 'pendente' | 'em_producao' | 'em_revisao' | 'aprovado' | 'entregue'
  criadoEm: string
}

export interface Briefing {
  id: string
  titulo: string
  status: 'aberto' | 'respondido'
  perguntas: { q: string; r?: string }[]
}

export interface CalendarItem {
  id: string
  data: string
  titulo: string
  formato: 'Reel' | 'Carrossel' | 'Story' | 'Post'
  pilar: string
  status: 'planejado' | 'em_producao' | 'aprovacao' | 'agendado' | 'publicado'
}

export interface Aprovacao {
  id: string
  titulo: string
  formato: string
  legenda: string
  prazo: string
  status: 'pendente' | 'aprovado' | 'ajustes'
}

export interface Arquivo {
  id: string
  nome: string
  tipo: 'pasta' | 'documento' | 'video' | 'imagem'
  url: string
  atualizado: string
}

export const SEED_DEMANDAS: Demanda[] = [
  { id: 'd1', titulo: 'Chegou coleção nova de armações', descricao: 'Recebemos a linha autoral nova, queria divulgar essa semana.', tipo: 'demanda', status: 'em_producao', criadoEm: '2026-06-24' },
  { id: 'd2', titulo: 'Ideia: vídeo mostrando os bastidores da loja', descricao: 'Acho que seria legal mostrar a equipe montando a vitrine.', tipo: 'ideia', status: 'pendente', criadoEm: '2026-06-26' },
  { id: 'd3', titulo: 'Promoção de inverno', descricao: 'Quero fazer uma campanha de óculos de sol antes de julho.', tipo: 'demanda', status: 'em_revisao', criadoEm: '2026-06-20' },
]

export const SEED_BRIEFINGS: Briefing[] = [
  {
    id: 'b1',
    titulo: 'Briefing de onboarding',
    status: 'respondido',
    perguntas: [
      { q: 'O que torna sua marca diferente?', r: 'Armações autorais e atendimento próximo.' },
      { q: 'Quem é seu cliente ideal?', r: 'Adultos 30-55 que valorizam estilo e qualidade.' },
      { q: 'Qual objetivo dos próximos 90 dias?', r: 'Mais agendamentos pelo Instagram.' },
    ],
  },
  {
    id: 'b2',
    titulo: 'Briefing — Campanha de aniversário da loja',
    status: 'aberto',
    perguntas: [
      { q: 'Qual a data e o que será oferecido?' },
      { q: 'Qual sentimento a campanha deve passar?' },
      { q: 'Tem provas/depoimentos para usar?' },
    ],
  },
]

export const SEED_CALENDAR: CalendarItem[] = [
  { id: 'c1', data: '2026-07-01', titulo: '3 erros ao escolher uma armação', formato: 'Carrossel', pilar: 'Autoridade', status: 'agendado' },
  { id: 'c2', data: '2026-07-03', titulo: 'Bastidores: nova coleção autoral', formato: 'Reel', pilar: 'Bastidores', status: 'em_producao' },
  { id: 'c3', data: '2026-07-05', titulo: 'Depoimento de cliente', formato: 'Story', pilar: 'Prova social', status: 'planejado' },
  { id: 'c4', data: '2026-07-08', titulo: 'Lente certa muda tudo (antes/depois)', formato: 'Post', pilar: 'Venda', status: 'aprovacao' },
  { id: 'c5', data: '2026-07-10', titulo: 'Quiz: qual armação combina com seu rosto', formato: 'Story', pilar: 'Conexão', status: 'planejado' },
]

export const SEED_APROVACOES: Aprovacao[] = [
  {
    id: 'a1',
    titulo: 'Lente certa muda tudo',
    formato: 'Post · Feed',
    legenda: 'A armação certa você até acha sozinho. A lente certa, não.\n\nMuita gente investe na estética e esquece do que realmente faz diferença no dia a dia: a lente. É ela que define seu conforto, sua nitidez e até quanto você cansa a vista.\n\nNa Igor Giordano, a gente avalia seu caso antes de indicar. Sem empurrar, com cuidado.\n\nAgende sua avaliação — link na bio.',
    prazo: '2026-07-06',
    status: 'pendente',
  },
  {
    id: 'a2',
    titulo: 'Bastidores da nova coleção',
    formato: 'Reel',
    legenda: 'Toda coleção começa muito antes da vitrine. 👇\n\nVem ver como nasce uma armação autoral na Igor Giordano.',
    prazo: '2026-07-02',
    status: 'pendente',
  },
]

export const SEED_ARQUIVOS: Arquivo[] = [
  { id: 'f1', nome: 'Pasta do mês — Julho 2026', tipo: 'pasta', url: 'https://drive.google.com', atualizado: '2026-06-28' },
  { id: 'f2', nome: 'Manual de marca (PDF)', tipo: 'documento', url: 'https://drive.google.com', atualizado: '2026-05-15' },
  { id: 'f3', nome: 'Reel — coleção autoral (final)', tipo: 'video', url: 'https://drive.google.com', atualizado: '2026-06-27' },
  { id: 'f4', nome: 'Fotos da vitrine', tipo: 'imagem', url: 'https://drive.google.com', atualizado: '2026-06-22' },
]

export function findClientByLogin(email: string, senha: string): ClientAccount | null {
  const e = email.trim().toLowerCase()
  return CLIENT_ACCOUNTS.find((c) => c.email === e && c.senha === senha) ?? null
}

export function clientById(id: string | null): ClientAccount | null {
  if (!id) return null
  return CLIENT_ACCOUNTS.find((c) => c.id === id) ?? null
}
