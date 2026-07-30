/**
 * Thin API client for the NestJS backend.
 * All fetch calls go through here so the URL is centralised.
 */
import type { ApiEvent, ApiNotification, BackendEventType } from './types'

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new Error(
      `Cannot reach the backend at ${BASE_URL}. Make sure the NestJS server is running (cd backend && npm run start:dev).`,
    )
  }

  if (!res.ok) {
    // Try to parse a JSON error body; fall back to status text
    const body = await res.json().catch(() => null)
    const message = body?.message ?? `API error ${res.status}: ${res.statusText}`
    throw new Error(Array.isArray(message) ? message.join(', ') : message)
  }

  return res.json() as Promise<T>
}

// ── Events ───────────────────────────────────

export function getEvents(): Promise<ApiEvent[]> {
  return request<ApiEvent[]>('/events')
}

export function getLatestEvents(): Promise<ApiEvent[]> {
  return request<ApiEvent[]>('/events/latest')
}

export function createEvent(payload: {
  type: BackendEventType
  message: string
}): Promise<ApiEvent> {
  return request<ApiEvent>('/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// ── Notifications ────────────────────────────

export function getNotifications(): Promise<ApiNotification[]> {
  return request<ApiNotification[]>('/notifications')
}
