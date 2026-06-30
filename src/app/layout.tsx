import type { Metadata } from 'next'
import { Syne, Poppins } from 'next/font/google'
import './globals.css'

const syne    = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400','500','600','700','800'] })
const poppins = Poppins({ subsets: ['latin'], variable: '--font-poppins', weight: ['300','400','500','600'] })

export const metadata: Metadata = {
  title: 'Agência Logue — Branding, conteúdo e inteligência criativa',
  description: 'Estratégia, estética, storytelling e IA aplicada. Branding, social media e produção criativa para marcas que querem ser lembradas.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${syne.variable} ${poppins.variable}`}>
        {children}
      </body>
    </html>
  )
}
