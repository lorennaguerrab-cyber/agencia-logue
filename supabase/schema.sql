-- ================================================
-- LORENNA OS — Supabase Schema
-- Sistema Cognitivo Adaptativo
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- TAREFAS
-- ================================================
CREATE TABLE IF NOT EXISTS tarefas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  status TEXT NOT NULL DEFAULT 'pendente'
    CHECK (status IN ('pendente', 'em_progresso', 'concluida', 'pausada')),
  prioridade TEXT NOT NULL DEFAULT 'media'
    CHECK (prioridade IN ('urgente', 'alta', 'media', 'baixa')),
  energia_necessaria TEXT[] DEFAULT '{}',
  categoria TEXT DEFAULT 'pessoal',
  cliente_id UUID,
  projeto_id UUID,
  data_limite TIMESTAMPTZ,
  recorrente BOOLEAN DEFAULT false,
  recorrencia TEXT,
  notion_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MICROETAPAS
CREATE TABLE IF NOT EXISTS microetapas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tarefas(id) ON DELETE CASCADE,
  ordem INTEGER NOT NULL DEFAULT 0,
  descricao TEXT NOT NULL,
  concluida BOOLEAN DEFAULT false,
  tempo_estimado INTEGER, -- minutos
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- IDEIAS
-- ================================================
CREATE TABLE IF NOT EXISTS ideias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT DEFAULT 'criatividade',
  plataformas TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'bruta'
    CHECK (status IN ('bruta', 'desenvolvendo', 'pronta', 'aplicada')),
  tags TEXT[] DEFAULT '{}',
  conexoes UUID[] DEFAULT '{}',
  notion_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- CAPTURAS MENTAIS
-- ================================================
CREATE TABLE IF NOT EXISTS capturas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conteudo_raw TEXT NOT NULL,
  conteudo_processado TEXT,
  tipo TEXT DEFAULT 'texto'
    CHECK (tipo IN ('texto', 'audio', 'dump')),
  tarefas_extraidas TEXT[] DEFAULT '{}',
  ideias_extraidas TEXT[] DEFAULT '{}',
  categorias_detectadas TEXT[] DEFAULT '{}',
  processada BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- CLIENTES
-- ================================================
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  logo TEXT,
  cor TEXT DEFAULT '#7C3AED',
  retorno_financeiro DECIMAL(10,2) DEFAULT 0,
  custo_cognitivo INTEGER DEFAULT 3 CHECK (custo_cognitivo BETWEEN 1 AND 5),
  alinhamento INTEGER DEFAULT 3 CHECK (alinhamento BETWEEN 1 AND 5),
  esforco INTEGER DEFAULT 3 CHECK (esforco BETWEEN 1 AND 5),
  satisfacao INTEGER DEFAULT 3 CHECK (satisfacao BETWEEN 1 AND 5),
  status TEXT DEFAULT 'ativo'
    CHECK (status IN ('ativo', 'pausado', 'encerrado')),
  proximas_acoes TEXT[] DEFAULT '{}',
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- CRM CRIATIVO
-- ================================================
CREATE TABLE IF NOT EXISTS crm_contatos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  tipo TEXT DEFAULT 'marca'
    CHECK (tipo IN ('marca', 'influencer', 'ugc', 'collab', 'networking')),
  status TEXT DEFAULT 'potencial'
    CHECK (status IN ('potencial', 'em_contato', 'negociando', 'fechado', 'arquivado')),
  plataforma TEXT,
  proposta TEXT,
  valor DECIMAL(10,2),
  proxima_acao TEXT,
  data_followup TIMESTAMPTZ,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- CONTEÚDO EDITORIAL
-- ================================================
CREATE TABLE IF NOT EXISTS conteudos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL
    CHECK (tipo IN ('reel', 'youtube', 'blog', 'newsletter', 'tiktok', 'shorts', 'carrossel')),
  plataformas TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'ideia'
    CHECK (status IN ('ideia', 'rascunho', 'filmando', 'editando', 'revisao', 'agendado', 'publicado')),
  categoria TEXT DEFAULT 'criatividade',
  data_filmagem DATE,
  data_publicacao DATE,
  url_post TEXT,
  notion_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- PROMPTS
-- ================================================
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  categoria TEXT DEFAULT 'conteudo',
  descricao TEXT,
  prompt_texto TEXT NOT NULL,
  ia_recomendada TEXT DEFAULT 'claude',
  ferramenta_ideal TEXT,
  checklist TEXT[] DEFAULT '{}',
  referencias TEXT[] DEFAULT '{}',
  etapas TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- DIA / FOCO
-- ================================================
CREATE TABLE IF NOT EXISTS dia_foco (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data DATE NOT NULL UNIQUE,
  energia TEXT NOT NULL DEFAULT 'criativa',
  foco_principal TEXT,
  tarefas_selecionadas UUID[] DEFAULT '{}',
  nota_do_dia TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- AUTOMAÇÕES: Updated_at trigger
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_tarefas_updated_at
  BEFORE UPDATE ON tarefas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ideias_updated_at
  BEFORE UPDATE ON ideias
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_crm_updated_at
  BEFORE UPDATE ON crm_contatos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_conteudos_updated_at
  BEFORE UPDATE ON conteudos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================
-- RLS (Row Level Security) — desativa para MVP
-- ================================================
ALTER TABLE tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideias ENABLE ROW LEVEL SECURITY;
ALTER TABLE capturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE conteudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE dia_foco ENABLE ROW LEVEL SECURITY;

-- Políticas abertas para desenvolvimento (substituir por auth em produção)
CREATE POLICY "Allow all for dev" ON tarefas FOR ALL USING (true);
CREATE POLICY "Allow all for dev" ON ideias FOR ALL USING (true);
CREATE POLICY "Allow all for dev" ON capturas FOR ALL USING (true);
CREATE POLICY "Allow all for dev" ON clientes FOR ALL USING (true);
CREATE POLICY "Allow all for dev" ON crm_contatos FOR ALL USING (true);
CREATE POLICY "Allow all for dev" ON conteudos FOR ALL USING (true);
CREATE POLICY "Allow all for dev" ON prompts FOR ALL USING (true);
CREATE POLICY "Allow all for dev" ON dia_foco FOR ALL USING (true);
CREATE POLICY "Allow all for dev" ON microetapas FOR ALL USING (true);

-- ================================================
-- DADOS INICIAIS — Clientes
-- ================================================
INSERT INTO clientes (nome, cor, retorno_financeiro, custo_cognitivo, alinhamento, esforco, satisfacao, status, proximas_acoes)
VALUES
  ('Pratique Academia', '#6EE7B7', 1800, 2, 4, 3, 4, 'ativo', ARRAY['Criar posts para semana 3', 'Enviar relatório mensal']),
  ('Espaço Criar', '#A78BFA', 2200, 1, 5, 2, 5, 'ativo', ARRAY['Entregar calendário editorial', 'Criar stories da semana']),
  ('Óptica Igor Giordano', '#60A5FA', 1500, 2, 3, 3, 4, 'ativo', ARRAY['Campanha dia dos namorados', 'Fotos de produto']),
  ('Jornal Cidades Minerais', '#F87171', 900, 5, 1, 5, 2, 'ativo', ARRAY['Roteiro plenária mineração', 'Gravar entrevista terça', 'Editar vídeo semanal'])
ON CONFLICT DO NOTHING;
