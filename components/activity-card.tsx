import { cn } from '@/lib/utils'
import {
  EVENT_META,
  formatTime,
  relativeTime,
  type ActivityEvent,
} from '@/lib/events'
import { StatusBadge } from '@/components/status-badge'

const ICON_ACCENT: Record<ActivityEvent['status'], string> = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-warning-foreground',
  error: 'bg-destructive/10 text-destructive',
  info: 'bg-primary/10 text-primary',
}

export function ActivityCard({
  event,
  isNew,
}: {
  event: ActivityEvent
  isNew?: boolean
}) {
  const Icon = EVENT_META[event.type].icon

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
          ICON_ACCENT[event.status],
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-sm font-semibold text-card-foreground">
            {event.category}
          </p>
          <StatusBadge status={event.status} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{event.message}</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono">{formatTime(event.timestamp)}</span>
          <span aria-hidden="true">·</span>
          <span>{event.actor}</span>
          <span aria-hidden="true">·</span>
          <span>{relativeTime(event.timestamp)}</span>
        </div>
      </div>
    </div>
  )
}
