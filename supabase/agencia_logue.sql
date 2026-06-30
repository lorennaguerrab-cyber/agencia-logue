-- ============================================================
-- AGÊNCIA LOGUE — Schema do MVP (site + área do cliente + painel + IA)
-- Postgres / Supabase. Execute após habilitar a extensão pgcrypto.
-- A autenticação usa o Supabase Auth (auth.users); as tabelas abaixo
-- referenciam auth.uid() nas políticas de RLS.
-- ============================================================

create extension if not exists "pgcrypto";
create extension if not exists "vector";        -- opcional: embeddings para RAG

-- ------------------------------------------------------------
-- PERFIS / PAPÉIS
-- Cada usuário do Auth tem um perfil. role define o acesso:
--   'admin'/'equipe' -> painel interno   |   'cliente' -> área do cliente
-- ------------------------------------------------------------
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nome        text not null,
  role        text not null default 'cliente' check (role in ('admin','equipe','cliente')),
  cliente_id  uuid,                         -- preenchido quando role = 'cliente'
  created_at  timestamptz default now()
);

-- ------------------------------------------------------------
-- CATÁLOGO: SERVIÇOS E PACOTES (editáveis pela equipe; alimentam o site)
-- ------------------------------------------------------------
create table if not exists servicos (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  descricao  text not null,
  tags       text[] default '{}',
  ordem      int default 0,
  ativo      boolean default true
);

create table if not exists pacotes (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  descricao   text not null,
  entregaveis text[] default '{}',
  popular     boolean default false,
  ordem       int default 0,
  ativo       boolean default true
);

-- ------------------------------------------------------------
-- CLIENTES E PROJETOS
-- ------------------------------------------------------------
create table if not exists clientes (
  id         uuid primary key default gen_random_uuid(),
  marca      text not null,
  segmento   text,
  pacote_id  uuid references pacotes(id),
  gerente    text,
  drive_url  text,
  tom_de_voz text,
  briefing   text,
  status     text default 'ativo' check (status in ('ativo','pausado','encerrado')),
  created_at timestamptz default now()
);

create table if not exists projetos (
  id         uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  nome       text not null,
  objetivo   text,
  status     text default 'ativo',
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- BRIEFINGS (formulários respondidos pelo cliente)
-- ------------------------------------------------------------
create table if not exists briefings (
  id         uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  titulo     text not null,
  status     text default 'aberto' check (status in ('aberto','respondido')),
  -- [{ "q": "...", "r": "..." }]
  perguntas  jsonb not null default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- DEMANDAS E IDEIAS enviadas pelo cliente
-- ------------------------------------------------------------
create table if not exists demandas (
  id         uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  titulo     text not null,
  descricao  text,
  tipo       text default 'demanda' check (tipo in ('demanda','ideia')),
  status     text default 'pendente'
             check (status in ('pendente','em_producao','em_revisao','aprovado','entregue')),
  briefing_ia jsonb,                        -- resultado do "demanda -> briefing"
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- CONTEÚDOS / CALENDÁRIO EDITORIAL + fluxo de aprovação
-- ------------------------------------------------------------
create table if not exists conteudos (
  id          uuid primary key default gen_random_uuid(),
  cliente_id  uuid not null references clientes(id) on delete cascade,
  titulo      text not null,
  formato     text check (formato in ('Reel','Carrossel','Story','Post')),
  pilar       text,                         -- autoridade, conexão, venda...
  legenda     text,
  data_publicacao date,
  status      text default 'planejado'
              check (status in ('planejado','em_producao','em_revisao','aprovacao','aprovado','agendado','publicado')),
  feedback    text,                         -- ajustes pedidos pelo cliente
  created_at  timestamptz default now()
);

-- ------------------------------------------------------------
-- ARQUIVOS / LINKS finais entregues ao cliente
-- ------------------------------------------------------------
create table if not exists arquivos (
  id         uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  nome       text not null,
  tipo       text check (tipo in ('pasta','documento','video','imagem','link')),
  url        text not null,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- BASE DE CONHECIMENTO DA IA (editável pela equipe)
-- É o que as ferramentas de IA recuperam (RAG) antes de gerar.
-- embedding é opcional: usar quando migrar de RAG por keywords p/ pgvector.
-- ------------------------------------------------------------
create table if not exists kb_documentos (
  id          uuid primary key default gen_random_uuid(),
  categoria   text not null,                -- servico, pacote, tom-de-voz, restricao, ...
  titulo      text not null,
  conteudo    text not null,
  tags        text[] default '{}',
  embedding   vector(1536),                 -- opcional (OpenAI/voyage). Null no MVP.
  atualizado_em timestamptz default now()
);

-- Prompts internos reutilizáveis pela equipe
create table if not exists prompts_internos (
  id         uuid primary key default gen_random_uuid(),
  titulo     text not null,
  categoria  text,
  descricao  text,
  prompt_texto text not null,
  created_at timestamptz default now()
);

-- Histórico de gerações feitas pela IA (auditoria/aprendizado)
create table if not exists geracoes_ia (
  id          uuid primary key default gen_random_uuid(),
  ferramenta  text not null,                -- ideias | legendas | briefing | ...
  cliente_id  uuid references clientes(id) on delete set null,
  autor_id    uuid references auth.users(id) on delete set null,
  input       jsonb,
  output      jsonb,
  fonte       text default 'claude',        -- claude | fallback
  docs_usados text[] default '{}',          -- ids de kb_documentos consultados
  created_at  timestamptz default now()
);

-- ------------------------------------------------------------
-- LEADS (pedidos de orçamento vindos do site)
-- ------------------------------------------------------------
create table if not exists leads (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  email      text not null,
  marca      text,
  telefone   text,
  servico    text,
  mensagem   text not null,
  status     text default 'novo' check (status in ('novo','contatado','convertido','arquivado')),
  created_at timestamptz default now()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
create index if not exists idx_demandas_cliente   on demandas(cliente_id);
create index if not exists idx_conteudos_cliente   on conteudos(cliente_id);
create index if not exists idx_briefings_cliente   on briefings(cliente_id);
create index if not exists idx_arquivos_cliente    on arquivos(cliente_id);
create index if not exists idx_kb_categoria        on kb_documentos(categoria);

-- ============================================================
-- RLS (Row Level Security) — esboço
-- Cliente só enxerga os próprios dados; equipe/admin enxerga tudo.
-- ============================================================
alter table clientes  enable row level security;
alter table demandas  enable row level security;
alter table briefings enable row level security;
alter table conteudos enable row level security;
alter table arquivos  enable row level security;

-- helper: o cliente_id do usuário logado
create or replace function current_cliente_id() returns uuid
language sql stable as $$
  select cliente_id from profiles where id = auth.uid()
$$;

create or replace function is_equipe() returns boolean
language sql stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('admin','equipe'))
$$;

-- Exemplo de políticas (repetir o padrão para cada tabela do cliente):
create policy "cliente_ve_suas_demandas" on demandas
  for select using (cliente_id = current_cliente_id() or is_equipe());
create policy "cliente_cria_demanda" on demandas
  for insert with check (cliente_id = current_cliente_id() or is_equipe());
create policy "equipe_gerencia_demandas" on demandas
  for update using (is_equipe());

create policy "cliente_ve_seus_conteudos" on conteudos
  for select using (cliente_id = current_cliente_id() or is_equipe());
create policy "cliente_aprova_conteudo" on conteudos
  for update using (cliente_id = current_cliente_id() or is_equipe());

create policy "cliente_ve_seus_arquivos" on arquivos
  for select using (cliente_id = current_cliente_id() or is_equipe());

create policy "cliente_ve_seus_briefings" on briefings
  for select using (cliente_id = current_cliente_id() or is_equipe());
create policy "cliente_responde_briefing" on briefings
  for update using (cliente_id = current_cliente_id() or is_equipe());

create policy "cliente_ve_seu_cadastro" on clientes
  for select using (id = current_cliente_id() or is_equipe());

-- kb_documentos, servicos, pacotes: leitura pública/equipe; escrita só equipe.
-- (configurar conforme necessidade no painel do Supabase)
