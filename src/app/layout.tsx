import type { Metadata } from 'next'
import { Syne, Poppins } from 'next/font/google'
import './globals.css'
import { Shell } from '@/components/layout/Shell'

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' })

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
      <body className={`${syne.variable} ${poppins.variable}`}>
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
