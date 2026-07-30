// ─────────────────────────────────────────────
//  Shared TypeScript types that match the
//  NestJS backend response shapes exactly.
// ─────────────────────────────────────────────

/** Event types supported by the backend (Prisma enum) */
export type BackendEventType = 'ENTRY' | 'LOGIN' | 'ALERT' | 'SYSTEM'

/** Shape returned by POST /events, GET /events, GET /events/latest */
export interface ApiEvent {
  id: number
  type: BackendEventType
  message: string
  createdAt: string // ISO-8601
}

/** Shape returned by GET /notifications */
export interface ApiNotification {
  id: number
  eventId: number
  channel: string
  status: string
  createdAt: string // ISO-8601
  event: {
    id: number
    eventType: BackendEventType
    message: string
    createdAt: string
  }
}

/** Socket.io payload emitted as 'new_event' */
export interface SocketEventPayload {
  id: number
  eventType: BackendEventType
  message: string
  createdAt: string
}
