import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Shell } from '@/components/layout/Shell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lorenna OS — Sistema Cognitivo Adaptativo',
  description: 'Cérebro externo. Copiloto executivo. Clareza mental.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
