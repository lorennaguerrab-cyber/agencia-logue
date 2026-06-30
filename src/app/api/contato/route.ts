import { NextResponse } from 'next/server'

/**
 * Recebe pedidos de orçamento do site.
 * MVP: valida e registra (log). Em produção, grava em `leads`
 * no Supabase e dispara e-mail para a equipe (ver schema.sql).
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body?.nome || !body?.email || !body?.mensagem) {
    return NextResponse.json({ error: 'Preencha nome, e-mail e mensagem.' }, { status: 400 })
  }
  // eslint-disable-next-line no-console
  console.log('[lead] novo pedido de orçamento:', {
    nome: body.nome, email: body.email, marca: body.marca, servico: body.servico,
  })
  return NextResponse.json({ ok: true })
}
