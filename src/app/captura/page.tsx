'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLorennStore } from '@/lib/store'
import { ENERGY_CONFIGS } from '@/lib/energy'
import { supabase } from '@/lib/supabase'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { timeAgo } from '@/lib/utils'
import { Zap, Send, Archive, Mic, CheckCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

interface CapturaRecord {
  id: string
  texto: string
  tipo: string
  processada: boolean
  created_at: string
}

export default function CapturaPage() {
  const { energyMode } = useLorennStore()
  const [text, setText] = useState('')
  const [processing, setProcessing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{
    tasks: string[]
    ideas: string[]
    summary: string
    categories: string[]
  } | null>(null)
  const [history, setHistory] = useState<CapturaRecord[]>([])
  const energy = ENERGY_CONFIGS[energyMode]

  const loadHistory = useCallback(async () => {
    const { data } = await supabase
      .from('capturas')
      .select('id,texto,tipo,processada,created_at')
      .order('created_at', { ascending: false })
      .limit(10)
    if (data) setHistory(data)
  }, [])

  useEffect(() => { loadHistory() }, [loadHistory])

  async function handleProcess() {
    if (!text.trim()) return
    setProcessing(true)
    setResult(null)
    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, energyMode }),
      })
      const data = await res.json()
      setResult(data)

      await supabase.from('capturas').insert({
        texto: text,
        tipo: data.tasks.length > 0 ? 'tarefa' : 'ideia',
        processada: true,
      })
      loadHistory()
    } catch {
      toast.error('Erro ao processar. Tente novamente.')
    } finally {
      setProcessing(false)
    }
  }

  async function handleSaveAll() {
    if (!result) return
    setSaving(true)
    try {
      const categoria = (result.categories[0] as string) || 'pessoal'

      const taskInserts = result.tasks.map((titulo) => ({
        titulo,
        status: 'pendente',
        prioridade: 'media',
        energia: [energyMode],
        categoria,
        recorrente: false,
      }))

      const ideaInserts = result.ideas.map((titulo) => ({
        titulo,
        categoria: result.categories[0] || 'criatividade',
        plataformas: [],
        status: 'bruta',
        tags: [],
      }))

      const ops: Promise<unknown>[] = []
      if (taskInserts.length > 0) ops.push(supabase.from('tarefas').insert(taskInserts))
      if (ideaInserts.length > 0) ops.push(supabase.from('ideias').insert(ideaInserts))
      await Promise.all(ops)

      toast.success(`${result.tasks.length} tarefa(s) e ${result.ideas.length} ideia(s) salvas!`)
      setText('')
      setResult(null)
    } catch {
      toast.error('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Captura Mental</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Jogue tudo aqui. Pensamentos bagunçados, ideias soltas, to-dos. A IA organiza.
          </p>
        </div>

        {/* Main capture */}
        <Card variant="elevated" className="overflow-hidden">
          <div className="h-1" style={{ backgroundColor: energy.accent }} />
          <CardBody className="pt-5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{energy.emoji}</span>
              <span className="text-xs text-[var(--text-secondary)]">
                Modo {energy.label} — {energy.description}
              </span>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Pode começar de qualquer forma...\n\n"Preciso criar o roteiro do reel de branding, mas antes disso tenho que entregar os posts da academia essa semana. Ah, tive uma ideia incrível sobre análise de marcas no TikTok..."`}
              className="w-full min-h-[200px] text-sm text-[var(--text-primary)] leading-relaxed resize-none bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-4 focus:border-[var(--border-accent)] transition-colors"
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleProcess()
              }}
            />

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" disabled className="opacity-40" title="Em breve">
                  <Mic size={14} />
                  Áudio (em breve)
                </Button>
              </div>
              <div className="flex gap-2">
                <span className="text-[11px] text-[var(--text-muted)] self-center">⌘ + Enter</span>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleProcess}
                  loading={processing}
                  disabled={!text.trim()}
                >
                  <Send size={14} />
                  Processar com IA
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* AI Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card variant="accent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-[var(--text-accent)]" />
                      <h2 className="text-sm font-semibold text-[var(--text-primary)]">Resultado da IA</h2>
                    </div>
                    <Button variant="primary" size="sm" onClick={handleSaveAll} loading={saving}>
                      <CheckCheck size={13} />
                      Salvar tudo
                    </Button>
                  </div>
                  {result.summary && (
                    <p className="text-xs text-[var(--text-secondary)] mt-2 italic">"{result.summary}"</p>
                  )}
                </CardHeader>
                <CardBody className="pt-0 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1">
                      <span className="text-[var(--text-accent)]">⚡</span>
                      {result.tasks.length} tarefa(s)
                    </p>
                    {result.tasks.length === 0 ? (
                      <p className="text-xs text-[var(--text-muted)]">Nenhuma tarefa detectada</p>
                    ) : (
                      <ul className="space-y-2">
                        {result.tasks.map((task, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-[var(--text-accent)] text-xs mt-0.5 flex-shrink-0">→</span>
                            <span className="text-[var(--text-primary)] leading-snug">{task}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1">
                      <span className="text-yellow-400">💡</span>
                      {result.ideas.length} ideia(s)
                    </p>
                    {result.ideas.length === 0 ? (
                      <p className="text-xs text-[var(--text-muted)]">Nenhuma ideia detectada</p>
                    ) : (
                      <ul className="space-y-2">
                        {result.ideas.map((idea, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-yellow-400 text-xs mt-0.5 flex-shrink-0">→</span>
                            <span className="text-[var(--text-primary)] leading-snug">{idea}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        {history.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Archive size={14} className="text-[var(--text-muted)]" />
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                Histórico de capturas
              </p>
            </div>
            <div className="space-y-2">
              {history.map((capture) => (
                <Card key={capture.id} hoverable>
                  <CardBody className="py-3 px-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--text-primary)] line-clamp-2 leading-snug">
                          {capture.texto}
                        </p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant={capture.tipo === 'tarefa' ? 'purple' : 'yellow'}>
                            {capture.tipo}
                          </Badge>
                          {capture.processada && (
                            <Badge variant="default">processada</Badge>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)] flex-shrink-0 mt-0.5">
                        {timeAgo(capture.created_at)}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
