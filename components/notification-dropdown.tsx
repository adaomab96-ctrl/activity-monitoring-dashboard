'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  Check,
  DoorOpen,
  LogIn,
  ShieldAlert,
  Settings2,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { getSocket } from '@/lib/socket'
import { relativeTime } from '@/lib/events'
import type { BackendEventType, SocketEventPayload } from '@/lib/types'

// Local shape just for the dropdown list
interface DropdownItem {
  id: number
  icon: LucideIcon
  tone: 'primary' | 'success' | 'error' | 'warning'
  title: string
  description: string
  time: string
  unread: boolean
}

const TYPE_CONFIG: Record<
  BackendEventType,
  { icon: LucideIcon; tone: DropdownItem['tone'] }
> = {
  ENTRY:  { icon: DoorOpen,    tone: 'success'  },
  LOGIN:  { icon: LogIn,       tone: 'primary'  },
  ALERT:  { icon: ShieldAlert, tone: 'error'    },
  SYSTEM: { icon: Settings2,   tone: 'warning'  },
}

const TONE_STYLES: Record<DropdownItem['tone'], string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  error:   'bg-destructive/10 text-destructive',
  warning: 'bg-warning/15 text-warning-foreground',
}

export function NotificationDropdown() {
  const [open, setOpen]   = useState(false)
  const [items, setItems] = useState<DropdownItem[]>([])
  const ref = useRef<HTMLDivElement>(null)

  // Subscribe to real-time events and build dropdown entries live
  useEffect(() => {
    const socket = getSocket()
    const handler = (payload: SocketEventPayload) => {
      const config = TYPE_CONFIG[payload.eventType] ?? TYPE_CONFIG.SYSTEM
      const item: DropdownItem = {
        id:          payload.id,
        icon:        config.icon,
        tone:        config.tone,
        title:       'In-app notification sent',
        description: payload.message,
        time:        relativeTime(payload.createdAt),
        unread:      true,
      }
      setItems((prev) => [item, ...prev].slice(0, 10)) // keep latest 10
    }
    socket.on('new_event', handler)
    return () => { socket.off('new_event', handler) }
  }, [])

  // Close on outside click / Escape
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [])

  const unreadCount = items.filter((i) => i.unread).length
  const markAllRead = () => setItems((prev) => prev.map((i) => ({ ...i, unread: false })))
  const dismiss     = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id))

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
        className="relative"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-primary-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="animate-in fade-in slide-in-from-top-1 absolute right-0 z-50 mt-2 w-80 origin-top-right overflow-hidden rounded-xl border border-border bg-popover shadow-lg duration-150 sm:w-96"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-popover-foreground">Notifications</p>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                  {unreadCount} new
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline disabled:opacity-50"
            >
              <Check className="size-3.5" /> Mark all read
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                Waiting for events… Click <strong>Simulate Event</strong> on the dashboard.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((item) => {
                  const Icon = item.icon
                  return (
                    <li
                      key={item.id}
                      className={cn(
                        'group relative flex gap-3 px-4 py-3 transition-colors hover:bg-accent/40',
                        item.unread && 'bg-primary/[0.03]',
                      )}
                    >
                      <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg', TONE_STYLES[item.tone])}>
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-popover-foreground">{item.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">{item.time}</p>
                      </div>
                      <button
                        type="button"
                        aria-label="Dismiss"
                        onClick={() => dismiss(item.id)}
                        className="absolute top-2 right-2 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
                      >
                        <X className="size-3.5" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="border-t border-border p-2">
            <a
              href="/notifications"
              className="block rounded-lg px-3 py-2 text-center text-sm font-medium text-primary hover:bg-accent/50"
            >
              View all notifications
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
