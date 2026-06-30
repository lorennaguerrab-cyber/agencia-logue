/* ============================================================
   Base de Conhecimento — Tipos
   Estrutura editável da Agência Logue usada como contexto da IA.
   Cada documento vira um "chunk" recuperável (RAG leve por keywords).
   ============================================================ */

export type KbCategoria =
  | 'servico'
  | 'pacote'
  | 'tom-de-voz'
  | 'regra-conteudo'
  | 'restricao'
  | 'briefing'
  | 'modelo-legenda'
  | 'modelo-roteiro'
  | 'modelo-calendario'
  | 'processo'
  | 'pergunta-estrategica'
  | 'exemplo'
  | 'persona'
  | 'funil'
  | 'campanha'
  | 'banco-ideias'
  | 'institucional'

export interface KbDoc {
  id: string
  categoria: KbCategoria
  titulo: string
  /** Texto que a IA lê como contexto. Markdown simples permitido. */
  conteudo: string
  /** Palavras-chave para recuperação. */
  tags: string[]
  /** Editável pela equipe; usado para versionamento simples. */
  atualizadoEm?: string
}

export const CATEGORIA_LABEL: Record<KbCategoria, string> = {
  'servico': 'Serviço',
  'pacote': 'Pacote',
  'tom-de-voz': 'Tom de voz',
  'regra-conteudo': 'Regra de conteúdo',
  'restricao': 'Restrição',
  'briefing': 'Briefing',
  'modelo-legenda': 'Modelo de legenda',
  'modelo-roteiro': 'Modelo de roteiro',
  'modelo-calendario': 'Modelo de calendário',
  'processo': 'Processo interno',
  'pergunta-estrategica': 'Pergunta estratégica',
  'exemplo': 'Exemplo de conteúdo',
  'persona': 'Persona / público',
  'funil': 'Jornada & funil',
  'campanha': 'Modelo de campanha',
  'banco-ideias': 'Banco de ideias',
  'institucional': 'Documento institucional',
}
