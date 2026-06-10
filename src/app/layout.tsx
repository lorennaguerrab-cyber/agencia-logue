import type { Metadata } from 'next'
import { Syne, Poppins } from 'next/font/google'
import './globals.css'
import { Shell } from '@/components/layout/Shell'

const syne    = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400','500','600','700','800'] })
const poppins = Poppins({ subsets: ['latin'], variable: '--font-poppins', weight: ['300','400','500','600'] })

export const metadata: Metadata = {
  title: 'Logue OS — Sistema Operacional da Agência Logue',
  description: 'Clientes, conteúdo, entregas, contratos e finanças — em um só lugar.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${syne.variable} ${poppins.variable}`}>
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
