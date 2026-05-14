export type EnergyMode =
  | 'cansada'
  | 'criativa'
  | 'operacional'
  | 'foco'
  | 'social'
  | 'maternidade'
  | 'gravacao'

export interface EnergyConfig {
  id: EnergyMode
  label: string
  emoji: string
  description: string
  color: string
  accent: string
  showHeavyTasks: boolean
  suggestedActions: string[]
}

export interface Task {
  id: string
  titulo: string
  descricao?: string
  status: 'pendente' | 'em_progresso' | 'concluida' | 'pausada'
  prioridade: 'urgente' | 'alta' | 'media' | 'baixa'
  energia_necessaria: EnergyMode[]
  microetapas: MicroStep[]
  categoria: TaskCategory
  cliente_id?: string
  projeto_id?: string
  data_limite?: string
  recorrente: boolean
  recorrencia?: string
  notion_id?: string
  created_at: string
  updated_at: string
}

export interface MicroStep {
  id: string
  task_id: string
  ordem: number
  descricao: string
  concluida: boolean
  tempo_estimado?: number
}

export type TaskCategory =
  | 'conteudo'
  | 'cliente'
  | 'criativo'
  | 'administrativo'
  | 'pessoal'
  | 'maternidade'
  | 'aprendizado'

export interface Idea {
  id: string
  titulo: string
  descricao?: string
  categoria: IdeaCategory
  plataformas: Platform[]
  status: 'bruta' | 'desenvolvendo' | 'pronta' | 'aplicada'
  tags: string[]
  conexoes: string[]
  notion_id?: string
  created_at: string
  updated_at: string
}

export type IdeaCategory =
  | 'branding'
  | 'mulheres_incriveis'
  | 'livros_infantis'
  | 'maternidade'
  | 'lifestyle'
  | 'criatividade'
  | 'inteligencia_artificial'
  | 'analise_marcas'
  | 'design'
  | 'marketing'
  | 'rotina'
  | 'blogosfera'
  | 'bastidores'

export type Platform =
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'blog'
  | 'newsletter'
  | 'linkedin'
  | 'collab'
  | 'pinterest'

export interface Client {
  id: string
  nome: string
  logo?: string
  cor: string
  retorno_financeiro: number
  custo_cognitivo: 1 | 2 | 3 | 4 | 5
  alinhamento: 1 | 2 | 3 | 4 | 5
  esforco: 1 | 2 | 3 | 4 | 5
  satisfacao: 1 | 2 | 3 | 4 | 5
  status: 'ativo' | 'pausado' | 'encerrado'
  proximas_acoes: string[]
  tarefas_pendentes: number
  created_at: string
}

export interface CRMContact {
  id: string
  nome: string
  tipo: 'marca' | 'influencer' | 'ugc' | 'collab' | 'networking'
  status: 'potencial' | 'em_contato' | 'negociando' | 'fechado' | 'arquivado'
  plataforma?: Platform
  proposta?: string
  valor?: number
  proxima_acao?: string
  data_followup?: string
  notas?: string
  created_at: string
}

export interface Prompt {
  id: string
  titulo: string
  categoria: PromptCategory
  descricao: string
  prompt_texto: string
  ia_recomendada: 'claude' | 'chatgpt' | 'gemini' | 'perplexity'
  ferramenta_ideal?: string
  checklist: string[]
  referencias: string[]
  etapas: string[]
  created_at: string
}

export type PromptCategory =
  | 'conteudo'
  | 'roteiro'
  | 'blog'
  | 'newsletter'
  | 'branding'
  | 'cliente'
  | 'ugc'
  | 'design'
  | 'pesquisa'
  | 'estrategia'

export interface Capture {
  id: string
  conteudo_raw: string
  conteudo_processado?: string
  tipo: 'texto' | 'audio' | 'dump'
  tarefas_extraidas: string[]
  ideias_extraidas: string[]
  categorias_detectadas: string[]
  processada: boolean
  created_at: string
}

export interface ContentItem {
  id: string
  titulo: string
  tipo: 'reel' | 'youtube' | 'blog' | 'newsletter' | 'tiktok' | 'shorts' | 'carrossel'
  plataformas: Platform[]
  status: 'ideia' | 'rascunho' | 'filmando' | 'editando' | 'revisao' | 'agendado' | 'publicado'
  categoria: IdeaCategory
  data_filmagem?: string
  data_publicacao?: string
  url_post?: string
  notion_id?: string
  created_at: string
}

export interface DayFocus {
  data: string
  energia: EnergyMode
  foco_principal: string
  tarefas_selecionadas: string[]
  nota_do_dia?: string
}
