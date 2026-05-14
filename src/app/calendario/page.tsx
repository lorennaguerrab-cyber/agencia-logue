'use client'

import { useState } from 'react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { CalendarDays, ExternalLink, Clock, Star } from 'lucide-react'

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

const FIXED_EVENTS = [
  { dia: 'Terça', titulo: 'Sabrina Sanchez — Óptica Giordano', tipo: 'influencer', cor: '#EC4899' },
  { dia: 'Quarta', titulo: 'Waltencir — Óptica Giordano', tipo: 'influencer', cor: '#8B5CF6' },
  { dia: 'Quinta', titulo: 'Thais Lage — Óptica Giordano', tipo: 'influencer', cor: '#F59E0B' },
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function CalendarioPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const today = now.getDate()
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  )

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Calendário</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Sua agenda e compromissos fixos</p>
        </div>
        <a
          href="https://calendar.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium border border-indigo-200 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <ExternalLink size={12} />
          Abrir Google Agenda
        </a>
      </div>

      {/* Calendar grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              ‹
            </button>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              ›
            </button>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-[var(--text-muted)] uppercase py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => (
              <div
                key={i}
                className={`aspect-square flex items-center justify-center rounded-xl text-sm transition-all ${
                  day === null ? '' :
                  isCurrentMonth && day === today
                    ? 'bg-indigo-500 text-white font-bold shadow-[0_2px_8px_rgba(99,102,241,0.3)]'
                    : 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] cursor-pointer'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Compromissos fixos */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Star size={14} className="text-amber-500" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Compromissos fixos</h2>
          </div>
        </CardHeader>
        <CardBody className="pt-0 space-y-2">
          {FIXED_EVENTS.map((e) => (
            <div key={e.titulo} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[var(--border)] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: e.cor }} />
              <div className="flex-1">
                <p className="text-xs font-semibold text-[var(--text-primary)]">{e.titulo}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{e.tipo === 'influencer' ? 'Influencer na loja' : e.tipo}</p>
              </div>
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full border" style={{ backgroundColor: `${e.cor}10`, borderColor: `${e.cor}20`, color: e.cor }}>
                {e.dia}
              </span>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Nota integração */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3">
        <CalendarDays size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-indigo-700">Integração com Google Agenda</p>
          <p className="text-xs text-indigo-600 mt-1 leading-relaxed">
            Para ver seus eventos do Google Agenda aqui, será necessário conectar sua conta Google. Clique em "Abrir Google Agenda" acima para gerenciar seus compromissos diretamente lá por enquanto.
          </p>
        </div>
      </div>
    </div>
  )
}
