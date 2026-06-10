/* Logue OS — Static data layer (mirrors window.DB from prototype) */

// ── Types ──────────────────────────────────────────────────────────

export type UserId = 'lorenna' | 'jeff' | 'ingred' | 'kamile'

export interface OsUser {
  id: UserId
  name: string
  role: string
  initials: string
  access: 'owner' | 'collab'
}

export type ClientStatus = 'ativo' | 'reajuste' | 'renovacao'

export interface OsClient {
  id: string
  name: string
  segment: string
  doc: string
  city: string
  phone: string
  plan: string          // plan id, 'reduzido', or '' for pending renewal
  value: number
  status: ClientStatus
  note?: string
  start: string         // ISO date
  renew: string         // ISO date
  tone: string
  brief: string
  services: string[]
  deliveries: number
  history: OsHistory[]
}

export interface OsHistory {
  label: string
  type: string          // 'Vídeo' | 'Social' | 'Roteiro' | 'Ensaio' | 'Identidade'
  date: string          // ISO date
}

export interface OsPlan {
  id: string
  name: string
  videos: number
  price: number
  popular?: boolean
  includes: string[]
}

export interface OsService {
  id: string
  name: string
  min: number | null
  max: number | null
  unit: string
}

export type KanbanCol = 'afazer' | 'producao' | 'aprovacao' | 'entregue'
export type DeliveryType = 'social' | 'video' | 'ensaio' | 'identidade'

export interface OsDelivery {
  id: string
  task: string
  client: string
  owner: string
  due: string
  col: KanbanCol
  type: DeliveryType
  late?: boolean
}

export interface OsKanbanCol {
  id: KanbanCol
  name: string
}

export type EquipmentStatus = 'disponivel' | 'uso' | 'manutencao'

export interface OsEquipment {
  name: string
  status: EquipmentStatus
  owner: string
  bought: string
}

export interface OsTool {
  name: string
  value: number
  due: string
  purpose: string
}

export interface OsCollaborator {
  name: string
  model: string
  clients?: number
  days?: number
  total: number
}

export interface OsCosts {
  tools: OsTool[]
  collaborators: OsCollaborator[]
}

export interface OsRevMonth {
  month: string
  value: number
}

export interface OsTicket {
  client: string
  current: string
  gap: string
  target: string
  potential: number
  argument: string
}

export type NetworkStage = 'frio' | 'aquecido' | 'proposta' | 'negociacao' | 'fechado' | 'perdido'

export interface OsNetworkContact {
  name: string
  segment: string
  stage: NetworkStage
  value: number
  next: string
  last: string
}

export interface OsNetwork {
  leads: OsNetworkContact[]
  influencers: OsNetworkContact[]
  agencias: OsNetworkContact[]
}

export interface OsClause {
  n: string
  title: string
  text: string
}

export interface OsContractor {
  name: string
  cpf: string
  city: string
  refs: string
}

// ── Data ──────────────────────────────────────────────────────────

export const users: Record<UserId, OsUser> = {
  lorenna: { id: 'lorenna', name: 'Lorenna Guerra', role: 'Diretora Criativa', initials: 'LG', access: 'owner' },
  jeff:    { id: 'jeff',    name: 'Jeff',           role: 'Sócio',             initials: 'JF', access: 'owner' },
  ingred:  { id: 'ingred',  name: 'Ingred',         role: 'Editora',           initials: 'IN', access: 'collab' },
  kamile:  { id: 'kamile',  name: 'Kamile',         role: 'Produtora',         initials: 'KM', access: 'collab' },
}

export const clients: OsClient[] = [
  {
    id: 'igor', name: 'Igor Giordano Eyewear', segment: 'Ótica / Moda',
    doc: 'CNPJ 32.481.207/0001-90', city: 'Itabira, MG', phone: '(31) 99812-4407',
    plan: 'essencial', value: 1200, status: 'reajuste',
    start: '2022-06-05', renew: '2026-07-05',
    tone: 'Sofisticado, próximo, referência em moda óptica na região. Fala com autoridade mas sem distância.',
    brief: 'Marca de óculos com curadoria própria. Foco em desejo + autoridade local. Evitar clichês de promoção. 4 anos de parceria com a Logue.',
    services: ['Social Media — Essencial', 'Roteiros', 'Vídeo'],
    deliveries: 6,
    history: [
      { label: 'Reel aniversário 4 anos', type: 'Vídeo', date: '2026-06-01' },
      { label: 'Carrossel coleção primavera', type: 'Social', date: '2026-05-15' },
      { label: 'Roteiro — depoimento cliente', type: 'Roteiro', date: '2026-04-28' },
      { label: 'Ensaio IA Business — 24 fotos', type: 'Ensaio', date: '2026-03-10' },
    ],
  },
  {
    id: 'mariana', name: 'Mariana Cabral', segment: 'Psicologia',
    doc: 'CPF 081.334.926-55', city: 'Itabira, MG', phone: '(31) 98765-2210',
    plan: 'essencial', value: 1200, status: 'ativo',
    start: '2024-02-05', renew: '2026-08-05',
    tone: 'Acolhedor, claro, sem jargão clínico. Educação emocional com leveza.',
    brief: 'Psicóloga clínica. Conteúdo de psicoeducação para adultos. Temas: ansiedade, relacionamentos, autoconhecimento. Nunca prometer cura.',
    services: ['Social Media — Essencial'],
    deliveries: 6,
    history: [
      { label: 'Carrossel — ansiedade no trabalho', type: 'Social', date: '2026-05-20' },
      { label: 'Reels — 3 sinais de que a terapia funciona', type: 'Vídeo', date: '2026-05-05' },
      { label: 'Agendamento junho', type: 'Social', date: '2026-06-04' },
    ],
  },
  {
    id: 'criar', name: 'Espaço Criar', segment: 'Educação infantil',
    doc: 'CNPJ 28.114.530/0001-22', city: 'Itabira, MG', phone: '(31) 99654-8821',
    plan: 'reduzido', value: 600, status: 'ativo', note: 'taxa reduzida',
    start: '2024-09-05', renew: '2026-09-05',
    tone: 'Lúdico, afetivo, voltado a pais e mães. Celebra o desenvolvimento das crianças.',
    brief: 'Espaço de desenvolvimento infantil. Posts de rotina, datas comemorativas e bastidores. Sem vídeo no plano atual.',
    services: ['Social Media — reduzido'],
    deliveries: 4,
    history: [
      { label: 'Posts junho — festa junina', type: 'Social', date: '2026-06-12' },
      { label: 'Posts maio — dia das mães', type: 'Social', date: '2026-05-10' },
    ],
  },
  {
    id: 'pratique', name: 'Pratique', segment: 'Fitness / Academia',
    doc: 'CNPJ 19.872.445/0001-71', city: 'Itabira, MG', phone: '(31) 98123-7745',
    plan: '', value: 0, status: 'renovacao',
    start: '2023-03-05', renew: '2026-06-20',
    tone: 'Energético, direto, motivacional sem ser agressivo.',
    brief: 'Academia com foco em comunidade. Contrato encerrado aguardando renovação — proposta enviada.',
    services: [],
    deliveries: 0,
    history: [],
  },
  {
    id: 'impacto', name: 'Impacto', segment: 'Varejo',
    doc: 'CNPJ 41.220.918/0001-04', city: 'Itabira, MG', phone: '(31) 99440-1133',
    plan: '', value: 0, status: 'renovacao',
    start: '2023-08-05', renew: '2026-06-28',
    tone: 'Popular, acessível, foco em oferta com dignidade visual.',
    brief: 'Rede de varejo local. Aguardando renovação de contrato — follow-up marcado.',
    services: [],
    deliveries: 0,
    history: [],
  },
  {
    id: 'cidades', name: 'Cidades & Minerais', segment: 'Institucional / Mineração',
    doc: 'CNPJ 07.553.222/0001-18', city: 'Itabira, MG', phone: '(31) 98870-9912',
    plan: '', value: 0, status: 'renovacao',
    start: '2024-01-05', renew: '2026-07-12',
    tone: 'Institucional, sério, orgulho regional.',
    brief: 'Projeto institucional ligado à história mineral da região. Renovação em negociação.',
    services: [],
    deliveries: 0,
    history: [],
  },
]

export const plans: OsPlan[] = [
  {
    id: 'essencial', name: 'Essencial', videos: 6, price: 1200,
    includes: ['Ideia', 'Direção criativa', 'Captação', 'Edição', 'Entrega final pronta', 'Gravação em 1 dia'],
  },
  {
    id: 'plus', name: 'Logue Plus', videos: 10, price: 2700, popular: true,
    includes: ['Estratégia básica', 'Legendas e agendamento', 'Direção criativa', 'Análise de crescimento', 'Suporte estratégico', 'Gravação em 1 dia'],
  },
  {
    id: 'full', name: 'Logue Full', videos: 14, price: 4500,
    includes: ['Tudo do Plus', 'Campanhas mensais + planejamento', 'Direcionamento para stories', 'Design de peças liberado', 'Pinterest / TikTok / YouTube', 'Branding + ensaio fotográfico', 'Visitas semanais para gravação', 'Reuniões presenciais mensais'],
  },
]

export const oneOffs: OsService[] = [
  { id: 'iv',        name: 'Identidade Visual completa',     min: 980,  max: 1730, unit: 'projeto' },
  { id: 'branding',  name: 'Branding estratégico',           min: 2500, max: 4000, unit: 'projeto' },
  { id: 'ia12',      name: 'Ensaio IA Business — 12 fotos',  min: 480,  max: 480,  unit: 'ensaio' },
  { id: 'ia24',      name: 'Ensaio IA Business — 24 fotos',  min: 680,  max: 680,  unit: 'ensaio' },
  { id: 'ia36',      name: 'Ensaio IA Business — 36 fotos',  min: 760,  max: 760,  unit: 'ensaio' },
  { id: 'lanc',      name: 'Lançamento de infoproduto',      min: null, max: null, unit: 'sob consulta' },
  { id: 'video',     name: 'Vídeo avulso',                   min: 300,  max: 300,  unit: 'unidade' },
  { id: 'post',      name: 'Post estático avulso',           min: 130,  max: 130,  unit: 'unidade' },
  { id: 'carrossel', name: 'Carrossel avulso',               min: 180,  max: 180,  unit: 'unidade' },
  { id: 'outdoor',   name: 'Arte para outdoor',              min: 300,  max: 300,  unit: 'unidade' },
]

export const deliveries: OsDelivery[] = [
  { id: 't1', task: 'Reel — bastidores nova coleção',             client: 'igor',    owner: 'ingred',  due: '2026-06-10', col: 'producao',  type: 'video' },
  { id: 't2', task: 'Carrossel psicoeducação — ansiedade',        client: 'mariana', owner: 'lorenna', due: '2026-06-11', col: 'afazer',    type: 'social' },
  { id: 't3', task: 'Captação — diária estúdio (óculos de grau)', client: 'igor',    owner: 'kamile',  due: '2026-06-08', col: 'afazer',    type: 'video', late: true },
  { id: 't4', task: 'Posts junho — rotina e festa junina',        client: 'criar',   owner: 'lorenna', due: '2026-06-12', col: 'aprovacao', type: 'social' },
  { id: 't5', task: 'Edição — vídeo aniversário 4 anos',          client: 'igor',    owner: 'ingred',  due: '2026-06-06', col: 'aprovacao', type: 'video', late: true },
  { id: 't6', task: 'Roteiro — depoimento paciente (anônimo)',    client: 'mariana', owner: 'jeff',    due: '2026-06-14', col: 'afazer',    type: 'social' },
  { id: 't7', task: 'Proposta de renovação — Pratique',           client: 'pratique',owner: 'jeff',    due: '2026-06-09', col: 'producao',  type: 'social' },
  { id: 't8', task: 'Stories — semana do cliente',                client: 'igor',    owner: 'lorenna', due: '2026-06-05', col: 'entregue',  type: 'social' },
  { id: 't9', task: 'Agendamento — grade junho Mariana',          client: 'mariana', owner: 'lorenna', due: '2026-06-04', col: 'entregue',  type: 'social' },
]

export const kanbanCols: OsKanbanCol[] = [
  { id: 'afazer',    name: 'A fazer' },
  { id: 'producao',  name: 'Em produção' },
  { id: 'aprovacao', name: 'Aguardando aprovação' },
  { id: 'entregue',  name: 'Entregue' },
]

export const checklists: Record<string, string[]> = {
  social:     ['Briefing', 'Linha editorial', 'Produção', 'Design', 'Copy', 'Agendamento', 'Revisão', 'Entrega'],
  identidade: ['Briefing', 'Moodboard', 'Reunião de alinhamento', 'Criação', 'Apresentação', 'Revisão', 'Fechamento', 'Envio por Drive'],
  video:      ['Briefing', 'Roteiro', 'Gravação', 'Edição', 'Revisão', 'Entrega'],
}

export const revenue6m: OsRevMonth[] = [
  { month: 'Jan', value: 4200 },
  { month: 'Fev', value: 4200 },
  { month: 'Mar', value: 3600 },
  { month: 'Abr', value: 3000 },
  { month: 'Mai', value: 3000 },
  { month: 'Jun', value: 3000 },
]

export const costs: OsCosts = {
  tools: [
    { name: 'Adobe Creative Cloud', value: 280, due: '2026-06-12', purpose: 'Edição e design' },
    { name: 'Canva Pro',            value: 45,  due: '2026-06-03', purpose: 'Peças rápidas' },
    { name: 'CapCut Pro',           value: 38,  due: '2026-06-18', purpose: 'Edição mobile' },
    { name: 'Claude API',           value: 120, due: '2026-06-01', purpose: 'IA de conteúdo' },
    { name: 'Google Workspace',     value: 76,  due: '2026-06-07', purpose: 'Drive e e-mail' },
  ],
  collaborators: [
    { name: 'Ingred', model: 'por cliente', clients: 2, total: 560 },
    { name: 'Kamile', model: 'por diária',  days: 3,    total: 540 },
  ],
}

export const tickets: OsTicket[] = [
  {
    client: 'criar', current: 'R$600/mês (taxa reduzida)',
    gap: 'Sem vídeo nem roteiro', target: 'Essencial R$1.200/mês',
    potential: 600,
    argument: 'Espaço Criar está no plano R$600/mês mas não tem roteiro nem vídeo — potencial de upgrade para Essencial R$1.200/mês. Argumento: vídeos de bastidores convertem matrículas; pais decidem pelo que veem.',
  },
  {
    client: 'mariana', current: 'Essencial R$1.200/mês',
    gap: 'Ensaio IA Business', target: '+ R$680',
    potential: 680,
    argument: 'Mariana cresceu +40% em alcance — hora de profissionalizar a imagem. Ensaio IA Business (24 fotos, R$680) renova o banco de imagens sem custo de estúdio.',
  },
  {
    client: 'igor', current: 'Essencial R$1.200/mês + reajuste pendente',
    gap: 'Upgrade para Plus', target: 'Logue Plus R$2.700/mês',
    potential: 1500,
    argument: '4 anos de casa e 6 vídeos/mês no limite. Upgrade para Logue Plus (10 vídeos, R$2.700) cobre lançamentos de coleção + análise de crescimento. Apresentar junto do reajuste.',
  },
]

export const network: OsNetwork = {
  leads: [
    { name: 'Clínica Sorrir+',      segment: 'Odontologia',   stage: 'proposta',   value: 2700, next: 'Follow-up dia 12/06',               last: '2026-06-02' },
    { name: 'Café do Centro',       segment: 'Gastronomia',   stage: 'aquecido',   value: 1200, next: 'Enviar cases de vídeo',              last: '2026-05-28' },
    { name: 'AutoPeças Silva',      segment: 'Automotivo',    stage: 'frio',       value: 1200, next: 'Primeira abordagem via WhatsApp',    last: '2026-06-01' },
    { name: 'Doce Mel Confeitaria', segment: 'Gastronomia',   stage: 'negociacao', value: 1730, next: 'Ajustar escopo de identidade visual', last: '2026-06-05' },
  ],
  influencers: [
    { name: 'Lais Martins', segment: 'Lifestyle Itabira', stage: 'fechado',  value: 0, next: 'Collab junho — Igor Giordano',         last: '2026-06-03' },
    { name: 'Pedro Rocha',  segment: 'Fitness',           stage: 'aquecido', value: 0, next: 'Aguardar renovação Pratique',           last: '2026-05-20' },
  ],
  agencias: [
    { name: 'Studio Vega (BH)', segment: 'Audiovisual',       stage: 'fechado',    value: 0, next: 'Repasse de captação drone',           last: '2026-05-15' },
    { name: 'Agência Norte',    segment: 'Performance/Tráfego',stage: 'negociacao', value: 0, next: 'Definir comissão de indicação',       last: '2026-06-04' },
  ],
}

export const scripts: Record<string, string> = {
  frio:      'Oi, [nome]! Aqui é a Lorenna, da Agência Logue 💛 A gente cuida da comunicação de marcas como Igor Giordano Eyewear e Espaço Criar aqui em Itabira. Vi o trabalho de vocês e tenho uma ideia que pode aumentar o movimento aí. Posso te mandar um áudio de 1 minuto?',
  aquecido:  'Oi, [nome]! Lembra da nossa conversa? Separei 2 cases parecidos com o seu negócio pra você ver o resultado na prática. Topa uma call de 15 min essa semana?',
  proposta:  'Oi, [nome]! Te enviei a proposta ontem — ficou alguma dúvida sobre o escopo ou investimento? Se quiser, ajusto o plano pro seu momento. Tô por aqui!',
}

export const equipment: OsEquipment[] = [
  { name: 'Sony ZV-E10 + kit lente',   status: 'uso',       owner: 'Kamile',  bought: '2024-03-01' },
  { name: 'iPhone 15 Pro (captação)',   status: 'uso',       owner: 'Lorenna', bought: '2024-09-01' },
  { name: 'DJI Mic 2 (duplo)',          status: 'disponivel',owner: '—',       bought: '2024-05-01' },
  { name: 'Tripé + gimbal DJI RS3 mini',status: 'disponivel',owner: '—',       bought: '2023-11-01' },
  { name: 'Kit iluminação softbox (2x)',status: 'manutencao',owner: '—',       bought: '2023-06-01' },
]

export const clauses: OsClause[] = [
  { n: '1ª', title: 'DO OBJETO',          text: 'O presente contrato tem por objeto a prestação de serviços de [SERVIÇO CONTRATADO], com as entregas especificadas no escopo descrito no Anexo I, conforme briefing aprovado entre as partes.' },
  { n: '2ª', title: 'DAS OBRIGAÇÕES',     text: 'A CONTRATADA se obriga a executar os serviços com zelo técnico e criativo. A CONTRATANTE se obriga a fornecer materiais, informações e aprovações necessárias em até 72 (setenta e duas) horas após solicitação, respeitando o prazo mínimo de entrega acordado.' },
  { n: '3ª', title: 'DO PRAZO',           text: 'Os serviços terão início em até 72 (setenta e duas) horas após a confirmação do pagamento, com entrega em até 30 (trinta) dias úteis. Está incluída 1 (uma) rodada de ajustes; rodadas adicionais serão orçadas à parte.' },
  { n: '4ª', title: 'DO PAGAMENTO',       text: 'O pagamento será realizado via PIX ou transferência bancária, todo dia 5 (cinco) útil do mês. O atraso implicará multa de 2% (dois por cento) sobre o valor devido, ficando o serviço suspenso até a regularização. Não haverá devolução de valores em caso de rescisão.' },
  { n: '5ª', title: 'DOS DIREITOS AUTORAIS', text: 'Nos termos da Lei nº 9.610/98, os arquivos abertos permanecem de propriedade da CONTRATADA. O uso comercial das peças finais fica liberado à CONTRATANTE após a quitação integral dos valores contratados.' },
]

export const contractor: OsContractor = {
  name: 'Lorenna Luiza Guerra Nunes Barbosa',
  cpf:  'CPF 123.741.376-19',
  city: 'Itabira, MG',
  refs: 'Código de Defesa do Consumidor · Lei 4.680/65 · Decreto 57.690/66',
}

// ── Helper functions ──────────────────────────────────────────────

export function clientById(id: string): OsClient | undefined {
  return clients.find(c => c.id === id)
}

export function userById(id: string): OsUser | undefined {
  return users[id as UserId]
}

export function planById(id: string): OsPlan | undefined {
  return plans.find(p => p.id === id.toLowerCase())
}

export function activeClients(): OsClient[] {
  return clients.filter(c => c.status === 'ativo' || c.status === 'reajuste')
}

export function monthlyRevenue(): number {
  return activeClients().reduce((s, c) => s + c.value, 0)
}

export function overdueCount(): number {
  return deliveries.filter(d => d.late && d.col !== 'entregue').length
}

export function totalCosts(): number {
  return costs.tools.reduce((s, t) => s + t.value, 0) +
         costs.collaborators.reduce((s, c) => s + c.total, 0)
}

export function daysUntil(dateStr: string): number {
  const today = new Date('2026-06-10')
  const d = new Date(dateStr)
  return Math.round((d.getTime() - today.getTime()) / 86400000)
}

export function fmt(v: number | null | undefined): string {
  if (v == null) return '—'
  return 'R$ ' + v.toLocaleString('pt-BR')
}

export function fmtK(v: number): string {
  return v >= 1000 ? 'R$ ' + (v / 1000).toFixed(1) + 'k' : fmt(v)
}

export function getPlanLabel(client: OsClient): string {
  if (client.plan === 'reduzido') return 'Pacote reduzido'
  if (!client.plan) return '—'
  return planById(client.plan)?.name ?? client.plan
}
