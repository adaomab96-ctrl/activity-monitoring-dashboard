import { DashboardShell } from '@/components/dashboard-shell'
import { SettingsView } from '@/components/settings-view'

export default function SettingsPage() {
  return (
    <DashboardShell
      title="Settings"
      subtitle="Manage your profile and notification preferences"
    >
      <SettingsView />
    </DashboardShell>
  )
}
