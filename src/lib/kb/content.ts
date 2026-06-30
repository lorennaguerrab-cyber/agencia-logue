import type { KbDoc } from './types'

/* ============================================================
   BASE DE CONHECIMENTO DA AGÊNCIA LOGUE
   ------------------------------------------------------------
   Esta é a fonte de verdade que a IA consulta antes de responder.
   A equipe edita estes documentos (no /painel/prompts) para
   atualizar serviços, pacotes, tom, modelos e regras com o tempo.
   Em produção, estes registros vivem na tabela `kb_documentos`
   do Supabase — este arquivo é o seed inicial.
   ============================================================ */

export const KB_SEED: KbDoc[] = [
  /* ---------- 1. SERVIÇOS ---------- */
  {
    id: 'serv-branding',
    categoria: 'servico',
    titulo: 'Branding & Identidade',
    tags: ['branding', 'identidade', 'marca', 'logo', 'posicionamento', 'naming'],
    conteudo:
      'Construção e reposicionamento de marca: estratégia de posicionamento, arquétipo, naming, identidade visual, manual de marca e definição de tom de voz. ' +
      'Entregamos uma marca com discurso claro, estética consistente e um sistema visual aplicável em qualquer ponto de contato. ' +
      'Não é "fazer um logo" — é definir o que a marca defende, para quem fala e como soa.',
  },
  {
    id: 'serv-social',
    categoria: 'servico',
    titulo: 'Social Media & Gestão de Conteúdo',
    tags: ['social media', 'instagram', 'conteúdo', 'gestão', 'feed', 'stories', 'calendário'],
    conteudo:
      'Gestão estratégica de redes sociais: planejamento editorial por pilares (autoridade, conexão, venda, prova social, bastidores e educação), ' +
      'criação de posts, carrosséis, reels e stories, copywriting, design e acompanhamento de métricas. ' +
      'Cada mês começa por um objetivo de negócio, não por "o que postar hoje".',
  },
  {
    id: 'serv-conteudo',
    categoria: 'servico',
    titulo: 'Conteúdo Estratégico & Storytelling',
    tags: ['conteúdo', 'storytelling', 'roteiro', 'copy', 'narrativa', 'estratégia'],
    conteudo:
      'Conteúdo que conecta narrativa e objetivo: roteiros de reels e vídeos, linhas editoriais, copy de venda, campanhas e séries de conteúdo. ' +
      'Trabalhamos storytelling aplicado — história a serviço de uma decisão do público, não história pela história.',
  },
  {
    id: 'serv-design',
    categoria: 'servico',
    titulo: 'Design & Direção Criativa',
    tags: ['design', 'direção criativa', 'visual', 'identidade visual', 'peças', 'social'],
    conteudo:
      'Direção de arte e design para social, campanhas, materiais impressos e apresentações. ' +
      'Sistemas visuais consistentes, templates editáveis e peças sob medida. Estética a serviço da clareza e da percepção de marca.',
  },
  {
    id: 'serv-producao',
    categoria: 'servico',
    titulo: 'Produção Criativa & Audiovisual',
    tags: ['produção', 'audiovisual', 'vídeo', 'foto', 'gravação', 'reels', 'ensaio'],
    conteudo:
      'Produção de vídeo e fotografia: direção, captação, edição e finalização de reels, vídeos institucionais e ensaios. ' +
      'Da ideia ao arquivo final pronto para publicar, com qualidade de marca.',
  },
  {
    id: 'serv-ia',
    categoria: 'servico',
    titulo: 'IA Aplicada à Comunicação',
    tags: ['ia', 'inteligência artificial', 'automação', 'produtividade', 'rag'],
    conteudo:
      'Aplicamos IA com método: ferramentas treinadas pelo contexto da marca para gerar ideias, legendas, roteiros, calendários e briefings mais rápido — ' +
      'sempre com revisão humana. A IA acelera a execução; a estratégia e a curadoria continuam sendo nossas.',
  },

  /* ---------- 2. PACOTES E ENTREGÁVEIS ---------- */
  {
    id: 'pac-essencial',
    categoria: 'pacote',
    titulo: 'Pacote Essencial',
    tags: ['pacote', 'essencial', 'entregáveis', 'plano', 'preço', 'mensal'],
    conteudo:
      'Para marcas que estão estruturando presença. Entregáveis/mês: 12 posts (feed + carrossel), 4 reels roteirizados, stories estratégicos semanais, ' +
      'planejamento editorial mensal e 1 reunião de alinhamento. Ideal para quem precisa de consistência e direção.',
  },
  {
    id: 'pac-estrategico',
    categoria: 'pacote',
    titulo: 'Pacote Estratégico',
    tags: ['pacote', 'estratégico', 'entregáveis', 'plano', 'campanha', 'completo'],
    conteudo:
      'Para marcas em crescimento. Entregáveis/mês: 16 posts, 6 reels, stories diários, 1 campanha mensal (conceito + peças + cronograma), ' +
      'calendário editorial por pilares, relatório de métricas e 2 reuniões. Foco em autoridade e conversão.',
  },
  {
    id: 'pac-premium',
    categoria: 'pacote',
    titulo: 'Pacote Premium / Branding 360',
    tags: ['pacote', 'premium', 'branding', '360', 'produção', 'completo'],
    conteudo:
      'Operação completa de marca. Inclui tudo do Estratégico + direção criativa dedicada, produção audiovisual mensal (diária de gravação), ' +
      'gestão de tráfego em parceria, identidade/rebranding quando necessário e squad dedicado. Para marcas que querem liderar a categoria.',
  },
  {
    id: 'pac-avulso',
    categoria: 'pacote',
    titulo: 'Projetos Avulsos',
    tags: ['avulso', 'projeto', 'identidade', 'campanha', 'pontual'],
    conteudo:
      'Entregas pontuais: identidade visual, manual de marca, campanha sazonal, ensaio de produtos, landing page de conteúdo ou consultoria estratégica. ' +
      'Escopo fechado, prazo definido.',
  },

  /* ---------- 3. TOM DE VOZ ---------- */
  {
    id: 'tom-principios',
    categoria: 'tom-de-voz',
    titulo: 'Tom de voz da Agência Logue',
    tags: ['tom de voz', 'voz', 'comunicação', 'estilo', 'linguagem'],
    conteudo:
      'A voz da Logue é humana, profissional, criativa, clara e sofisticada. ' +
      'Princípios: (1) Clareza acima de tudo — se a frase precisa ser relida, reescreva. ' +
      '(2) Sofisticação sem rebuscamento — elegância vem da precisão, não de palavras difíceis. ' +
      '(3) Estratégia visível — todo conteúdo tem um porquê. ' +
      '(4) Humanidade — escrevemos para pessoas, com calor e respeito pela inteligência de quem lê. ' +
      '(5) Sem hype — nada de "milagre", "explodir", "segredo", "fórmula mágica". ' +
      'Frases de tamanho variado, ritmo de leitura cuidado. Evitar jargão vazio e linguagem robótica de IA.',
  },
  {
    id: 'tom-faca-evite',
    categoria: 'tom-de-voz',
    titulo: 'Faça & Evite (voz)',
    tags: ['tom de voz', 'faça', 'evite', 'do', 'dont', 'palavras'],
    conteudo:
      'FAÇA: usar verbos concretos; trazer um insight real; ser específico (números, exemplos); respeitar o silêncio (não encher linguiça); ' +
      'terminar com uma direção clara. ' +
      'EVITE: superlativos vazios ("o melhor", "incrível", "sensacional"); promessas de resultado garantido; ' +
      'emojis em excesso (máx. 1–3 por legenda, com intenção); clichês de marketing ("alavanque", "destrave seu potencial"); ' +
      'frases genéricas que serviriam para qualquer marca.',
  },

  /* ---------- 4. REGRAS DE CONTEÚDO ---------- */
  {
    id: 'regra-estrutura',
    categoria: 'regra-conteudo',
    titulo: 'Regras de estrutura de conteúdo',
    tags: ['regra', 'estrutura', 'gancho', 'cta', 'legenda', 'reel'],
    conteudo:
      'Todo conteúdo tem: (1) Gancho — primeira linha/3 segundos que param o scroll, conectados a uma dor ou desejo real. ' +
      '(2) Desenvolvimento — uma ideia por peça, com valor verdadeiro (ensino, perspectiva, prova). ' +
      '(3) CTA — uma única ação clara, coerente com a etapa do funil. ' +
      'Carrossel: capa com promessa + máx. 1 ideia por slide + slide final com CTA. ' +
      'Reel: hook nos 3s, retenção a cada 5–7s, legenda na tela para mudo, CTA falado e escrito.',
  },
  {
    id: 'regra-pilares',
    categoria: 'regra-conteudo',
    titulo: 'Pilares de conteúdo',
    tags: ['pilares', 'autoridade', 'conexão', 'venda', 'prova social', 'bastidores', 'educação'],
    conteudo:
      'Seis pilares equilibram o calendário: AUTORIDADE (mostra domínio do assunto), CONEXÃO (gera identificação e relacionamento), ' +
      'VENDA (apresenta oferta com clareza), PROVA SOCIAL (depoimentos, resultados, antes/depois), BASTIDORES (processo, pessoas, humaniza) ' +
      'e EDUCAÇÃO (ensina algo útil). Regra de ouro: no máximo ~30% de venda direta; o resto constrói confiança.',
  },

  /* ---------- 5. RESTRIÇÕES ---------- */
  {
    id: 'restr-geral',
    categoria: 'restricao',
    titulo: 'O que a marca NÃO deve falar ou prometer',
    tags: ['restrição', 'não prometer', 'compliance', 'ética', 'proibido'],
    conteudo:
      'NUNCA prometer: resultado garantido, números específicos de faturamento/seguidores, "ficar rico/famoso", cura, emagrecimento garantido ' +
      'ou qualquer promessa milagrosa. ' +
      'EVITAR: comparações depreciativas com concorrentes; linguagem alarmista; urgência falsa ("últimas vagas" sem ser verdade); ' +
      'termos médicos/jurídicos/financeiros sem respaldo do cliente; dados sem fonte. ' +
      'Em saúde, estética, psicologia, jurídico e finanças: seguir o conselho de classe da área, tom educativo, sem prometer resultado.',
  },

  /* ---------- 6. FORMULÁRIOS DE BRIEFING ---------- */
  {
    id: 'brief-onboarding',
    categoria: 'briefing',
    titulo: 'Briefing de Onboarding (novo cliente)',
    tags: ['briefing', 'onboarding', 'formulário', 'perguntas', 'novo cliente'],
    conteudo:
      'Campos: Nome da marca e segmento; O que vende e ticket médio; Diferencial real (por que comprar de você?); ' +
      'Público-alvo e persona principal; Tom desejado; Concorrentes/referências admiradas; ' +
      'Objetivo dos próximos 90 dias; O que NÃO pode faltar e o que NÃO pode aparecer; ' +
      'Materiais disponíveis (fotos, logo, depoimentos); Canais ativos e metas.',
  },
  {
    id: 'brief-conteudo',
    categoria: 'briefing',
    titulo: 'Briefing de Demanda de Conteúdo',
    tags: ['briefing', 'demanda', 'conteúdo', 'formulário', 'pedido'],
    conteudo:
      'Campos: Qual o objetivo deste conteúdo? (autoridade, conexão, venda...); Para quem? (persona); ' +
      'Formato indicado (reel, carrossel, story, post); Mensagem principal em uma frase; ' +
      'Data/urgência; Oferta ou CTA; Provas/dados disponíveis; Restrições; Referências visuais.',
  },

  /* ---------- 7. MODELOS DE LEGENDA ---------- */
  {
    id: 'mod-legenda-autoridade',
    categoria: 'modelo-legenda',
    titulo: 'Modelo de legenda — Autoridade',
    tags: ['modelo', 'legenda', 'autoridade', 'estrutura', 'copy'],
    conteudo:
      'GANCHO: uma afirmação que contraria o senso comum ou nomeia uma dor ("A maioria erra isso antes mesmo de começar."). ' +
      'DESENVOLVIMENTO: explique o porquê em 2–4 parágrafos curtos, com um exemplo concreto. ' +
      'FECHO: resuma o insight em uma frase memorável. ' +
      'CTA: convide a salvar/comentar ("Salva pra não esquecer" / "Me conta nos comentários como você faz").',
  },
  {
    id: 'mod-legenda-venda',
    categoria: 'modelo-legenda',
    titulo: 'Modelo de legenda — Venda leve',
    tags: ['modelo', 'legenda', 'venda', 'oferta', 'cta'],
    conteudo:
      'GANCHO: fale do problema que seu produto resolve, do ponto de vista do cliente. ' +
      'DESENVOLVIMENTO: mostre a transformação (antes → depois) sem prometer milagre; use prova (depoimento, caso). ' +
      'OFERTA: apresente o que é, para quem e o primeiro passo. ' +
      'CTA: direto e único ("Chama no direct" / "Link na bio para agendar"). Sem urgência falsa.',
  },

  /* ---------- 8. MODELOS DE ROTEIRO ---------- */
  {
    id: 'mod-roteiro-reel',
    categoria: 'modelo-roteiro',
    titulo: 'Modelo de roteiro — Reel',
    tags: ['modelo', 'roteiro', 'reel', 'hook', 'cenas', 'vídeo'],
    conteudo:
      'HOOK (0–3s): frase + cena que param o scroll; texto na tela reforçando. ' +
      'FALA PRINCIPAL: 1 ideia, desenvolvida em 15–40s, com ritmo (corte a cada 5–7s). ' +
      'CENAS SUGERIDAS: lista plano a plano (o que aparece em cada corte). ' +
      'TEXTO NA TELA: versão curta da mensagem para quem assiste sem som. ' +
      'CTA: falado + escrito, uma ação só. Trilha coerente com a marca.',
  },

  /* ---------- 9. MODELOS DE CALENDÁRIO ---------- */
  {
    id: 'mod-calendario',
    categoria: 'modelo-calendario',
    titulo: 'Modelo de calendário editorial',
    tags: ['modelo', 'calendário', 'editorial', 'planejamento', 'pilares'],
    conteudo:
      'Distribuição semanal sugerida (5 publicações/semana): Seg — Autoridade (carrossel educativo); ' +
      'Ter — Conexão (reel/relato); Qua — Prova social (depoimento/resultado); Qui — Educação (dica prática); ' +
      'Sex — Venda leve (oferta + CTA). Stories diários intercalando bastidores, enquetes e provas. ' +
      'Ajustar à frequência contratada; sempre amarrar ao objetivo do mês e a datas comerciais relevantes.',
  },

  /* ---------- 10. PROCESSOS INTERNOS ---------- */
  {
    id: 'proc-fluxo',
    categoria: 'processo',
    titulo: 'Fluxo de produção de conteúdo',
    tags: ['processo', 'fluxo', 'produção', 'aprovação', 'status'],
    conteudo:
      'Etapas e status: Briefing → Pendente → Em produção → Em revisão (interna) → Aprovação (cliente) → Aprovado → Entregue/Publicado. ' +
      'Cliente envia demandas pela área logada; equipe transforma em tarefa; conteúdo sobe para aprovação com prazo; ' +
      'ajustes ficam registrados; arquivo final vai para a pasta do Drive do cliente.',
  },
  {
    id: 'proc-envio',
    categoria: 'processo',
    titulo: 'Como o cliente envia materiais',
    tags: ['processo', 'envio', 'materiais', 'orientação', 'drive', 'fotos'],
    conteudo:
      'Oriente o cliente: enviar fotos em alta (originais, sem print); vídeos na horizontal e vertical quando possível; ' +
      'logos em PNG/vetor; textos e datas por escrito; referências com link. ' +
      'Demandas com pelo menos 5 dias úteis de antecedência; campanhas, 15 dias. Tudo pela área do cliente ou pela pasta compartilhada.',
  },

  /* ---------- 11. PERGUNTAS ESTRATÉGICAS ---------- */
  {
    id: 'perg-estrategicas',
    categoria: 'pergunta-estrategica',
    titulo: 'Perguntas estratégicas para clientes',
    tags: ['perguntas', 'estratégia', 'descoberta', 'briefing', 'diagnóstico'],
    conteudo:
      'Use para destravar um briefing: Qual é a única coisa que você quer que as pessoas lembrem da sua marca? ' +
      'Quem é o cliente ideal e o que tira o sono dele? Por que alguém compra de você e não do concorrente? ' +
      'Qual objeção mais aparece antes da compra? Qual resultado real seu cliente teve? ' +
      'O que você NÃO quer que sua marca pareça? Qual ação você quer que o público tome este mês?',
  },

  /* ---------- 12. EXEMPLOS DE BONS CONTEÚDOS ---------- */
  {
    id: 'ex-bom-carrossel',
    categoria: 'exemplo',
    titulo: 'Exemplo de bom carrossel (referência)',
    tags: ['exemplo', 'carrossel', 'referência', 'autoridade'],
    conteudo:
      'Tema: "3 erros ao escolher uma armação". Capa: promessa clara + estética limpa. ' +
      'Slides: 1 erro por slide, com explicação de 1 linha e imagem de apoio. Penúltimo: o jeito certo. ' +
      'Último: CTA "Agende sua avaliação". Funciona porque ensina algo útil, é específico do nicho e termina com ação coerente.',
  },

  /* ---------- 13. DOCUMENTOS INSTITUCIONAIS ---------- */
  {
    id: 'inst-manifesto',
    categoria: 'institucional',
    titulo: 'Manifesto / Sobre a Agência Logue',
    tags: ['institucional', 'sobre', 'manifesto', 'posicionamento', 'missão'],
    conteudo:
      'A Agência Logue une estratégia, estética, storytelling, inteligência artificial e execução prática. ' +
      'Acreditamos que marca forte nasce do encontro entre clareza estratégica e sensibilidade criativa. ' +
      'Não vendemos promessa milagrosa: construímos presença, percepção e consistência. ' +
      'Trabalhamos com método, gosto e responsabilidade — para que cada marca seja lembrada pelo que realmente é.',
  },

  /* ---------- 14. PERSONAS, JORNADA E FUNIL ---------- */
  {
    id: 'persona-cliente-tipo',
    categoria: 'persona',
    titulo: 'Personas de cliente da agência',
    tags: ['persona', 'público', 'cliente ideal', 'segmento'],
    conteudo:
      'Personas atendidas: (A) Negócio local em crescimento (ótica, estética, restaurante) que quer presença consistente e mais clientes na porta; ' +
      '(B) Profissional liberal/autoridade (psicólogo, advogado, médico) que quer educar e gerar confiança; ' +
      '(C) Infoprodutor/serviço que precisa de campanhas e conversão; ' +
      '(D) Marca em reposicionamento que precisa de identidade e narrativa novas.',
  },
  {
    id: 'funil-jornada',
    categoria: 'funil',
    titulo: 'Jornada do cliente & funil de marketing',
    tags: ['funil', 'jornada', 'topo', 'meio', 'fundo', 'conversão'],
    conteudo:
      'Topo (descoberta): conteúdo de educação e conexão para atrair e ser percebido. ' +
      'Meio (consideração): autoridade e prova social para gerar confiança e nutrir. ' +
      'Fundo (decisão): venda leve, oferta clara e CTA direto para converter. ' +
      'Pós: relacionamento e prova para reter e gerar indicação. Cada conteúdo deve saber em que etapa atua.',
  },

  /* ---------- 15. MODELOS DE CAMPANHA E FORMATOS ---------- */
  {
    id: 'camp-sazonal',
    categoria: 'campanha',
    titulo: 'Modelo de campanha sazonal',
    tags: ['campanha', 'sazonal', 'data comercial', 'oferta', 'cronograma'],
    conteudo:
      'Estrutura: CONCEITO (ideia central + frase da campanha) → OFERTA (o que, para quem, condição) → ' +
      'PEÇAS (3–5 posts, sequência de stories, 1–2 reels) → CRONOGRAMA (aquecimento, lançamento, reforço, último dia) → ' +
      'CTA único. Datas: Dia das Mães, Namorados, Black Friday, Natal, aniversário da marca, datas locais. ' +
      'Sempre conectar a data ao valor da marca, sem oportunismo vazio.',
  },
  {
    id: 'banco-ideias-nichos',
    categoria: 'banco-ideias',
    titulo: 'Banco de ideias por nicho',
    tags: ['banco de ideias', 'nicho', 'estética', 'psicologia', 'ótica', 'restaurante', 'liberal'],
    conteudo:
      'ESTÉTICA: antes/depois (com responsabilidade), mitos sobre procedimentos, bastidores do atendimento, cuidados pós. ' +
      'PSICOLOGIA: psicoeducação, mitos x verdades, como é a primeira sessão, quando buscar ajuda (tom ético, sem diagnóstico). ' +
      'ÓTICA: como escolher armação, cuidados com lentes, tendências, aniversário da loja. ' +
      'RESTAURANTE: bastidores da cozinha, prato do dia, história de um prato, depoimento de cliente. ' +
      'PROFISSIONAL LIBERAL: dúvidas frequentes, casos (anonimizados), processo de trabalho, autoridade no tema. ' +
      'COMÉRCIO LOCAL: novidades, prova social, promoções com verdade, conexão com a comunidade.',
  },
]
