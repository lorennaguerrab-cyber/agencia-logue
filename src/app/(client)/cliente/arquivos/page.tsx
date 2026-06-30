'use client'

import { useClientStore } from '@/lib/client/store'
import { ClientHeader } from '@/components/client/ClientShell'
import { SEED_ARQUIVOS } from '@/lib/client/data'
import { Folder, FileText, Video, Image as ImageIcon, ExternalLink } from 'lucide-react'

const ICON = { pasta: Folder, documento: FileText, video: Video, imagem: ImageIcon }

export default function ArquivosPage() {
  const { account } = useClientStore()

  return (
    <div>
      <ClientHeader title="Arquivos finais" subtitle="Conteúdos prontos, documentos e links do seu projeto." />

      {account && (
        <a href={account.driveUrl} target="_blank" rel="noreferrer" className="card-soft" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 20, marginBottom: 16, borderColor: 'var(--accent)' }}>
          <span style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--accent-ghost)', color: 'var(--accent)', alignItems: 'center', justifyContent: 'center' }}>
            <Folder size={20} />
          </span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: 15, fontWeight: 500, color: 'var(--fg-1)' }}>Pasta principal no Google Drive</span>
            <span style={{ fontSize: 12.5, color: 'var(--fg-3)' }}>Tudo do seu projeto, sempre atualizado</span>
          </span>
          <ExternalLink size={17} color="var(--fg-3)" />
        </a>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {SEED_ARQUIVOS.map((f) => {
          const Icon = ICON[f.tipo]
          return (
            <a key={f.id} href={f.url} target="_blank" rel="noreferrer" className="card-soft" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 'var(--r-sm)', background: 'var(--surface-2)', color: 'var(--fg-2)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 13.5, color: 'var(--fg-1)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.nome}</span>
                <span style={{ fontSize: 11.5, color: 'var(--fg-4)' }}>Atualizado {new Date(f.atualizado + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
              </span>
              <ExternalLink size={14} color="var(--fg-4)" />
            </a>
          )
        })}
      </div>
    </div>
  )
}
