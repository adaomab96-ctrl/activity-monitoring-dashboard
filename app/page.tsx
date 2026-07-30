import { DashboardShell } from '@/components/dashboard-shell'
import { DashboardView } from '@/components/dashboard-view'

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Activity Dashboard"
      subtitle="Real-time monitoring across all connected systems"
    >
      <DashboardView />
    </DashboardShell>
  )
}
