import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'purple' | 'green' | 'yellow' | 'red' | 'blue' | 'pink'
  size?: 'sm' | 'md'
  className?: string
}

const variants = {
  default: 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]',
  purple: 'bg-purple-950/50 text-purple-300 border border-purple-800/30',
  green: 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/30',
  yellow: 'bg-amber-950/50 text-amber-300 border border-amber-800/30',
  red: 'bg-red-950/50 text-red-300 border border-red-800/30',
  blue: 'bg-blue-950/50 text-blue-300 border border-blue-800/30',
  pink: 'bg-pink-950/50 text-pink-300 border border-pink-800/30',
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
