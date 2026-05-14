'use client'

import { useLorennStore } from '@/lib/store'
import { Sidebar } from './Sidebar'
import { QuickCapture } from './QuickCapture'
import { Toaster } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface ShellProps {
  children: React.ReactNode
}

export function Shell({ children }: ShellProps) {
  const { sidebarCollapsed } = useLorennStore()

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)]">
      <Sidebar />
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-56'
        )}
      >
        {children}
      </main>
      <QuickCapture />
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
    </div>
  )
}
