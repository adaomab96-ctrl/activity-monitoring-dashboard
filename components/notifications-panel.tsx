'use client'

import { useState } from 'react'
import {
  Bell,
  Check,
  Trash2,
  Loader2,
  AlertCircle,
  DoorOpen,
  LogIn,
  ShieldAlert,
  Settings2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useNotifications } from '@/hooks/useNotifications'
import { relativeTime } from '@/lib/events'
import type { BackendEventType } from '@/lib/types'

// Icon + tone per backend event type
const TYPE_CONFIG: Record<
  BackendEventType,
  { icon: LucideIcon; tone: 'primary' | 'success' | 'error' | 'warning' }
> = {
  ENTRY:  { icon: DoorOpen,    tone: 'success'  },
  LOGIN:  { icon: LogIn,       tone: 'primary'  },
  ALERT:  { icon: ShieldAlert, tone: 'error'    },
  SYSTEM: { icon: Settings2,   tone: 'warning'  },
}

const TONE_STYLES: Record<string, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  error:   'bg-destructive/10 text-destructive',
  warning: 'bg-warning/15 text-warning-foreground',
}

type Tab = 'all' | 'unread'

export function NotificationsPanel() {
  const { notifications, loading, error, unreadCount, markAllRead } = useNotifications()
  const [tab, setTab]         = useState<Tab>('all')
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())
  const [readTimestamp, setReadTimestamp] = useState<string | null>(null)

  const dismiss = (id: number) =>
    setDismissed((prev) => new Set([...prev, id]))

  const handleMarkAllRead = () => {
    setReadTimestamp(new Date().toISOString())
    markAllRead()
  }

  const visible = notifications
    .filter((n) => !dismissed.has(n.id))
    .filter((n) => {
      if (tab === 'unread') {
        return !readTimestamp || n.createdAt > readTimestamp
      }
      return true
    })

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-border bg-card">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bell className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-card-foreground">
                Recent Notifications
              </h2>
              <p className="text-xs text-muted-foreground">
                {loading ? 'Loading…' : `${unreadCount} unread of ${notifications.length - dismissed.size}`}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 self-start sm:self-auto"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0 || loading}
          >
            <Check className="size-4" />
            Mark all read
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border px-4 py-2">
          {(['all', 'unread'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors',
                tab === t
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t}
              {t === 'unread' && unreadCount > 0 && (
                <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 text-xs text-primary">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 border-b border-destructive/20 bg-destructive/10 px-5 py-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading notifications…
          </div>
        ) : visible.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-muted-foreground">
            No notifications to show.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {visible.map((item) => {
              const eventType = item.event.eventType as BackendEventType
              const config = TYPE_CONFIG[eventType] ?? TYPE_CONFIG.SYSTEM
              const Icon = config.icon
              const isUnread = !readTimestamp || item.createdAt > readTimestamp

              return (
                <li
                  key={item.id}
                  className={cn(
                    'flex gap-4 p-5 transition-colors hover:bg-accent/30',
                    isUnread && 'bg-primary/[0.03]',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-lg',
                      TONE_STYLES[config.tone],
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-card-foreground">
                        In-app notification sent
                      </p>
                      {isUnread && (
                        <span className="size-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.event.message}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {relativeTime(item.createdAt)} · {item.channel}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                        {item.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => dismiss(item.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                        Dismiss
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
