'use client'

import { useState } from 'react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

const STEPS = [
  { id: 'visao',      label: 'Visão geral'     },
  { id: 'github',     label: 'GitHub'          },
  { id: 'vercel',     label: 'Vercel'          },
  { id: 'dominio',    label: 'Domínio'         },
  { id: 'manutencao', label: 'Manutenção'      },
]

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-[var(--offwhite)] border border-[var(--border)] rounded-[15px] p-4 text-[12.5px] font-mono text-[var(--text-primary)] overflow-auto leading-relaxed whitespace-pre-wrap">
      {children}
    </pre>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-[17px] font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-syne)' }}>{title}</h3>
      {children}
    </div>
  )
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{children}</p>
}

function StepVisao() {
  return (
    <div className="space-y-5">
      <Section title="O que você tem">
        <Para>
          Um sistema Next.js 16 rodando localmente no seu computador. O código vive no GitHub em <strong className="text-[var(--text-primary)]">lorennaguerrab-cyber/agencia-logue</strong>, branch <code className="bg-[var(--pink-tint)] text-[var(--pink-deep)] px-1.5 py-0.5 rounded-md text-xs">claude/review-attached-context-RWQiu</code>.
        </Para>
        <Para>
          Para que qualquer pessoa (ou você mesma em outro dispositivo) acesse esse sistema, ele precisa ser publicado na internet. O caminho mais simples é via Vercel — gratuito, conecta com o GitHub e atualiza automaticamente a cada push.
        </Para>
      </Section>
      <Section title="Fluxo completo">
        <div className="space-y-2">
          {[
            { n: '1', label: 'Código no GitHub', desc: 'Repositório privado ou público.' },
            { n: '2', label: 'Vercel conecta ao repositório', desc: 'Cada push na branch dispara um novo deploy.' },
            { n: '3', label: 'URL gerada automaticamente', desc: 'Ex: lorenna-os.vercel.app' },
            { n: '4', label: 'Domínio personalizado (opcional)', desc: 'Ex: os.papeldalola.com via Hostinger.' },
          ].map((s) => (
            <div key={s.n} className="flex items-start gap-3 p-3 bg-[var(--bg-elevated)] rounded-[15px] border border-[var(--border)]">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'var(--pink)' }}>{s.n}</div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{s.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function StepGithub() {
  return (
    <div className="space-y-5">
      <Section title="Fazer push do código para o GitHub">
        <Para>O código precisa estar no GitHub para que a Vercel consiga publicá-lo. Se ainda não foi feito o push, rode:</Para>
        <CodeBlock>{`git add .
git commit -m "Sistema Lorenna OS"
git push -u origin claude/review-attached-context-RWQiu`}</CodeBlock>
        <Para>Se der erro de autenticação, o token de acesso pode ter expirado. Gere um novo em <strong>GitHub → Settings → Developer Settings → Personal Access Tokens</strong> e use com:</Para>
        <CodeBlock>{`git remote set-url origin https://SEU_TOKEN@github.com/lorennaguerrab-cyber/agencia-logue.git
git push`}</CodeBlock>
      </Section>
      <Section title="Trocar para a branch main (recomendado)">
        <Para>Para a Vercel detectar automaticamente, é mais fácil usar a branch <code className="bg-[var(--pink-tint)] text-[var(--pink-deep)] px-1 rounded text-xs">main</code>:</Para>
        <CodeBlock>{`git checkout -b main
git push -u origin main`}</CodeBlock>
      </Section>
    </div>
  )
}

function StepVercel() {
  return (
    <div className="space-y-5">
      <Section title="Criar conta e importar projeto">
        <Para>Acesse <strong>vercel.com</strong> e crie uma conta (pode usar login com GitHub — mais fácil).</Para>
        <div className="space-y-2">
          {[
            'Clique em "New Project"',
            'Selecione o repositório lorennaguerrab-cyber/agencia-logue',
            'Framework: Next.js (detectado automaticamente)',
            'Branch: main (ou a branch que você está usando)',
            'Clique em Deploy',
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 bg-[var(--bg-elevated)] rounded-[12px] border border-[var(--border)]">
              <span className="text-xs font-bold text-[var(--pink)]">{i + 1}</span>
              <span className="text-sm text-[var(--text-secondary)]">{s}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Após o deploy">
        <Para>A Vercel vai gerar uma URL como <code className="bg-[var(--pink-tint)] text-[var(--pink-deep)] px-1 rounded text-xs">agencia-logue.vercel.app</code>. Qualquer push no repositório atualiza o sistema automaticamente.</Para>
      </Section>
    </div>
  )
}

function StepDominio() {
  return (
    <div className="space-y-5">
      <Section title="Usar domínio personalizado (via Hostinger)">
        <Para>Se você tem domínio no Hostinger (ex: papeldalola.com), pode apontar um subdomínio para a Vercel:</Para>
        <div className="space-y-2">
          {[
            { step: '1', text: 'Na Vercel: vá em Settings → Domains → Add domain → ex: os.papeldalola.com' },
            { step: '2', text: 'A Vercel vai mostrar um registro CNAME pra você adicionar' },
            { step: '3', text: 'No Hostinger: DNS → Gerenciar → Adicionar registro CNAME com o valor da Vercel' },
            { step: '4', text: 'Aguarde até 24h para propagação (geralmente menos de 1h)' },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3 p-3 bg-[var(--bg-elevated)] rounded-[15px] border border-[var(--border)]">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5" style={{ background: 'var(--pink)' }}>{s.step}</span>
              <p className="text-sm text-[var(--text-secondary)]">{s.text}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function StepManutencao() {
  return (
    <div className="space-y-5">
      <Section title="Como atualizar o sistema">
        <Para>Sempre que o Claude Code (ou você) fizer mudanças, basta fazer push:</Para>
        <CodeBlock>{`git add .
git commit -m "descrição da mudança"
git push`}</CodeBlock>
        <Para>A Vercel detecta o push e faz deploy automático em ~2 minutos.</Para>
      </Section>
      <Section title="Resolver problemas comuns">
        <div className="space-y-2">
          {[
            { p: 'Build falhou na Vercel', s: 'Veja os logs em Vercel → Deployments → clique no deploy com erro' },
            { p: 'Token do GitHub expirou', s: 'Gere novo em GitHub → Settings → Developer Settings → Tokens' },
            { p: 'Página em branco', s: 'Pode ser erro de variável de ambiente — verifique Settings → Environment Variables na Vercel' },
          ].map((item) => (
            <div key={item.p} className="p-3 bg-[var(--bg-elevated)] rounded-[15px] border border-[var(--border)]">
              <p className="text-sm font-semibold text-[var(--text-primary)]">{item.p}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{item.s}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Links úteis">
        <div className="space-y-2">
          {[
            { label: 'Vercel', url: 'https://vercel.com' },
            { label: 'GitHub — seu repositório', url: 'https://github.com/lorennaguerrab-cyber/agencia-logue' },
            { label: 'Documentação Next.js', url: 'https://nextjs.org/docs' },
          ].map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 bg-[var(--bg-elevated)] rounded-[12px] border border-[var(--border)] hover:border-[var(--pink-soft)] transition-colors group">
              <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">{l.label}</span>
              <ExternalLink size={13} className="text-[var(--text-muted)] group-hover:text-[var(--pink)]" />
            </a>
          ))}
        </div>
      </Section>
    </div>
  )
}

const STEP_CONTENT = [StepVisao, StepGithub, StepVercel, StepDominio, StepManutencao]

export default function ComoPorNoArPage() {
  const [step, setStep] = useState(0)
  const StepComponent = STEP_CONTENT[step]

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-syne)' }}>Como pôr no ar</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Do código local até o sistema online — passo a passo.</p>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-[var(--border)] overflow-x-auto gap-1">
        {STEPS.map((s, i) => (
          <button key={s.id} onClick={() => setStep(i)}
            className="flex items-center gap-1.5 px-4 py-3.5 text-[13px] font-medium whitespace-nowrap border-b-2 -mb-px transition-colors"
            style={{
              color: step === i ? 'var(--pink-deep)' : 'var(--gray)',
              borderBottomColor: step === i ? 'var(--pink)' : 'transparent',
              fontWeight: step === i ? 600 : 500,
            }}>
            <span className="text-[var(--text-muted)] font-medium text-[11px]">{String(i + 1).padStart(2, '0')}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <Card>
        <CardBody>
          <StepComponent />
        </CardBody>
      </Card>

      {/* Prev / Next */}
      <div className="flex items-center justify-between pt-1">
        <Button variant="ghost" size="sm" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}>
          <ChevronLeft size={14} /> Anterior
        </Button>
        <span className="text-xs text-[var(--text-muted)]">{step + 1} de {STEPS.length}</span>
        <Button variant="primary" size="sm" disabled={step === STEPS.length - 1} onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}>
          Próximo <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}
