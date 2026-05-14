import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(date))
}

export function formatDateFull(date: string | Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date(date))
}

export function timeAgo(date: string | Date) {
  const now = new Date()
  const past = new Date(date)
  const diff = now.getTime() - past.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'agora'
  if (minutes < 60) return `${minutes}min`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  return formatDate(date)
}

export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function truncate(str: string, max: number) {
  if (str.length <= max) return str
  return str.slice(0, max) + '…'
}

export const CATEGORY_LABELS: Record<string, string> = {
  branding: 'Branding',
  mulheres_incriveis: 'Mulheres Incríveis',
  livros_infantis: 'Livros Infantis',
  maternidade: 'Maternidade',
  lifestyle: 'Lifestyle',
  criatividade: 'Criatividade',
  inteligencia_artificial: 'Inteligência Artificial',
  analise_marcas: 'Análise de Marcas',
  design: 'Design',
  marketing: 'Marketing',
  rotina: 'Rotina',
  blogosfera: 'Blogosfera',
  bastidores: 'Bastidores Criativos',
}

export const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  blog: 'Blog',
  newsletter: 'Newsletter',
  linkedin: 'LinkedIn',
  collab: 'Collab',
  pinterest: 'Pinterest',
}

export const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E1306C',
  youtube: '#FF0000',
  tiktok: '#000000',
  blog: '#7C3AED',
  newsletter: '#F59E0B',
  linkedin: '#0077B5',
  collab: '#10B981',
  pinterest: '#E60023',
}
