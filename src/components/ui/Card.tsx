'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'accent'
  hoverable?: boolean
}

export function Card({ className, variant = 'default', hoverable, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl',
        {
          'bg-[var(--bg-surface)] border border-[var(--border)]': variant === 'default',
          'bg-[var(--bg-elevated)] border border-[var(--border)]': variant === 'elevated',
          'glass': variant === 'glass',
          'bg-[var(--accent-soft)] border border-[var(--border-accent)]': variant === 'accent',
        },
        hoverable && 'transition-all duration-200 cursor-pointer hover:border-[var(--border-accent)] hover:bg-[var(--bg-hover)] hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 pb-3', className)} {...props}>
      {children}
    </div>
  )
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-5 pb-5', className)} {...props}>
      {children}
    </div>
  )
}
