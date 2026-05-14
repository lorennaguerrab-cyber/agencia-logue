import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { content, energyMode } = await req.json()

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Conteúdo vazio' }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY

  if (!apiKey) {
    return NextResponse.json(fallbackProcess(content), { status: 200 })
  }

  try {
    const prompt = buildPrompt(content, energyMode)

    if (process.env.ANTHROPIC_API_KEY) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || ''
      return NextResponse.json(parseAIResponse(text, content))
    }

    if (process.env.OPENAI_API_KEY) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024,
        }),
      })
      const data = await res.json()
      const text = data.choices?.[0]?.message?.content || ''
      return NextResponse.json(parseAIResponse(text, content))
    }
  } catch {
    return NextResponse.json(fallbackProcess(content))
  }

  return NextResponse.json(fallbackProcess(content))
}

function buildPrompt(content: string, energyMode: string) {
  return `Você é um assistente de organização cognitiva para uma criadora de conteúdo com TDAH e TEA nível 1.
Sua função é analisar dumps mentais e extrair informações estruturadas.

ENERGIA ATUAL: ${energyMode}

TEXTO DO DUMP:
"${content}"

Analise e retorne SOMENTE um JSON válido neste formato exato:
{
  "tasks": ["tarefa 1", "tarefa 2"],
  "ideas": ["ideia 1", "ideia 2"],
  "categories": ["categoria1"],
  "summary": "resumo em 1 frase do que foi capturado"
}

Regras:
- tasks: ações concretas e executáveis detectadas no texto
- ideas: conceitos criativos, insights, oportunidades de conteúdo
- categories: uma ou mais de [branding, mulheres_incriveis, livros_infantis, maternidade, lifestyle, criatividade, inteligencia_artificial, analise_marcas, design, marketing, rotina, blogosfera, bastidores]
- summary: frase curta e encorajadora sobre o que foi capturado
- Se o modo de energia é "cansada", priorize apenas 1-2 tarefas pequenas
- Responda APENAS com o JSON, sem markdown ou explicações`
}

function parseAIResponse(text: string, original: string) {
  try {
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(clean)
    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      ideas: Array.isArray(parsed.ideas) ? parsed.ideas : [],
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      summary: parsed.summary || 'Captura salva com sucesso.',
    }
  } catch {
    return fallbackProcess(original)
  }
}

function fallbackProcess(content: string) {
  const lines = content.split(/[.\n!?]/).map((l) => l.trim()).filter((l) => l.length > 10)
  const tasks = lines.filter((l) =>
    /^(fazer|criar|escrever|gravar|editar|enviar|responder|revisar|agendar|postar|ligar|contratar|comprar)/i.test(l)
  )
  const ideas = lines.filter((l) =>
    /^(ideia|e se|pensei|seria|poderia|quero|e se eu|tenho uma)/i.test(l)
  )

  return {
    tasks: tasks.slice(0, 5),
    ideas: ideas.slice(0, 5),
    categories: ['criatividade'],
    summary: 'Captura salva. Revise e organize quando quiser.',
  }
}
