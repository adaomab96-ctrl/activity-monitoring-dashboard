import {
  DoorOpen,
  LogIn,
  LogOut,
  ShieldAlert,
  UploadCloud,
  Settings2,
  UserPlus,
  type LucideIcon,
} from 'lucide-react'

export type EventStatus = 'success' | 'warning' | 'error' | 'info'

export type EventType =
  | 'entry'
  | 'login'
  | 'logout'
  | 'alert'
  | 'upload'
  | 'system'
  | 'signup'

export interface ActivityEvent {
  id: string
  type: EventType
  category: string
  message: string
  /** ISO timestamp */
  timestamp: string
  status: EventStatus
  actor: string
}

interface EventMeta {
  category: string
  icon: LucideIcon
  status: EventStatus
}

export const EVENT_META: Record<EventType, EventMeta> = {
  entry: { category: 'Entry Event', icon: DoorOpen, status: 'success' },
  login: { category: 'Login Event', icon: LogIn, status: 'success' },
  logout: { category: 'Logout Event', icon: LogOut, status: 'info' },
  alert: { category: 'Security Alert', icon: ShieldAlert, status: 'error' },
  upload: { category: 'Upload Event', icon: UploadCloud, status: 'info' },
  system: { category: 'System Event', icon: Settings2, status: 'warning' },
  signup: { category: 'New Account', icon: UserPlus, status: 'success' },
}

export const STATUS_LABEL: Record<EventStatus, string> = {
  success: 'Success',
  warning: 'Warning',
  error: 'Critical',
  info: 'Info',
}

const SAMPLE_TEMPLATES: Record<EventType, { message: string; actor: string }[]> =
  {
    entry: [
      { message: 'Visitor entered the main building', actor: 'Front Gate' },
      { message: 'Badge scan at west wing entrance', actor: 'Access Control' },
      { message: 'Contractor checked in at reception', actor: 'Lobby Desk' },
    ],
    login: [
      { message: 'User logged in from a new device', actor: 'Auth Service' },
      { message: 'Admin signed in to the console', actor: 'Auth Service' },
      { message: 'User authenticated via SSO', actor: 'Identity Provider' },
    ],
    logout: [
      { message: 'User session ended', actor: 'Auth Service' },
      { message: 'Idle session timed out', actor: 'Session Manager' },
    ],
    alert: [
      { message: 'Multiple failed login attempts detected', actor: 'Threat Monitor' },
      { message: 'Unusual access pattern flagged', actor: 'Anomaly Engine' },
      { message: 'Unauthorized door access attempt', actor: 'Access Control' },
    ],
    upload: [
      { message: 'Report exported to secure storage', actor: 'Storage Service' },
      { message: 'New document uploaded to workspace', actor: 'File Service' },
    ],
    system: [
      { message: 'Monitoring agent restarted', actor: 'System Automata' },
      { message: 'Configuration profile updated', actor: 'Config Service' },
      { message: 'Scheduled maintenance completed', actor: 'System Automata' },
    ],
    signup: [
      { message: 'New team member account created', actor: 'Onboarding' },
      { message: 'Guest account provisioned', actor: 'Onboarding' },
    ],
  }

const EVENT_TYPES = Object.keys(EVENT_META) as EventType[]

let counter = 0
function nextId() {
  counter += 1
  return `evt_${Date.now().toString(36)}_${counter}`
}

/** Generate a single random event, optionally at a specific time. */
export function createRandomEvent(at: Date = new Date()): ActivityEvent {
  const type = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)]
  const templates = SAMPLE_TEMPLATES[type]
  const template = templates[Math.floor(Math.random() * templates.length)]
  return {
    id: nextId(),
    type,
    category: EVENT_META[type].category,
    message: template.message,
    timestamp: at.toISOString(),
    status: EVENT_META[type].status,
    actor: template.actor,
  }
}

/** Deterministic-ish seed list for the initial render. */
export function seedEvents(): ActivityEvent[] {
  const now = Date.now()
  const seeds: { type: EventType; index: number; minutesAgo: number }[] = [
    { type: 'entry', index: 0, minutesAgo: 2 },
    { type: 'login', index: 1, minutesAgo: 6 },
    { type: 'alert', index: 0, minutesAgo: 14 },
    { type: 'upload', index: 0, minutesAgo: 27 },
    { type: 'system', index: 0, minutesAgo: 41 },
    { type: 'signup', index: 0, minutesAgo: 58 },
    { type: 'logout', index: 0, minutesAgo: 72 },
    { type: 'login', index: 2, minutesAgo: 96 },
  ]
  return seeds.map(({ type, index, minutesAgo }) => {
    const template = SAMPLE_TEMPLATES[type][index]
    return {
      id: nextId(),
      type,
      category: EVENT_META[type].category,
      message: template.message,
      timestamp: new Date(now - minutesAgo * 60_000).toISOString(),
      status: EVENT_META[type].status,
      actor: template.actor,
    }
  })
}

/** Larger history dataset for the table. */
export function seedHistory(count = 48): ActivityEvent[] {
  const now = Date.now()
  return Array.from({ length: count }, (_, i) => {
    const type = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)]
    const templates = SAMPLE_TEMPLATES[type]
    const template = templates[Math.floor(Math.random() * templates.length)]
    return {
      id: `hist_${i}`,
      type,
      category: EVENT_META[type].category,
      message: template.message,
      timestamp: new Date(now - i * 37 * 60_000).toISOString(),
      status: EVENT_META[type].status,
      actor: template.actor,
    }
  })
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}
