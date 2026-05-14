'use client'

import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion } from 'framer-motion'

const INITIAL_NODES: Node[] = [
  // Central
  {
    id: 'lorenna',
    data: { label: '✨ Lorenna', desc: 'Criadora • Mãe • Estrategista' },
    position: { x: 400, y: 300 },
    type: 'default',
    style: {
      background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
      color: '#fff',
      border: 'none',
      borderRadius: 16,
      padding: '12px 20px',
      fontWeight: 700,
      fontSize: 14,
      boxShadow: '0 0 30px rgba(124,58,237,0.4)',
      minWidth: 140,
      textAlign: 'center',
    },
  },

  // Marca pessoal
  {
    id: 'marca',
    data: { label: '🏷 Marca Pessoal' },
    position: { x: 150, y: 150 },
    style: {
      background: '#1E1A3F',
      color: '#A78BFA',
      border: '1px solid rgba(167,139,250,0.3)',
      borderRadius: 12,
      padding: '8px 16px',
      fontSize: 12,
      fontWeight: 600,
    },
  },
  {
    id: 'blog',
    data: { label: '📝 Papel da Lola' },
    position: { x: 50, y: 80 },
    style: { background: '#1A1A2E', color: '#818CF8', border: '1px solid rgba(129,140,248,0.2)', borderRadius: 10, padding: '6px 12px', fontSize: 11 },
  },
  {
    id: 'instagram',
    data: { label: '📸 Instagram' },
    position: { x: 60, y: 230 },
    style: { background: '#1A1A2E', color: '#F472B6', border: '1px solid rgba(244,114,182,0.2)', borderRadius: 10, padding: '6px 12px', fontSize: 11 },
  },
  {
    id: 'youtube',
    data: { label: '▶️ YouTube' },
    position: { x: 50, y: 310 },
    style: { background: '#1A1A2E', color: '#F87171', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, padding: '6px 12px', fontSize: 11 },
  },

  // Conteúdo
  {
    id: 'conteudo',
    data: { label: '🎬 Conteúdo' },
    position: { x: 650, y: 150 },
    style: { background: '#1A2E1A', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600 },
  },
  {
    id: 'reels',
    data: { label: '🎞 Reels' },
    position: { x: 750, y: 80 },
    style: { background: '#1A1A2E', color: '#6EE7B7', border: '1px solid rgba(110,231,183,0.2)', borderRadius: 10, padding: '6px 12px', fontSize: 11 },
  },
  {
    id: 'newsletter',
    data: { label: '📩 Newsletter' },
    position: { x: 760, y: 200 },
    style: { background: '#1A1A2E', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10, padding: '6px 12px', fontSize: 11 },
  },
  {
    id: 'ugc',
    data: { label: '📱 UGC Creator' },
    position: { x: 740, y: 300 },
    style: { background: '#1A1A2E', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 10, padding: '6px 12px', fontSize: 11 },
  },

  // Clientes
  {
    id: 'clientes',
    data: { label: '💼 Clientes' },
    position: { x: 650, y: 450 },
    style: { background: '#2E1A1A', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600 },
  },
  {
    id: 'pratique',
    data: { label: '🏋 Pratique Academia' },
    position: { x: 750, y: 400 },
    style: { background: '#1A1A2E', color: '#6EE7B7', border: '1px solid rgba(110,231,183,0.2)', borderRadius: 10, padding: '6px 12px', fontSize: 11 },
  },
  {
    id: 'espaco',
    data: { label: '🎨 Espaço Criar' },
    position: { x: 760, y: 480 },
    style: { background: '#1A1A2E', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10, padding: '6px 12px', fontSize: 11 },
  },
  {
    id: 'optica',
    data: { label: '👓 Óptica Giordano' },
    position: { x: 750, y: 540 },
    style: { background: '#1A1A2E', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 10, padding: '6px 12px', fontSize: 11 },
  },
  {
    id: 'jornal',
    data: { label: '📰 Jornal Cidades' },
    position: { x: 760, y: 600 },
    style: { background: '#1A1A2E', color: '#F87171', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, padding: '6px 12px', fontSize: 11 },
  },

  // Temas editoriais
  {
    id: 'temas',
    data: { label: '💡 Temas' },
    position: { x: 400, y: 500 },
    style: { background: '#1A1500', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600 },
  },
  {
    id: 'branding',
    data: { label: '🏷 Branding' },
    position: { x: 300, y: 580 },
    style: { background: '#1A1A2E', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10, padding: '6px 12px', fontSize: 11 },
  },
  {
    id: 'maternidade',
    data: { label: '🌸 Maternidade' },
    position: { x: 400, y: 610 },
    style: { background: '#1A1A2E', color: '#F9A8D4', border: '1px solid rgba(249,168,212,0.2)', borderRadius: 10, padding: '6px 12px', fontSize: 11 },
  },
  {
    id: 'ia',
    data: { label: '🤖 IA' },
    position: { x: 510, y: 580 },
    style: { background: '#1A1A2E', color: '#34D399', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 10, padding: '6px 12px', fontSize: 11 },
  },

  // Agência
  {
    id: 'agencia',
    data: { label: '🚀 Agência Logue' },
    position: { x: 150, y: 450 },
    style: { background: '#1A1A2E', color: '#818CF8', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600 },
  },
]

const INITIAL_EDGES: Edge[] = [
  // Lorenna → hubs
  { id: 'e1', source: 'lorenna', target: 'marca', style: { stroke: '#A78BFA', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#A78BFA' } },
  { id: 'e2', source: 'lorenna', target: 'conteudo', style: { stroke: '#34D399', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#34D399' } },
  { id: 'e3', source: 'lorenna', target: 'clientes', style: { stroke: '#FBBF24', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#FBBF24' } },
  { id: 'e4', source: 'lorenna', target: 'temas', style: { stroke: '#FBBF24', strokeWidth: 1.5 }, animated: true },
  { id: 'e5', source: 'lorenna', target: 'agencia', style: { stroke: '#818CF8', strokeWidth: 1.5 } },

  // Marca → canais
  { id: 'e6', source: 'marca', target: 'blog', style: { stroke: '#818CF8', strokeWidth: 1 } },
  { id: 'e7', source: 'marca', target: 'instagram', style: { stroke: '#F472B6', strokeWidth: 1 } },
  { id: 'e8', source: 'marca', target: 'youtube', style: { stroke: '#F87171', strokeWidth: 1 } },

  // Conteúdo → tipos
  { id: 'e9', source: 'conteudo', target: 'reels', style: { stroke: '#6EE7B7', strokeWidth: 1 } },
  { id: 'e10', source: 'conteudo', target: 'newsletter', style: { stroke: '#FBBF24', strokeWidth: 1 } },
  { id: 'e11', source: 'conteudo', target: 'ugc', style: { stroke: '#60A5FA', strokeWidth: 1 } },

  // Clientes → cada um
  { id: 'e12', source: 'clientes', target: 'pratique', style: { stroke: '#6EE7B7', strokeWidth: 1 } },
  { id: 'e13', source: 'clientes', target: 'espaco', style: { stroke: '#A78BFA', strokeWidth: 1 } },
  { id: 'e14', source: 'clientes', target: 'optica', style: { stroke: '#60A5FA', strokeWidth: 1 } },
  { id: 'e15', source: 'clientes', target: 'jornal', style: { stroke: '#F87171', strokeWidth: 1 } },

  // Temas
  { id: 'e16', source: 'temas', target: 'branding', style: { stroke: '#A78BFA', strokeWidth: 1 } },
  { id: 'e17', source: 'temas', target: 'maternidade', style: { stroke: '#F9A8D4', strokeWidth: 1 } },
  { id: 'e18', source: 'temas', target: 'ia', style: { stroke: '#34D399', strokeWidth: 1 } },

  // Interconexões
  { id: 'e19', source: 'branding', target: 'conteudo', style: { stroke: '#A78BFA', strokeWidth: 1, opacity: 0.4 }, animated: true },
  { id: 'e20', source: 'agencia', target: 'clientes', style: { stroke: '#818CF8', strokeWidth: 1, opacity: 0.5 } },
]

export default function MapaPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES)
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 pb-4 flex-shrink-0">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Mapa Mental</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Visualização das conexões entre projetos, temas e clientes
        </p>
      </div>

      {/* Flow */}
      <div className="flex-1 mx-6 mb-6 rounded-2xl overflow-hidden border border-[var(--border)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          style={{ background: '#08080F' }}
          defaultEdgeOptions={{
            style: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 },
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="rgba(255,255,255,0.04)"
          />
          <Controls
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 12,
            }}
          />
          <MiniMap
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 12,
            }}
            nodeColor={(node) => {
              const style = node.style as any
              return style?.color || '#7C3AED'
            }}
          />
        </ReactFlow>
      </div>
    </div>
  )
}
