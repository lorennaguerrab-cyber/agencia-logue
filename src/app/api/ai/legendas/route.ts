import { NextResponse } from 'next/server'
import { gerarLegenda, type LegendaInput } from '@/lib/ai/tools'

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<LegendaInput>
  if (!body.tema?.trim() || !body.objetivo?.trim()) {
    return NextResponse.json({ error: 'Informe ao menos tema e objetivo.' }, { status: 400 })
  }
  const result = await gerarLegenda({
    tema: body.tema,
    objetivo: body.objetivo,
    formato: body.formato || 'Post',
    tom: body.tom,
  })
  return NextResponse.json(result)
}
