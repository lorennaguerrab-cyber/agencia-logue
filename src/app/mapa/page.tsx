'use client'

import { useCallback } from 'react'
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

const INITIAL_NODES: Node[] = [
  // Central
  {
    id: 'lorenna',
    data: { label: '✨ Lorenna', desc: 'Criadora • Mãe • Estrategista' },
    position: { x: 400, y: 300 },
    type: 'default',
    style: {
      background: 'linear-gradient(135deg, #6366F1, #A78BFA)',
      color: '#fff',
      border: 'none',
      borderRadius: 16,
      padding: '12px 20px',
      fontWeight: 700,
      fontSize: 14,
      boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
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
      background: '#EEF2FF',
      color: '#4F46E5',
      border: '1px solid rgba(99,102,241,0.25)',
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
    style: { background: '#FFFFFF', color: '#6366F1', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, padding: '6px 12px', fontSize: 11, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  },
  {
    id: 'instagram',
    data: { label: '📸 Instagram' },
    position: { x: 60, y: 230 },
    style: { background: '#FFFFFF', color: '#EC4899', border: '1px solid rgba(236,72,153,0.15)', borderRadius: 10, padding: '6px 12px', fontSize: 11, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  },
  {
    id: 'youtube',
    data: { label: '▶️ YouTube' },
    position: { x: 50, y: 310 },
    style: { background: '#FFFFFF', color: '#EF4444', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, padding: '6px 12px', fontSize: 11, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  },

  // Conteúdo
  {
    id: 'conteudo',
    data: { label: '🎬 Conteúdo' },
    position: { x: 650, y: 150 },
    style: { background: '#F0FDF4', color: '#059669', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600 },
  },
  {
    id: 'reels',
    data: { label: '🎞 Reels' },
    position: { x: 750, y: 80 },
    style: { background: '#FFFFFF', color: '#10B981', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10, padding: '6px 12px', fontSize: 11, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  },
  {
    id: 'newsletter',
    data: { label: '📩 Newsletter' },
    position: { x: 760, y: 200 },
    style: { background: '#FFFFFF', color: '#D97706', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10, padding: '6px 12px', fontSize: 11, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  },
  {
    id: 'ugc',
    data: { label: '📱 UGC Creator' },
    position: { x: 740, y: 300 },
    style: { background: '#FFFFFF', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 10, padding: '6px 12px', fontSize: 11, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  },

  // Clientes
  {
    id: 'clientes',
    data: { label: '💼 Clientes' },
    position: { x: 650, y: 450 },
    style: { background: '#FFFBEB', color: '#D97706', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600 },
  },
  {
    id: 'pratique',
    data: { label: '🏋 Pratique Academia' },
    position: { x: 750, y: 400 },
    style: { background: '#FFFFFF', color: '#10B981', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10, padding: '6px 12px', fontSize: 11, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  },
  {
    id: 'espaco',
    data: { label: '🎨 Espaço Criar' },
    position: { x: 760, y: 480 },
    style: { background: '#FFFFFF', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 10, padding: '6px 12px', fontSize: 11, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  },
  {
    id: 'optica',
    data: { label: '👓 Óptica Giordano' },
    position: { x: 750, y: 540 },
    style: { background: '#FFFFFF', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 10, padding: '6px 12px', fontSize: 11, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  },
  {
    id: 'jornal',
    data: { label: '📰 Jornal Cidades' },
    position: { x: 760, y: 600 },
    style: { background: '#FFFFFF', color: '#EF4444', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10, padding: '6px 12px', fontSize: 11, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  },

  // Temas editoriais
  {
    id: 'temas',
    data: { label: '💡 Temas' },
    position: { x: 400, y: 500 },
    style: { background: '#FFFBEB', color: '#B45309', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600 },
  },
  {
    id: 'branding',
    data: { label: '🏷 Branding' },
    position: { x: 300, y: 580 },
    style: { background: '#FFFFFF', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 10, padding: '6px 12px', fontSize: 11, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  },
  {
    id: 'maternidade',
    data: { label: '🌸 Maternidade' },
    position: { x: 400, y: 610 },
    style: { background: '#FFFFFF', color: '#EC4899', border: '1px solid rgba(236,72,153,0.15)', borderRadius: 10, padding: '6px 12px', fontSize: 11, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  },
  {
    id: 'ia',
    data: { label: '🤖 IA' },
    position: { x: 510, y: 580 },
    style: { background: '#FFFFFF', color: '#10B981', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10, padding: '6px 12px', fontSize: 11, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  },

  // Agência
  {
    id: 'agencia',
    data: { label: '🚀 Agência Logue' },
    position: { x: 150, y: 450 },
    style: { background: '#EEF2FF', color: '#4F46E5', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 12, padding: '8px 16px', fontSize: 12, fontWeight: 600 },
  },
]

const INITIAL_EDGES: Edge[] = [
  // Lorenna → hubs
  { id: 'e1', source: 'lorenna', target: 'marca', style: { stroke: '#8B5CF6', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8B5CF6' } },
  { id: 'e2', source: 'lorenna', target: 'conteudo', style: { stroke: '#10B981', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' } },
  { id: 'e3', source: 'lorenna', target: 'clientes', style: { stroke: '#F59E0B', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' } },
  { id: 'e4', source: 'lorenna', target: 'temas', style: { stroke: '#F59E0B', strokeWidth: 1.5 }, animated: true },
  { id: 'e5', source: 'lorenna', target: 'agencia', style: { stroke: '#6366F1', strokeWidth: 1.5 } },

  // Marca → canais
  { id: 'e6', source: 'marca', target: 'blog', style: { stroke: '#6366F1', strokeWidth: 1 } },
  { id: 'e7', source: 'marca', target: 'instagram', style: { stroke: '#EC4899', strokeWidth: 1 } },
  { id: 'e8', source: 'marca', target: 'youtube', style: { stroke: '#EF4444', strokeWidth: 1 } },

  // Conteúdo → tipos
  { id: 'e9', source: 'conteudo', target: 'reels', style: { stroke: '#10B981', strokeWidth: 1 } },
  { id: 'e10', source: 'conteudo', target: 'newsletter', style: { stroke: '#F59E0B', strokeWidth: 1 } },
  { id: 'e11', source: 'conteudo', target: 'ugc', style: { stroke: '#3B82F6', strokeWidth: 1 } },

  // Clientes → cada um
  { id: 'e12', source: 'clientes', target: 'pratique', style: { stroke: '#10B981', strokeWidth: 1 } },
  { id: 'e13', source: 'clientes', target: 'espaco', style: { stroke: '#8B5CF6', strokeWidth: 1 } },
  { id: 'e14', source: 'clientes', target: 'optica', style: { stroke: '#3B82F6', strokeWidth: 1 } },
  { id: 'e15', source: 'clientes', target: 'jornal', style: { stroke: '#EF4444', strokeWidth: 1 } },

  // Temas
  { id: 'e16', source: 'temas', target: 'branding', style: { stroke: '#8B5CF6', strokeWidth: 1 } },
  { id: 'e17', source: 'temas', target: 'maternidade', style: { stroke: '#EC4899', strokeWidth: 1 } },
  { id: 'e18', source: 'temas', target: 'ia', style: { stroke: '#10B981', strokeWidth: 1 } },

  // Interconexões
  { id: 'e19', source: 'branding', target: 'conteudo', style: { stroke: '#8B5CF6', strokeWidth: 1, opacity: 0.4 }, animated: true },
  { id: 'e20', source: 'agencia', target: 'clientes', style: { stroke: '#6366F1', strokeWidth: 1, opacity: 0.5 } },
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
      <div className="p-6 pb-4 flex-shrink-0">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Mapa Mental</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Visualização das conexões entre projetos, temas e clientes
        </p>
      </div>

      <div className="flex-1 mx-6 mb-6 rounded-2xl overflow-hidden border border-[var(--border)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          style={{ background: '#F4F5F9' }}
          defaultEdgeOptions={{
            style: { stroke: 'rgba(0,0,0,0.12)', strokeWidth: 1 },
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="rgba(0,0,0,0.05)"
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
              const style = node.style as Record<string, string>
              return style?.color || '#6366F1'
            }}
          />
        </ReactFlow>
      </div>
    </div>
  )
}
