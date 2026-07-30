import { DashboardShell } from '@/components/dashboard-shell'
import { NotificationsPanel } from '@/components/notifications-panel'

export default function NotificationsPage() {
  return (
    <DashboardShell
      title="Notifications"
      subtitle="Alerts, delivery reports, and system messages"
    >
      <NotificationsPanel />
    </DashboardShell>
  )
}
