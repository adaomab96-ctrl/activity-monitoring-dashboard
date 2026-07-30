import { cn } from '@/lib/utils'
import { STATUS_LABEL, type EventStatus } from '@/lib/events'

const STATUS_STYLES: Record<EventStatus, string> = {
  success: 'bg-success/10 text-success ring-success/20',
  warning: 'bg-warning/15 text-warning-foreground ring-warning/30',
  error: 'bg-destructive/10 text-destructive ring-destructive/20',
  info: 'bg-primary/10 text-primary ring-primary/20',
}

export function StatusBadge({
  status,
  className,
}: {
  status: EventStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        STATUS_STYLES[status],
        className,
      )}
    >
      <span
        className={cn('size-1.5 rounded-full', {
          'bg-success': status === 'success',
          'bg-warning': status === 'warning',
          'bg-destructive': status === 'error',
          'bg-primary': status === 'info',
        })}
        aria-hidden="true"
      />
      {STATUS_LABEL[status]}
    </span>
  )
}
