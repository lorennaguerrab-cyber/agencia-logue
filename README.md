# Agência Logue — Site + Área do Cliente + Painel + Ferramentas de IA

MVP do ecossistema digital da **Agência Logue**: um site institucional, uma área
logada para clientes, um painel interno para a equipe e um conjunto de
ferramentas de IA treinadas pelo **contexto próprio da agência** (RAG sobre uma
base de conhecimento editável).

> A IA **não é genérica**. Toda geração consulta a base de conhecimento da Logue
> (serviços, pacotes, tom de voz, regras, restrições, modelos e exemplos) e
> injeta o núcleo de marca (tom + restrições) antes de responder.

---

## 1. Arquitetura

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 +
design tokens em CSS · Zustand (estado/sessão) · Supabase (Postgres + Auth, schema
pronto) · API de IA da Anthropic (Claude) com *fallback* determinístico.

Por que esta stack: é simples, escalável e fácil de manter; um único projeto
entrega site público, áreas logadas e backend (Route Handlers), sem servidor
separado. Supabase dá banco + autenticação + RLS sem infra própria. A IA roda em
Route Handlers no servidor, mantendo a chave secreta fora do cliente.

### Organização por áreas (route groups)

```
src/app/
  layout.tsx                # layout raiz (fontes + globals), sem chrome
  (site)/                   # SITE PÚBLICO  — header/footer próprios
    page.tsx  sobre  servicos  pacotes  portfolio  blog/[slug]  contato
  (auth)/login              # login único (abas: cliente / equipe)
  (client)/cliente/         # ÁREA DO CLIENTE — guarda de sessão própria
    page  briefings  demandas  calendario  aprovacoes  arquivos  orientacoes
  (painel)/painel/          # PAINEL INTERNO/ADMIN (Logue OS) — sob /painel
    page  clientes  entregas  ia  base  roteiros  financeiro ...
  api/
    ai/{ideias,legendas,briefing}/route.ts   # ferramentas de IA
    contato/route.ts                          # leads do site
```

### Camada de IA + base de conhecimento (o coração do projeto)

```
src/lib/kb/        # BASE DE CONHECIMENTO (15 categorias) — fonte de verdade
  types.ts         # categorias e tipos
  content.ts       # documentos editáveis (seed; em prod -> tabela kb_documentos)
  index.ts         # retrieve() RAG por keywords, brandCore(), buildContextBlock()
src/lib/ai/
  provider.ts      # chamada ao Claude com fallback gracioso (sem chave -> modelo)
  tools.ts         # 3 ferramentas implementadas + registro das 10
```

**Fluxo de cada geração:** `entrada do usuário` → `retrieve()` recupera os
documentos relevantes da base + `brandCore()` (tom de voz e restrições, sempre) →
monta o *system prompt* com esse contexto → chama o Claude **ou**, sem
`ANTHROPIC_API_KEY`, usa um gerador-modelo determinístico (para o MVP funcionar e
ser demonstrável sem credenciais). A resposta inclui `usedDocs` — os documentos
consultados — exibidos na interface para transparência do RAG.

---

## 2. Banco de dados

`supabase/agencia_logue.sql` — modelo completo: `profiles` (papéis admin/equipe/
cliente), `clientes`, `projetos`, `briefings`, `demandas`, `conteudos`
(calendário + fluxo de aprovação), `arquivos`, `kb_documentos` (base da IA, com
coluna `vector` opcional para pgvector), `prompts_internos`, `geracoes_ia`
(histórico), `leads`, `servicos`, `pacotes`. Inclui índices e esboço de **RLS**
(cliente só vê o que é seu; equipe vê tudo).

No MVP, os dados rodam de *seeds* em `src/lib/` (sem precisar de Supabase
configurado). A migração para Supabase é trocar os módulos de dados por queries —
as interfaces já estão desenhadas para isso.

---

## 3. Fluxo de telas

- **Site:** Home → Serviços/Pacotes/Portfólio/Conteúdos → Contato (gera lead) →
  Login.
- **Cliente:** Login (aba *Sou cliente*) → Visão geral → Briefings, Demandas &
  Ideias (com "Organizar com IA"), Calendário, Aprovações (aprovar / pedir
  ajustes), Arquivos, Como enviar materiais.
- **Painel:** Login (aba *Sou da equipe*) → Dashboard → Clientes, Entregas,
  **Ferramentas de IA**, **Base de conhecimento** (editar contexto da IA),
  Financeiro etc.

---

## 4. Funcionalidades do MVP

Site institucional (7 páginas) · Login dual (cliente/equipe) · Área do cliente
(7 telas) · Painel interno com gestão e KPIs · Base de conhecimento navegável e
editável · 3 ferramentas de IA funcionais com RAG + arquitetura das outras 7 ·
captação de leads.

## 5. Componentes principais

`SiteHeader`/`SiteFooter`, `ClientShell`, `Shell`/`Sidebar` (painel),
`ContatoForm`, hub de IA (`painel/ia`), editor da base (`painel/base`), e a
camada `kb` + `ai`.

## 6–9. Versões funcionais entregues

- ✅ Site funcional (`/`)
- ✅ Área logada do cliente (`/cliente/*`)
- ✅ Painel interno/admin (`/painel/*`)
- ✅ 3 ferramentas de IA: **Gerador de ideias**, **Gerador de legendas**,
  **Demanda → Briefing** (com base de conhecimento/RAG e fallback).

As outras 7 ferramentas (roteiros, stories, calendário, diagnóstico, campanhas,
assistente de briefing, banco de ideias por nicho) estão arquitetadas em
`TOOLS` (`src/lib/ai/tools.ts`) e seguem o mesmo contrato dos endpoints prontos.

---

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:3000
```

**Acessos de demonstração**
- Cliente: `cliente@logue.com.br` / `cliente`
- Equipe: escolher um perfil na aba "Sou da equipe"

**Variáveis de ambiente** (opcionais no MVP) — ver `.env.example`:
- `ANTHROPIC_API_KEY` — ativa a geração real com Claude. Sem ela, as ferramentas
  usam o gerador-modelo determinístico, ainda ancorado na base de conhecimento.
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — para ligar o
  banco/autenticação.
