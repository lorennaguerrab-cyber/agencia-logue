import { ClientShell } from '@/components/client/ClientShell'

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return <ClientShell>{children}</ClientShell>
}
