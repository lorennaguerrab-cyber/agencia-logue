'use client'

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 cursor-pointer select-none',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          {
            'bg-[#6366F1] hover:bg-[#4F46E5] active:bg-[#4338CA] text-white shadow-[0_1px_3px_rgba(99,102,241,0.3)]':
              variant === 'primary',
            'bg-white hover:bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border)] shadow-[var(--shadow-xs)]':
              variant === 'secondary',
            'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]':
              variant === 'ghost',
            'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200':
              variant === 'danger',
            'bg-white/90 backdrop-blur text-[var(--text-primary)] border border-[var(--border)] hover:bg-white':
              variant === 'glass',
          },
          {
            'h-7 px-3 text-xs rounded-lg': size === 'sm',
            'h-9 px-4 text-sm': size === 'md',
            'h-11 px-6 text-base': size === 'lg',
            'h-9 w-9 p-0': size === 'icon',
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
