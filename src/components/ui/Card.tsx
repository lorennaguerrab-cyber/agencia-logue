'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'flat' | 'accent'
  hoverable?: boolean
}

export function Card({ className, variant = 'default', hoverable, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border',
        {
          'bg-white border-[var(--border)] shadow-[0_1px_3px_rgba(0,0,0,0.07),0_1px_2px_rgba(0,0,0,0.04)]': variant === 'default',
          'bg-[var(--bg-elevated)] border-[var(--border)] shadow-[0_4px_8px_rgba(0,0,0,0.06)]': variant === 'elevated',
          'bg-[var(--bg-base)] border-transparent shadow-none': variant === 'flat',
          'bg-indigo-50 border-indigo-100': variant === 'accent',
        },
        hoverable && 'transition-all duration-200 cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.09)] hover:-translate-y-0.5 hover:border-indigo-200',
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
    <div className={cn('px-5 pt-5 pb-3', className)} {...props}>
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
