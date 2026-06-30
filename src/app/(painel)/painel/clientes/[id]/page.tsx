import ClienteDetail from './ClienteDetail'

export default async function ClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ClienteDetail id={id} />
}
