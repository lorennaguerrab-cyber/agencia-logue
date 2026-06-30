import { NextResponse } from 'next/server'
import { gerarIdeias, type IdeiasInput } from '@/lib/ai/tools'

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<IdeiasInput>
  if (!body.nicho?.trim() || !body.objetivo?.trim()) {
    return NextResponse.json({ error: 'Informe ao menos nicho e objetivo.' }, { status: 400 })
  }
  const result = await gerarIdeias(body as IdeiasInput)
  return NextResponse.json(result)
}
