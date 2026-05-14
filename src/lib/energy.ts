import { EnergyConfig, EnergyMode } from './types'

export const ENERGY_CONFIGS: Record<EnergyMode, EnergyConfig> = {
  cansada: {
    id: 'cansada',
    label: 'Cansada',
    emoji: '🌙',
    description: 'Modo suave. Só o essencial.',
    color: '#2D1B69',
    accent: '#8B5CF6',
    showHeavyTasks: false,
    suggestedActions: [
      'Responder mensagens simples',
      'Organizar ideias soltas',
      'Ler referências',
      'Agendar posts já prontos',
      'Fazer uma captura mental rápida',
    ],
  },
  criativa: {
    id: 'criativa',
    label: 'Criativa',
    emoji: '✨',
    description: 'Modo expansão. Criar sem limites.',
    color: '#1E1A3F',
    accent: '#A78BFA',
    showHeavyTasks: true,
    suggestedActions: [
      'Escrever roteiros',
      'Desenvolver ideias do banco',
      'Criar posts e reels',
      'Escrever para o blog',
      'Gravar conteúdo autoral',
    ],
  },
  operacional: {
    id: 'operacional',
    label: 'Operacional',
    emoji: '⚙️',
    description: 'Modo execução. Fazer acontecer.',
    color: '#0F1F14',
    accent: '#34D399',
    showHeavyTasks: true,
    suggestedActions: [
      'Entregar tarefas de clientes',
      'Revisar e aprovar conteúdos',
      'Responder e-mails',
      'Organizar arquivos',
      'Atualizar projetos',
    ],
  },
  foco: {
    id: 'foco',
    label: 'Foco Profundo',
    emoji: '🎯',
    description: 'Modo profundo. Sem distração.',
    color: '#0F0A2E',
    accent: '#818CF8',
    showHeavyTasks: true,
    suggestedActions: [
      'Trabalho estratégico',
      'Criação de projetos complexos',
      'Escrita longa',
      'Análise e planejamento',
      'Vídeos longos para YouTube',
    ],
  },
  social: {
    id: 'social',
    label: 'Social',
    emoji: '💬',
    description: 'Modo conexão. Engajar e crescer.',
    color: '#1A1505',
    accent: '#FBBF24',
    showHeavyTasks: false,
    suggestedActions: [
      'Responder comentários',
      'Interagir com comunidade',
      'Prospectar collabs',
      'Networking',
      'Follow-up de propostas',
    ],
  },
  maternidade: {
    id: 'maternidade',
    label: 'Maternidade',
    emoji: '🌸',
    description: 'Modo presença. Família primeiro.',
    color: '#1F0A1F',
    accent: '#F9A8D4',
    showHeavyTasks: false,
    suggestedActions: [
      'Tarefas escolares do Davi',
      'Conteúdo de lifestyle',
      'Posts rápidos e leves',
      'Planejar semana',
      'Descanso consciente',
    ],
  },
  gravacao: {
    id: 'gravacao',
    label: 'Gravação',
    emoji: '🎬',
    description: 'Modo câmera. Criar em vídeo.',
    color: '#0A1F1A',
    accent: '#6EE7B7',
    showHeavyTasks: false,
    suggestedActions: [
      'Reels pessoais',
      'Vídeos para clientes',
      'UGC',
      'YouTube',
      'Stories ao vivo',
    ],
  },
}

export function getEnergyColor(mode: EnergyMode) {
  return ENERGY_CONFIGS[mode].accent
}

export function getEnergyBg(mode: EnergyMode) {
  return ENERGY_CONFIGS[mode].color
}
