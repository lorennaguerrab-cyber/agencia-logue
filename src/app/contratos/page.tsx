'use client'

import { useEffect, useState } from 'react'
import { useTopbar } from '@/lib/topbar-context'
import { clauses, contractor } from '@/lib/db'
import { Download } from 'lucide-react'

export default function ContratosPage() {
  const { setConfig } = useTopbar()

  useEffect(() => {
    setConfig({
      title: 'Gerador de Contratos',
      subtitle: 'Base legal real da Logue',
    })
  }, [setConfig])

  const [contratante, setContratante] = useState('')
  const [cpf, setCpf] = useState('')
  const [endereco, setEndereco] = useState('')
  const [telefone, setTelefone] = useState('')
  const [servico, setServico] = useState('')
  const [valor, setValor] = useState('')
  const [pagamento, setPagamento] = useState('PIX · dia 5 útil')
  const [inicio, setInicio] = useState('')

  const fieldLabel: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--fg-3)',
    marginBottom: 6,
  }

  const fieldInput: React.CSSProperties = {
    width: '100%',
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-sm)',
    padding: '10px 12px',
    color: 'var(--fg-1)',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }} className="os-view-in">
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 20, alignItems: 'start' }}>

        {/* LEFT — Form card */}
        <div style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)',
          padding: 24,
        }}>
          <p className="os-eyebrow" style={{ marginBottom: 20 }}>Dados do contrato</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            <div>
              <label style={fieldLabel}>Contratante</label>
              <input
                style={fieldInput}
                type="text"
                placeholder="Nome do cliente"
                value={contratante}
                onChange={e => setContratante(e.target.value)}
              />
            </div>

            <div>
              <label style={fieldLabel}>CPF / CNPJ</label>
              <input
                style={fieldInput}
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={e => setCpf(e.target.value)}
              />
            </div>

            <div>
              <label style={fieldLabel}>Endereço</label>
              <input
                style={fieldInput}
                type="text"
                placeholder="Rua, número, cidade - UF"
                value={endereco}
                onChange={e => setEndereco(e.target.value)}
              />
            </div>

            <div>
              <label style={fieldLabel}>Telefone</label>
              <input
                style={fieldInput}
                type="text"
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
              />
            </div>

            <div>
              <label style={fieldLabel}>Serviço contratado</label>
              <input
                style={fieldInput}
                type="text"
                placeholder="Ex: Social Media — Essencial"
                value={servico}
                onChange={e => setServico(e.target.value)}
              />
            </div>

            <div>
              <label style={fieldLabel}>Valor</label>
              <input
                style={fieldInput}
                type="text"
                placeholder="R$ 0,00"
                value={valor}
                onChange={e => setValor(e.target.value)}
              />
            </div>

            <div>
              <label style={fieldLabel}>Forma de pagamento</label>
              <select
                style={fieldInput}
                value={pagamento}
                onChange={e => setPagamento(e.target.value)}
              >
                <option>PIX · dia 5 útil</option>
                <option>Transferência · dia 5 útil</option>
              </select>
            </div>

            <div>
              <label style={fieldLabel}>Início</label>
              <input
                style={fieldInput}
                type="text"
                placeholder="Ex: 05/07/2026"
                value={inicio}
                onChange={e => setInicio(e.target.value)}
              />
            </div>
          </div>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              marginTop: 20,
              padding: '12px 16px',
              borderRadius: 'var(--r-sm)',
              background: 'var(--accent)',
              color: '#0a0a0a',
              fontSize: 13,
              fontWeight: 600,
              border: '1px solid transparent',
              cursor: 'pointer',
            }}
            onClick={() => window.print()}
          >
            <Download size={15} />
            Gerar PDF
          </button>
        </div>

        {/* RIGHT — Contract preview */}
        <div style={{
          background: '#fff',
          color: '#111',
          borderRadius: 'var(--r-lg)',
          padding: 40,
          position: 'relative',
          overflow: 'hidden',
          lineHeight: 1.6,
          boxShadow: '0 2px 24px rgba(0,0,0,0.10)',
        }}>
          {/* Decorative corner elements */}
          <span style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            borderTop: '60px solid #e8ff4d',
            borderRight: '60px solid transparent',
          }} />
          <span style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 0,
            height: 0,
            borderBottom: '60px solid #e8ff4d',
            borderLeft: '60px solid transparent',
          }} />

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <p style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#555',
              marginBottom: 10,
              fontVariant: 'small-caps',
            }}>
              Contrato de prestação de serviços
            </p>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px', color: '#0a0a0a', lineHeight: 1.2 }}>
              {contratante || 'Nome do Contratante'}
            </h2>
            <p style={{ fontSize: 13, color: '#444', margin: 0 }}>
              Entre <strong>{contractor.name}</strong>, {contractor.cpf}, {contractor.city} (CONTRATADA) e{' '}
              <strong>{contratante || '[CONTRATANTE]'}</strong>
              {cpf ? `, ${cpf}` : ''}
              {endereco ? `, ${endereco}` : ''}
              {' '}(CONTRATANTE).
            </p>
          </div>

          {/* Clauses */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 32 }}>
            {clauses.map((clause) => (
              <div key={clause.n}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0a0a0a', margin: '0 0 4px' }}>
                  Cláusula {clause.n} — {clause.title}
                </p>
                <p style={{ fontSize: 12.5, color: '#333', margin: 0, lineHeight: 1.65 }}>
                  {clause.text.replace('[SERVIÇO CONTRATADO]', servico || '[SERVIÇO CONTRATADO]')}
                </p>
              </div>
            ))}
          </div>

          {/* Signature lines */}
          <div style={{ display: 'flex', gap: 32, marginBottom: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ borderBottom: '1.5px solid #bbb', marginBottom: 6 }} />
              <p style={{ fontSize: 11, color: '#666', margin: 0, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                CONTRATADA
              </p>
              <p style={{ fontSize: 12, color: '#333', margin: '2px 0 0' }}>{contractor.name}</p>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ borderBottom: '1.5px solid #bbb', marginBottom: 6 }} />
              <p style={{ fontSize: 11, color: '#666', margin: 0, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                CONTRATANTE
              </p>
              <p style={{ fontSize: 12, color: '#333', margin: '2px 0 0' }}>{contratante || '—'}</p>
            </div>
          </div>

          {/* References */}
          <p style={{ fontSize: 10.5, color: '#999', margin: '0 0 12px', lineHeight: 1.5 }}>
            {contractor.refs}
          </p>

          {/* Brand mark */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#bbb', textTransform: 'uppercase' }}>
              Logue OS
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
