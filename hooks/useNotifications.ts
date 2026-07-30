'use client'

import { useEffect, useState } from 'react'
import { getNotifications } from '@/lib/api'
import { getSocket } from '@/lib/socket'
import type { ApiNotification, SocketEventPayload } from '@/lib/types'

export interface UseNotificationsReturn {
  notifications: ApiNotification[]
  loading: boolean
  error: string | null
  unreadCount: number
  markAllRead: () => void
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<ApiNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Track locally which IDs have been "read" — unread = arrived after last markAllRead
  const [readBefore, setReadBefore] = useState<string | null>(null)

  // Initial fetch
  useEffect(() => {
    let cancelled = false
    getNotifications()
      .then((data) => { if (!cancelled) setNotifications(data) })
      .catch((err) => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  // Listen for new events and prepend a notification entry live
  useEffect(() => {
    const socket = getSocket()
    const handleNewEvent = (payload: SocketEventPayload) => {
      const synthetic: ApiNotification = {
        id: Date.now(), // temp local id
        eventId: payload.id,
        channel: 'IN_APP',
        status: 'SENT',
        createdAt: payload.createdAt,
        event: {
          id: payload.id,
          eventType: payload.eventType,
          message: payload.message,
          createdAt: payload.createdAt,
        },
      }
      setNotifications((prev) => [synthetic, ...prev])
    }
    socket.on('new_event', handleNewEvent)
    return () => { socket.off('new_event', handleNewEvent) }
  }, [])

  const unreadCount = readBefore
    ? notifications.filter((n) => n.createdAt > readBefore).length
    : notifications.length

  const markAllRead = () => setReadBefore(new Date().toISOString())

  return { notifications, loading, error, unreadCount, markAllRead }
}
