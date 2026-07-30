import { DashboardShell } from '@/components/dashboard-shell'
import { SupportView } from '@/components/support-view'

export default function SupportPage() {
  return (
    <DashboardShell
      title="Support"
      subtitle="Get help and find answers to common questions"
    >
      <SupportView />
    </DashboardShell>
  )
}
