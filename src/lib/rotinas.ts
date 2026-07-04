import { IdeaCategory, Platform } from '@/lib/types'
import { OsClient } from '@/lib/db'

export type Objetivo = 'educação' | 'autoridade' | 'vendas' | 'relacionamento' | 'bastidores'
export type Formato = 'Reel' | 'Carrossel' | 'Story' | 'Estático' | 'Vídeo longo' | 'Blog' | 'Thread' | 'Pin'

export interface RoutineTemplate {
  id: string
  titulo: string
  formato: Formato
  categoria: IdeaCategory
  objetivo: Objetivo
  plataformas: Platform[]
  gancho: string
  corpo: string[]
  cta: string
  artPrompt: string
  desdobramento: string[]
}

export interface StoryBeat {
  tipo: 'teaser' | 'enquete' | 'ferramenta' | 'spoiler' | 'lancamento' | 'reforco'
  label: string
  texto: string
}

const STORY_SEQUENCES: Record<Objetivo, StoryBeat[]> = {
  educação: [
    { tipo: 'teaser',     label: 'Antes (D-2)',   texto: 'Story falando que você tá organizando um conteúdo sobre o tema — sem entregar tudo ainda.' },
    { tipo: 'enquete',    label: 'Antes (D-1)',   texto: 'Enquete de aquecimento: "Você já sabe o que é isso? Sim / Não" — cria curiosidade e mede repertório.' },
    { tipo: 'lancamento', label: 'Dia do post',   texto: 'Story avisando "no ar" com link/destaque direto pro post, logo depois de publicar.' },
    { tipo: 'ferramenta', label: 'Depois',        texto: 'Caixinha de perguntas: "me manda suas dúvidas sobre isso" — gera conteúdo derivado pro dia seguinte.' },
  ],
  autoridade: [
    { tipo: 'teaser',     label: 'Antes (D-2)',   texto: 'Bastidores da produção/pesquisa desse conteúdo — mostra o processo, não só o resultado.' },
    { tipo: 'spoiler',    label: 'Antes (D-1)',   texto: 'Spoiler: um print, frase ou trecho do que vem por aí, sem contexto completo.' },
    { tipo: 'lancamento', label: 'Dia do post',   texto: 'Story direto avisando que o conteúdo está no ar, com destaque fixado no perfil.' },
    { tipo: 'reforco',    label: 'Depois',        texto: 'Repost de comentários ou reações de quem concordou/se identificou — prova social.' },
  ],
  vendas: [
    { tipo: 'enquete',    label: 'Antes (D-2)',   texto: 'Enquete de dor: "Você já passou por isso? Sim / Não" — qualifica quem tem o problema.' },
    { tipo: 'spoiler',    label: 'Antes (D-1)',   texto: 'Contagem regressiva ou spoiler da oferta/solução, sem revelar o preço ainda.' },
    { tipo: 'lancamento', label: 'Dia do post',   texto: 'Story com link direto + destaque fixado — remover fricção pra quem já decidiu.' },
    { tipo: 'reforco',    label: 'Depois',        texto: 'Prova social: depoimento, print de resultado ou repost de quem comprou/agendou.' },
  ],
  relacionamento: [
    { tipo: 'ferramenta', label: 'Antes (D-1)',   texto: 'Pergunta aberta pra engajar: "me conta a sua versão disso" — caixinha de resposta.' },
    { tipo: 'enquete',    label: 'Antes (D-1)',   texto: 'Enquete leve de opinião sobre o tema, tom de conversa, não de aula.' },
    { tipo: 'lancamento', label: 'Dia do post',   texto: 'Story bastidores/humor mostrando o "making of" do conteúdo, depois o aviso de que está no ar.' },
    { tipo: 'reforco',    label: 'Depois',        texto: 'Repost das respostas mais engraçadas ou emocionantes de quem comentou.' },
  ],
  bastidores: [
    { tipo: 'ferramenta', label: 'Durante',       texto: 'Sequência ao vivo (várias telas) mostrando o processo acontecendo, em tempo real.' },
    { tipo: 'ferramenta', label: 'Durante',       texto: 'Caixinha "pergunte-me" sobre o processo — "quer saber algo sobre como isso é feito?"' },
    { tipo: 'lancamento', label: 'Dia do post',   texto: 'Story avisando que o conteúdo final está no ar, linkando o resultado do bastidor.' },
    { tipo: 'reforco',    label: 'Depois',        texto: 'Comparação antes/depois ou "como começou vs. como ficou".' },
  ],
}

export function getStorySequence(objetivo: Objetivo): StoryBeat[] {
  return STORY_SEQUENCES[objetivo]
}

// ── "Meu conteúdo" — canais próprios (Lorenna, Papel da Lola, Agência Logue) ──

export const MY_CHANNELS: { id: string; label: string; plataformas: Platform[] }[] = [
  { id: 'lorenna',  label: 'Lorenna (pessoal)',   plataformas: ['instagram', 'tiktok', 'youtube'] },
  { id: 'lola',     label: 'Papel da Lola',       plataformas: ['blog', 'instagram', 'tiktok', 'pinterest', 'newsletter'] },
  { id: 'logue',    label: 'Agência Logue',       plataformas: ['instagram'] },
]

export const MY_ROUTINES: RoutineTemplate[] = [
  {
    id: 'my-bastidores-1', titulo: '"Domingo é o único dia em que tenho 47 ideias e zero energia pra executar"',
    formato: 'Reel', categoria: 'bastidores', objetivo: 'relacionamento', plataformas: ['instagram', 'tiktok', 'threads'],
    gancho: 'Domingo é o único dia em que tenho 47 ideias e zero energia pra executar.',
    corpo: [
      'E tá tudo bem. Criar não é uma linha reta — é maré. Tem semana de produzir 10 coisas e semana de só anotar ideia no bloco de notas.',
      'O que eu aprendi: não brigo mais com os dias de maré baixa. Uso pra organizar, planejar, descansar — e deixo a execução pra quando a energia voltar.',
    ],
    cta: 'Me conta: hoje é dia de maré alta ou baixa pra você? 👇',
    artPrompt: 'Foto estilo lifestyle, mulher criativa sentada no sofá com notebook e caderno de anotações, luz natural suave de domingo, paleta rosa claro e branco, tom acolhedor e real, sem poses forçadas, formato 4:5.',
    desdobramento: [
      'Vira carrossel: "5 sinais de que você tá em maré baixa (e o que fazer)".',
      'Vira story de enquete: "maré alta ou baixa hoje?" com opções de sticker.',
      'Reaproveita a frase como hook de um Reel de bastidores real da sua semana.',
    ],
  },
  {
    id: 'my-mulheres-1', titulo: 'Série "Mulheres que viraram marca" — Luisa Sonza',
    formato: 'Carrossel', categoria: 'mulheres_incriveis', objetivo: 'autoridade', plataformas: ['instagram', 'pinterest'],
    gancho: 'Luisa Sonza não vende música. Ela vende uma versão de si mesma que muda a cada álbum — e isso é branding de verdade.',
    corpo: [
      'Cada era é um reposicionamento estratégico: estética, tom de voz, paleta, narrativa. Nada é acidente.',
      'O que dá pra copiar sem ser famosa: ter uma "era" clara por trimestre, uma paleta fixa, e uma frase que resume onde você quer chegar.',
    ],
    cta: 'Salva esse post pra revisar seu próprio posicionamento no fim do mês.',
    artPrompt: 'Carrossel editorial minimalista, 4 slides, tipografia grande estilo serifada, paleta rosa e preto, referência de moodboard de branding pessoal, fundo texturizado sutil, formato 4:5.',
    desdobramento: [
      'Blog: aprofunda em post longo com mais exemplos (Anitta, Kylie Jenner).',
      'Newsletter: resumo com 3 aprendizados aplicáveis a qualquer criador.',
      'YouTube/Reel: comenta 1 slide por vídeo em formato "análise rápida".',
    ],
  },
  {
    id: 'my-ia-1', titulo: '5 ferramentas de IA que eu uso todo dia sem complicar',
    formato: 'Reel', categoria: 'inteligencia_artificial', objetivo: 'educação', plataformas: ['instagram', 'youtube', 'tiktok'],
    gancho: 'Você não precisa entender de IA pra usar IA. Precisa de 5 ferramentas certas e um fluxo simples.',
    corpo: [
      '1. Um assistente de texto pra rascunhos rápidos. 2. Um gerador de imagem pra artes. 3. Um editor de vídeo com IA pra cortes automáticos.',
      '4. Um app de transcrição pra virar fala em texto. 5. Um organizador de tarefas com IA pra não esquecer nada.',
    ],
    cta: 'Quer que eu detalhe alguma dessas em um post separado? Comenta qual.',
    artPrompt: 'Ilustração flat minimalista com 5 ícones representando ferramentas digitais, paleta rosa/lilás/amarelo suave, fundo claro, estilo infográfico limpo, formato 4:5.',
    desdobramento: [
      'Vira thread no Threads: 1 ferramenta por tweet, com print de uso real.',
      'Vira post de blog "review" mais detalhado de cada ferramenta.',
      'Vira story com enquete: "qual dessas você já usa?"',
    ],
  },
  {
    id: 'my-analise-1', titulo: 'Por que a Duolingo domina o TikTok (e o que copiar)',
    formato: 'Vídeo longo', categoria: 'analise_marcas', objetivo: 'autoridade', plataformas: ['youtube', 'blog'],
    gancho: 'A Duolingo não posta conteúdo educativo sobre idiomas. Ela posta caos controlado — e isso é a jogada.',
    corpo: [
      'A mascote vira meme, não professor. O conteúdo é sobre a marca ter personalidade, não sobre ensinar.',
      'O que copiar: dê "vida" a um elemento da sua marca (mascote, frase, cor) e deixe ele ser engraçado e humano, mesmo fora do produto.',
    ],
    cta: 'Assista o vídeo completo pra ver mais 3 marcas que fazem isso bem.',
    artPrompt: 'Thumbnail de YouTube estilo análise de marketing, contraste alto, texto grande "por que funciona?", paleta verde/rosa, elementos gráficos de rede social estilizados, formato 16:9.',
    desdobramento: [
      'Blog: versão escrita mais longa, com prints e análise linha a linha.',
      'Reel: corta o melhor insight em 30s como resumo/isca pro vídeo completo.',
      'Pinterest: pin com a frase "caos controlado" como citação de branding.',
    ],
  },
  {
    id: 'my-maternidade-1', titulo: 'Como eu organizo trabalho criativo sendo mãe de três',
    formato: 'Carrossel', categoria: 'maternidade', objetivo: 'relacionamento', plataformas: ['instagram', 'blog'],
    gancho: 'Não existe equilíbrio perfeito. Existe sistema — e o meu foi feito sob medida pro meu cérebro.',
    corpo: [
      'Bloco de manhã é operacional (e-mail, agenda). Bloco da tarde é criativo (roteiro, ideia, gravação). Bloco da noite não existe — e tá certo assim.',
      'O segredo não é fazer mais. É saber em qual bloco cada tipo de tarefa realmente rende.',
    ],
    cta: 'Se você também tenta encaixar criatividade numa rotina cheia, salva esse post.',
    artPrompt: 'Foto lifestyle candid, mulher trabalhando em mesa de escritório em casa com elementos de maternidade ao fundo desfocado, luz quente, paleta rosa e bege, tom autêntico não-editorial, formato 4:5.',
    desdobramento: [
      'Newsletter: versão mais pessoal e longa, com bastidores reais.',
      'Story sequence: mostra os 3 blocos do dia em tempo real.',
      'Reaproveita em um Reel "um dia na minha vida" editado rápido.',
    ],
  },
  {
    id: 'my-blogosfera-1', titulo: 'O que aprendi voltando a escrever num blog em 2026',
    formato: 'Blog', categoria: 'blogosfera', objetivo: 'educação', plataformas: ['blog', 'newsletter'],
    gancho: 'Todo mundo falou que blog tinha morrido. Eu voltei a escrever um — e foi a melhor decisão de conteúdo do ano.',
    corpo: [
      'Blog te dá algo que rede social não dá: um lugar que você é dona, sem algoritmo decidindo quem vê.',
      'Também é o melhor lugar pra aprofundar o que vira post curto nas redes — e ainda ranquear no Google meses depois.',
    ],
    cta: 'Assina a newsletter pra receber os próximos posts direto no e-mail.',
    artPrompt: 'Capa de blog post editorial, foto de notebook com xícara de café em mesa clara, tipografia serifada sobreposta com o título, paleta rosa claro e branco, formato 16:9.',
    desdobramento: [
      'Vira carrossel com os 3 principais aprendizados do post.',
      'Vira thread resumindo o argumento central em 5 posts curtos.',
      'Vira pin de Pinterest com a frase de abertura como citação.',
    ],
  },
  {
    id: 'my-criatividade-1', titulo: 'Quiz: qual tipo de criadora você é essa semana?',
    formato: 'Story', categoria: 'criatividade', objetivo: 'relacionamento', plataformas: ['instagram', 'tiktok'],
    gancho: 'Nem toda semana você é a mesma criadora. Descobre qual é a sua hoje.',
    corpo: [
      'Opções: "a organizada", "a caótica genial", "a que só quer dormir", "a inspirada demais pra parar".',
      'Sem certo ou errado — só um jeito leve de reconhecer onde você tá.',
    ],
    cta: 'Responde nos stickers e marca alguém que precisa ver isso hoje.',
    artPrompt: 'Ilustração colorida estilo quiz de app, 4 personagens representando arquétipos de criatividade, paleta vibrante rosa/amarelo/lilás, estilo playful, formato 9:16 vertical.',
    desdobramento: [
      'Reposta os resultados mais votados no feed no dia seguinte.',
      'Vira Reel "os 4 tipos de criadora" com cortes rápidos de cada um.',
      'Vira post de blog levinho sobre ciclos de criatividade.',
    ],
  },
  {
    id: 'my-design-1', titulo: 'Antes/depois: o mesmo post com e sem hierarquia visual',
    formato: 'Carrossel', categoria: 'design', objetivo: 'educação', plataformas: ['instagram', 'pinterest'],
    gancho: 'Mesma informação, dois designs. Um você lê em 2 segundos. O outro, ninguém termina.',
    corpo: [
      'Hierarquia visual não é "deixar bonito" — é decidir o que os olhos veem primeiro, segundo, terceiro.',
      '3 regras rápidas: 1 ideia por slide, contraste de tamanho entre título e corpo, espaço em branco de sobra.',
    ],
    cta: 'Salva pra aplicar no próximo carrossel que você fizer.',
    artPrompt: 'Comparação lado a lado de dois designs de carrossel, um poluído e um limpo, setas indicando hierarquia visual, paleta neutra com destaque rosa, estilo educativo de design, formato 4:5.',
    desdobramento: [
      'Vira pin específico só do "antes" e só do "depois" separados.',
      'Vira thread com as 3 regras, uma por post.',
      'Vira aula curta em Reel mostrando a edição acontecendo.',
    ],
  },
]

// ── Clientes da Agência Logue — rotinas geradas a partir do brief real ──

export function getClientRoutines(client: OsClient): RoutineTemplate[] {
  if (!client.brief || client.services.length === 0) return []

  const nome = client.name
  const seg = client.segment

  const base: Omit<RoutineTemplate, 'id'>[] = [
    {
      titulo: `Os bastidores de como ${nome} atende de verdade`,
      formato: 'Reel', categoria: 'bastidores', objetivo: 'relacionamento', plataformas: ['instagram'],
      gancho: `O que acontece antes de você ver o resultado final na ${nome}.`,
      corpo: [
        `Mostra o processo real — não o produto pronto, mas o cuidado por trás dele. Isso aproxima e humaniza a marca.`,
        `Tom de voz: ${client.tone}`,
      ],
      cta: 'Convida quem assiste a conhecer/agendar.',
      artPrompt: `Foto documental de bastidores em ambiente de ${seg}, luz natural, foco no processo/atendimento, tom autêntico não posado, formato 4:5.`,
      desdobramento: [
        'Vira carrossel com 3 fotos do processo + legenda educativa.',
        'Vira story sequence "um dia na rotina" em tempo real.',
        'Reaproveita como case de autoridade no fechamento de mês.',
      ],
    },
    {
      titulo: `3 perguntas que todo cliente da ${nome} já fez`,
      formato: 'Carrossel', categoria: 'marketing', objetivo: 'educação', plataformas: ['instagram'],
      gancho: `As dúvidas mais comuns sobre ${seg.toLowerCase()} — respondidas sem enrolação.`,
      corpo: [
        `Baseia nas perguntas reais recebidas no atendimento. Reduz objeção antes da pessoa perguntar.`,
        `Restrição de tom: ${client.tone}`,
      ],
      cta: 'Convida a mandar mensagem pra tirar mais dúvidas.',
      artPrompt: `Carrossel educativo com tipografia grande, 3 perguntas em destaque, paleta da marca ${nome}, estilo clean, formato 4:5.`,
      desdobramento: [
        'Vira destaque fixo nos stories: "Perguntas frequentes".',
        'Vira roteiro de vídeo respondendo 1 pergunta por vez.',
        'Vira post de blog/FAQ se o cliente tiver site.',
      ],
    },
    {
      titulo: `Depoimento real: por que voltaram a fechar com ${nome}`,
      formato: 'Reel', categoria: 'branding', objetivo: 'vendas', plataformas: ['instagram'],
      gancho: `A prova social mais forte não é o que você fala — é o que o cliente fala por você.`,
      corpo: [
        `Grava um depoimento curto e espontâneo, sem roteiro decorado.`,
        `Encaixa no plano contratado: ${client.services.join(', ')}.`,
      ],
      cta: 'CTA direto: agende o seu horário/orçamento.',
      artPrompt: `Still de vídeo depoimento, pessoa sorrindo naturalmente em ambiente de ${seg.toLowerCase()}, luz suave, formato 4:5.`,
      desdobramento: [
        'Vira story destacado permanente de "depoimentos".',
        'Vira citação em carrossel de prova social.',
        'Reaproveita em proposta comercial/renovação.',
      ],
    },
  ]

  return base.map((b, i) => ({ ...b, id: `${client.id}-routine-${i + 1}` }))
}

// ── Rotação diária ──

export function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0)
  const diff = d.getTime() - start.getTime()
  return Math.floor(diff / 86400000)
}

export function rotateBySeed<T>(pool: T[], seed: number, count: number): T[] {
  if (pool.length === 0) return []
  const start = ((seed % pool.length) + pool.length) % pool.length
  const rotated = [...pool.slice(start), ...pool.slice(0, start)]
  return rotated.slice(0, Math.min(count, pool.length))
}

export function getDailyRoutines<T>(pool: T[], date: Date, count: number): T[] {
  return rotateBySeed(pool, dayOfYear(date), count)
}
