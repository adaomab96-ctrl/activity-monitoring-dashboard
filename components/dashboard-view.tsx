'use client'

import { useMemo } from 'react'
import {
  Activity,
  CalendarClock,
  Radio,
  Sparkles,
  Clock,
  Pause,
  Play,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { useEvents, BACKEND_EVENT_META } from '@/hooks/useEvents'
import { StatCard } from '@/components/stat-card'
import { Button } from '@/components/ui/button'
import { relativeTime } from '@/lib/events'
import { cn } from '@/lib/utils'
import type { ApiEvent } from '@/lib/types'
import {
  DoorOpen,
  LogIn,
  ShieldAlert,
  Settings2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import { formatTime } from '@/lib/events'

// Icon map for backend event types
const TYPE_ICON: Record<string, LucideIcon> = {
  ENTRY:  DoorOpen,
  LOGIN:  LogIn,
  ALERT:  ShieldAlert,
  SYSTEM: Settings2,
}

// Individual live-feed card for ApiEvent (backend shape)
function LiveCard({ event, isNew }: { event: ApiEvent; isNew: boolean }) {
  const meta = BACKEND_EVENT_META[event.type]
  const Icon = TYPE_ICON[event.type] ?? Activity

  const ICON_ACCENT: Record<string, string> = {
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/15 text-warning-foreground',
    error:   'bg-destructive/10 text-destructive',
    info:    'bg-primary/10 text-primary',
  }

  return (
    <div
      className={cn(
        'group flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/40',
        isNew && 'animate-in fade-in slide-in-from-top-2 duration-500',
      )}
    >
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-lg',
          ICON_ACCENT[meta.status],
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm font-semibold text-card-foreground">
            {meta.category}
          </p>
          <StatusBadge status={meta.status} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{event.message}</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono">{formatTime(event.createdAt)}</span>
          <span aria-hidden="true">·</span>
          <span>#{event.id}</span>
          <span aria-hidden="true">·</span>
          <span>{relativeTime(event.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}

export function DashboardView() {
  const { events, newestId, loading, error, simulating, simulate } = useEvents()

  // Pause/resume just controls visual indicator; Socket feed always runs
  const live = true

  const stats = useMemo(() => {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const today = events.filter(
      (e) => new Date(e.createdAt) >= startOfDay,
    ).length
    const latest = events[0]
    return { total: events.length, today, latest }
  }, [events])

  return (
    <div className="space-y-6">
      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stat cards */}
      <section
        aria-label="Key statistics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Total Events"
          value={loading ? '—' : stats.total.toLocaleString()}
          icon={Activity}
          hint="all time"
          accent="primary"
        />
        <StatCard
          label="Events Today"
          value={loading ? '—' : stats.today.toLocaleString()}
          icon={CalendarClock}
          hint="since midnight"
          accent="success"
        />
        <StatCard
          label="Active Monitoring"
          value="Live"
          icon={Radio}
          hint="WebSocket stream active"
          accent="primary"
        />
        <StatCard
          label="Latest Event"
          value={
            loading
              ? '—'
              : stats.latest
              ? BACKEND_EVENT_META[stats.latest.type]?.category ?? stats.latest.type
              : '—'
          }
          icon={Clock}
          hint={stats.latest ? relativeTime(stats.latest.createdAt) : ''}
          accent="warning"
        />
      </section>

      {/* Live feed */}
      <section
        aria-label="Live activity feed"
        className="rounded-2xl border border-border bg-card"
      >
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex size-2.5">
              {live && (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
              )}
              <span className="relative inline-flex size-2.5 rounded-full bg-success" />
            </span>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-card-foreground">
                Live Activity Feed
              </h2>
              <p className="text-xs text-muted-foreground">
                Streaming real-time events via WebSocket
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={simulate}
              disabled={simulating}
              className="h-9 px-4"
              aria-label="Simulate a new event"
            >
              {simulating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Simulating…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Simulate Event
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="max-h-[600px] space-y-3 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Connecting to activity stream…
            </div>
          ) : events.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No events yet. Click <strong>Simulate Event</strong> to generate one.
            </div>
          ) : (
            events.map((event) => (
              <LiveCard
                key={event.id}
                event={event}
                isNew={event.id === newestId}
              />
            ))
          )}
        </div>
      </section>
    </div>
  )
}
