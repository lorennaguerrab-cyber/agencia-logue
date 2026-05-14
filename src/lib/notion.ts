import { Client } from '@notionhq/client'

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export const NOTION_DB_IDS = {
  bancodeideias: process.env.NOTION_BANCO_IDEIAS_DB || '4e630aa6-6822-83f0-b8bf-87a51a1925f2',
  calendario: process.env.NOTION_CALENDARIO_DB || '35230aa6-6822-8086-91aa-000b2b90173c',
  projetos: process.env.NOTION_PROJETOS_DB || '28b30aa6-6822-8053-ac2c-eaa1b0228dc8',
}

export async function syncIdeaToNotion(idea: {
  titulo: string
  plataforma?: string
  descricao?: string
}) {
  if (!process.env.NOTION_API_KEY) return null
  try {
    const page = await notion.pages.create({
      parent: { database_id: NOTION_DB_IDS.bancodeideias },
      properties: {
        Ideia: { title: [{ text: { content: idea.titulo } }] },
        ...(idea.plataforma && {
          Plataforma: { select: { name: idea.plataforma } },
        }),
      },
    })
    return page.id
  } catch {
    return null
  }
}

export async function syncContentToNotion(content: {
  titulo: string
  tipo: string
  plataformas: string[]
  status: string
  data_publicacao?: string
}) {
  if (!process.env.NOTION_API_KEY) return null
  try {
    const statusMap: Record<string, string> = {
      ideia: 'Ideia',
      rascunho: 'Em rascunho',
      filmando: 'Em filmagem',
      editando: 'Em edição',
      revisao: 'Pronto para revisão',
      agendado: 'Agendado',
      publicado: 'Publicado',
    }
    const page = await notion.pages.create({
      parent: { database_id: NOTION_DB_IDS.calendario },
      properties: {
        'Nome do conteúdo': {
          title: [{ text: { content: content.titulo } }],
        },
        Status: { status: { name: statusMap[content.status] || 'Ideia' } },
        Plataforma: {
          multi_select: content.plataformas.map((p) => ({ name: p })),
        },
        ...(content.data_publicacao && {
          'Data de publicação': {
            date: { start: content.data_publicacao },
          },
        }),
      },
    })
    return page.id
  } catch {
    return null
  }
}
