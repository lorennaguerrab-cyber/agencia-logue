'use client'

import { useState, useRef, useEffect } from 'react'
import { useLorennStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { X, Zap, Send, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

export function QuickCapture() {
  const { captureOpen, setCaptureOpen, addCapture, addTask, addIdea, energyMode } = useLorennStore()
  const [text, setText] = useState('')
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<{
    tasks: string[]
    ideas: string[]
    summary: string
  } | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (captureOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [captureOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCaptureOpen(!captureOpen)
      }
      if (e.key === 'Escape' && captureOpen) {
        setCaptureOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [captureOpen, setCaptureOpen])

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

      const capture = {
        id: crypto.randomUUID(),
        conteudo_raw: text,
        conteudo_processado: data.summary,
        tipo: 'texto' as const,
        tarefas_extraidas: data.tasks || [],
        ideias_extraidas: data.ideas || [],
        categorias_detectadas: data.categories || [],
        processada: true,
        created_at: new Date().toISOString(),
      }
      addCapture(capture)
    } catch {
      setResult({
        tasks: [],
        ideas: [],
        summary: text,
      })
    } finally {
      setProcessing(false)
    }
  }

  function handleSaveAll() {
    if (!result) return

    result.tasks.forEach((taskText) => {
      addTask({
        id: crypto.randomUUID(),
        titulo: taskText,
        status: 'pendente',
        prioridade: 'media',
        energia_necessaria: [energyMode],
        microetapas: [],
        categoria: 'pessoal',
        recorrente: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    })

    result.ideas.forEach((ideaText) => {
      addIdea({
        id: crypto.randomUUID(),
        titulo: ideaText,
        categoria: 'criatividade',
        plataformas: [],
        status: 'bruta',
        tags: [],
        conexoes: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    })

    toast.success(`${result.tasks.length} tarefa(s) e ${result.ideas.length} ideia(s) salvas`)
    setText('')
    setResult(null)
    setCaptureOpen(false)
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setCaptureOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'w-13 h-13 rounded-2xl',
          'bg-gradient-to-br from-violet-500 to-fuchsia-500',
          'shadow-lg shadow-purple-900/40',
          'flex items-center justify-center',
          'text-white transition-all duration-200',
          'hover:scale-105 hover:shadow-xl hover:shadow-purple-900/50',
          'active:scale-95',
          captureOpen && 'opacity-0 pointer-events-none'
        )}
        title="Captura Rápida (⌘K)"
      >
        <Zap size={22} />
      </button>

      {/* Panel */}
      <AnimatePresence>
        {captureOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setCaptureOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed bottom-6 right-6 z-50 w-full max-w-lg"
            >
              <div className="glass rounded-2xl border border-[var(--border-accent)] overflow-hidden shadow-2xl shadow-purple-950/50">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-[var(--text-accent)]" />
                    <span className="text-sm font-semibold text-[var(--text-primary)]">Captura Mental</span>
                    <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-elevated)] px-2 py-0.5 rounded-full border border-[var(--border)]">⌘K</span>
                  </div>
                  <button
                    onClick={() => setCaptureOpen(false)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-lg hover:bg-[var(--bg-hover)]"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Textarea */}
                <div className="p-4">
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Joga tudo aqui. Pensamentos, ideias, tarefas, qualquer coisa... A IA organiza pra você."
                    className="w-full min-h-[120px] max-h-[300px] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none leading-relaxed"
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleProcess()
                    }}
                  />
                </div>

                {/* Result */}
                {result && (
                  <div className="px-4 pb-4 space-y-3">
                    {result.tasks.length > 0 && (
                      <div className="bg-[var(--bg-elevated)] rounded-xl p-3 border border-[var(--border)]">
                        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2">
                          ⚡ {result.tasks.length} tarefa(s) detectada(s)
                        </p>
                        <ul className="space-y-1">
                          {result.tasks.map((task, i) => (
                            <li key={i} className="text-sm text-[var(--text-primary)] flex items-start gap-2">
                              <span className="text-[var(--text-accent)] mt-0.5">→</span>
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.ideas.length > 0 && (
                      <div className="bg-[var(--bg-elevated)] rounded-xl p-3 border border-[var(--border)]">
                        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2">
                          💡 {result.ideas.length} ideia(s) detectada(s)
                        </p>
                        <ul className="space-y-1">
                          {result.ideas.map((idea, i) => (
                            <li key={i} className="text-sm text-[var(--text-primary)] flex items-start gap-2">
                              <span className="text-yellow-400 mt-0.5">→</span>
                              {idea}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="px-4 pb-4 flex items-center gap-2 justify-between">
                  <p className="text-[11px] text-[var(--text-muted)]">⌘ + Enter para processar</p>
                  <div className="flex gap-2">
                    {result && (
                      <Button variant="primary" size="sm" onClick={handleSaveAll}>
                        Salvar tudo
                      </Button>
                    )}
                    <Button
                      variant={result ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={handleProcess}
                      loading={processing}
                      disabled={!text.trim()}
                    >
                      {processing ? (
                        <>Processando...</>
                      ) : (
                        <>
                          <Send size={13} />
                          Processar com IA
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
