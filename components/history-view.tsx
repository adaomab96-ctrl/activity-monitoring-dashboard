'use client'

import { useEffect, useMemo, useState } from 'react'
import { Download, ListFilter, Loader2, AlertCircle } from 'lucide-react'
import { getEvents } from '@/lib/api'
import { BACKEND_EVENT_META } from '@/hooks/useEvents'
import type { ApiEvent } from '@/lib/types'
import { EventTable } from '@/components/event-table'
import { Button } from '@/components/ui/button'

export function HistoryView() {
  const [events, setEvents] = useState<ApiEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getEvents()
      .then((data) => { if (!cancelled) setEvents(data) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const summary = useMemo(() => {
    const critical = events.filter((e) => BACKEND_EVENT_META[e.type]?.status === 'error').length
    const warnings = events.filter((e) => BACKEND_EVENT_META[e.type]?.status === 'warning').length
    return { total: events.length, critical, warnings }
  }, [events])

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-card-foreground">
            <ListFilter className="size-4 text-muted-foreground" />
            {loading ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              `${summary.total} records`
            )}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-muted-foreground">
            {summary.critical} critical
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-muted-foreground">
            {summary.warnings} warnings
          </span>
        </div>
        <Button variant="outline" className="h-9 self-start sm:self-auto">
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      <EventTable events={events} loading={loading} />
    </div>
  )
}
