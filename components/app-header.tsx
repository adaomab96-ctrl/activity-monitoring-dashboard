'use client'

import { Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NotificationDropdown } from '@/components/notification-dropdown'

export function AppHeader({
  title,
  subtitle,
  onOpenSidebar,
}: {
  title: string
  subtitle?: string
  onOpenSidebar: () => void
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open navigation menu"
        onClick={onOpenSidebar}
      >
        <Menu className="size-5" />
      </Button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {subtitle}
          </p>
        )}
      </div>

      <div className="relative hidden md:block">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search events..."
          aria-label="Search events"
          className="h-9 w-56 rounded-lg border border-input bg-card pr-3 pl-9 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>

      <NotificationDropdown />

      <div className="flex items-center gap-2.5 border-l border-border pl-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          AR
        </span>
        <div className="hidden text-left leading-tight sm:block">
          <p className="text-sm font-medium text-foreground">Avery Rowe</p>
          <p className="text-xs text-muted-foreground">Operations Lead</p>
        </div>
      </div>
    </header>
  )
}
