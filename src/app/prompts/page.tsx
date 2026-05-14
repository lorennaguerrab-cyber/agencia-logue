'use client'

import { useState, useEffect, useCallback } from 'react'
import { Prompt, PromptCategory } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import {
  BookMarked, Copy, Check, Search, ChevronDown, ChevronRight,
  Plus, Trash2, X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

const SEED_PROMPTS: Prompt[] = [
  {
    id: 'p1',
    titulo: 'Criar post para blog',
    categoria: 'blog',
    descricao: 'Gera um artigo completo otimizado para SEO e engajamento',
    prompt_texto: `Você é uma escritora criativa e estrategista de conteúdo especializada em [TEMA].

Escreva um artigo de blog completo sobre: [TÍTULO]

Estrutura obrigatória:
1. Título magnético com palavra-chave
2. Introdução que cria conexão imediata (3-4 parágrafos)
3. 5-7 subtópicos desenvolvidos
4. Exemplos reais e histórias
5. Conclusão com CTA
6. Meta description (155 caracteres)
7. 5 sugestões de hashtag

Tom: [sofisticado/conversacional/técnico]
Tamanho: [1500/2000/3000] palavras

Palavras-chave principais: [PALAVRAS]`,
    ia_recomendada: 'claude',
    ferramenta_ideal: 'Claude + Notion + Rank Math',
    checklist: [
      'Definir palavra-chave principal',
      'Pesquisar top 5 artigos concorrentes',
      'Escrever com o prompt',
      'Adicionar imagens (Unsplash/Midjourney)',
      'Revisar SEO no Rank Math',
      'Publicar e compartilhar',
    ],
    referencias: ['Papel da Lola Blog', 'Google Trends', 'AnswerThePublic'],
    etapas: ['Pesquisa', 'Estrutura', 'Escrita', 'Revisão', 'Publicação'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'p2',
    titulo: 'Criar roteiro de reel',
    categoria: 'roteiro',
    descricao: 'Roteiro completo para reel viral de 30-60 segundos',
    prompt_texto: `Você é uma roteirista especializada em reels virais para Instagram e TikTok.

Crie um roteiro de reel de [30/60] segundos sobre: [TEMA]

Formato obrigatório:

GANCHO (0-3s):
[frase que para o scroll]

DESENVOLVIMENTO (4-25s):
[conteúdo principal em pontos rápidos]

CTA (últimos 5s):
[ação específica]

LEGENDA:
[legenda completa com hashtags]

Variações de gancho (3 opções):
1.
2.
3.

Tom desejado: [provocativo/educativo/emocional/humor]
Tema: [TEMA]
Meu nicho: criatividade, branding, maternidade, IA`,
    ia_recomendada: 'claude',
    ferramenta_ideal: 'Claude + CapCut + Canva',
    checklist: [
      'Escolher o gancho mais forte',
      'Gravar em fundo neutro',
      'Editar no CapCut',
      'Adicionar legendas',
      'Revisar áudio',
      'Publicar na melhor hora',
    ],
    referencias: ['Reels de alta performance', 'Viral Hooks Database'],
    etapas: ['Gancho', 'Roteiro', 'Gravação', 'Edição', 'Publicação'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'p3',
    titulo: 'Newsletter semanal',
    categoria: 'newsletter',
    descricao: 'Estrutura completa para newsletter engajante',
    prompt_texto: `Você é uma redatora especialista em newsletters que geram abertura acima de 40%.

Crie uma newsletter completa sobre: [TEMA DA SEMANA]

Estrutura:
📌 ASSUNTO: [3 opções de assunto irresistível]

ABERTURA (personalizada, com "Oi [nome]"):
[2-3 parágrafos conectando com a vida do leitor]

CONTEÚDO PRINCIPAL:
[tema central bem desenvolvido com exemplos práticos]

SEÇÃO FIXA — [nome da seção recorrente]:
[conteúdo da seção]

FECHAMENTO:
[despedida quente + pergunta para engajar resposta]

PS:
[algo pessoal e inesperado]

Tom: íntimo, inteligente, sofisticado mas acessível
Tamanho: [400-600 palavras]`,
    ia_recomendada: 'claude',
    ferramenta_ideal: 'Claude + Mailchimp/Beehiiv',
    checklist: [
      'Definir tema da semana',
      'Escrever com o prompt',
      'Revisar tom e personalidade',
      'Adicionar imagem de capa',
      'Programar envio',
      'Analisar métricas na semana seguinte',
    ],
    referencias: ['Newsletters que amo', 'Morning Brew', 'The Hustle'],
    etapas: ['Tema', 'Escrita', 'Revisão', 'Design', 'Envio', 'Análise'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'p4',
    titulo: 'Análise de marca',
    categoria: 'branding',
    descricao: 'Análise estratégica profunda de posicionamento de marca',
    prompt_texto: `Você é uma estrategista de marca com visão de diretora criativa.

Faça uma análise profunda da marca: [NOME DA MARCA]

Analise:

1. POSICIONAMENTO
- Proposta de valor clara?
- Diferencial competitivo
- Público-alvo percebido

2. IDENTIDADE VISUAL
- Coerência visual
- Paleta e tipografia
- Emoções transmitidas

3. PRESENÇA DIGITAL
- Tom de voz
- Tipo de conteúdo
- Frequência e consistência

4. PONTOS FORTES
[liste 5 pontos]

5. OPORTUNIDADES
[o que poderia fazer melhor]

6. O QUE PODEMOS APRENDER
[insights acionáveis para aplicar]

Use exemplos concretos e seja direta.`,
    ia_recomendada: 'claude',
    ferramenta_ideal: 'Claude + Perplexity + Notion',
    checklist: [
      'Pesquisar marca no Google e redes',
      'Analisar com o prompt',
      'Salvar insights no Notion',
      'Criar conteúdo baseado na análise',
    ],
    referencias: ['Brand New', 'Behance', 'Instagram da marca'],
    etapas: ['Pesquisa', 'Análise', 'Insights', 'Conteúdo'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'p5',
    titulo: 'UGC — Proposta para marca',
    categoria: 'ugc',
    descricao: 'Proposta profissional de UGC creator para marcas',
    prompt_texto: `Você é uma UGC creator e estrategista de conteúdo.

Crie uma proposta de UGC para a marca: [NOME DA MARCA]
Produto/serviço: [PRODUTO]

Estrutura da proposta:

APRESENTAÇÃO PESSOAL (3 linhas):
[quem você é + seus números + por que faz sentido]

O QUE ENTREGO:
[lista detalhada de entregáveis]

COMO TRABALHO:
[processo em 4 etapas]

VALORES:
[tabela de pacotes: básico / completo / premium]

POR QUE EU:
[3 diferenciais únicos]

PRÓXIMOS PASSOS:
[CTA claro]

Tom: profissional, confiante, propositivo`,
    ia_recomendada: 'claude',
    ferramenta_ideal: 'Claude + Canva + Notion',
    checklist: [
      'Pesquisar a marca profundamente',
      'Personalizar o prompt',
      'Criar proposta visual no Canva',
      'Enviar por e-mail profissional',
      'Follow-up em 3 dias',
    ],
    referencias: ['UGC Creator Playbook', 'Marca pessoal'],
    etapas: ['Pesquisa', 'Proposta', 'Design', 'Envio', 'Follow-up'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'p6',
    titulo: 'Planejamento semanal adaptativo',
    categoria: 'estrategia',
    descricao: 'Plano de semana baseado em energia e prioridades reais',
    prompt_texto: `Você é minha copiloto executiva especializada em produtividade adaptativa para mentes criativas com TDAH.

Vou te dar informações sobre minha semana e você cria um plano adaptativo.

CONTEXTO:
- Energia atual: [NÍVEL]
- Compromissos fixos: [LISTE]
- Tarefas urgentes: [LISTE]
- Tarefas importantes (não urgentes): [LISTE]
- Como me sinto emocionalmente: [ESTADO]

Crie um plano que:
1. Respeite minha energia atual
2. Coloque as tarefas mais pesadas nos meus melhores horários (13h-17h)
3. Quebre cada tarefa em microetapas
4. Reserve tempo para imprevistos
5. Inclua pausas obrigatórias
6. Sugira o que pode ser delegado ou eliminado

Formato: dia a dia, hora a hora, com emoji de energia`,
    ia_recomendada: 'claude',
    ferramenta_ideal: 'Claude + Google Calendar + Lorenna OS',
    checklist: [
      'Fazer o dump mental da semana',
      'Usar o prompt',
      'Revisar e ajustar',
      'Adicionar no calendário',
      'Revisão diária às 13h',
    ],
    referencias: ['Time blocking', 'Energy management'],
    etapas: ['Dump mental', 'Planejamento IA', 'Revisão', 'Execução'],
    created_at: new Date().toISOString(),
  },
]

const CATEGORY_LABELS: Record<string, string> = {
  conteudo: 'Conteúdo',
  roteiro: 'Roteiro',
  blog: 'Blog',
  newsletter: 'Newsletter',
  branding: 'Branding',
  cliente: 'Cliente',
  ugc: 'UGC',
  design: 'Design',
  pesquisa: 'Pesquisa',
  estrategia: 'Estratégia',
}

const IA_COLORS: Record<string, string> = {
  claude: '#A78BFA',
  chatgpt: '#34D399',
  gemini: '#60A5FA',
  perplexity: '#FBBF24',
}

const BLANK_FORM = {
  titulo: '',
  categoria: 'conteudo' as PromptCategory,
  descricao: '',
  prompt_texto: '',
  ia_recomendada: 'claude',
  ferramenta_ideal: '',
  checklist_raw: '',
  etapas_raw: '',
}

function PromptCard({ prompt, onDelete }: { prompt: Prompt; onDelete?: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  function copyPrompt() {
    navigator.clipboard.writeText(prompt.prompt_texto)
    setCopied(true)
    toast.success('Prompt copiado!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardBody className="pt-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">{prompt.titulo}</h3>
              <Badge variant="purple">{CATEGORY_LABELS[prompt.categoria] ?? prompt.categoria}</Badge>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: `${IA_COLORS[prompt.ia_recomendada] ?? '#A78BFA'}22`,
                  color: IA_COLORS[prompt.ia_recomendada] ?? '#A78BFA',
                }}
              >
                {prompt.ia_recomendada}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">{prompt.descricao}</p>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <Button variant="ghost" size="icon" onClick={copyPrompt} title="Copiar prompt">
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(prompt.id)}
                title="Excluir prompt"
                className="text-[var(--text-muted)] hover:text-red-400"
              >
                <Trash2 size={14} />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </Button>
          </div>
        </div>

        {prompt.ferramenta_ideal && (
          <p className="text-[11px] text-[var(--text-muted)]">🛠 {prompt.ferramenta_ideal}</p>
        )}

        <div className="flex gap-1 flex-wrap">
          {(prompt.etapas ?? []).map((etapa, i) => (
            <span
              key={etapa}
              className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)] flex items-center gap-1"
            >
              <span className="text-[var(--text-accent)]">{i + 1}</span> {etapa}
            </span>
          ))}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-2 border-t border-[var(--border)]">
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Prompt completo</p>
                  <div className="bg-[var(--bg-base)] rounded-xl p-4 border border-[var(--border)] relative">
                    <pre className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap font-mono leading-relaxed">
                      {prompt.prompt_texto}
                    </pre>
                    <button
                      onClick={copyPrompt}
                      className="absolute top-3 right-3 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                {(prompt.checklist ?? []).length > 0 && (
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2">Checklist</p>
                    <ul className="space-y-1.5">
                      {prompt.checklist.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                          <div className="w-4 h-4 rounded border border-[var(--border)] flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardBody>
    </Card>
  )
}

export default function PromptsPage() {
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState<PromptCategory | 'todos'>('todos')
  const [dbPrompts, setDbPrompts] = useState<Prompt[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(BLANK_FORM)
  const [saving, setSaving] = useState(false)

  const loadDbPrompts = useCallback(async () => {
    const { data } = await supabase
      .from('prompts')
      .select('*')
      .eq('is_custom', true)
      .order('created_at', { ascending: false })
    if (data) setDbPrompts(data as Prompt[])
  }, [])

  useEffect(() => { loadDbPrompts() }, [loadDbPrompts])

  const allPrompts = [...SEED_PROMPTS, ...dbPrompts]

  const filtered = allPrompts.filter((p) => {
    const matchSearch = !search || p.titulo.toLowerCase().includes(search.toLowerCase()) || p.descricao.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'todos' || p.categoria === filterCat
    return matchSearch && matchCat
  })

  async function handleSave() {
    if (!form.titulo.trim() || !form.prompt_texto.trim()) {
      toast.error('Título e prompt são obrigatórios.')
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase.from('prompts').insert({
        titulo: form.titulo.trim(),
        categoria: form.categoria,
        descricao: form.descricao.trim(),
        prompt_texto: form.prompt_texto.trim(),
        ia_recomendada: form.ia_recomendada,
        ferramenta_ideal: form.ferramenta_ideal.trim() || null,
        checklist: form.checklist_raw.split('\n').map(s => s.trim()).filter(Boolean),
        etapas: form.etapas_raw.split('\n').map(s => s.trim()).filter(Boolean),
        referencias: [],
        is_custom: true,
      })
      if (error) throw error
      toast.success('Prompt salvo!')
      setForm(BLANK_FORM)
      setModalOpen(false)
      loadDbPrompts()
    } catch {
      toast.error('Erro ao salvar prompt.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este prompt?')) return
    const { error } = await supabase.from('prompts').delete().eq('id', id)
    if (error) { toast.error('Erro ao excluir.'); return }
    toast.success('Prompt excluído.')
    setDbPrompts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Banco de Prompts</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Prompts prontos com IA recomendada, checklists e etapas
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={14} /> Novo prompt
          </Button>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-3 py-2 flex-1 max-w-xs">
            <Search size={14} className="text-[var(--text-muted)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar prompts..."
              className="text-sm flex-1 bg-transparent outline-none text-[var(--text-primary)]"
            />
          </div>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value as PromptCategory | 'todos')}
            className="text-sm text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-3 py-2"
          >
            <option value="todos">Todas categorias</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-center py-10 text-sm text-[var(--text-muted)]">Nenhum prompt encontrado.</p>
          )}
          {filtered.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onDelete={prompt.id.startsWith('p') ? undefined : handleDelete}
            />
          ))}
        </div>
      </motion.div>

      {/* New prompt modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(43,43,43,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false) }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[20px] border border-[var(--border)] w-full max-w-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                <h2 className="text-base font-semibold text-[var(--text-primary)]">Novo prompt</h2>
                <button onClick={() => setModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Título *</label>
                  <input
                    value={form.titulo}
                    onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                    placeholder="Ex: Criar caption para Instagram"
                    className="mt-1 w-full text-sm border border-[var(--border)] rounded-xl px-3 py-2.5 bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-pink-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Categoria</label>
                    <select
                      value={form.categoria}
                      onChange={e => setForm(f => ({ ...f, categoria: e.target.value as PromptCategory }))}
                      className="mt-1 w-full text-sm border border-[var(--border)] rounded-xl px-3 py-2.5 bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                    >
                      {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">IA recomendada</label>
                    <select
                      value={form.ia_recomendada}
                      onChange={e => setForm(f => ({ ...f, ia_recomendada: e.target.value }))}
                      className="mt-1 w-full text-sm border border-[var(--border)] rounded-xl px-3 py-2.5 bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
                    >
                      {Object.keys(IA_COLORS).map(ia => <option key={ia} value={ia}>{ia}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Descrição curta</label>
                  <input
                    value={form.descricao}
                    onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                    placeholder="O que esse prompt faz?"
                    className="mt-1 w-full text-sm border border-[var(--border)] rounded-xl px-3 py-2.5 bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-pink-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Prompt completo *</label>
                  <textarea
                    value={form.prompt_texto}
                    onChange={e => setForm(f => ({ ...f, prompt_texto: e.target.value }))}
                    placeholder="Cole aqui o prompt completo. Use [COLCHETES] para variáveis."
                    rows={8}
                    className="mt-1 w-full text-sm border border-[var(--border)] rounded-xl px-3 py-2.5 bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-pink-300 resize-none font-mono leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Ferramenta ideal</label>
                  <input
                    value={form.ferramenta_ideal}
                    onChange={e => setForm(f => ({ ...f, ferramenta_ideal: e.target.value }))}
                    placeholder="Ex: Claude + Canva"
                    className="mt-1 w-full text-sm border border-[var(--border)] rounded-xl px-3 py-2.5 bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-pink-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Etapas (1 por linha)</label>
                    <textarea
                      value={form.etapas_raw}
                      onChange={e => setForm(f => ({ ...f, etapas_raw: e.target.value }))}
                      placeholder={"Pesquisa\nEscrita\nRevisão"}
                      rows={4}
                      className="mt-1 w-full text-sm border border-[var(--border)] rounded-xl px-3 py-2.5 bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-pink-300 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Checklist (1 por linha)</label>
                    <textarea
                      value={form.checklist_raw}
                      onChange={e => setForm(f => ({ ...f, checklist_raw: e.target.value }))}
                      placeholder={"Definir objetivo\nEscrever com IA\nRevisar"}
                      rows={4}
                      className="mt-1 w-full text-sm border border-[var(--border)] rounded-xl px-3 py-2.5 bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:border-pink-300 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="ghost" size="md" className="flex-1" onClick={() => setModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button variant="primary" size="md" className="flex-1" onClick={handleSave} loading={saving}>
                    Salvar prompt
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
