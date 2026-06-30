import { getKnowledgeBase } from '@/lib/kb'
import { ClientHeader } from '@/components/client/ClientShell'
import { Camera, FileText, Clock, FolderInput, Check } from 'lucide-react'

export default function OrientacoesPage() {
  const guia = getKnowledgeBase().find((d) => d.id === 'proc-envio')

  const blocos = [
    { icon: Camera, titulo: 'Fotos e vídeos', itens: ['Envie fotos em alta (originais, sem print).', 'Vídeos na vertical e horizontal quando possível.', 'Evite imagens com marca d’água de outros apps.'] },
    { icon: FileText, titulo: 'Textos e dados', itens: ['Mande informações por escrito (datas, valores, nomes).', 'Logos em PNG ou vetor.', 'Referências com link sempre que tiver.'] },
    { icon: Clock, titulo: 'Prazos', itens: ['Demandas: pelo menos 5 dias úteis de antecedência.', 'Campanhas e datas comerciais: 15 dias.', 'Quanto antes, melhor o resultado.'] },
    { icon: FolderInput, titulo: 'Por onde enviar', itens: ['Use “Demandas & Ideias” para pedidos e ideias.', 'Arquivos pesados: pasta do Drive do projeto.', 'Dúvidas: fale com sua gerente.'] },
  ]

  return (
    <div>
      <ClientHeader title="Como enviar materiais" subtitle="Um guia rápido para a gente produzir com o seu padrão de marca." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
        {blocos.map((b) => {
          const Icon = b.icon
          return (
            <div key={b.titulo} className="card-soft" style={{ padding: 24 }}>
              <span style={{ display: 'inline-flex', width: 42, height: 42, borderRadius: 'var(--r-md)', background: 'var(--accent-ghost)', color: 'var(--accent)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={19} />
              </span>
              <h3 className="os-title" style={{ fontSize: 17, color: 'var(--fg-1)', marginBottom: 14 }}>{b.titulo}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {b.itens.map((it, i) => (
                  <div key={i} style={{ display: 'flex', gap: 9, fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>
                    <Check size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
                    <span>{it}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {guia && (
        <div className="card-soft" style={{ padding: 24, background: 'var(--surface-2)' }}>
          <span className="os-eyebrow" style={{ color: 'var(--accent)', display: 'block', marginBottom: 10 }}>Resumo da agência</span>
          <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.7 }}>{guia.conteudo}</p>
        </div>
      )}
    </div>
  )
}
