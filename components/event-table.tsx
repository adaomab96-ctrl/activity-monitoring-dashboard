'use client'

import { useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Inbox,
  Loader2,
} from 'lucide-react'
import {
  DoorOpen,
  LogIn,
  ShieldAlert,
  Settings2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ApiEvent, BackendEventType } from '@/lib/types'
import { BACKEND_EVENT_META } from '@/hooks/useEvents'
import { StatusBadge } from '@/components/status-badge'
import { formatDateTime } from '@/lib/events'
import { cn } from '@/lib/utils'

const TYPE_ICON: Record<BackendEventType, LucideIcon> = {
  ENTRY:  DoorOpen,
  LOGIN:  LogIn,
  ALERT:  ShieldAlert,
  SYSTEM: Settings2,
}

type StatusFilter = 'all' | 'success' | 'warning' | 'error' | 'info'

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'All',      value: 'all'     },
  { label: 'Success',  value: 'success' },
  { label: 'Warning',  value: 'warning' },
  { label: 'Critical', value: 'error'   },
]

const PAGE_SIZE = 8

interface EventTableProps {
  events: ApiEvent[]
  loading?: boolean
}

export function EventTable({ events, loading = false }: EventTableProps) {
  const [query, setQuery]   = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [page, setPage]     = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return events.filter((e) => {
      const meta = BACKEND_EVENT_META[e.type]
      const matchesStatus = status === 'all' || meta?.status === status
      const matchesQuery =
        !q ||
        meta?.category.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [events, query, status])

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start       = (currentPage - 1) * PAGE_SIZE
  const pageRows    = filtered.slice(start, start + PAGE_SIZE)
  const resetPage   = () => setPage(1)

  return (
    <div className="rounded-2xl border border-border bg-card">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); resetPage() }}
            placeholder="Search by type or message…"
            aria-label="Search events"
            className="h-9 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground sm:flex">
            <SlidersHorizontal className="size-3.5" />
            Status
          </span>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => { setStatus(f.value); resetPage() }}
              className={cn(
                'shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                status === f.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
              <th scope="col" className="px-5 py-3 font-medium">Event Type</th>
              <th scope="col" className="px-5 py-3 font-medium">Message</th>
              <th scope="col" className="px-5 py-3 font-medium">Time</th>
              <th scope="col" className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="size-6 animate-spin" />
                    <p className="text-sm">Loading events…</p>
                  </div>
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Inbox className="size-8" />
                    <p className="text-sm font-medium">No events found</p>
                    <p className="text-xs">Try adjusting your search or filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              pageRows.map((event) => {
                const meta = BACKEND_EVENT_META[event.type]
                const Icon = TYPE_ICON[event.type] ?? Settings2
                return (
                  <tr
                    key={event.id}
                    className="transition-colors hover:bg-accent/40"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="font-medium text-card-foreground">
                          {meta?.category ?? event.type}
                        </span>
                      </div>
                    </td>
                    <td className="max-w-xs px-5 py-3.5 text-muted-foreground">
                      <span className="line-clamp-1">{event.message}</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs whitespace-nowrap text-muted-foreground">
                      {formatDateTime(event.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={meta?.status ?? 'info'} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-3 sm:flex-row">
        <p className="text-xs text-muted-foreground">
          {filtered.length === 0
            ? 'No results'
            : `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} of ${filtered.length}`}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="size-4" /> Prev
          </button>
          <span className="px-2 text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          >
            Next <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
