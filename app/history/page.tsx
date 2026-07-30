import { DashboardShell } from '@/components/dashboard-shell'
import { HistoryView } from '@/components/history-view'

export default function HistoryPage() {
  return (
    <DashboardShell
      title="Activity History"
      subtitle="Search, filter, and review every recorded event"
    >
      <HistoryView />
    </DashboardShell>
  )
}
