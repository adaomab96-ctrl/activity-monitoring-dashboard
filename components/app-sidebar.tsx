'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Activity,
  LayoutDashboard,
  History,
  Bell,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Activity History', href: '/history', icon: History },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Monitoring', href: '/monitoring', icon: ShieldCheck },
]

const SECONDARY = [
  // { label: 'Settings', href: '/settings', icon: Settings },
  // { label: 'Support', href: '/support', icon: LifeBuoy },
]

export function SidebarContent({
  onNavigate,
}: {
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  const renderItem = (item: (typeof NAV)[number]) => {
    const active =
      item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
    const Icon = item.icon
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          active
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
        )}
      >
        <Icon className="size-4.5 shrink-0" aria-hidden="true" />
        {item.label}
      </Link>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-6">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Activity className="size-5" aria-hidden="true" />
        </span>
        <span className="text-base font-semibold tracking-tight text-sidebar-foreground">
          Pulse
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        <p className="px-3 pb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Overview
        </p>
        {NAV.map(renderItem)}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-success/15 text-success">
            <span className="size-2 animate-pulse rounded-full bg-success" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground">
              Systems online
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Real-time stream active
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
      <div className="sticky top-0 h-screen">
        <SidebarContent />
      </div>
    </aside>
  )
}
