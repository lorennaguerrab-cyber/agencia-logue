'use client'

import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, Plus, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const DAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

type Evento = {
  id: string
  titulo: string
  data: string
  hora_inicio?: string
  cor: string
  tipo: string
}

const FALLBACK_EVENTS: Evento[] = [
  { id: 'f1', titulo: 'Sabrina Sanchez — Óptica',  data: '', hora_inicio: '10:00', cor: '#FF78B0', tipo: 'influencer' },
  { id: 'f2', titulo: 'Waltencir — Óptica',         data: '', hora_inicio: '10:00', cor: '#A89AC9', tipo: 'influencer' },
  { id: 'f3', titulo: 'Thais Lage — Óptica',        data: '', hora_inicio: '10:00', cor: '#E89B4C', tipo: 'influencer' },
]

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function getFirstDay(y: number, m: number) { return new Date(y, m, 1).getDay() }

export default function CalendarioPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [events, setEvents] = useState<Evento[]>([])
  const [selectedDay, setSelectedDay] = useState<number | null>(now.getDate())
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newHora, setNewHora] = useState('')
  const [saving, setSaving] = useState(false)

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()
  const today = now.getDate()

  useEffect(() => {
    const from = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const to   = `${year}-${String(month + 1).padStart(2, '0')}-${String(getDaysInMonth(year, month)).padStart(2, '0')}`
    supabase
      .from('eventos')
      .select('id, titulo, data, hora_inicio, cor, tipo')
      .gte('data', from)
      .lte('data', to)
      .order('data')
      .then(({ data }) => setEvents(data && data.length > 0 ? data : []))
  }, [year, month])

  // Eventos do dia selecionado
  const dayStr = selectedDay
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : ''
  const dayEvents = events.filter((e) => e.data === dayStr)

  // Dias com eventos (para marcar no calendário)
  const eventDays = new Set(events.map((e) => parseInt(e.data.split('-')[2])))

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDay(year, month)
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null as null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  function prev() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelectedDay(null)
  }
  function next() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDay(null)
  }

  async function addEvent() {
    if (!newTitle.trim() || !selectedDay) return
    setSaving(true)
    const data = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    const { data: inserted } = await supabase
      .from('eventos')
      .insert({ titulo: newTitle, data, hora_inicio: newHora || null, cor: '#FF78B0', tipo: 'pessoal' })
      .select()
      .single()
    if (inserted) setEvents(prev => [...prev, inserted])
    setNewTitle(''); setNewHora(''); setShowAdd(false); setSaving(false)
  }

  const TYPE_LABELS: Record<string, string> = {
    pessoal: 'Pessoal', cliente: 'Cliente', influencer: 'Influencer',
    recorrente: 'Recorrente', lembrete: 'Lembrete',
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-syne)' }}>Agenda</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Seus eventos e calendário de influenciadores</p>
        </div>
        <a
          href="https://calendar.google.com"
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-[15px] border border-[var(--border)] bg-white hover:border-[var(--pink-soft)] transition-colors text-[var(--text-secondary)]"
        >
          <ExternalLink size={12} /> Abrir Google Agenda
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Calendário */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <button onClick={prev} className="p-1.5 rounded-[12px] hover:bg-[var(--offwhite)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <h2 className="text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-syne)' }}>
                  {MONTHS[month]} {year}
                </h2>
                <button onClick={next} className="p-1.5 rounded-[12px] hover:bg-[var(--offwhite)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </CardHeader>
            <CardBody>
              {/* Cabeçalho dias */}
              <div className="grid grid-cols-7 mb-2">
                {DAYS_SHORT.map((d) => (
                  <div key={d} className="text-center text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider py-1">{d}</div>
                ))}
              </div>
              {/* Grid */}
              <div className="grid grid-cols-7 gap-0.5">
                {cells.map((day, i) => {
                  if (!day) return <div key={`e-${i}`} />
                  const isToday = isCurrentMonth && day === today
                  const isSelected = day === selectedDay
                  const hasEvent = eventDays.has(day)
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                      className="relative aspect-square flex flex-col items-center justify-center rounded-[12px] text-sm font-medium transition-all"
                      style={{
                        background: isSelected ? 'var(--pink)' : isToday ? 'var(--pink-tint)' : 'transparent',
                        color: isSelected ? 'white' : isToday ? 'var(--pink-deep)' : 'var(--text-primary)',
                        fontWeight: isToday || isSelected ? 700 : 500,
                      }}
                    >
                      {day}
                      {hasEvent && (
                        <span className="absolute bottom-1 w-1 h-1 rounded-full" style={{ background: isSelected ? 'white' : 'var(--pink)' }} />
                      )}
                    </button>
                  )
                })}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Painel lateral */}
        <div className="space-y-4">

          {/* Eventos do dia */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                  {selectedDay
                    ? `${selectedDay} de ${MONTHS[month]}`
                    : 'Selecione um dia'}
                </h3>
                {selectedDay && (
                  <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="p-1.5 rounded-[12px] transition-colors hover:bg-[var(--pink-tint)]"
                    style={{ color: 'var(--pink-deep)' }}
                  >
                    <Plus size={15} />
                  </button>
                )}
              </div>
            </CardHeader>
            <CardBody className="pt-0 space-y-2">
              {showAdd && (
                <div className="space-y-2 p-3 bg-[var(--pink-tint)] rounded-[15px] border border-[var(--pink-soft)]">
                  <input
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="Título do evento"
                    className="w-full text-sm bg-white border border-[var(--border)] rounded-[12px] px-3 py-2 outline-none focus:border-[var(--pink)]"
                  />
                  <input
                    type="time"
                    value={newHora}
                    onChange={e => setNewHora(e.target.value)}
                    className="w-full text-sm bg-white border border-[var(--border)] rounded-[12px] px-3 py-2 outline-none focus:border-[var(--pink)]"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" onClick={addEvent} disabled={saving || !newTitle.trim()}>
                      {saving ? 'Salvando…' : 'Salvar'}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancelar</Button>
                  </div>
                </div>
              )}

              {dayEvents.length === 0 && !showAdd && (
                <p className="text-xs text-[var(--text-muted)] py-3 text-center">
                  {selectedDay ? 'Nenhum evento neste dia.' : 'Clique em um dia para ver os eventos.'}
                </p>
              )}

              {dayEvents.map((e) => (
                <div key={e.id} className="flex items-start gap-2.5 p-2.5 rounded-[12px] bg-[var(--bg-elevated)] border border-[var(--border)]">
                  <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ background: e.cor }} />
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{e.titulo}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {e.hora_inicio && <span className="text-[10px] text-[var(--text-muted)]">{e.hora_inicio.slice(0, 5)}</span>}
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: `${e.cor}20`, color: e.cor }}>
                        {TYPE_LABELS[e.tipo] || e.tipo}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Recorrentes fixos */}
          <Card>
            <CardHeader>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Influenciadores Óptica</h3>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Todo semana — fixos</p>
            </CardHeader>
            <CardBody className="pt-0 space-y-2">
              {[
                { dia: 'Terça',  nome: 'Sabrina Sanchez', cor: '#FF78B0' },
                { dia: 'Quarta', nome: 'Waltencir',        cor: '#A89AC9' },
                { dia: 'Quinta', nome: 'Thais Lage',       cor: '#E89B4C' },
              ].map((inf) => (
                <div key={inf.nome} className="flex items-center gap-2.5 p-2.5 rounded-[12px] bg-[var(--bg-elevated)] border border-[var(--border)]">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: inf.cor }} />
                  <div>
                    <p className="text-xs font-medium text-[var(--text-primary)]">{inf.nome}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{inf.dia}</p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

        </div>
      </div>
    </div>
  )
}
