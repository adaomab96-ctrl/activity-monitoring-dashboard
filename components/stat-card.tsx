import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StatCardProps {
  label: string
  value: string
  hint?: string
  icon: LucideIcon
  trend?: {
    value: string
    positive?: boolean
  }
  accent?: 'primary' | 'success' | 'warning'
}

const ACCENTS: Record<NonNullable<StatCardProps['accent']>, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-warning-foreground',
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  accent = 'primary',
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-card-foreground">
            {value}
          </p>
        </div>
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-lg',
            ACCENTS[accent],
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        {trend && (
          <span
            className={cn(
              'font-medium',
              trend.positive ? 'text-success' : 'text-muted-foreground',
            )}
          >
            {trend.value}
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  )
}
