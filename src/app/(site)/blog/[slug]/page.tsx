import Link from 'next/link'
import { notFound } from 'next/navigation'
import { POSTS } from '@/lib/site-content'
import { ArrowLeft, Clock } from 'lucide-react'

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS.find((p) => p.slug === slug)
  return { title: post ? `${post.titulo} · Agência Logue` : 'Conteúdo · Agência Logue' }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  const data = new Date(post.data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <div className="os-view-in">
      <article className="site-section" style={{ maxWidth: 760, paddingTop: 'clamp(48px, 7vw, 88px)' }}>
        <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: 'var(--fg-3)', marginBottom: 32 }}>
          <ArrowLeft size={15} /> Voltar para conteúdos
        </Link>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent)' }}>{post.categoria}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: 'var(--fg-3)' }}><Clock size={12} /> {post.tempo}</span>
          <span style={{ fontSize: 12.5, color: 'var(--fg-4)' }}>{data}</span>
        </div>
        <h1 className="site-h2" style={{ marginBottom: 28 }}>{post.titulo}</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {post.corpo.map((par, i) => (
            <p key={i} style={{ fontSize: 16.5, color: 'var(--fg-2)', lineHeight: 1.75 }}>{par}</p>
          ))}
        </div>

        <div style={{ marginTop: 48, paddingTop: 28, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontSize: 14, color: 'var(--fg-2)' }}>Gostou? Vamos aplicar na sua marca.</span>
          <Link href="/contato" className="btn-accent">Falar com a Logue</Link>
        </div>
      </article>
    </div>
  )
}
