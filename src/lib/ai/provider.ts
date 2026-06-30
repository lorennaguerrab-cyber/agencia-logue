/* ============================================================
   Provedor de IA — chamada ao modelo com fallback gracioso.
   Usa Claude (Anthropic) quando ANTHROPIC_API_KEY existe.
   Sem chave, devolve `null` e o caller usa um gerador-modelo
   determinístico — assim a ferramenta é demonstrável mesmo
   sem credenciais (importante para o MVP).
   ============================================================ */

export interface LlmResult {
  text: string
  source: 'claude' | 'fallback'
}

const MODEL = 'claude-opus-4-8'

export async function runLlm(params: {
  system: string
  user: string
  maxTokens?: number
}): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return null

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || MODEL,
        max_tokens: params.maxTokens ?? 1500,
        system: params.system,
        messages: [{ role: 'user', content: params.user }],
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const text = data?.content?.[0]?.text
    return typeof text === 'string' && text.trim() ? text : null
  } catch {
    return null
  }
}

/** Tenta extrair JSON de uma resposta do modelo (com ou sem cercas). */
export function extractJson<T>(text: string): T | null {
  try {
    const clean = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim()
    const start = clean.indexOf('{')
    const startArr = clean.indexOf('[')
    const from =
      start === -1 ? startArr : startArr === -1 ? start : Math.min(start, startArr)
    if (from === -1) return JSON.parse(clean) as T
    return JSON.parse(clean.slice(from)) as T
  } catch {
    return null
  }
}
