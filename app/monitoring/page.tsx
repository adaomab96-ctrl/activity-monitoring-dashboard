import { DashboardShell } from '@/components/dashboard-shell'
import { MonitoringView } from '@/components/monitoring-view'

export default function MonitoringPage() {
  return (
    <DashboardShell
      title="Monitoring"
      subtitle="Live health of your monitoring infrastructure"
    >
      <MonitoringView />
    </DashboardShell>
  )
}
