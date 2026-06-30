import { NextResponse } from 'next/server'
import { transformarBriefing, type BriefingInput } from '@/lib/ai/tools'

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<BriefingInput>
  if (!body.demanda?.trim()) {
    return NextResponse.json({ error: 'Descreva a demanda do cliente.' }, { status: 400 })
  }
  const result = await transformarBriefing(body as BriefingInput)
  return NextResponse.json(result)
}
