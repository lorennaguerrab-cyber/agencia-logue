/* Conteúdo do site institucional (cases e blog).
   Serviços e pacotes vêm da base de conhecimento (single source of truth). */

export interface Case {
  slug: string
  cliente: string
  segmento: string
  titulo: string
  resumo: string
  servicos: string[]
  resultado: string
}

export const CASES: Case[] = [
  {
    slug: 'igor-giordano',
    cliente: 'Igor Giordano Óticas',
    segmento: 'Ótica · varejo local',
    titulo: 'Uma ótica autoral com presença de marca',
    resumo: 'Reposicionamento de conteúdo com linha editorial por pilares, reels de autoridade e campanha de aniversário da loja.',
    servicos: ['Social Media', 'Conteúdo Estratégico', 'Produção Audiovisual'],
    resultado: 'Linha editorial consistente, aumento de salvamentos e mais agendamentos vindos do Instagram.',
  },
  {
    slug: 'mariana-psicologia',
    cliente: 'Mariana Costa · Psicologia',
    segmento: 'Saúde · profissional liberal',
    titulo: 'Autoridade ética para uma psicóloga',
    resumo: 'Conteúdo de psicoeducação com tom acolhedor e responsável, dentro das diretrizes do conselho.',
    servicos: ['Conteúdo Estratégico', 'Social Media', 'Design'],
    resultado: 'Percepção de autoridade e fila de espera para novos pacientes, sem prometer resultado.',
  },
  {
    slug: 'casa-do-sabor',
    cliente: 'Casa do Sabor',
    segmento: 'Restaurante · comércio local',
    titulo: 'O sabor que vira história',
    resumo: 'Bastidores da cozinha, storytelling de pratos e campanha sazonal de Dia das Mães.',
    servicos: ['Produção Criativa', 'Social Media', 'Campanha Sazonal'],
    resultado: 'Casa cheia nas datas trabalhadas e marca mais lembrada na região.',
  },
]

export interface Post {
  slug: string
  titulo: string
  resumo: string
  categoria: string
  tempo: string
  data: string
  corpo: string[]
}

export const POSTS: Post[] = [
  {
    slug: 'conteudo-nao-e-sobre-postar-todo-dia',
    titulo: 'Conteúdo não é sobre postar todo dia',
    resumo: 'A consistência que importa não é de calendário — é de mensagem. Como pensar conteúdo a partir de objetivo, não de ansiedade.',
    categoria: 'Estratégia',
    tempo: '4 min',
    data: '2026-06-12',
    corpo: [
      'Existe uma confusão comum entre frequência e consistência. Postar todo dia não garante marca forte — garante cansaço.',
      'Na Logue, todo mês começa por uma pergunta: qual é o objetivo? A partir dele, distribuímos o conteúdo entre seis pilares — autoridade, conexão, venda, prova social, bastidores e educação.',
      'Quando cada peça sabe o que está fazendo ali, a conta inteira passa a fazer sentido. E aí, sim, a consistência aparece — como consequência, não como meta de volume.',
    ],
  },
  {
    slug: 'ia-na-comunicacao-sem-perder-a-alma',
    titulo: 'IA na comunicação, sem perder a alma',
    resumo: 'Como usamos inteligência artificial para acelerar a execução mantendo estratégia e curadoria humanas.',
    categoria: 'Inteligência Artificial',
    tempo: '5 min',
    data: '2026-05-28',
    corpo: [
      'IA generativa é uma ferramenta poderosa — e perigosa quando usada sem contexto. Texto genérico é fácil de reconhecer e fácil de ignorar.',
      'Por isso treinamos nossas ferramentas pelo contexto de cada marca: tom de voz, regras, restrições e exemplos. A IA consulta essa base antes de escrever.',
      'O resultado é velocidade com identidade. A máquina rascunha; a pessoa decide, edita e dá a última palavra. Estratégia continua sendo humana.',
    ],
  },
  {
    slug: 'a-oferta-clara-vende-mais',
    titulo: 'A oferta clara vende mais que a promessa grande',
    resumo: 'Por que abandonamos o hype e apostamos em clareza, prova e CTA único.',
    categoria: 'Copywriting',
    tempo: '3 min',
    data: '2026-05-10',
    corpo: [
      'Promessa milagrosa converte no curto prazo e destrói confiança no longo. Clareza faz o contrário.',
      'Uma boa oferta responde três coisas: o que é, para quem é e qual o primeiro passo. Sem urgência falsa, sem superlativo vazio.',
      'Quando a mensagem é honesta e específica, o público sente. E confiança, no fim, é o que sustenta qualquer venda.',
    ],
  },
]
