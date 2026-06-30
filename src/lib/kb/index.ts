import { KB_SEED } from './content'
import type { KbDoc, KbCategoria } from './types'

export * from './types'
export { KB_SEED }

/**
 * Em produção, esta função busca os documentos na tabela `kb_documentos`
 * do Supabase (editável pela equipe). Sem Supabase configurado, usa o seed.
 * Mantida síncrona com o seed para simplicidade do MVP; a versão Supabase
 * (async) está documentada no schema.sql.
 */
export function getKnowledgeBase(): KbDoc[] {
  return KB_SEED
}

const STOPWORDS = new Set([
  'a','o','as','os','de','da','do','das','dos','e','ou','um','uma','que','para',
  'com','sem','por','no','na','nos','nas','em','ao','aos','à','às','se','sua','seu',
  'meu','minha','the','of','to','and','is','um','uns','umas','pra','pro',
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t))
}

/**
 * RAG leve por palavras-chave: pontua cada documento pela sobreposição
 * entre a consulta e (título + tags + conteúdo). Suficiente e transparente
 * para o MVP; trocável por embeddings/pgvector sem mudar a interface.
 */
export function retrieve(
  query: string,
  opts: { categorias?: KbCategoria[]; limit?: number } = {}
): KbDoc[] {
  const { categorias, limit = 6 } = opts
  const qTokens = new Set(tokenize(query))
  const pool = getKnowledgeBase().filter(
    (d) => !categorias || categorias.includes(d.categoria)
  )

  const scored = pool.map((doc) => {
    const tagText = doc.tags.join(' ')
    const docTokens = tokenize(`${doc.titulo} ${tagText} ${doc.conteudo}`)
    let score = 0
    for (const t of docTokens) if (qTokens.has(t)) score += 1
    // tags valem mais (sinal mais limpo)
    for (const tag of doc.tags) {
      for (const t of tokenize(tag)) if (qTokens.has(t)) score += 2
    }
    return { doc, score }
  })

  const hits = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score)

  // Se a consulta não casou com nada, devolve os documentos das categorias
  // pedidas (ou um núcleo de marca) para sempre dar contexto à IA.
  const base = hits.length > 0 ? hits.map((h) => h.doc) : pool

  return base.slice(0, limit)
}

/** Sempre injetamos o núcleo de marca (tom + restrições) em toda geração. */
export function brandCore(): KbDoc[] {
  const ids = ['tom-principios', 'tom-faca-evite', 'restr-geral', 'regra-pilares']
  return getKnowledgeBase().filter((d) => ids.includes(d.id))
}

/** Monta o bloco de contexto que vai no prompt do sistema. */
export function buildContextBlock(docs: KbDoc[]): string {
  const seen = new Set<string>()
  const unique = docs.filter((d) => (seen.has(d.id) ? false : (seen.add(d.id), true)))
  return unique
    .map((d) => `### ${d.titulo} (${d.categoria})\n${d.conteudo}`)
    .join('\n\n')
}

export function byCategoria(cat: KbCategoria): KbDoc[] {
  return getKnowledgeBase().filter((d) => d.categoria === cat)
}
