import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'purple' | 'green' | 'yellow' | 'red' | 'blue' | 'pink'
  size?: 'sm' | 'md'
  className?: string
}

const variants = {
  default: 'bg-gray-100 text-gray-600 border border-gray-200',
  purple: 'bg-violet-50 text-violet-700 border border-violet-200',
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  yellow: 'bg-amber-50 text-amber-700 border border-amber-200',
  red: 'bg-red-50 text-red-600 border border-red-200',
  blue: 'bg-blue-50 text-blue-700 border border-blue-200',
  pink: 'bg-pink-50 text-pink-700 border border-pink-200',
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
