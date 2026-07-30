'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getLatestEvents, createEvent } from '@/lib/api'
import { getSocket } from '@/lib/socket'
import type { ApiEvent, BackendEventType, SocketEventPayload } from '@/lib/types'

// Maps backend EventType → display metadata used by the UI
export const BACKEND_EVENT_META: Record<
  BackendEventType,
  { category: string; status: 'success' | 'warning' | 'error' | 'info' }
> = {
  ENTRY:  { category: 'Entry Event',    status: 'success' },
  LOGIN:  { category: 'Login Event',    status: 'success' },
  ALERT:  { category: 'Security Alert', status: 'error'   },
  SYSTEM: { category: 'System Event',   status: 'warning' },
}

// Simulate-event templates — frontend picks one at random and sends to backend
const SIMULATE_TEMPLATES: { type: BackendEventType; message: string }[] = [
  { type: 'ENTRY',  message: 'Visitor entered the main building' },
  { type: 'ENTRY',  message: 'Badge scan at west wing entrance' },
  { type: 'LOGIN',  message: 'User logged in from a new device' },
  { type: 'LOGIN',  message: 'Admin signed in to the console' },
  { type: 'ALERT',  message: 'Multiple failed login attempts detected' },
  { type: 'ALERT',  message: 'Unusual access pattern flagged' },
  { type: 'SYSTEM', message: 'Monitoring agent restarted' },
  { type: 'SYSTEM', message: 'Configuration profile updated' },
]

export interface UseEventsReturn {
  events: ApiEvent[]
  newestId: number | null
  loading: boolean
  error: string | null
  simulating: boolean
  simulate: () => Promise<void>
}

export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<ApiEvent[]>([])
  const [newestId, setNewestId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [simulating, setSimulating] = useState(false)

  // Track IDs we've already received via Socket so we don't double-add
  const knownIds = useRef(new Set<number>())

  // Initial fetch
  useEffect(() => {
    let cancelled = false
    getLatestEvents()
      .then((data) => {
        if (cancelled) return
        data.forEach((e) => knownIds.current.add(e.id))
        setEvents(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  // Real-time Socket.io subscription
  useEffect(() => {
    const socket = getSocket()

    const handleNewEvent = (payload: SocketEventPayload) => {
      if (knownIds.current.has(payload.id)) return // deduplicate
      knownIds.current.add(payload.id)

      const event: ApiEvent = {
        id: payload.id,
        type: payload.eventType,
        message: payload.message,
        createdAt: payload.createdAt,
      }

      setEvents((prev) => [event, ...prev])
      setNewestId(payload.id)
    }

    socket.on('new_event', handleNewEvent)
    return () => { socket.off('new_event', handleNewEvent) }
  }, [])

  // Simulate Event handler
  const simulate = useCallback(async () => {
    setSimulating(true)
    setError(null)
    const template =
      SIMULATE_TEMPLATES[Math.floor(Math.random() * SIMULATE_TEMPLATES.length)]
    try {
      // POST to backend — socket broadcast will add it to the feed
      await createEvent(template)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to simulate event')
    } finally {
      setSimulating(false)
    }
  }, [])

  return { events, newestId, loading, error, simulating, simulate }
}
